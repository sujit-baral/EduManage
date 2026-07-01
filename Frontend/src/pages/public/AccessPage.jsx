import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, UserRoundCog, Users } from "lucide-react";
import PublicPageLayout from "../../components/layout/PublicPageLayout";

const roles = [
  {
    title: "Student Workspace",
    path: "/student/login",
    icon: BookOpen,
    iconColor: "text-indigo-600 bg-indigo-50/80 border-indigo-100/50 shadow-indigo-100/10",
    features: ["Access homework assignments & submit work", "Track live attendance records & subject grades", "Reserve library books and request leave requests"],
  },
  {
    title: "Faculty Workspace",
    path: "/faculty/login",
    icon: Users,
    iconColor: "text-violet-600 bg-violet-50/80 border-violet-100/50 shadow-violet-100/10",
    features: ["Mark student attendance grids in real-time", "Distribute course notes and digital materials", "Review student submissions & submit graded scores"],
  },
  {
    title: "Admin Workspace",
    path: "/admin/login",
    icon: UserRoundCog,
    iconColor: "text-sky-600 bg-sky-50/80 border-sky-100/50 shadow-sky-100/10",
    features: ["Manage student & faculty directory items", "Establish departments, courses & semesters", "Inspect system operations, settings & report logs"],
  },
];

const AccessPage = () => {
  const navigate = useNavigate();

  return (
    <PublicPageLayout
      eyebrow="Access Portals"
      title="Role-based entry points for every campus workflow."
      description="Each user type lands in a dedicated workspace with the routes, APIs, and controls relevant to their responsibilities."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.title}
            onClick={() => navigate(role.path)}
            className="group text-left flex flex-col justify-between rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-500/20 hover:-translate-y-0.5 cursor-pointer"
          >
            <div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-lg border ${role.iconColor} shadow-2xs`}>
                <role.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-bold text-slate-950 tracking-tight group-hover:text-indigo-650 transition-colors">
                {role.title}
              </h2>
              <div className="mt-5 space-y-3.5">
                {role.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-bold text-slate-950 group-hover:text-indigo-600 transition-colors">
              <span>Enter Workspace</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </PublicPageLayout>
  );
};

export default AccessPage;
