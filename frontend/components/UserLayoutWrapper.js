"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMe, logout } from "@/services/authService";
import UserSidebar from "./UserSidebar";
import NotificationBell from "./NotificationBell";
import { Loader2, User } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UserLayoutWrapper({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await getMe();
      if (res.success) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } else {
        localStorage.removeItem("user");
        router.push("/login");
      }
    } catch (err) {
      const status = err?.response?.status;
      // Only force logout on a genuine auth rejection
      if (status === 401 || status === 403) {
        localStorage.removeItem("user");
        router.push("/login");
      }
      // 429 (rate limit), 5xx (server error), network failure - stay on page,
      // the stored user in state is still valid
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      toast.success("Logged out");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-terracotta animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <UserSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onLogout={handleLogout}
      />

      <div className="flex-grow bg-parchment overflow-x-hidden transition-all duration-300">
        
        <header className="h-20 border-b border-border-cream px-8 flex items-center justify-end sticky top-0 bg-parchment/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-5">
            <NotificationBell />
            <div className="h-8 w-px bg-border-cream" />
            <Link
              href="/settings"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-near-black group-hover:text-terracotta transition-colors leading-tight">
                  {user?.name}
                </p>
                <p className="text-[10px] uppercase font-bold text-terracotta tracking-wider">
                  {user?.role || "user"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-warm-sand border border-border-cream overflow-hidden flex items-center justify-center group-hover:border-terracotta/50 transition-colors">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : user?.name ? (
                  <span className="text-terracotta font-serif font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-stone-gray" />
                )}
              </div>
            </Link>
          </div>
        </header>

        <main className="p-8 md:p-12 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
