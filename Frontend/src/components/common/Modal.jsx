import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 text-center">
        <div
          className="fixed inset-0 z-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div
          className={`relative z-10 inline-block max-h-[88vh] w-full overflow-y-auto rounded-2xl bg-white/95 border border-slate-200/60 px-6 pb-6 pt-5.5 text-left align-middle shadow-2xl shadow-slate-900/10 transform transition-all sm:max-w-lg ${className}`}
        >
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <h3 className="text-xl font-bold text-slate-950 font-display tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-450 hover:text-slate-700 hover:bg-slate-50 transition focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
