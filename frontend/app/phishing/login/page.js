"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";
import { getTemplates } from "@/services/phishingService";
import UserLayoutWrapper from "@/components/UserLayoutWrapper";
import Link from "next/link";
import { Loader2, Monitor, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";

const BRAND_COLORS = {
  microsoft: "text-blue-600 bg-blue-50",
  google:    "text-red-500 bg-red-50",
  paypal:    "text-blue-800 bg-blue-100",
  bank:      "text-green-700 bg-green-50",
  facebook:  "text-blue-500 bg-blue-50",
};

const DIFF_BADGE = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100 text-red-700",
};

export default function LoginLabPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await getMe();
        const res = await getTemplates("login");
        setTemplates(res.data || []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const completed = templates.filter((t) => t.attempt).length;

  return (
    <UserLayoutWrapper>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
        </div>
      ) : (
      <div className="max-w-4xl mx-auto">
          <div className="mb-2">
            <Link href="/phishing" className="flex items-center gap-1.5 text-sm text-stone-gray hover:text-near-black transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Labs
            </Link>
          </div>
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
            <div>
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Phishing Lab</p>
              <h1 className="text-4xl font-serif text-near-black mb-2">Fake Login Lab</h1>
              <p className="text-stone-gray max-w-xl">Examine each fake login page and identify the mistakes that reveal it is fraudulent. Learn what to check every time you log in somewhere.</p>
            </div>
            {templates.length > 0 && (
              <div className="bg-ivory border border-border-cream rounded-2xl px-6 py-4 shadow-whisper shrink-0">
                <p className="text-xs font-mono text-stone-gray uppercase tracking-widest mb-1">Progress</p>
                <p className="text-2xl font-serif text-near-black">{completed}<span className="text-stone-gray text-base">/{templates.length}</span> <span className="text-sm text-stone-gray font-sans">completed</span></p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((t) => {
              const brand = t.loginMeta?.brand || "general";
              const colorClass = BRAND_COLORS[brand] || "text-stone-gray bg-stone-gray/10";
              return (
                <Link
                  key={t.templateId}
                  href={`/phishing/login/${t.templateId}`}
                  className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper hover:border-terracotta/30 transition-all group flex flex-col relative"
                >
                  {t.attempt && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Monitor className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${DIFF_BADGE[t.difficulty]}`}>
                      {t.difficulty}
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-near-black mb-1">{t.title}</h3>
                  {t.loginMeta?.pageUrl && (
                    <p className="text-xs text-stone-gray/60 font-mono mb-4 truncate">{t.loginMeta.pageUrl}</p>
                  )}
                  <div className="mt-auto">
                    {t.attempt ? (
                      <span className="text-xs font-mono font-bold text-green-600">Score: {t.attempt.score}%</span>
                    ) : (
                      <span className="text-xs font-mono text-terracotta font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Examine page <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-20">
              <Monitor className="w-12 h-12 mx-auto mb-4 text-stone-gray opacity-30" />
              <p className="font-serif text-xl text-stone-gray mb-2">No login templates yet</p>
              <p className="text-sm text-stone-gray/60">Ask an admin to seed phishing lab data.</p>
            </div>
          )}
        </div>
      )}
    </UserLayoutWrapper>
  );
}
