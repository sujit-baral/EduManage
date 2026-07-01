import React from "react";

export const Table = ({ headers, children, className = "" }) => {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200/50 ${className}`}>
      <table className="min-w-full divide-y divide-slate-150">
        <thead className="bg-slate-50/70">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white/50 divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = "" }) => {
  return <tr className={`hover:bg-slate-50/80 transition-colors duration-150 ${className}`}>{children}</tr>;
};

export const TableCell = ({ children, className = "" }) => {
  return (
    <td
      className={`px-6 py-4.5 whitespace-nowrap text-sm text-slate-700 font-sans ${className}`}
    >
      {children}
    </td>
  );
};
