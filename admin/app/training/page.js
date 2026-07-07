"use client";

import { useEffect, useState } from "react";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import { seedTrainingData, getQuestionStats, getAssessmentStats, seedPhishingData, getPhishingStats } from "@/services/analyticsService";
import { Loader2, Database, BookOpen, CheckCircle, GraduationCap, RefreshCw, Mail } from "lucide-react";

const CATEGORY_LABELS = {
  phishing_email: "Phishing Email",
  vishing: "Vishing",
  bec: "BEC / CEO Fraud",
  mfa_fatigue: "MFA Fatigue",
  pretexting: "Pretexting",
  general: "General Security",
};

export default function TrainingAdminPage() {
  const [questionStats, setQuestionStats] = useState(null);
  const [assessmentStats, setAssessmentStats] = useState([]);
  const [phishingCount, setPhishingCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedingPhishing, setSeedingPhishing] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [qs, as, ps] = await Promise.all([getQuestionStats(), getAssessmentStats(), getPhishingStats()]);
      setQuestionStats(qs.data);
      setAssessmentStats(as.data || []);
      setPhishingCount(ps.data?.length ?? 0);
    } catch {
      
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will upsert all training data from JSON files. Continue?")) return;
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await seedTrainingData();
      setSeedMsg(res.message || "Seeded successfully.");
      await fetchStats();
    } catch (err) {
      setSeedMsg("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AdminLayoutWrapper>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Training Modules</p>
          <h1 className="text-4xl font-serif text-near-black">Education Management</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchStats}
            className="btn-warm-sand px-5 py-2.5 text-sm flex items-center gap-2 border border-border-cream"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="btn-terracotta px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Seed Training Data
          </button>
          <button
            onClick={async () => {
              if (!confirm("Seed 12 email + 5 login phishing lab templates?")) return;
              setSeedingPhishing(true); setSeedMsg("");
              try {
                const res = await seedPhishingData();
                setSeedMsg(res.message || "Phishing templates seeded.");
                await fetchStats();
              } catch (err) {
                setSeedMsg("Error: " + (err.response?.data?.message || err.message));
              } finally { setSeedingPhishing(false); }
            }}
            disabled={seedingPhishing}
            className="btn-terracotta !bg-near-black !text-ivory px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {seedingPhishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Seed Phishing Labs
          </button>
        </div>
      </div>

      {seedMsg && (
        <div className={`mb-8 px-5 py-4 rounded-3xl text-sm font-medium flex items-center gap-3 border shadow-whisper ${
          seedMsg.startsWith("Error") ? "bg-red-50 text-red-700 border-red-100" : "bg-green-50 text-green-700 border-green-100"
        }`}>
          <CheckCircle className="w-4 h-4 shrink-0" /> {seedMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-terracotta animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          
          <div className="bg-ivory border border-border-cream rounded-[40px] p-8 md:p-10 shadow-whisper">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center text-terracotta">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-serif text-near-black">Question Bank</h2>
              {questionStats && (
                <span className="ml-auto px-4 py-1.5 bg-warm-sand/30 rounded-full text-xs font-mono font-bold text-stone-gray border border-border-cream/50">
                  {questionStats.total} total questions
                </span>
              )}
            </div>

            {questionStats?.byCategory?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-cream/50 text-stone-gray">
                      <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-wider">Category</th>
                      <th className="text-center py-4 px-4 font-mono text-xs uppercase tracking-wider">Total</th>
                      <th className="text-center py-4 px-4 font-mono text-xs uppercase tracking-wider text-green-600">Easy</th>
                      <th className="text-center py-4 px-4 font-mono text-xs uppercase tracking-wider text-terracotta">Medium</th>
                      <th className="text-center py-4 px-4 font-mono text-xs uppercase tracking-wider text-near-black">Hard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-cream/30">
                    {questionStats.byCategory.map((row) => (
                      <tr key={row._id || "none"} className="hover:bg-warm-sand/5 transition-colors group">
                        <td className="py-5 px-4 text-near-black font-semibold">
                          {CATEGORY_LABELS[row._id] || row._id || "Uncategorized"}
                        </td>
                        <td className="py-5 px-4 text-center font-mono text-near-black font-bold">{row.total}</td>
                        <td className="py-5 px-4 text-center font-mono text-green-600 font-bold">{row.easy}</td>
                        <td className="py-5 px-4 text-center font-mono text-terracotta font-bold">{row.medium}</td>
                        <td className="py-5 px-4 text-center font-mono text-near-black font-bold">{row.hard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-warm-sand/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-stone-gray opacity-30" />
                </div>
                <p className="text-olive-gray font-serif text-lg">No questions seeded yet. Click "Seed Training Data" to begin.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-ivory border border-border-cream rounded-[40px] p-8 md:p-10 shadow-whisper">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center text-terracotta">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-serif text-near-black">Phishing Labs</h2>
              </div>
              {phishingCount === 0 || phishingCount === null ? (
                <div className="text-center py-10">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-stone-gray opacity-20" />
                  <p className="text-olive-gray text-sm">No templates found. Seed the lab data above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-parchment border border-border-cream rounded-3xl p-6 text-center shadow-sm">
                    <p className="text-3xl font-serif font-bold text-terracotta">{phishingCount}</p>
                    <p className="text-[10px] uppercase font-bold text-stone-gray tracking-widest mt-2">Emails</p>
                  </div>
                  <div className="bg-parchment border border-border-cream rounded-3xl p-6 text-center shadow-sm">
                    <p className="text-3xl font-serif font-bold text-near-black">5</p>
                    <p className="text-[10px] uppercase font-bold text-stone-gray tracking-widest mt-2">Logins</p>
                  </div>
                  <div className="bg-near-black rounded-3xl p-6 text-center shadow-md">
                    <p className="text-3xl font-serif font-bold text-ivory">{phishingCount + 5}</p>
                    <p className="text-[10px] uppercase font-bold text-stone-gray/60 tracking-widest mt-2">Total</p>
                  </div>
                </div>
              )}
            </div>

            
            <div className="bg-ivory border border-border-cream rounded-[40px] p-8 md:p-10 shadow-whisper">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center text-terracotta">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-serif text-near-black">Assessments</h2>
              </div>
              {assessmentStats.length > 0 ? (
                <div className="space-y-4">
                  {assessmentStats.map((stat) => (
                    <div key={stat._id} className="bg-parchment border border-border-cream rounded-3xl p-6 flex items-center justify-between shadow-sm">
                      <div>
                        <p className="text-[10px] font-bold text-terracotta uppercase tracking-[0.2em] mb-1">
                          {stat._id === "pre_assessment" ? "Initial Evaluation" : "Final Assessment"}
                        </p>
                        <p className="text-2xl font-serif text-near-black">{stat.count} <span className="text-sm font-sans text-stone-gray ">taken</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-serif font-bold text-near-black">{Math.round(stat.avgScore || 0)}% <span className="text-xs font-sans text-stone-gray font-normal">Avg</span></p>
                        <p className="text-xs font-mono font-bold text-green-600 uppercase tracking-wider">{Math.round((stat.passRate || 0) * 100)}% Pass Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-olive-gray  text-sm">No assessment results recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
