"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";
import { getModules } from "@/services/trainingService";
import UserLayoutWrapper from "@/components/UserLayoutWrapper";
import Link from "next/link";
import {
  Loader2, BookOpen, Mail, Phone, Briefcase, ShieldAlert, UserCheck,
  CheckCircle, Clock, ChevronRight, GraduationCap, Star, Target,
} from "lucide-react";

const CATEGORY_META = {
  phishing_email: { label: "Phishing Email",  icon: Mail,       color: "text-red-500",    bg: "bg-red-50"    },
  vishing:        { label: "Vishing",          icon: Phone,      color: "text-orange-500", bg: "bg-orange-50" },
  bec:            { label: "BEC / CEO Fraud",  icon: Briefcase,  color: "text-purple-500", bg: "bg-purple-50" },
  mfa_fatigue:    { label: "MFA Fatigue",      icon: ShieldAlert,color: "text-yellow-600", bg: "bg-yellow-50" },
  pretexting:     { label: "Pretexting",       icon: UserCheck,  color: "text-blue-500",   bg: "bg-blue-50"   },
  general:        { label: "General Security", icon: BookOpen,   color: "text-teal-500",   bg: "bg-teal-50"   },
};

const DIFF_BADGE = {
  beginner:     "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced:     "bg-red-100 text-red-700",
};

export default function LearnPage() {
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const init = async () => {
      try {
        await getMe();
        const res = await getModules();
        setModules(res.data?.data || []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const filtered = filter === "all" ? modules : modules.filter((m) => m.category === filter);
  const completedCount = modules.filter((m) => m.progress?.completed).length;

  return (
    <UserLayoutWrapper>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
        </div>
      ) : (
      <div className="max-w-5xl mx-auto">

          
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Security Education</p>
              <h1 className="text-4xl font-serif text-near-black mb-2">Training Modules</h1>
              <p className="text-stone-gray max-w-xl">
                Learn to recognise and defend against social engineering attacks through structured modules with real-world examples and knowledge checks.
              </p>
            </div>
            {modules.length > 0 && (
              <div className="bg-ivory border border-border-cream rounded-2xl px-6 py-4 shadow-whisper shrink-0">
                <p className="text-xs font-mono text-stone-gray uppercase tracking-widest mb-1">Your Progress</p>
                <p className="text-2xl font-serif text-near-black">{completedCount}<span className="text-stone-gray text-base">/{modules.length}</span> <span className="text-sm text-stone-gray font-sans">completed</span></p>
              </div>
            )}
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Link href="/assessment?type=pre_assessment" className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper hover:border-terracotta/30 transition-all group flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <div className="grow">
                <p className="font-serif text-near-black font-medium">Pre-Training Assessment</p>
                <p className="text-xs text-stone-gray mt-0.5">Gauge your baseline security knowledge - 30 questions, 20 min</p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-gray group-hover:text-terracotta transition-colors shrink-0" />
            </Link>
            <Link href="/assessment?type=post_assessment" className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper hover:border-terracotta/30 transition-all group flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-green-500" />
              </div>
              <div className="grow">
                <p className="font-serif text-near-black font-medium">Post-Training Assessment</p>
                <p className="text-xs text-stone-gray mt-0.5">Test what you have learned - 30 questions, 20 min</p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-gray group-hover:text-terracotta transition-colors shrink-0" />
            </Link>
            <Link href="/phishing" className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper hover:border-terracotta/30 transition-all group flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <div className="grow">
                <p className="font-serif text-near-black font-medium">Spot the Fake Labs</p>
                <p className="text-xs text-stone-gray mt-0.5">Identify real phishing emails and fake login pages</p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-gray group-hover:text-terracotta transition-colors shrink-0" />
            </Link>
          </div>

          
          <div className="flex flex-wrap gap-2 mb-8">
            {["all", ...Object.keys(CATEGORY_META)].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all border ${
                  filter === t
                    ? "bg-near-black text-ivory border-near-black"
                    : "bg-ivory text-stone-gray border-border-cream hover:border-terracotta/40"
                }`}
              >
                {t === "all" ? "All Topics" : CATEGORY_META[t]?.label || t}
              </button>
            ))}
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((module) => {
              const meta = CATEGORY_META[module.category] || CATEGORY_META.general;
              const Icon = meta.icon;
              const completed = module.progress?.completed;
              return (
                <Link
                  key={module.moduleId}
                  href={`/learn/${module.moduleId}`}
                  className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper flex flex-col hover:border-terracotta/30 transition-all group relative"
                >
                  {completed && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 ${meta.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${DIFF_BADGE[module.difficulty] || DIFF_BADGE.beginner}`}>
                      {module.difficulty}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-near-black mb-1 leading-snug">{module.title}</h3>
                  <p className="text-stone-gray text-sm grow mb-4 leading-relaxed line-clamp-2">{module.subtitle}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="flex items-center gap-1.5 text-xs text-stone-gray font-mono">
                      <Clock className="w-3.5 h-3.5" /> {module.estimatedMinutes} min
                    </span>
                    {completed ? (
                      <span className="text-xs font-mono text-green-600 font-bold">
                        {module.progress?.quizScore != null ? `Score: ${module.progress.quizScore}%` : "Completed"}
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-terracotta font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Start <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-stone-gray opacity-30" />
              <p className="font-serif text-xl text-stone-gray">No modules available yet.</p>
            </div>
          )}
        </div>
      )}
    </UserLayoutWrapper>
  );
}
