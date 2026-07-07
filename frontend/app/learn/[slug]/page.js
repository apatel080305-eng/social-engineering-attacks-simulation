"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getModule, completeModule } from "@/services/trainingService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Loader2, ChevronLeft, ChevronRight, CheckCircle, XCircle,
  BookOpen, Shield, AlertTriangle, Lightbulb, BarChart2,
} from "lucide-react";

const SECTION_ICONS = [BookOpen, Shield, AlertTriangle, Lightbulb, BarChart2];

export default function ModulePage() {
  const router = useRouter();
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [phase, setPhase] = useState("content"); 
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getModule(slug);
        setData(res.data?.data);
      } catch {
        router.push("/learn");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [slug]);

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const answerList = Object.entries(answers).map(([questionId, selected]) => ({
        questionId,
        selected,
      }));
      const res = await completeModule(slug, { answers: answerList });
      setResults(res.data?.data);
      setPhase("results");
    } catch {
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { module, questions, userProgress } = data;
  const sections = module.sections || [];
  const totalSections = sections.length;

  
  if (phase === "content") {
    const section = sections[activeSection];
    const SectionIcon = SECTION_ICONS[activeSection % SECTION_ICONS.length];
    return (
      <div className="flex flex-col min-h-screen bg-parchment">
        <Header />
        <main className="grow py-10 px-6">
          <div className="max-w-3xl mx-auto">
            
            <button onClick={() => router.push("/learn")} className="flex items-center gap-1.5 text-sm text-stone-gray hover:text-near-black mb-8 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Modules
            </button>

            
            <div className="mb-8">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">{module.category?.replace(/_/g, " ")}</p>
              <h1 className="text-3xl font-serif text-near-black mb-2">{module.title}</h1>
              <p className="text-stone-gray">{module.subtitle}</p>
            </div>

            
            <div className="flex gap-1.5 mb-8">
              {sections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  className={`h-1.5 rounded-full flex-1 transition-all ${
                    i === activeSection ? "bg-terracotta" : i < activeSection ? "bg-terracotta/40" : "bg-border-cream"
                  }`}
                />
              ))}
            </div>

            
            {section && (
              <div className="bg-ivory border border-border-cream rounded-3xl p-8 shadow-whisper mb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-terracotta/10 rounded-2xl flex items-center justify-center">
                    <SectionIcon className="w-5 h-5 text-terracotta" />
                  </div>
                  <h2 className="font-serif text-xl text-near-black">{section.title}</h2>
                </div>
                <p className="text-stone-gray leading-relaxed mb-6 whitespace-pre-line">{section.content}</p>
                {section.keyPoints?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-stone-gray uppercase tracking-widest mb-3">Key Takeaways</p>
                    {section.keyPoints.map((pt, i) => (
                      <div key={i} className="flex gap-2.5 text-sm text-near-black">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            
            {activeSection === totalSections - 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {module.redFlags?.length > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                    <p className="text-xs font-mono text-red-600 uppercase tracking-widest mb-3">Red Flags</p>
                    <ul className="space-y-1.5">
                      {module.redFlags.map((f, i) => (
                        <li key={i} className="text-sm text-red-800 flex gap-2">
                          <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {module.defenseTips?.length > 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                    <p className="text-xs font-mono text-green-600 uppercase tracking-widest mb-3">Defence Tips</p>
                    <ul className="space-y-1.5">
                      {module.defenseTips.map((t, i) => (
                        <li key={i} className="text-sm text-green-800 flex gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-500" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            
            {activeSection === totalSections - 1 && module.statisticHighlights?.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6">
                <p className="text-xs font-mono text-amber-700 uppercase tracking-widest mb-3">Did You Know?</p>
                <ul className="space-y-2">
                  {module.statisticHighlights.map((s, i) => (
                    <li key={i} className="text-sm text-amber-800 font-medium">{s}</li>
                  ))}
                </ul>
              </div>
            )}

            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSection((p) => Math.max(0, p - 1))}
                disabled={activeSection === 0}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl border border-border-cream text-stone-gray hover:text-near-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              {activeSection < totalSections - 1 ? (
                <button
                  onClick={() => setActiveSection((p) => p + 1)}
                  className="btn-terracotta px-6 py-2.5 flex items-center gap-2 text-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setPhase("quiz")}
                  className="btn-terracotta px-6 py-2.5 flex items-center gap-2 text-sm"
                >
                  Take Knowledge Check <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Quiz phase ─────────────────────────────────────────────────────────────
  if (phase === "quiz") {
    const allAnswered = questions.length > 0 && questions.every((q) => answers[q.questionId]);
    return (
      <div className="flex flex-col min-h-screen bg-parchment">
        <Header />
        <main className="grow py-10 px-6">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setPhase("content")} className="flex items-center gap-1.5 text-sm text-stone-gray hover:text-near-black mb-8 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Module
            </button>
            <div className="mb-8">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Knowledge Check</p>
              <h1 className="text-3xl font-serif text-near-black">{module.title}</h1>
              <p className="text-stone-gray mt-1">{questions.length} questions · No time limit</p>
            </div>

            {questions.length === 0 ? (
              <div className="bg-ivory border border-border-cream rounded-3xl p-10 shadow-whisper text-center mb-8">
                <BookOpen className="w-10 h-10 text-stone-gray/30 mx-auto mb-4" />
                <p className="font-serif text-lg text-near-black mb-1">No quiz questions available yet</p>
                <p className="text-sm text-stone-gray mb-6">Questions for this module have not been seeded. You can still mark the module as complete.</p>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="btn-terracotta px-8 py-2.5 flex items-center justify-center gap-2 mx-auto disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as Complete"}
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6 mb-8">
                  {questions.map((q, i) => (
                    <div key={q.questionId} className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper">
                      <p className="text-xs font-mono text-stone-gray mb-3">Question {i + 1}</p>
                      <p className="font-medium text-near-black mb-4 leading-relaxed">{q.question}</p>
                      <div className="space-y-2">
                        {Object.entries(q.options || {}).filter(([, v]) => v).map(([key, value]) => (
                          <button
                            key={key}
                            onClick={() => handleAnswer(q.questionId, key)}
                            className={`w-full text-left px-4 py-3 rounded-2xl border text-sm transition-all ${
                              answers[q.questionId] === key
                                ? "border-terracotta bg-terracotta/5 text-near-black font-medium"
                                : "border-border-cream bg-parchment/50 text-stone-gray hover:border-terracotta/30 hover:text-near-black"
                            }`}
                          >
                            <span className="font-mono font-bold mr-2">{key}.</span> {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!allAnswered || submitting}
                  className="btn-terracotta w-full py-3 flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Answers"}
                </button>
                {!allAnswered && (
                  <p className="text-center text-xs text-stone-gray mt-3">Answer all questions to submit.</p>
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Results phase ──────────────────────────────────────────────────────────
  const pass = results?.quizScore >= 70;
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="grow py-10 px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className={`rounded-3xl p-8 mb-8 ${pass ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"}`}>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-whisper">
                <span className={`text-3xl font-serif font-bold ${pass ? "text-green-600" : "text-amber-600"}`}>
                  {results?.quizScore ?? 0}%
                </span>
              </div>
              <div>
                <p className={`text-xl font-serif font-bold ${pass ? "text-green-700" : "text-amber-700"}`}>
                  {pass ? "Well Done!" : "Keep Practising"}
                </p>
                <p className="text-sm text-stone-gray mt-1">
                  {results?.results?.filter((r) => r.isCorrect).length ?? 0} of {results?.results?.length ?? 0} correct
                </p>
              </div>
            </div>
          </div>

          
          <div className="space-y-4 mb-8">
            {(results?.results || []).map((r, i) => (
              <div key={i} className={`bg-ivory border rounded-2xl p-5 ${r.isCorrect ? "border-green-100" : "border-red-100"}`}>
                <div className="flex items-start gap-3">
                  {r.isCorrect
                    ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  }
                  <div>
                    <p className="text-sm font-medium text-near-black mb-1">Question {i + 1}</p>
                    {!r.isCorrect && (
                      <p className="text-xs text-stone-gray mb-2">
                        Your answer: <span className="font-mono text-red-600">{r.selected}</span> · Correct: <span className="font-mono text-green-600">{r.correct}</span>
                      </p>
                    )}
                    <p className="text-xs text-stone-gray ">{r.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={() => router.push("/learn")} className="btn-terracotta px-6 py-3 flex items-center gap-2">
              Back to Modules <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => { setPhase("content"); setActiveSection(0); setAnswers({}); setResults(null); }} className="btn-warm-sand px-6 py-3">
              Restart Module
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
