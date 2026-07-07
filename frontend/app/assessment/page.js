"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { startQuestionnaire, submitQuestionnaire } from "@/services/assessmentService";
import Header from "@/components/Header";
import { Loader2, ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react";

const DRAFT_KEY = (t) => `assessment_draft_${t}`;

function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "pre_assessment";

  const [phase, setPhase] = useState("loading"); 
  const [questionnaire, setQuestionnaire] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const timerRef = useRef(null);

  
  useEffect(() => {
    if (!questionnaire || (phase !== "active" && phase !== "consent")) return;
    localStorage.setItem(DRAFT_KEY(type), JSON.stringify({
      type, phase, questionnaire, questions, answers, current, startedAt,
      timeLimitSeconds: questionnaire.timeLimitMinutes * 60,
    }));
  }, [phase, answers, current, startedAt]);

  
  useEffect(() => {
    const init = async () => {
      let draft = null;
      try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY(type))); } catch { }

      if (draft?.questionnaire) {
        const timeLimitSecs = draft.timeLimitSeconds || draft.questionnaire.timeLimitMinutes * 60;

        if (draft.phase === "active" && draft.startedAt) {
          const elapsed = Math.floor((Date.now() - draft.startedAt) / 1000);
          const remaining = timeLimitSecs - elapsed;

          if (remaining <= 0) {
            // Time expired during the refresh - auto-submit saved answers
            localStorage.removeItem(DRAFT_KEY(type));
            const answerList = Object.entries(draft.answers || {}).map(([questionId, selected]) => ({ questionId, selected }));
            const durationSeconds = timeLimitSecs;
            try {
              const res = await submitQuestionnaire(type, { answers: answerList, durationSeconds });
              sessionStorage.setItem("assessmentResult", JSON.stringify(res.data?.data));
            } catch { }
            router.push("/assessment/results");
            return;
          }

          setQuestionnaire(draft.questionnaire);
          setQuestions(draft.questions || []);
          setAnswers(draft.answers || {});
          setCurrent(draft.current || 0);
          setStartedAt(draft.startedAt);
          setTimeLeft(remaining);
          setPhase("active");
          return;
        }

        if (draft.phase === "consent") {
          setQuestionnaire(draft.questionnaire);
          setQuestions(draft.questions || []);
          setTimeLeft(timeLimitSecs);
          setPhase("consent");
          return;
        }
      }

      
      try {
        const res = await startQuestionnaire(type);
        const d = res.data?.data;
        setQuestionnaire(d);
        setQuestions(d.questions || []);
        setTimeLeft(d.timeLimitMinutes * 60);
        setPhase("consent");
      } catch {
        router.push("/learn");
      }
    };
    init();
  }, [type]);

  
  useEffect(() => {
    if (phase !== "active" || timeLeft === null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    clearInterval(timerRef.current);
    setPhase("submitting");
    localStorage.removeItem(DRAFT_KEY(type));
    const answerList = Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected }));
    const durationSeconds = startedAt
      ? Math.round((Date.now() - startedAt) / 1000)
      : (questionnaire?.timeLimitMinutes ?? 20) * 60;
    try {
      const res = await submitQuestionnaire(type, { answers: answerList, durationSeconds });
      const result = res.data?.data;
      sessionStorage.setItem("assessmentResult", JSON.stringify(result));
      router.push("/assessment/results");
    } catch {
      alert("Failed to submit. Please try again.");
      setPhase("active");
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
        <p className="text-stone-gray font-mono text-sm">Calculating your results...</p>
      </div>
    );
  }

  // ── Consent screen ─────────────────────────────────────────────────────────
  if (phase === "consent") {
    const isPost = type === "post_assessment";
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-ivory border border-border-cream rounded-3xl p-10 shadow-whisper">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-2xl font-serif text-near-black mb-2">{questionnaire?.title}</h2>
          <p className="text-stone-gray text-sm mb-6">{questionnaire?.description}</p>
          <div className="bg-parchment/60 rounded-2xl px-5 py-4 mb-8 space-y-2">
            <div className="flex items-center gap-3 text-sm text-stone-gray">
              <Clock className="w-4 h-4 shrink-0 text-terracotta" />
              <span>{questionnaire?.timeLimitMinutes} minute time limit</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-gray">
              <ChevronRight className="w-4 h-4 shrink-0 text-terracotta" />
              <span>{questions.length} questions</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-gray">
              <ChevronRight className="w-4 h-4 shrink-0 text-terracotta" />
              <span>Passing score: {questionnaire?.passingScore}%</span>
            </div>
          </div>
          <button onClick={() => { setStartedAt(Date.now()); setPhase("active"); }} className="btn-terracotta w-full py-3 font-medium">
            Begin Assessment
          </button>
          <button
            onClick={() => { localStorage.removeItem(DRAFT_KEY(type)); router.push("/learn"); }}
            className="w-full mt-3 py-2.5 text-sm text-stone-gray hover:text-near-black transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Active assessment ──────────────────────────────────────────────────────
  const q = questions[current];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />

      
      <div className="bg-ivory border-b border-border-cream px-6 py-3 flex items-center justify-between">
        <div className="text-xs font-mono text-stone-gray">
          Question <span className="text-near-black font-bold">{current + 1}</span> / {questions.length}
          <span className="ml-3 text-stone-gray/60">({answeredCount} answered)</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${timeLeft < 120 ? "text-red-500" : "text-stone-gray"}`}>
          <Clock className="w-3.5 h-3.5" /> {formatTime(timeLeft ?? 0)}
        </div>
      </div>

      
      <div className="h-1 bg-border-cream">
        <div
          className="h-full bg-terracotta transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <main className="grow py-10 px-6">
        <div className="max-w-2xl mx-auto">
          {q && (
            <div className="bg-ivory border border-border-cream rounded-3xl p-8 shadow-whisper">
              <p className="text-xs font-mono text-stone-gray capitalize mb-1">{q.category?.replace(/_/g, " ")} · {q.difficulty}</p>
              <p className="font-medium text-near-black text-base leading-relaxed mb-6">{q.question}</p>
              <div className="space-y-2.5">
                {Object.entries(q.options || {}).filter(([, v]) => v).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleAnswer(q.questionId, key)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border text-sm transition-all ${answers[q.questionId] === key
                        ? "border-terracotta bg-terracotta/5 text-near-black font-medium"
                        : "border-border-cream bg-parchment/40 text-stone-gray hover:border-terracotta/30 hover:text-near-black"
                      }`}
                  >
                    <span className="font-mono font-bold mr-2.5">{key}.</span>{value}
                  </button>
                ))}
              </div>
            </div>
          )}

          
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrent((p) => Math.max(0, p - 1))}
              disabled={current === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl border border-border-cream text-stone-gray hover:text-near-black transition-colors disabled:opacity-30 text-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((p) => p + 1)}
                className="btn-terracotta px-6 py-2.5 flex items-center gap-2 text-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit()}
                className="btn-terracotta px-6 py-2.5 flex items-center gap-2 text-sm"
              >
                Submit Assessment
              </button>
            )}
          </div>

          
          <div className="mt-8 bg-ivory border border-border-cream rounded-2xl p-4">
            <p className="text-xs font-mono text-stone-gray mb-3">Question Navigator</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all ${i === current
                      ? "bg-terracotta text-ivory"
                      : answers[questions[i]?.questionId]
                        ? "bg-green-100 text-green-700"
                        : "bg-parchment text-stone-gray hover:bg-warm-sand/40"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  );
}
