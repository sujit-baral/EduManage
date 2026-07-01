import React from "react";

const AdminActionButton = ({ children, icon: Icon, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-slate-950 text-white hover:bg-cyan-700",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
        variants[variant] || variants.primary
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};

export default AdminActionButton;
