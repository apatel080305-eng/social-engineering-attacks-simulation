"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";
import { getMyHistory } from "@/services/simulationService";
import UserLayoutWrapper from "@/components/UserLayoutWrapper";
import { Loader2, ChevronRight, Shield, ShieldAlert, History } from "lucide-react";

const TYPE_LABELS = {
  phishing_email: "Phishing Email",
  vishing: "Vishing",
  bec: "BEC",
  mfa_fatigue: "MFA Fatigue",
  pretexting: "Pretexting",
};

const GRADE_COLORS = {
  A: "bg-green-100 text-green-700",
  B: "bg-teal-100 text-teal-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-red-100 text-red-700",
};

const DIFF_COLORS = {
  easy: "text-green-600",
  medium: "text-yellow-600",
  hard: "text-red-600",
};

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await getMe();
        const res = await getMyHistory();
        setSessions(res.data || []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const avgScore = sessions.length
    ? Math.round(sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / sessions.length)
    : 0;

  const identified = sessions.filter((s) => s.attackIdentified).length;

  return (
    <UserLayoutWrapper>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
        </div>
      ) : (
      <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">My Training</p>
            <h1 className="text-4xl font-serif text-near-black">Simulation History</h1>
          </div>

          
          {sessions.length > 0 && (
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper">
                <p className="text-xs font-mono text-stone-gray uppercase tracking-widest mb-3">Sessions Completed</p>
                <p className="text-4xl font-serif text-near-black">{sessions.length}</p>
              </div>
              <div className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper">
                <p className="text-xs font-mono text-stone-gray uppercase tracking-widest mb-3">Average Score</p>
                <p className="text-4xl font-serif text-near-black">{avgScore}<span className="text-xl text-stone-gray">/100</span></p>
              </div>
              <div className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper">
                <p className="text-xs font-mono text-stone-gray uppercase tracking-widest mb-3">Attacks Identified</p>
                <p className="text-4xl font-serif text-near-black">{identified}<span className="text-xl text-stone-gray">/{sessions.length}</span></p>
              </div>
            </div>
          )}

          {sessions.length === 0 ? (
            <div className="text-center py-20">
              <History className="w-12 h-12 mx-auto mb-4 text-stone-gray opacity-30" />
              <p className="font-serif text-xl text-stone-gray">No simulations completed yet.</p>
              <button onClick={() => router.push("/training")} className="btn-terracotta px-6 py-3 mt-6">
                Start Your First Simulation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => (
                <div
                  key={s._id}
                  onClick={() => router.push(`/training/results?sessionId=${s._id}`)}
                  className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper hover:border-terracotta/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-serif font-bold text-lg ${GRADE_COLORS[s.grade] || GRADE_COLORS.F}`}>
                        {s.grade || "-"}
                      </div>
                      <div>
                        <p className="font-serif text-near-black text-base">{TYPE_LABELS[s.scenarioType] || s.scenarioType}</p>
                        <p className={`text-xs font-mono capitalize ${DIFF_COLORS[s.difficulty]}`}>{s.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-serif text-near-black">{s.overallScore ?? "-"}<span className="text-sm text-stone-gray">/100</span></p>
                      </div>
                      <div>
                        {s.attackIdentified ? (
                          <Shield className="w-5 h-5 text-green-500" />
                        ) : (
                          <ShieldAlert className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <p className="text-xs text-stone-gray">{s.completedAt ? new Date(s.completedAt).toLocaleDateString() : ""}</p>
                      <ChevronRight className="w-4 h-4 text-stone-gray group-hover:text-terracotta transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <button onClick={() => router.push("/training")} className="btn-terracotta px-6 py-3">
              New Simulation
            </button>
          </div>
        </div>
      )}
    </UserLayoutWrapper>
  );
}
