"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMe } from "@/services/authService";
import { startSimulation, endSimulation, getScenarioPreview } from "@/services/simulationService";
import Header from "@/components/Header";
import { Loader2, AlertTriangle, Lock, Lightbulb } from "lucide-react";

// Stance-based options - represent the user's attitude, not a specific action.
// This way they correlate with any attacker message regardless of topic.
// Two sets per type, alternated by turn for variety.
const RESPONSE_OPTIONS = {
  phishing_email: [
    [
      { label: "A", text: "OK, that makes sense. What do you need me to do?" },
      { label: "B", text: "Can you verify your identity before we continue?" },
      { label: "C", text: "I'd like to check this through official channels first." },
      { label: "D", text: "Something doesn't feel right here. I'm going to report this." },
    ],
    [
      { label: "A", text: "Sure, I'm happy to help with that." },
      { label: "B", text: "This is unusual - do you have any official documentation?" },
      { label: "C", text: "I want to verify this with my manager before I do anything." },
      { label: "D", text: "I won't be acting on this. I'm flagging it to IT security now." },
    ],
  ],
  vishing: [
    [
      { label: "A", text: "Of course, I'm happy to help you with that." },
      { label: "B", text: "Can I take your name and call you back on the official number?" },
      { label: "C", text: "I'll need to verify this call through our official IT line first." },
      { label: "D", text: "I don't trust this call. I'm ending it and reporting it to IT." },
    ],
    [
      { label: "A", text: "OK, tell me what you need and I'll sort it out." },
      { label: "B", text: "Can you give me a reference number I can verify first?" },
      { label: "C", text: "I'd prefer to contact IT myself on the official number." },
      { label: "D", text: "This sounds suspicious. I'm hanging up and contacting IT directly." },
    ],
  ],
  bec: [
    [
      { label: "A", text: "Sure, I can take care of that for you right away." },
      { label: "B", text: "This is unusual - can we discuss this on a call first?" },
      { label: "C", text: "Our procedures require me to verify this through another channel." },
      { label: "D", text: "I won't action this without going through proper approval channels." },
    ],
    [
      { label: "A", text: "I'll get started on that immediately." },
      { label: "B", text: "Can you confirm this via the usual process first?" },
      { label: "C", text: "I need sign-off from a second person before I can proceed." },
      { label: "D", text: "This doesn't follow our procedures. I'm escalating to compliance." },
    ],
  ],
  mfa_fatigue: [
    [
      { label: "A", text: "OK, I've gone ahead and approved the request." },
      { label: "B", text: "Why am I receiving these - is something wrong with my account?" },
      { label: "C", text: "I'm not approving anything I didn't personally initiate." },
      { label: "D", text: "I'm blocking these requests and contacting IT security right now." },
    ],
    [
      { label: "A", text: "Fine, I'll approve it to make them stop." },
      { label: "B", text: "Can you explain why this is happening before I do anything?" },
      { label: "C", text: "I'll raise a support ticket rather than approve without context." },
      { label: "D", text: "I'm denying all of these and resetting my credentials immediately." },
    ],
  ],
  pretexting: [
    [
      { label: "A", text: "Of course, I'm happy to help you with that." },
      { label: "B", text: "Can I see some ID or an authorisation letter first?" },
      { label: "C", text: "I'll need to verify this with your point of contact before helping." },
      { label: "D", text: "I can't help without formal verification. I'm contacting security." },
    ],
    [
      { label: "A", text: "No problem at all - what do you need?" },
      { label: "B", text: "Who can I call to confirm this request is legitimate?" },
      { label: "C", text: "This needs to go through official channels. I'll raise a request." },
      { label: "D", text: "I'm not proceeding with this. I'm reporting it to the security team." },
    ],
  ],
};

const FUN_FACTS = [
  "98% of successful attacks rely on manipulation of people rather than purely technical exploits.",
  "The average organisation takes 197 days to detect a breach - by then, attackers have long moved on.",
  "A voice can be cloned convincingly from as little as 3 seconds of audio using widely available tools.",
  "The FBI reports Business Email Compromise has cost businesses over $43 billion since 2016.",
  "91% of data breaches begin with a single deceptive email.",
  "Humans correctly identify deception at roughly 54% accuracy - barely better than a coin flip.",
  "Attackers typically spend 3–4 weeks researching a target before making their first contact.",
  "The 2020 Twitter hack that compromised Obama and Musk's accounts was carried out entirely by manipulating Twitter staff.",
  "The 'urgency' trigger causes people to skip normal verification steps in 67% of cases.",
  "A well-crafted pretext achieves an 80% success rate even against security-aware employees.",
  "Enabling two-step verification blocks 99.9% of automated credential attacks.",
  "The 'Hi Mum' WhatsApp scam cost UK victims over £1.5 million in a single year.",
  "Only 3% of attacks exploit a purely technical flaw - the rest target human behaviour.",
  "A caller who builds rapport for just 4 minutes doubles their success rate.",
  "Over 75% of targeted attacks start with email - making it the most abused communication channel.",
  "Attackers often use LinkedIn to map an entire organisation's reporting structure before striking.",
  "Smishing has a 98% open rate compared to 20% for email.",
  "The Bangladesh Bank heist - the world's costliest social engineering attack - stole $81 million in a single weekend.",
  "Attackers rehearse 5–10 variations of their opening line before launching a campaign.",
  "Research shows people are significantly more compliant when requests come with any reason, even an implausible one.",
];

const SIM_DRAFT_KEY = (id) => `sim_draft_${id}`;
const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function SimulateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId");

  const [phase, setPhase] = useState("consent");
  const [session, setSession] = useState(null);
  const [scenarioPreview, setScenarioPreview] = useState(null);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [lastEval, setLastEval] = useState(null);
  const [factIndex, setFactIndex] = useState(0);
  const [currentOptions, setCurrentOptions] = useState(null);
  const messagesEndRef = useRef(null);
  const errorCountRef = useRef(0);

  // Replace [Target Name] placeholder with the actual user's first name
  const personalise = (text) =>
    userName ? text?.replace(/\[Target Name\]/gi, userName) : text;

  // Return current dynamic options, falling back to hardcoded sets if AI hasn't provided them yet
  const getOptions = () => {
    if (currentOptions) return currentOptions;
    const type = session?.scenario?.type || "phishing_email";
    const sets = RESPONSE_OPTIONS[type] || RESPONSE_OPTIONS.phishing_email;
    return sets[turnCount % sets.length];
  };

  // Persist active session to localStorage on every meaningful change
  useEffect(() => {
    if (!scenarioId || phase !== "active" || !session) return;
    localStorage.setItem(SIM_DRAFT_KEY(scenarioId), JSON.stringify({
      phase, session, messages, turnCount, savedAt: Date.now(),
    }));
  }, [phase, messages, turnCount]);

  useEffect(() => {
    if (!scenarioId) { router.push("/training"); return; }

    // Try to restore an in-progress session
    try {
      const raw = localStorage.getItem(SIM_DRAFT_KEY(scenarioId));
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.phase === "active" && draft.session &&
            Date.now() - draft.savedAt < DRAFT_MAX_AGE_MS) {
          setSession(draft.session);
          setMessages(draft.messages || []);
          setTurnCount(draft.turnCount || 0);
          setPhase("active");
          // Still fetch user name + preview in background
          getMe().then(r => setUserName(r.data?.name?.split(" ")[0] || "")).catch(() => {});
          getScenarioPreview(scenarioId).then(r => setScenarioPreview(r.data)).catch(() => {});
          return;
        }
      }
    } catch {}

    // No valid draft - fetch briefing data fresh
    Promise.all([
      getScenarioPreview(scenarioId).then(r => setScenarioPreview(r.data)).catch(() => {}),
      getMe().then(r => setUserName(r.data?.name?.split(" ")[0] || "")).catch(() => {}),
    ]);
  }, [scenarioId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Rotate fun facts during any wait state
  const isWaiting = submitting || phase === "loading" || phase === "ending";
  useEffect(() => {
    if (!isWaiting) return;
    setFactIndex(Math.floor(Math.random() * FUN_FACTS.length));
    const interval = setInterval(() => {
      setFactIndex((i) => (i + 1) % FUN_FACTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isWaiting]);

  const handleConsent = async () => {
    setPhase("loading");
    setCurrentOptions(null);
    try {
      await getMe();
      const res = await startSimulation(scenarioId);
      const data = res.data;
      setSession(data);
      setMessages([{ role: "attacker", content: data.attackerMessage, triggers: data.triggersFired }]);
      setTurnCount(1);
      if (data.responseOptions) setCurrentOptions(data.responseOptions);
      setPhase("active");
    } catch (err) {
      alert("Failed to start simulation. Please try again.");
      router.push("/training");
    }
  };

  const handleSend = async (text) => {
    if (!text || submitting) return;
    setSubmitting(true);

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    
    setMessages((prev) => [...prev, { role: "attacker", content: "", streaming: true }]);

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/simulation/${session.sessionId}/respond/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userResponse: text, aiSessionId: session.aiSessionId }),
        },
      );

      if (!response.ok) throw new Error("Stream request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let event;
          try { event = JSON.parse(raw); } catch { continue; }

          if (event.type === "token") {
            accumulated += event.token;
            // Don't render raw tokens - reasoning models output chain-of-thought first.
            // Keep the typing indicator until the cleaned final message arrives in "done".
          } else if (event.type === "eval") {
            setLastEval(event.evaluation);
          } else if (event.type === "done") {
            errorCountRef.current = 0;
            setMessages((prev) => {
              const msgs = [...prev];
              msgs[msgs.length - 1] = {
                role: "attacker",
                content: event.attacker_message,
                triggers: event.triggers_fired,
              };
              return msgs;
            });
            setTurnCount(event.turn_number);
            if (event.response_options) setCurrentOptions(event.response_options);
            if (event.session_complete) {
              setPhase("ending");
              await finalise();
              return;
            }
          } else if (event.type === "error") {
            // Roll back the user message + empty attacker bubble so user can retry cleanly
            setMessages((prev) => prev.slice(0, -2));
          }
        }
      }
    } catch {
      errorCountRef.current += 1;
      // After 2 consecutive errors the session is likely dead (server restarted)
      // Clear the draft and drop back to the briefing screen
      if (errorCountRef.current >= 2) {
        localStorage.removeItem(SIM_DRAFT_KEY(scenarioId));
        setSession(null);
        setMessages([]);
        setTurnCount(0);
        setPhase("consent");
        errorCountRef.current = 0;
        return;
      }
      // Roll back the user + empty attacker bubble so options reappear cleanly
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return last?.streaming || last?.content === "" ? prev.slice(0, -2) : prev;
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndEarly = async () => {
    setPhase("ending");
    await finalise();
  };

  const finalise = async () => {
    localStorage.removeItem(SIM_DRAFT_KEY(scenarioId));
    try {
      await endSimulation(session.sessionId, session.aiSessionId);
    } catch {}
    router.push(`/training/results?sessionId=${session.sessionId}`);
  };


  
  if (phase === "consent") {
    const typeLabel = scenarioPreview?.type?.replace(/_/g, " ") || "";
    const difficultyColour = { easy: "text-green-600 bg-green-50", medium: "text-amber-600 bg-amber-50", hard: "text-red-600 bg-red-50" };

    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full space-y-4">

          {/* Scenario card */}
          <div className="bg-ivory border border-border-cream rounded-3xl p-8 shadow-whisper">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-gray">{typeLabel}</span>
              {scenarioPreview?.difficulty && (
                <span className={`text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${difficultyColour[scenarioPreview.difficulty] || "text-stone-gray bg-warm-sand"}`}>
                  {scenarioPreview.difficulty}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-serif text-near-black mb-2">
              {scenarioPreview?.name || "Loading scenario…"}
            </h2>
            <p className="text-sm text-stone-gray leading-relaxed">
              {scenarioPreview?.description}
            </p>
          </div>

          {/* Situation briefing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-ivory border border-border-cream rounded-2xl p-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-stone-gray mb-2">Your Role</p>
              <p className="text-sm font-medium text-near-black">
                {userName ? `${userName}, an employee` : "An employee"} in a typical workplace
              </p>
            </div>
            <div className="bg-ivory border border-border-cream rounded-2xl p-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-stone-gray mb-2">The Attacker</p>
              <p className="text-sm font-medium text-near-black">
                {scenarioPreview?.attackerPersona || "Unknown"}
              </p>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs font-bold text-amber-800">Before you begin</p>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-800">
              <li>• Everything is fictional - no real messages are sent</li>
              <li>• Respond as you would in a real workplace situation</li>
              <li>• Your choices are analysed to show which tactics worked on you</li>
              <li>• You will receive a full debrief at the end</li>
            </ul>
          </div>

          <button onClick={handleConsent} className="btn-terracotta w-full py-3.5 font-medium">
            I Understand - Begin Simulation
          </button>
          <button onClick={() => router.push("/training")} className="w-full py-2.5 text-sm text-stone-gray hover:text-near-black transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  
  if (phase === "loading" || phase === "ending") {
    const isLoading = phase === "loading";
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-6">
        {/* Spinner ring */}
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-terracotta/15" />
          <div className="absolute inset-0 rounded-full border-t-2 border-terracotta animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-6 h-6 text-terracotta/50" />
          </div>
        </div>

        <p className="text-[10px] font-mono uppercase tracking-widest text-stone-gray mb-1">
          {isLoading ? "Setting up scenario" : "Preparing debrief"}
        </p>
        <h2 className="text-xl font-serif text-near-black mb-10 text-center">
          {isLoading ? "The attacker is preparing their approach…" : "Analysing your responses…"}
        </h2>

        {/* Fun fact card */}
        <div className="max-w-sm w-full bg-ivory border border-border-cream rounded-3xl p-7 shadow-whisper">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-terracotta shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta font-bold">Did you know?</span>
          </div>
          <p key={factIndex} className="text-sm text-charcoal-warm leading-relaxed animate-in fade-in duration-700 min-h-[4rem]">
            {FUN_FACTS[factIndex]}
          </p>
          {/* Progress pips */}
          <div className="mt-5 flex gap-1.5 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  i === factIndex % 6 ? "bg-terracotta scale-125" : "bg-warm-sand"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-stone-gray/40 font-mono">This may take a few moments</p>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />

      
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-amber-700 font-mono font-bold">
          <Lock className="w-3.5 h-3.5" />
          TRAINING SIMULATION - NOT A REAL COMMUNICATION
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-stone-gray font-mono">Turn {turnCount} / 6</span>
          <button
            onClick={handleEndEarly}
            className="text-xs text-stone-gray hover:text-near-black font-medium transition-colors border border-border-cream rounded-full px-3 py-1 hover:border-terracotta/30"
          >
            End & Get Debrief
          </button>
        </div>
      </div>

      
      <div className="bg-ivory border-b border-border-cream px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-stone-gray uppercase tracking-widest">
            {session?.scenario?.type?.replace(/_/g, " ")} · {session?.scenario?.difficulty}
          </p>
          <p className="font-serif text-near-black text-lg mt-0.5">{session?.scenario?.name}</p>
        </div>
      </div>

      
      <main className="grow py-8 px-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "system" ? (
                <div className="text-xs text-stone-gray  px-4 py-2 bg-warm-sand/30 rounded-2xl">
                  {msg.content}
                </div>
              ) : (
                <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <p className={`text-xs font-mono mb-1 ${msg.role === "user" ? "text-right text-stone-gray" : "text-terracotta"}`}>
                    {msg.role === "user" ? "You" : session?.scenario?.attackerPersona || "Attacker"}
                  </p>
                  <div
                    className={`px-5 py-3.5 rounded-3xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-near-black text-ivory rounded-br-md"
                        : "bg-ivory border border-border-cream text-near-black rounded-bl-md shadow-whisper"
                    }`}
                  >
                    {msg.content || (msg.streaming ? " " : "")}
                    {msg.streaming && (
                      <span className="inline-block w-0.5 h-3.5 bg-stone-gray align-middle ml-0.5 animate-pulse" />
                    )}
                  </div>
                  {msg.triggers && msg.triggers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.triggers.map((t) => (
                        <span key={t} className="text-xs font-mono bg-red-50 text-red-600 px-2 py-0.5 rounded-full capitalize opacity-60">
                          {t.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Fun fact card - visible only while waiting for first token */}
          {submitting && messages[messages.length - 1]?.streaming && messages[messages.length - 1]?.content === "" && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 flex justify-start">
              <div className="max-w-[75%] bg-ivory border border-border-cream rounded-3xl rounded-bl-md px-5 py-4 shadow-whisper">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta font-bold">Did you know?</span>
                </div>
                <p key={factIndex} className="text-sm text-stone-gray leading-relaxed animate-in fade-in duration-500">
                  {FUN_FACTS[factIndex]}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] text-stone-gray/50 font-mono">Thinking</span>
                  <span className="flex gap-0.5">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1 h-1 rounded-full bg-stone-gray/40 animate-bounce" style={{animationDelay: `${i * 150}ms`}} />
                    ))}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="bg-ivory border-t border-border-cream px-6 pt-4 pb-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-mono uppercase tracking-widest text-stone-gray mb-3">
            How do you respond?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {getOptions().map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleSend(opt.text)}
                disabled={submitting}
                className="text-left p-4 rounded-2xl border border-border-cream bg-parchment/40 hover:border-terracotta/50 hover:bg-terracotta/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-warm-sand text-charcoal-warm text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-terracotta group-hover:text-ivory transition-colors mt-0.5">
                    {opt.label}
                  </span>
                  <p className="text-sm text-charcoal-warm leading-relaxed">{opt.text}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-[10px] text-stone-gray/40 font-mono mt-3">
            TRAINING SIMULATION - NO REAL MESSAGES ARE SENT
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SimulatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    }>
      <SimulateContent />
    </Suspense>
  );
}
