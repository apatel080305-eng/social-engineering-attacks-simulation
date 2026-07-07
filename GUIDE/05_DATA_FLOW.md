# Data Flow - End to End

This guide traces the exact path of data through the system for the two most important features: running a simulation and using the chatbot.

---

## Simulation: Complete Data Flow

### Phase 1 - User clicks "Start Simulation"

```
Browser
  │  POST /api/v1/simulation/start
  │  Headers: Cookie: token=<JWT>
  │  Body: { scenarioId: "phishing-hard-1" }
  ▼
Express Backend (port 5000)
  │
  ├─ authMiddleware.protect
  │    └─ jwt.verify(token) → decoded.id
  │    └─ User.findById(id) → req.user
  │
  ├─ simulationController.startSimulation
  │    └─ Scenario.findOne({ scenarioId: "phishing-hard-1", isActive: true })
  │         → { type: "phishing_email", difficulty: "hard",
  │               attackerPersona: "IT Helpdesk", ... }
  │
  │  POST http://localhost:8000/simulate/start
  │  Body: {
  │    user_id: req.user._id,
  │    scenario_type: "phishing_email",
  │    difficulty: "hard",
  │    attacker_persona: "IT Helpdesk",
  │    profile_tags: ["handles_payments", "finance_role"],
  │    job_role: "finance",
  │    tech_level: "beginner"
  │  }
  ▼
FastAPI AI Service (port 8000)
  │
  ├─ session_manager.create_session(...)
  │    → session_id = "550e8400-e29b-..."
  │
  ├─ retriever.retrieve_initial_attack("phishing_email")
  │    │  query = "How to start a phishing_email attack, initial message..."
  │    ├─ embedder.embed_query(query)
  │    │    └─ BGE model → 1024-dim vector
  │    ├─ Pinecone.query(vector, filter={scenario_type: "phishing_email",
  │    │                                  chunk_type: "initial_attack"}, top_k=10)
  │    │    → 10 candidate documents
  │    └─ CrossEncoder.predict([(query, doc)] × 10) → rerank → top 3
  │         → [{text: "Start with urgency and pretend to be IT...", ...}, ...]
  │
  ├─ generator.generate_attacker_message(...)
  │    │  Builds prompt with persona + retrieved tactics + conversation history
  │    └─ httpx.post("http://localhost:11434/api/generate", model="gemma:7b")
  │         → "Hi, this is the IT helpdesk. We've detected unusual activity on
  │            your account and need you to verify your credentials immediately
  │            or your access will be suspended within the hour."
  │
  ├─ trigger_detector.detect_triggers_in_text(message)
  │    └─ Regex scan → ["urgency", "authority"]
  │
  └─ Returns: { session_id, attacker_message, turn_number: 1, triggers_fired }
  ▼
Express Backend
  │
  └─ SimulationSession.create({
         userId, scenarioId, aiSessionId: session_id,
         turns: [{ turnNumber: 1, attackerMessage: "Hi, this is..." }],
         status: "active"
       })
       → MongoDB stores the document
  │
  └─ Response 201: { sessionId (Mongo), aiSessionId, attackerMessage, ... }
  ▼
Browser - displays "Hi, this is the IT helpdesk..."
```

---

### Phase 2 - User types a response (streaming)

```
Browser
  │  POST /api/v1/simulation/:sessionId/respond/stream
  │  Body: { userResponse: "OK I'll verify now", aiSessionId: "550e8400..." }
  ▼
Express Backend
  │
  ├─ SimulationSession.findOne({ _id, userId }) → verify ownership
  │
  ├─ res.setHeader("Content-Type", "text/event-stream")
  │    res.flushHeaders()   ← opens SSE connection to browser immediately
  │
  │  POST http://localhost:8000/simulate/respond/stream
  │  { session_id: "550e8400...", user_response: "OK I'll verify now" }
  ▼
FastAPI AI Service
  │
  ├─ evaluator.rule_based_evaluation("OK I'll verify now")
  │    Regex detects "ok", "verify" → compliance: "partial", suspicion: true
  │    rule_score = 50
  │    user_reaction_hint = "questioning"
  │
  ├─ [ThreadPoolExecutor thread] evaluator.evaluate_response(...)
  │    Sends to Ollama with temperature=0.1 for consistent JSON output
  │    → { compliance_level: "partial", suspicion_shown: true,
  │         attack_identified: false, score: 55, ... }
  │
  ├─ retriever.retrieve_escalation("phishing_email", "questioning")
  │    → tactics for handling a questioning/uncertain target
  │
  ├─ [Main thread] generator.generate_attacker_message_stream(...)
  │    Streams from Ollama token by token:
  │    "I" → "understand" → " your" → " concern" → ...
  │
  │  Yields SSE events as tokens arrive:
  │  data: {"type": "token", "token": "I"}
  │  data: {"type": "token", "token": " understand"}
  │  ...
  ▼
Express Backend
  │  Receives SSE stream from AI service
  │  Pipes each event directly to the browser:
  │  res.write('data: {"type":"token","token":"I"}\n\n')
  │
  │  When stream ends:
  │  ├─ Updates last turn in SimulationSession (adds userResponse, scores)
  │  ├─ Pushes new turn (next attacker message)
  │  └─ session.save() → MongoDB
  ▼
Browser - renders tokens as they arrive (typewriter effect)
```

---

### Phase 3 - Session Ends

```
Browser
  │  POST /api/v1/simulation/:sessionId/end
  │  Body: { aiSessionId: "550e8400..." }
  ▼
Express Backend → POST http://localhost:8000/simulate/end
  ▼
FastAPI AI Service
  │
  ├─ end_session(session_id) → marks status: "completed"
  │
  ├─ evaluator.compute_session_score(turns)
  │    → overall_score: 62, grade: "B", complied_turns: 1, ...
  │
  ├─ retriever.retrieve_debrief("phishing_email", ["urgency", "authority"])
  │    → explanation text from knowledge base
  │
  └─ Returns: {
         summary: { overall_score, grade, ... },
         trigger_explanations: [
           { id: "urgency", name: "Urgency", description: "...",
             counter_measures: "Slow down, verify independently", times_hit: 2 }
         ],
         debrief_context: ["Always verify IT requests through..."],
         turns: [...],
         duration_seconds: 180
       }
  ▼
Express Backend
  └─ SimulationSession.findOneAndUpdate(...)
       session.overallScore = 62
       session.grade = "B"
       session.triggersHit = { urgency: 2, authority: 1 }
       session.triggerExplanations = [...]
       session.status = "completed"
       session.completedAt = now
       → MongoDB updated
  │
  └─ Response 200: full result object
  ▼
Browser - shows results screen with score, grade, trigger breakdown, advice
```

---

## Chatbot: Data Flow

```
Browser (landing page)
  │  POST /api/v1/chat
  │  Body: { message: "What is phishing?",
  │           history: [{ role: "user", content: "..." }, ...] }
  ▼
Express Backend - chatController.askChat
  │
  ├─ Input validation: message must be non-empty string
  │
  ├─ isOffTopic(message) - regex blocklist check
  │    If matched → SSE canned reply → end
  │
  ├─ res.setHeader("Content-Type", "text/event-stream")
  │    res.flushHeaders()
  │
  │  POST http://localhost:8000/chat/ask/stream
  │  { message: "What is phishing?", history: [...] }
  ▼
FastAPI AI Service - generator.answer_chat_query_stream
  │
  ├─ Builds message array:
  │    [{ role: "system", content: "You are a helpful assistant for INTERCEPTOR..." },
  │     ...last 4 turns from history...,
  │     { role: "user", content: "What is phishing?" }]
  │
  ├─ httpx.stream POST to Ollama /api/chat
  │    model: gemma:7b, temperature: 0.3, num_ctx: 512
  │    (low temperature → consistent answers; small context → fast for chat)
  │
  └─ Yields tokens as SSE:
     data: {"type": "token", "token": "Phishing"}
     data: {"type": "token", "token": " is"}
     ...
     data: {"type": "done"}
  ▼
Express Backend
  └─ Pipes each SSE event to the browser
  ▼
Browser - message appears word by word in chat UI
```

---

## MongoDB Document Lifecycle

```
User registers
  → User document created (isEmailVerified: false)

User verifies email
  → isEmailVerified: true, tokens cleared

User completes onboarding
  → profileCompleted: true, jobRole, techLevel, profileTags populated

User starts simulation
  → SimulationSession created (status: "active")

Per turn
  → SimulationSession.turns array updated (push new turn)

Session ends
  → SimulationSession finalized (score, grade, status: "completed")

User completes training module
  → ModuleProgress upserted (completed: true, quizScore: X)
```

---

## Key Design Decisions Explained

**Why does Express sit between the frontend and the AI service?**

If the frontend called the AI service directly, it would need to expose the AI service to the internet, handle its own authentication, and the AI service would need to know about users. Keeping the AI service internal means it has zero authentication logic and is never publicly reachable - it only accepts calls from Express on the same machine.

**Why are AI sessions in-memory (not MongoDB)?**

The AI session is a scratch pad for the ongoing conversation. It is only needed for the duration of the simulation (minutes). Persisting it to MongoDB on every turn would add latency and complexity. The important structured data (turns, scores, triggers) is saved to MongoDB by Express anyway.

**Why SSE instead of WebSockets for streaming?**

SSE is simpler - it is one-directional (server to browser), uses a plain HTTP connection, and is natively supported by browsers. There is no need for a bidirectional channel here: the browser sends a POST, the server streams back the response. WebSockets would require a persistent connection upgrade and more state management for no benefit.
