"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";
import { getMyHistory } from "@/services/simulationService";
import UserLayoutWrapper from "@/components/UserLayoutWrapper";
import Link from "next/link";
import {
  Loader2, ShieldAlert, History, ChevronRight, Shield,
  ShieldCheck, ArrowUpRight, PlayCircle, Trophy, Target, UserCheck,
} from "lucide-react";

const TYPE_LABELS = {
  phishing_email: "Phishing Email",
  vishing:        "Vishing",
  bec:            "BEC",
  mfa_fatigue:    "MFA Fatigue",
  pretexting:     "Pretexting",
};

const GRADE_COLORS = {
  A: "bg-green-100 text-green-700",
  B: "bg-teal-100 text-teal-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-red-100 text-red-700",
};

const DIFF_COLORS = {
  easy:   "text-green-600",
  medium: "text-yellow-600",
  hard:   "text-red-500",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
        try {
          const hist = await getMyHistory();
          setSessions(hist.data || []);
        } catch {
          setSessions([]);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const completed   = sessions.length;
  const avgScore    = completed
    ? Math.round(sessions.reduce((s, x) => s + (x.overallScore || 0), 0) / completed)
    : 0;
  const identified  = sessions.filter((s) => s.attackIdentified).length;
  const recent      = sessions.slice(0, 5);

  const stats = [
    {
      label: "Simulations Completed",
      value: completed,
      icon: Target,
      sub: completed === 0 ? "Start your first simulation" : `${identified} attacks identified`,
      color: "text-terracotta",
      bg: "bg-terracotta/10",
    },
    {
      label: "Average Score",
      value: completed ? `${avgScore}/100` : "-",
      icon: Trophy,
      sub: completed === 0 ? "No data yet" : avgScore >= 70 ? "Good awareness" : "Needs improvement",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Attacks Identified",
      value: completed ? `${identified}/${completed}` : "-",
      icon: ShieldCheck,
      sub: completed === 0 ? "Complete a simulation" : `${completed > 0 ? Math.round((identified / completed) * 100) : 0}% identification rate`,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <UserLayoutWrapper>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
        </div>
      ) : (
      <div>

          
          {!user?.profileCompleted && (
            <Link
              href="/onboarding"
              className="flex items-center gap-4 mb-8 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 hover:border-amber-300 transition-colors group"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div className="grow">
                <p className="font-medium text-amber-900 text-sm">Complete your security profile</p>
                <p className="text-xs text-amber-700 mt-0.5">Personalise your training to match your role and risk exposure - takes 2 minutes</p>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-500 group-hover:text-amber-700 transition-colors shrink-0" />
            </Link>
          )}

          
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Security Dashboard</p>
              <h1 className="text-4xl font-serif text-near-black">
                Welcome back, {user?.name.split(" ")[0]}
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/history" className="btn-warm-sand px-6 py-2.5 text-sm flex items-center gap-2">
                <History className="w-4 h-4" /> View History
              </Link>
              <Link href="/training" className="btn-terracotta px-6 py-2.5 text-sm flex items-center gap-2">
                <PlayCircle className="w-4 h-4" /> Start Training
              </Link>
            </div>
          </header>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-ivory border border-border-cream rounded-3xl p-8 shadow-whisper group hover:border-terracotta/30 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-stone-gray text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-serif text-near-black mb-1">{stat.value}</p>
                <p className="text-xs text-stone-gray/70 font-mono">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            
            <div className="lg:col-span-2 bg-ivory border border-border-cream rounded-4xl p-8 shadow-whisper">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif text-near-black">Recent Simulations</h2>
                <Link
                  href="/history"
                  className="text-sm text-stone-gray hover:text-near-black flex items-center gap-1 group font-medium"
                >
                  View All <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShieldAlert className="w-10 h-10 text-stone-gray/30 mb-4" />
                  <p className="font-serif text-stone-gray text-lg mb-1">No simulations yet</p>
                  <p className="text-sm text-stone-gray/60 mb-6">
                    Complete your first social engineering simulation to see results here.
                  </p>
                  <Link href="/training" className="btn-terracotta px-6 py-2.5 text-sm flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" /> Start Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recent.map((s) => (
                    <Link
                      key={s._id}
                      href={`/training/results?sessionId=${s._id}`}
                      className="flex items-center gap-5 p-4 rounded-2xl hover:bg-warm-sand/10 transition-colors border border-transparent hover:border-border-cream/50 group"
                    >
                      
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-sm shrink-0 ${GRADE_COLORS[s.grade] || GRADE_COLORS.F}`}>
                        {s.grade || "-"}
                      </div>

                      <div className="grow min-w-0">
                        <p className="text-near-black font-medium text-sm truncate">
                          {TYPE_LABELS[s.scenarioType] || s.scenarioType}
                        </p>
                        <p className={`text-xs font-mono capitalize ${DIFF_COLORS[s.difficulty]}`}>
                          {s.difficulty}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-sm font-serif text-near-black font-semibold">
                          {s.overallScore ?? "-"}<span className="text-xs text-stone-gray font-sans">/100</span>
                        </span>
                        {s.attackIdentified
                          ? <ShieldCheck className="w-4 h-4 text-green-500" />
                          : <Shield className="w-4 h-4 text-red-400" />
                        }
                        <span className="text-xs text-stone-gray hidden sm:block">
                          {s.completedAt ? new Date(s.completedAt).toLocaleDateString() : ""}
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-gray group-hover:text-terracotta transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            
            <div className="bg-near-black rounded-4xl p-8 text-ivory shadow-whisper flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h2 className="text-2xl font-serif mb-2">Run a Simulation</h2>
                <p className="text-xs text-ivory/50 font-mono uppercase tracking-widest mb-8">
                  5 attack types available
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Phishing Email",  href: "/training?type=phishing_email", diff: "Easy → Hard" },
                    { label: "Vishing Call",    href: "/training?type=vishing",        diff: "Easy → Medium" },
                    { label: "CEO Fraud (BEC)", href: "/training?type=bec",            diff: "Medium → Hard" },
                    { label: "MFA Fatigue",     href: "/training?type=mfa_fatigue",    diff: "Medium" },
                    { label: "Pretexting",      href: "/training?type=pretexting",     diff: "Medium → Hard" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group/item"
                    >
                      <span className="text-sm font-medium text-ivory/80 group-hover/item:text-ivory transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs font-mono text-ivory/30">{item.diff}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/training"
                className="relative z-10 mt-8 flex items-center justify-center gap-2 bg-terracotta text-ivory rounded-2xl py-3 text-sm font-medium hover:bg-terracotta/90 transition-colors"
              >
                <PlayCircle className="w-4 h-4" /> Browse All Scenarios
              </Link>

              
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl pointer-events-none group-hover:bg-terracotta/10 transition-all duration-700" />
            </div>

          </div>
        </div>
      )}
    </UserLayoutWrapper>
  );
}
