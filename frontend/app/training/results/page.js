"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSessionDetail } from "@/services/simulationService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Shield, ShieldAlert, ShieldCheck, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";

const GRADE_META = {
  A: { color: "text-green-600", bg: "bg-green-50", label: "Excellent", icon: ShieldCheck },
  B: { color: "text-teal-600",  bg: "bg-teal-50",  label: "Good",      icon: Shield },
  C: { color: "text-yellow-600",bg: "bg-yellow-50",label: "Moderate",  icon: ShieldAlert },
  D: { color: "text-orange-600",bg: "bg-orange-50",label: "At Risk",   icon: ShieldAlert },
  F: { color: "text-red-600",   bg: "bg-red-50",   label: "Vulnerable",icon: ShieldAlert },
};

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { router.push("/training"); return; }
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const res = await getSessionDetail(sessionId);
      setSession(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        router.push("/login");
      } else {
        router.push("/training");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    );
  }

  const grade = session?.grade || "F";
  const gradeMeta = GRADE_META[grade] || GRADE_META.F;
  const GradeIcon = gradeMeta.icon;
  const triggerExplanations = session?.triggerExplanations || [];
  const triggersHit = session?.triggersHit || {};

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="grow py-12 px-6">
        <div className="max-w-3xl mx-auto">

          
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              <strong>Simulation Complete.</strong> The interaction you just completed was a security awareness exercise.
              No real communication occurred. Review your debrief below.
            </p>
          </div>

          
          <div className={`${gradeMeta.bg} border border-border-cream rounded-3xl p-8 mb-8 flex items-center gap-6`}>
            <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-whisper`}>
              <span className={`text-4xl font-serif font-bold ${gradeMeta.color}`}>{grade}</span>
            </div>
            <div className="grow">
              <p className="text-xs font-mono text-stone-gray uppercase tracking-widest mb-1">Security Awareness Score</p>
              <div className="flex items-end gap-3">
                <span className={`text-5xl font-serif font-bold ${gradeMeta.color}`}>{session?.overallScore ?? 0}</span>
                <span className="text-stone-gray text-lg mb-1">/ 100</span>
              </div>
              <p className={`font-medium mt-1 ${gradeMeta.color}`}>{gradeMeta.label}</p>
            </div>
            <div className="text-right">
              {session?.attackIdentified ? (
                <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                  <CheckCircle className="w-4 h-4" /> Attack Identified
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500 font-medium text-sm">
                  <ShieldAlert className="w-4 h-4" /> Attack Not Identified
                </div>
              )}
              <p className="text-xs text-stone-gray mt-1">{session?.turns?.length || 0} turns · {Math.round((session?.durationSeconds || 0) / 60)}m {(session?.durationSeconds || 0) % 60}s</p>
            </div>
          </div>

          
          {triggerExplanations.length > 0 && (
            <div className="bg-ivory border border-border-cream rounded-3xl p-7 mb-6 shadow-whisper">
              <h2 className="font-serif text-xl text-near-black mb-5">Psychological Triggers Used Against You</h2>
              <div className="space-y-5">
                {triggerExplanations.map((t) => (
                  <div key={t.id} className="border-l-2 border-terracotta/40 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-near-black capitalize">{t.name}</span>
                      <span className="text-xs font-mono bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                        Hit {t.times_hit}×
                      </span>
                    </div>
                    <p className="text-sm text-stone-gray mb-2">{t.description}</p>
                    <div className="space-y-1">
                      {(t.counter_measures || []).map((cm, i) => (
                        <div key={i} className="flex gap-2 text-xs text-stone-gray">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                          <span>{cm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
          <div className="bg-ivory border border-border-cream rounded-3xl p-7 mb-6 shadow-whisper">
            <h2 className="font-serif text-xl text-near-black mb-5">Turn-by-Turn Review</h2>
            <div className="space-y-4">
              {(session?.turns || []).filter((t) => t.userResponse).map((turn, i) => (
                <div key={i} className="border border-border-cream rounded-2xl p-4">
                  <p className="text-xs font-mono text-stone-gray mb-2">Turn {turn.turnNumber}</p>
                  <div className="bg-warm-sand/30 rounded-xl px-4 py-2.5 mb-3">
                    <p className="text-xs font-mono text-stone-gray mb-1">Attacker</p>
                    <p className="text-sm text-near-black">{turn.attackerMessage}</p>
                  </div>
                  <div className="bg-near-black/5 rounded-xl px-4 py-2.5 mb-3">
                    <p className="text-xs font-mono text-stone-gray mb-1">Your Response</p>
                    <p className="text-sm text-near-black">{turn.userResponse}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-full font-bold ${
                      turn.score >= 70 ? "bg-green-100 text-green-700" :
                      turn.score >= 40 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      Score: {turn.score ?? "-"}
                    </span>
                    {turn.suspicionShown && (
                      <span className="text-xs font-mono bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">Suspicion Shown</span>
                    )}
                    {turn.attackIdentified && (
                      <span className="text-xs font-mono bg-green-50 text-green-700 px-2.5 py-1 rounded-full">Attack Identified</span>
                    )}
                    {turn.complianceLevel === "full" && (
                      <span className="text-xs font-mono bg-red-50 text-red-600 px-2.5 py-1 rounded-full">Complied</span>
                    )}
                    {turn.evaluationSummary && (
                      <span className="text-xs text-stone-gray ">{turn.evaluationSummary}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="flex gap-4">
            <button onClick={() => router.push("/training")} className="btn-terracotta px-6 py-3 flex items-center gap-2">
              Try Another Scenario <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => router.push("/history")} className="btn-warm-sand px-6 py-3">
              View My History
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
