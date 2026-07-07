"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";
import { getScenarios } from "@/services/simulationService";
import UserLayoutWrapper from "@/components/UserLayoutWrapper";
import { Loader2, Mail, Phone, Briefcase, ShieldAlert, UserCheck, ChevronRight, Lock } from "lucide-react";

const TYPE_META = {
  phishing_email: { label: "Phishing Email", icon: Mail, color: "text-red-500", bg: "bg-red-50" },
  vishing:        { label: "Vishing (Voice)", icon: Phone, color: "text-orange-500", bg: "bg-orange-50" },
  bec:            { label: "Business Email Compromise", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
  mfa_fatigue:    { label: "MFA Fatigue", icon: ShieldAlert, color: "text-yellow-600", bg: "bg-yellow-50" },
  pretexting:     { label: "Pretexting", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50" },
};

const DIFF_META = {
  easy:   { label: "Easy",   color: "bg-green-100 text-green-700" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  hard:   { label: "Hard",   color: "bg-red-100 text-red-700" },
};

export default function TrainingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    Promise.all([fetchUser(), fetchScenarios()]).finally(() => setLoading(false));
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
    } catch {
      router.push("/login");
    }
  };

  const fetchScenarios = async () => {
    try {
      const res = await getScenarios();
      setScenarios(res.data || []);
    } catch {
      setScenarios([]);
    }
  };

  const handleStart = (scenarioId) => {
    setStarting(scenarioId);
    router.push(`/training/simulate?scenarioId=${scenarioId}`);
  };

  const filtered = filter === "all" ? scenarios : scenarios.filter((s) => s.type === filter);

  return (
    <UserLayoutWrapper>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
        </div>
      ) : (
      <div className="max-w-5xl mx-auto">
          
          <div className="mb-8 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <Lock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              <span className="font-bold">Training Simulation.</span> All scenarios below are fictional security awareness exercises.
              No real messages are sent. Your responses are analysed to help you identify social engineering tactics.
            </p>
          </div>

          <div className="mb-10">
            <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Awareness Training</p>
            <h1 className="text-4xl font-serif text-near-black mb-4">Choose a Scenario</h1>
            <p className="text-stone-gray text-base max-w-2xl">
              Each simulation places you in a realistic social engineering attack. Respond naturally - your choices are evaluated and you receive a full debrief explaining every tactic used against you.
            </p>
          </div>

          
          <div className="flex flex-wrap gap-2 mb-8">
            {["all", ...Object.keys(TYPE_META)].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all border ${
                  filter === t
                    ? "bg-near-black text-ivory border-near-black"
                    : "bg-ivory text-stone-gray border-border-cream hover:border-terracotta/40"
                }`}
              >
                {t === "all" ? "All Types" : TYPE_META[t].label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((scenario) => {
              const meta = TYPE_META[scenario.type] || TYPE_META.phishing_email;
              const diff = DIFF_META[scenario.difficulty] || DIFF_META.medium;
              const Icon = meta.icon;
              return (
                <div
                  key={scenario._id}
                  className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper flex flex-col hover:border-terracotta/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${meta.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${diff.color}`}>
                      {diff.label}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-near-black mb-2 leading-snug">{scenario.name}</h3>
                  <p className="text-stone-gray text-sm grow mb-4 leading-relaxed">{scenario.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(scenario.triggers || []).slice(0, 3).map((t) => (
                      <span key={t} className="text-xs font-mono bg-warm-sand/60 text-stone-gray px-2 py-0.5 rounded-full capitalize">
                        {t.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleStart(scenario.scenarioId)}
                    disabled={starting === scenario.scenarioId}
                    className="btn-terracotta w-full py-2.5 text-sm flex items-center justify-center gap-2 group-hover:gap-3 transition-all"
                  >
                    {starting === scenario.scenarioId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Start Simulation <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-stone-gray">
              <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-serif text-xl">No scenarios found.</p>
              <p className="text-sm mt-2">Contact your administrator to seed the scenario library.</p>
            </div>
          )}
        </div>
      )}
    </UserLayoutWrapper>
  );
}
