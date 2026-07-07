"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle, XCircle, ChevronRight, BarChart2, Trophy, BookOpen } from "lucide-react";

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("assessmentResult");
    if (!stored) { router.push("/learn"); return; }
    try {
      setResult(JSON.parse(stored));
    } catch {
      router.push("/learn");
    }
  }, []);

  if (!result) return null;

  const { score, totalQuestions, correctAnswers, passed, passingScore, categoryBreakdown, answers } = result;

  const grade =
    score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  const gradeColor = {
    A: "text-green-600", B: "text-teal-600", C: "text-yellow-600", D: "text-orange-600", F: "text-red-600",
  }[grade];

  const gradeBg = {
    A: "bg-green-50", B: "bg-teal-50", C: "bg-yellow-50", D: "bg-orange-50", F: "bg-red-50",
  }[grade];

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="grow py-12 px-6">
        <div className="max-w-3xl mx-auto">

          
          <div className={`${gradeBg} border border-border-cream rounded-3xl p-8 mb-8 flex items-center gap-6`}>
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-whisper">
              <span className={`text-4xl font-serif font-bold ${gradeColor}`}>{grade}</span>
            </div>
            <div className="grow">
              <p className="text-xs font-mono text-stone-gray uppercase tracking-widest mb-1">Assessment Score</p>
              <div className="flex items-end gap-3">
                <span className={`text-5xl font-serif font-bold ${gradeColor}`}>{score}</span>
                <span className="text-stone-gray text-lg mb-1">/ 100</span>
              </div>
              <p className={`text-sm font-medium mt-1 ${passed ? "text-green-600" : "text-red-500"}`}>
                {passed ? "Passed" : `Did not pass (required ${passingScore}%)`}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-serif text-near-black">{correctAnswers}<span className="text-stone-gray text-base">/{totalQuestions}</span></p>
              <p className="text-xs text-stone-gray mt-1">correct answers</p>
            </div>
          </div>

          
          {categoryBreakdown && Object.keys(categoryBreakdown).length > 0 && (
            <div className="bg-ivory border border-border-cream rounded-3xl p-7 mb-6 shadow-whisper">
              <div className="flex items-center gap-2 mb-5">
                <BarChart2 className="w-5 h-5 text-terracotta" />
                <h2 className="font-serif text-xl text-near-black">Performance by Category</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(categoryBreakdown).map(([cat, stats]) => {
                  const pct = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-near-black capitalize">{cat.replace(/_/g, " ")}</span>
                        <span className="text-sm font-mono text-stone-gray">{stats.correct}/{stats.total}</span>
                      </div>
                      <div className="h-2 bg-border-cream rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 70 ? "bg-green-400" : pct >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          
          <div className="bg-ivory border border-border-cream rounded-3xl p-7 mb-8 shadow-whisper">
            <h2 className="font-serif text-xl text-near-black mb-5">Answer Review</h2>
            <div className="space-y-4">
              {(answers || []).map((a, i) => (
                <div key={i} className={`border rounded-2xl p-4 ${a.isCorrect ? "border-green-100 bg-green-50/30" : "border-red-100 bg-red-50/30"}`}>
                  <div className="flex items-start gap-3">
                    {a.isCorrect
                      ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      : <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    }
                    <div className="grow min-w-0">
                      <p className="text-sm text-near-black font-medium mb-1">{a.question}</p>
                      {!a.isCorrect && (
                        <p className="text-xs text-stone-gray mb-1.5">
                          Your answer: <span className="font-mono text-red-600">{a.selected}</span>
                          {" "}· Correct: <span className="font-mono text-green-600">{a.correct}</span>
                        </p>
                      )}
                      <p className="text-xs text-stone-gray ">{a.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="flex flex-wrap gap-4">
            <Link href="/learn" className="btn-terracotta px-6 py-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Continue Learning
            </Link>
            <Link href="/training" className="btn-warm-sand px-6 py-3 flex items-center gap-2">
              Run a Simulation <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
