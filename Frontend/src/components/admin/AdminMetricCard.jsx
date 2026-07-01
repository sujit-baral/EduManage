import React from "react";

const AdminMetricCard = ({ icon, label, value, tone = "cyan", note }) => {
  const tones = {
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
          {note && <p className="mt-2 text-xs text-slate-500">{note}</p>}
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${
            tones[tone] || tones.cyan
          }`}
        >
          {React.createElement(icon, { className: "h-5 w-5" })}
        </span>
      </div>
    </div>
  );
};

export default AdminMetricCard;
