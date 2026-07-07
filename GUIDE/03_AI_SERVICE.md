# AI Service - Deep Dive

Files: `BACKEND/ai_service/`

The AI service is a completely separate Python process. It is built with **FastAPI** and runs on port 8000. The Express backend is its only client - the frontend never calls it directly.

---

## Why a Separate Python Service?

The machine learning libraries used here (sentence-transformers, Pinecone SDK) are Python-first. Running them inside Node.js would require awkward native bindings or subprocess calls. A clean HTTP boundary between Node and Python is simpler, more maintainable, and lets each service be scaled or restarted independently.

---

## Startup and Model Warm-up

When the FastAPI app starts (`main.py`), it uses FastAPI's `lifespan` context manager to run a background thread that sends a dummy prompt to Ollama:

```python
httpx.post(f"{OLLAMA_BASE_URL}/api/generate",
    json={"model": OLLAMA_MODEL, "prompt": ".", "stream": False, "keep_alive": -1})
```

The `keep_alive: -1` tells Ollama to keep the model loaded in VRAM indefinitely. Without this, Ollama unloads the model after 5 minutes of inactivity, and the next request would have a 30–60 second wait while it loads again. The warm-up call happens in a daemon thread so it does not block the server from accepting requests.

---

## Configuration - `config.py`

All settings are read from environment variables (via `.env`):

| Variable | Default | Purpose |
|---|---|---|
| `PINECONE_API_KEY` | - | Authenticates with Pinecone |
| `PINECONE_HOST` | - | Direct index endpoint (faster than going through the Pinecone control plane) |
| `PINECONE_INDEX_NAME` | `"social-engineering"` | Which Pinecone index to query |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Where Ollama is running |
| `OLLAMA_MODEL` | `gemma:7b` | The LLM model name |
| `EMBEDDING_MODEL` | `BAAI/bge-large-en-v1.5` | Sentence transformer for creating embeddings |
| `RERANKER_MODEL` | `cross-encoder/ms-marco-MiniLM-L-6-v2` | Cross-encoder for reranking |
| `RETRIEVAL_TOP_K` | `10` | How many candidates to fetch from Pinecone |
| `RERANK_TOP_N` | `3` | How many to keep after reranking |
| `MAX_TURNS` | `6` | Maximum conversation turns before session ends |
| `MIN_TURNS_BEFORE_COMPLETE` | `3` | Earliest a session can end (prevents trivial one-shot wins) |

---

## The RAG Pipeline

RAG stands for **Retrieval-Augmented Generation**. Instead of relying solely on the LLM's training data, we store domain-specific knowledge in a vector database (Pinecone) and retrieve relevant chunks at runtime. Those chunks are injected into the LLM prompt. This makes the attacker's messages more realistic and grounded in actual social engineering techniques.

### Step 1 - Embedding (`pipeline/embedder.py`)

The embedding model (`BAAI/bge-large-en-v1.5`) converts text into a 1024-dimensional vector of floating-point numbers. Semantically similar texts produce similar vectors.

- `embed_query(query)` - used at retrieval time. Prepends the instruction prefix `"Represent this sentence for searching relevant passages: "` before encoding. This is required by the BGE model architecture to get best retrieval performance.
- `embed_documents(texts)` - used during the seeding phase to index knowledge chunks into Pinecone.

The model is loaded lazily (on first call) and cached in a module-level variable so it is only loaded once.

### Step 2 - Dense Retrieval from Pinecone (`pipeline/retriever.py`)

Pinecone is a **vector database** - it stores vectors alongside metadata and supports approximate nearest neighbour (ANN) search. Given a query vector, it returns the `top_k` most similar stored vectors.

The `retrieve()` function:

1. Embeds the query using the BGE model
2. Sends the query vector to Pinecone with optional **metadata filters**:
   - `scenario_type` - ensures we only retrieve docs relevant to the current attack type (e.g. only phishing docs for a phishing simulation)
   - `chunk_type` - filters by the stage of the attack: `initial_attack`, `escalation`, `persuasion`, or `debrief`
3. Gets back up to `top_k` (10) candidate documents

### Step 3 - Cross-Encoder Reranking

The ANN search is fast but imprecise - it ranks by vector cosine similarity, which is a proxy for relevance, not a guarantee. The cross-encoder (`ms-marco-MiniLM-L-6-v2`) is a more accurate but slower model that looks at the query and each candidate document *together* and produces a true relevance score.

The top 10 candidates from Pinecone are re-scored by the cross-encoder and sorted. Only the top 3 (`RERANK_TOP_N`) are kept.

This **two-stage retrieval** pattern is a standard industry practice: the first stage is fast but approximate, the second stage is slower but precise.

### Retrieval Functions

Four specific retrieval functions wrap the general `retrieve()`:

```python
retrieve_initial_attack(scenario_type)   # "How to start a phishing attack..."
retrieve_escalation(scenario_type, user_reaction)  # "Escalation when target is questioning..."
retrieve_persuasion(scenario_type, objection)  # "Overcoming resistance in BEC..."
retrieve_debrief(scenario_type, triggers_hit)  # "Debrief for vishing using urgency, authority..."
```

Each one constructs a natural language query that is then embedded and searched.

---

## The Knowledge Base

The knowledge base is stored in `ai_service/knowledge/`:

- `scenarios/phishing.json`, `vishing.json`, `bec.json`, etc. - scenario-specific attack knowledge
- `tactics/psychological_triggers.json` - describes each psychological trigger (urgency, authority, social proof, etc.) with common phrases, counter-measures, and a vulnerability score weight

During setup, `scripts/seed_pinecone.py` reads these JSON files, splits them into chunks, embeds each chunk, and uploads them to Pinecone with metadata (`scenario_type`, `chunk_type`).

---

## Session Management (`simulation/session_manager.py`)

Sessions live in a Python dictionary (`_sessions`) in memory - they are **not persisted to a database** in the AI service. The Express backend handles persistence in MongoDB. The AI service just needs the session for the duration of a simulation.

Each session contains:
- `session_id` - UUID
- `turns` - list of turn dicts (attacker message, user response, evaluation, triggers)
- `triggers_hit_all` - running count of every trigger fired across all turns
- `status` - `"active"` or `"completed"`

Functions: `create_session`, `get_session`, `append_turn`, `get_conversation_history`, `end_session`, `is_session_active`, `get_turn_count`.

`get_conversation_history()` returns the turns formatted as `[{"role": "attacker", "content": "..."}, {"role": "user", "content": "..."}]` - the format the LLM prompt expects.

---

## Trigger Detection (`simulation/trigger_detector.py`)

Psychological triggers are predefined patterns loaded from `psychological_triggers.json`. Each trigger has:
- `id` - string key (e.g. `"urgency"`, `"authority"`, `"social_proof"`)
- `common_phrases` - list of phrases the attacker might use
- `vulnerability_score_weight` - how much being fooled by this trigger hurts your score
- `counter_measures` - advice for the debrief

`detect_triggers_in_text(text)` scans the attacker's generated message using regex and returns the list of trigger IDs that appear. This runs after every generated message.

These trigger IDs are attached to each turn so we know exactly which manipulation tactics were present when the user responded.

---

## Response Evaluation (`pipeline/evaluator.py`)

Every user response goes through a two-stage evaluation:

### Stage 1 - Rule-Based (fast, synchronous)

`rule_based_evaluation(user_response)` uses regex patterns to immediately classify the response:

- **Compliance patterns** - "ok", "sure", "I'll send it", "here is my password" → `compliance_level: full`
- **Suspicion patterns** - "seems suspicious", "I'll verify", "call you back" → `suspicion_shown: true`
- **Attack identified patterns** - "this is phishing", "you're a scammer" → `attack_identified: true`

Returns: `compliance_level`, `suspicion_shown`, `attack_identified`, `user_reaction_hint`, `rule_score`.

### Stage 2 - LLM Evaluation (slow, nuanced)

`evaluate_response()` sends the attacker message, user response, and list of triggers to Ollama with a prompt asking it to return a JSON object with the same fields plus a `reaction_summary`. Temperature is set to 0.1 (near-deterministic) so the evaluator is consistent.

The raw response is parsed: the code finds the first `{` and last `}` and tries `json.loads()`. If parsing fails, a `_fallback_evaluation()` with simple keyword matching is used.

### Merging (`merge_evaluations`)

The rule-based result and LLM result are merged:
- `attack_identified` from rule-based is authoritative (regex is reliable for explicit phrases)
- Final score = `0.4 × rule_score + 0.6 × llm_score` - LLM gets more weight because it understands nuance

---

## Message Generation (`pipeline/generator.py`)

### Attacker Messages

`generate_attacker_message()` calls `ollama/api/generate` (not `/api/chat`) with a carefully engineered prompt that includes:

1. The attacker's persona
2. The scenario type
3. Retrieved knowledge chunks labelled as `[Tactic 1]`, `[Tactic 2]`, etc.
4. The full conversation history so far
5. A reaction hint (e.g. "the target is questioning" → attacker should escalate)
6. User profile context (job role, profile tags) so attacks can be personalised (an IT employee gets a different attack than a finance employee)

Strict rules in the prompt: stay in character, 3–5 sentences max, plain text only, never reveal it's a simulation.

Temperature is 0.7 - enough creativity to make each simulation feel different, not so high that the attacker becomes incoherent.

### Streaming

`generate_attacker_message_stream()` uses `httpx.stream()` to consume Ollama's streaming response token-by-token and `yield`s each token. FastAPI's `StreamingResponse` wraps this generator and formats each token as an SSE event:

```
data: {"type": "token", "token": "Hello"}

data: {"type": "token", "token": ","}

data: {"type": "done", ...}
```

The Express streaming endpoint pipes this SSE stream directly to the browser. This is why the attacker's reply appears word-by-word - the browser receives tokens as Ollama produces them.

**Parallel evaluation + streaming**: In the streaming endpoint, the LLM evaluation runs in a `ThreadPoolExecutor` thread while the message is streaming. When the stream finishes, the code waits up to 30 seconds for the evaluation thread to complete (it usually finishes much faster). This avoids making the user wait for evaluation before seeing the next message.

---

## API Endpoints Summary

| Method | Path | What it does |
|---|---|---|
| `GET` | `/health` | Health check (Express polls this on startup) |
| `POST` | `/simulate/start` | Creates session, generates first attacker message |
| `POST` | `/simulate/respond` | Evaluates response, generates next message (blocking) |
| `POST` | `/simulate/respond/stream` | Same but streams tokens as SSE |
| `POST` | `/simulate/end` | Ends session, computes final score, retrieves debrief |
| `POST` | `/chat/ask/stream` | Streaming chatbot for landing page questions |

---

## Scoring

At the end of a session, `compute_session_score()` calculates:

- `overall_score` - average of per-turn scores (0–100, higher = better security behaviour)
- `grade` - A (≥85), B (≥70), C (≥55), D (≥40), F (<40)
- `complied_turns` - turns where the user fully complied
- `suspicious_turns` - turns where the user showed suspicion
- `attack_identified` - whether the user ever correctly called out the attack

These are returned to Express, which saves them to the `SimulationSession` document in MongoDB.
