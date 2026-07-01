import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  Library,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
  Users,
} from "lucide-react";

const roleAccess = [
  {
    role: "Student",
    path: "/student/login",
    icon: BookOpen,
    accent: "bg-indigo-50/85 border border-indigo-100/50 text-indigo-600 shadow-2xs",
    description: "Access homework assignments, track attendance sheets, read digital notes, and borrow library volumes.",
  },
  {
    role: "Faculty",
    path: "/faculty/login",
    icon: Users,
    accent: "bg-violet-50/85 border border-violet-100/50 text-violet-600 shadow-2xs",
    description: "Submit attendance records, upload study materials, inspect student uploads, and evaluate grades.",
  },
  {
    role: "Admin",
    path: "/admin/login",
    icon: UserRoundCog,
    accent: "bg-sky-50/85 border border-sky-100/50 text-sky-600 shadow-2xs",
    description: "Modify user directories, configure courses and semesters, pull reports, and modify system preferences.",
  },
];

const modules = [
  { label: "Live Attendance Tracking", value: "Real-time", icon: CalendarCheck, desc: "Seamless attendance capturing with live data sync and history exports." },
  { label: "Curriculum Control", value: "Database Linked", icon: ClipboardList, desc: "Course structures, custom credit layouts, and subject allocations." },
  { label: "Connected Library", value: "Fully Tracked", icon: Library, desc: "Virtual catalog checkouts, renewals, and automated reserve functions." },
  { label: "Academic Analytics", value: "Instant Summaries", icon: BarChart3, desc: "Comprehensive reporting logs for administrators and faculty managers." },
];

const metrics = [
  { label: "Dedicated Workspace Portals", value: "3 Portals" },
  { label: "Operational Core Modules", value: "12+ Modules" },
  { label: "Database API Security Score", value: "A+ Verified" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfcfe] text-slate-900 antialiased font-sans">
      {/* Hero Section - Light & Premium Minimal */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-100/75 via-slate-50/55 to-[#fcfcfe] border-b border-slate-200/50 flex flex-col justify-between">
        
        {/* Subtle light-themed grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-50" />

        {/* Soft glowing ambient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-400/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-400/5 rounded-full blur-[110px] pointer-events-none" />

        {/* Global Nav Header */}
        <header className="relative z-10 border-b border-slate-200/60 bg-white/40 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 text-slate-950 transition hover:opacity-90 cursor-pointer"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/10">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-900 to-slate-900 bg-clip-text text-transparent font-display">
                EduManage
              </span>
            </button>

            <nav className="hidden items-center gap-8 text-sm text-slate-650 md:flex">
              <button onClick={() => navigate("/access")} className="hover:text-indigo-650 transition-colors duration-200 cursor-pointer">
                Access Portals
              </button>
              <button onClick={() => navigate("/modules")} className="hover:text-indigo-650 transition-colors duration-200 cursor-pointer">
                Modules
              </button>
              <button onClick={() => navigate("/security")} className="hover:text-indigo-650 transition-colors duration-200 cursor-pointer">
                Security & Tech
              </button>
            </nav>

            <button
              onClick={() => navigate("/admin/login")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-500/10 transition duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-md hover:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
            >
              Admin Console
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Main Hero Container */}
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 content-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 flex-1">
          
          {/* Left Text Column */}
          <div className="flex flex-col justify-center max-w-3xl">
            <div className="mb-6 self-start inline-flex items-center gap-2 rounded-full border border-indigo-150 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-650 animate-pulse" />
              MongoDB Powered Workspace Environment
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.08] font-display">
              Academic Control <br />
              <span className="bg-gradient-to-r from-indigo-650 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Simplified & Unified.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl font-normal">
              A premium, minimal administration suite designed for university workflows. Integrated module databases support attendance, submissions, events, dynamic library catalogs, and user profiles.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/student/login")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition duration-200 hover:from-indigo-505 hover:to-violet-505 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] cursor-pointer"
              >
                Enter Student Portal
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/faculty/login")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] cursor-pointer"
              >
                Faculty Access
              </button>
            </div>
            
            {/* Soft Illustration Preview on Desktop */}
            <div className="mt-12 hidden lg:block max-w-md rounded-xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-100">
              <img 
                src="/campus_hero_art.png" 
                alt="System Preview" 
                className="rounded-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Right Role Portal Selection Column */}
          <div id="access" className="flex flex-col justify-center gap-4">
            <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">
              Select Workspace Portal
            </h2>
            {roleAccess.map((item) => (
              <button
                key={item.role}
                onClick={() => navigate(item.path)}
                className="group relative flex items-center gap-5 rounded-xl border border-slate-200/60 bg-white/80 p-5 text-left text-slate-900 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/35 hover:bg-indigo-50/15 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition duration-300 ${item.accent}`}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold tracking-tight text-slate-950 group-hover:text-indigo-650 transition-colors">
                    {item.role} Workspace
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500 group-hover:text-slate-655 transition-colors">
                    {item.description}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid overflow-hidden rounded-xl border border-slate-200/50 bg-white shadow-xl shadow-slate-150/40 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-6 sm:p-8 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Capabilities & Modules */}
      <main className="py-20 bg-[#fafafc]">
        <section id="modules" className="mx-auto max-w-7xl gap-12 px-4 sm:px-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:px-8 items-center">
          <div>
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Core Capabilities
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl tracking-tight leading-tight font-display">
              Designed for the real daily rhythm of your campus.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              A comprehensive system offering role-restricted spaces for students, educators, and system operators. The application coordinates live databases for curriculum registration, exam evaluations, library management, and report generation.
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate("/modules")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
              >
                Browse all operational modules
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-6 mt-12 lg:mt-0 sm:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module.label}
                className="group rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
                    <module.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-2xs font-semibold text-slate-700 uppercase tracking-wider">
                    {module.value}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-950 font-display">
                  {module.label}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {module.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Safeguards & Security Banner - Redesigned to Light Theme Callout */}
        <section id="security" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-2xl bg-white p-8 sm:p-10 text-slate-900 md:grid-cols-3 relative overflow-hidden border border-slate-200/60 shadow-xl shadow-slate-100">
            {/* Decorative layout accent */}
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex gap-4 relative z-10">
              <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
              <div>
                <h3 className="font-bold text-base tracking-tight text-slate-950">Role-Based Router Guards</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Strict client-side protection blocks unauthenticated users and isolates workspaces by account roles.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 relative z-10">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-violet-650" />
              <div>
                <h3 className="font-bold text-base tracking-tight text-slate-950">Protected Admin Operations</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Administrative adjustments, course deletions, and system updates are protected by middleware checkers.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 relative z-10">
              <BarChart3 className="mt-1 h-5 w-5 shrink-0 text-fuchsia-600" />
              <div>
                <h3 className="font-bold text-base tracking-tight text-slate-950">Dynamic Database Analytics</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Instantly compiled reporting parameters and metrics cards derived directly from live database instances.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} EduManage College Workspace. Powered by Express & MongoDB.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
