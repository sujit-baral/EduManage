import React from "react";
import { DatabaseZap, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import PublicPageLayout from "../../components/layout/PublicPageLayout";

const safeguards = [
  {
    title: "Token-Based User Sessions",
    icon: KeyRound,
    iconColor: "text-indigo-600 bg-indigo-50/80 border-indigo-100/50 shadow-indigo-100/10",
    detail: "All secure API actions authenticate requests via short-lived JWT tokens saved in local client sessions.",
  },
  {
    title: "Role-Restricted Middleware Routes",
    icon: LockKeyhole,
    iconColor: "text-violet-600 bg-violet-50/80 border-violet-100/50 shadow-violet-100/10",
    detail: "Sensitive administrative and teaching controllers filter requests using server-side role validators.",
  },
  {
    title: "Administrative Safeguards",
    icon: ShieldCheck,
    iconColor: "text-sky-600 bg-sky-50/80 border-sky-100/50 shadow-sky-100/10",
    detail: "Deletion constraints prevent admins from disabling their own access or leaving the platform without an operator.",
  },
  {
    title: "MongoDB Document Schema Validation",
    icon: DatabaseZap,
    iconColor: "text-fuchsia-600 bg-fuchsia-50/80 border-fuchsia-100/50 shadow-fuchsia-100/10",
    detail: "Operational data maps directly to explicit Mongoose models to enforce consistent structural integrity.",
  },
];

const SecurityPage = () => {
  return (
    <PublicPageLayout
      eyebrow="Security & Tech"
      title="Guardrails for the workflows that should never be accidental."
      description="The application employs authenticated route barriers, role-restricted API controllers, structured try-catch systems, and safety logic."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {safeguards.map((item) => (
          <div
            key={item.title}
            className="group rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-500/20 hover:-translate-y-0.5"
          >
            <div className="flex gap-4.5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${item.iconColor} shadow-2xs`}>
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-950 tracking-tight group-hover:text-indigo-650 transition-colors">
                  {item.title}
                </h2>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-500 font-normal">
                  {item.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
};

export default SecurityPage;
