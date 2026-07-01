import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Issue #19: Shared loading state component.
 * Shows a centered spinner with an optional message.
 */
const LoadingState = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <Loader2 className="h-8 w-8 animate-spin text-cyan-600 mb-3" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default LoadingState;
