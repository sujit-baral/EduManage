import React from "react";

const Card = ({ children, className = "", title, subtitle }) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-xs shadow-slate-100/50 hover:shadow-md hover:border-slate-300/50 transition-all duration-300 ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4.5 border-b border-slate-150 bg-slate-50/50 rounded-t-2xl">
          {title && (
            <h3 className="text-lg font-bold text-slate-950 font-display tracking-tight">{title}</h3>
          )}
          {subtitle && <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
