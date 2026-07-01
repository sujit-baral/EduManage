import React from "react";

const AdminPageHeader = ({ eyebrow = "Admin", title, description, actions }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 bg-gradient-to-r from-slate-50 via-cyan-50 to-rose-50 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
};

export default AdminPageHeader;
