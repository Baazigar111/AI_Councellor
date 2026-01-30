import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Switching to Inter for a more professional "SaaS" look
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Counsellor | Your Study Abroad Path",
  description: "AI-powered guidance for your international education journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-brand-bg text-slate-900`}>
        <div className="flex h-screen overflow-hidden">
          {/* PROFESSIONAL SIDEBAR 
            This stays fixed while the content on the right changes.
          */}
          <aside className="w-64 bg-brand-dark text-white flex flex-col border-r border-white/10">
            <div className="p-6">
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <span className="bg-brand-primary p-1 rounded-lg">🎓</span>
                AI Counsellor
              </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/10 transition-all group">
                <span className="opacity-70 group-hover:opacity-100">💬</span> 
                Dashboard
              </Link>
              <Link href="/discovery" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/10 transition-all group">
                <span className="opacity-70 group-hover:opacity-100">🔍</span> 
                Discovery
              </Link>
              <Link href="/locker" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/10 transition-all group">
                <span className="opacity-70 group-hover:opacity-100">📁</span> 
                Doc Locker
              </Link>
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-xs text-slate-400 mb-1">Current Status</p>
                {/* This will dynamically reflect your "ONBOARDING" stage 
                  once we connect the state logic.
                */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-blue-100">ONBOARDING</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 relative overflow-y-auto bg-slate-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}