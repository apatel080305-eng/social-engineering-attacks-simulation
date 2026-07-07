"use client";

import { useEffect, useState } from "react";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import { getOverview, getAllUserScores } from "@/services/analyticsService";
import { Loader2, Users, BarChart3, Shield, TrendingUp, ChevronRight } from "lucide-react";

const TYPE_LABELS = {
  phishing_email: "Phishing Email",
  vishing: "Vishing",
  bec: "BEC",
  mfa_fatigue: "MFA Fatigue",
  pretexting: "Pretexting",
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    Promise.all([
      getOverview().then((r) => setOverview(r.data)),
      getAllUserScores().then((r) => setUsers(r.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayoutWrapper>
      <div className="mb-8">
        <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Administration</p>
        <h1 className="text-3xl font-serif text-near-black">Simulation Analytics</h1>
      </div>

      
      <div className="flex gap-2 mb-8">
        {["overview", "users"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-mono font-bold transition-all border capitalize ${
              activeTab === tab
                ? "bg-near-black text-ivory border-near-black"
                : "bg-ivory text-stone-gray border-border-cream hover:border-terracotta/40"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && overview && (
        <>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Sessions", value: overview.totalSessions, icon: BarChart3 },
              { label: "Completed", value: overview.completedSessions, icon: TrendingUp },
              { label: "Avg Score", value: `${overview.averageScore}/100`, icon: Shield },
              { label: "Users Tracked", value: users.length, icon: Users },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-ivory border border-border-cream rounded-3xl p-6 shadow-whisper">
                  <div className="flex justify-between items-start mb-4">
                    <Icon className="w-5 h-5 text-terracotta" />
                  </div>
                  <p className="text-stone-gray text-sm font-medium mb-1">{kpi.label}</p>
                  <p className="text-3xl font-serif text-near-black">{kpi.value}</p>
                </div>
              );
            })}
          </div>

          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-ivory border border-border-cream rounded-3xl p-7 shadow-whisper">
              <h2 className="font-serif text-xl text-near-black mb-5">Scenario Performance</h2>
              <div className="space-y-4">
                {(overview.scenarioBreakdown || []).map((s) => (
                  <div key={s.type}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-near-black">{TYPE_LABELS[s.type] || s.type}</span>
                      <span className="font-mono text-stone-gray">{s.count} sessions · avg {s.avgScore}</span>
                    </div>
                    <div className="h-2 bg-warm-sand/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-terracotta rounded-full"
                        style={{ width: `${s.avgScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-stone-gray mt-1">{s.identificationRate}% identified the attack</p>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="bg-ivory border border-border-cream rounded-3xl p-7 shadow-whisper">
              <h2 className="font-serif text-xl text-near-black mb-5">Most Exploited Triggers</h2>
              <div className="space-y-3">
                {(overview.topTriggers || []).map((t, i) => (
                  <div key={t.trigger} className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-warm-sand rounded-full flex items-center justify-center text-xs font-mono text-stone-gray">{i + 1}</span>
                    <span className="flex-grow text-sm text-near-black capitalize">{t.trigger.replace(/_/g, " ")}</span>
                    <span className="text-xs font-mono font-bold text-terracotta">{t.hits} hits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "users" && (
        <div className="bg-ivory border border-border-cream rounded-3xl shadow-whisper overflow-hidden">
          <div className="p-6 border-b border-border-cream">
            <h2 className="font-serif text-xl text-near-black">User Performance</h2>
            <p className="text-sm text-stone-gray mt-1">Sorted by average awareness score (highest first).</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-cream bg-parchment/50">
                  <th className="text-left px-6 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Email</th>
                  <th className="text-center px-4 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Sessions</th>
                  <th className="text-center px-4 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Avg Score</th>
                  <th className="text-center px-4 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Best</th>
                  <th className="text-center px-4 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">ID Rate</th>
                  <th className="text-center px-4 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Last Activity</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId} className="border-b border-border-cream/50 hover:bg-warm-sand/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-near-black">{u.name}</td>
                    <td className="px-6 py-4 text-stone-gray">{u.email}</td>
                    <td className="px-4 py-4 text-center">{u.totalSessions}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                        u.avgScore >= 70 ? "bg-green-100 text-green-700" :
                        u.avgScore >= 50 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {u.avgScore}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-stone-gray font-mono text-xs">{u.bestScore}</td>
                    <td className="px-4 py-4 text-center text-stone-gray font-mono text-xs">{u.identificationRate}%</td>
                    <td className="px-4 py-4 text-center text-xs text-stone-gray">
                      {u.lastSession ? new Date(u.lastSession).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-4" />
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-16 text-stone-gray">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No simulation data yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
