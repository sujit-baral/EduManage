import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Issue #19: Shared error state component.
 * Shows an error message with an optional retry button.
 */
const ErrorState = ({ message = "Something went wrong", onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-500">
    <AlertTriangle className="h-8 w-8 text-amber-500 mb-3" />
    <p className="text-sm font-medium text-slate-700 mb-1">{message}</p>
    <p className="text-xs text-slate-400 mb-4">Please try again or contact support if the issue persists.</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
