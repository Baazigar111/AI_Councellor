"use client";
import { useState, useEffect, useCallback } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiRequest } from "@/lib/api";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [shortlistCount, setShortlistCount] = useState(0);
  const [stage, setStage] = useState("LOADING...");

  // NEW: Function to sync user data from the database
  const syncSidebarData = useCallback(async () => {
    const token = localStorage.getItem('token');
    // Don't fetch data if we are on an auth page or not logged in
    if (!token || pathname === "/login" || pathname === "/signup" || pathname === "/") return;

    try {
      const userData = await apiRequest('/user/me');
      setShortlistCount(userData.shortlisted_universities?.length || 0);
      setStage(userData.current_stage || "ONBOARDING");
    } catch (err) {
      console.error("Sidebar sync failed");
    }
  }, [pathname]);

  // Trigger sync every time the user navigates to a new route
  useEffect(() => {
    syncSidebarData();
  }, [syncSidebarData]);

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/onboarding" || pathname === "/";

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-brand-bg text-slate-900`}>
        {isAuthPage ? (
          <main className="min-h-screen">
            {children}
          </main>
        ) : (
          <div className="flex h-screen overflow-hidden">
            <aside className="w-64 bg-brand-dark text-white flex flex-col border-r border-white/10 shrink-0">
              <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <span className="bg-brand-primary p-1 rounded-lg">🎓</span>
                  AI Counsellor
                </h1>
              </div>

              <nav className="flex-1 px-4 py-4 space-y-2">
                <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all group ${pathname === '/dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                  <span>💬</span> Dashboard
                </Link>
                
                <Link href="/discovery" className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all group ${pathname === '/discovery' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span>🔍</span> Discovery
                  </div>
                  {/* Dynamic Badge for Shortlist Count */}
                  {shortlistCount > 0 && (
                    <span className="bg-blue-600 text-[10px] px-2 py-0.5 rounded-full text-white font-bold animate-fade-in">
                      {shortlistCount}
                    </span>
                  )}
                </Link>

                <Link href="/locker" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all group ${pathname === '/locker' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                  <span>📁</span> Doc Locker
                </Link>
              </nav>

              <div className="p-4 border-t border-white/10">
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-[10px] text-slate-400 mb-1 uppercase font-bold tracking-widest">Current Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-tight">
                      {stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1 relative overflow-y-auto bg-slate-50">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}