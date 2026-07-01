import React from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Library,
  Settings,
  Users,
} from "lucide-react";
import PublicPageLayout from "../../components/layout/PublicPageLayout";

const modules = [
  { name: "User Directory", icon: Users, detail: "Comprehensive accounts for students, faculty, and admins with customizable profile picture capabilities." },
  { name: "Academic Curriculums", icon: BookOpen, detail: "Structured course catalogs and subject credits managed on a semester-by-semester level." },
  { name: "Roster Attendance", icon: ClipboardCheck, detail: "Real-time attendance record sheets and automated percentage calculators for faculty." },
  { name: "Homework & Grades", icon: FileText, detail: "Task details distribution, secure digital file hand-ins, and direct scoring boards." },
  { name: "Campus Events", icon: CalendarDays, detail: "Full campus scheduler with capacity thresholds and role-based registry options." },
  { name: "Connected Library", value: "Realtime", icon: Library, detail: "Browse digital catalogs, perform renewals, handle book returns, and reserve volumes." },
  { name: "Analytical Records", icon: BarChart3, detail: "Data sheet exports and custom reports reflecting active academic parameters." },
  { name: "Global Preferences", icon: Settings, detail: "System settings panel to adjust core portal parameters and configuration states." },
];

const ModulesPage = () => {
  return (
    <PublicPageLayout
      eyebrow="Modules"
      title="A connected operating layer for college administration."
      description="The application is structured into targeted functional components sharing a unified database schema, keeping views clean, thin, and maintainable."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <div
            key={module.name}
            className="group rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-500/20 hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600 shadow-2xs transition-transform duration-300 group-hover:scale-105">
              <module.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-base font-bold text-slate-950 tracking-tight group-hover:text-indigo-650 transition-colors">
              {module.name}
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 font-normal">
              {module.detail}
            </p>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
};

export default ModulesPage;
