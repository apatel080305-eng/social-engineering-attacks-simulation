"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";
import { getTemplates } from "@/services/phishingService";
import UserLayoutWrapper from "@/components/UserLayoutWrapper";
import Link from "next/link";
import { Loader2, Mail, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";

const DIFF_BADGE = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100 text-red-700",
};

export default function EmailLabPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await getMe();
        const res = await getTemplates("email");
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
              <h1 className="text-4xl font-serif text-near-black mb-2">Fake Email Lab</h1>
              <p className="text-stone-gray max-w-xl">Read each email carefully and identify as many red flags as you can. Scoring rewards finding real flags and penalises false alarms.</p>
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
              const attempt = t.attempt;
              return (
                <Link
                  key={t.templateId}
                  href={`/phishing/email/${t.templateId}`}
                  className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper hover:border-terracotta/30 transition-all group flex flex-col relative"
                >
                  {attempt && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-red-500" />
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${DIFF_BADGE[t.difficulty]}`}>
                      {t.difficulty}
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-near-black mb-1 leading-snug">{t.title}</h3>
                  {t.emailMeta?.subject && (
                    <p className="text-xs text-stone-gray mb-4 font-mono truncate">"{t.emailMeta.subject}"</p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    {attempt ? (
                      <span className="text-xs font-mono font-bold text-green-600">Score: {attempt.score}%</span>
                    ) : (
                      <span className="text-xs font-mono text-terracotta font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read email <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-20">
              <Mail className="w-12 h-12 mx-auto mb-4 text-stone-gray opacity-30" />
              <p className="font-serif text-xl text-stone-gray mb-2">No email templates yet</p>
              <p className="text-sm text-stone-gray/60">Ask an admin to seed phishing lab data.</p>
            </div>
          )}
        </div>
      )}
    </UserLayoutWrapper>
  );
}
