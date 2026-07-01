import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/" },
  { label: "Access Portals", path: "/access" },
  { label: "Modules", path: "/modules" },
  { label: "Security & Tech", path: "/security" },
];

const PublicPageLayout = ({ eyebrow, title, description, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    document.title = eyebrow
      ? `${eyebrow} | EduManage`
      : "EduManage — Modern Campus Portal";
  }, [eyebrow]);

  return (
    <div className="min-h-screen bg-[#fcfcfe] text-slate-900 antialiased font-sans">
      {/* Sticky Header with Premium Glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all duration-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 text-slate-950 transition hover:opacity-90 cursor-pointer"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/10">
              <EducationIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-900 to-slate-900 bg-clip-text text-transparent font-display">
              EduManage
            </span>
          </button>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative py-1 font-medium transition-colors duration-200 hover:text-indigo-600 cursor-pointer ${
                    isActive ? "text-indigo-600" : "text-slate-650"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600" />
                  )}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => navigate("/admin/login")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-500/10 transition duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-md hover:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
          >
            Admin Console
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <main>
        {/* Modern Subpage Hero Section with Subtle Mesh Gradient - LIGHT THEME */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/60 via-slate-50/40 to-[#fcfcfe] py-16 sm:py-20 border-b border-slate-200/60">
          {/* Subtle grid lines for high-tech aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-40" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-150 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                {eyebrow}
              </span>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.1] font-display">
                {title}
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-500 max-w-2xl font-normal">
                {description}
              </p>
            </div>
          </div>
        </section>

        {/* Child Content Container */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {children}
        </section>
      </main>
    </div>
  );
};

// Internal icon proxy helper for fallback compatibility
const EducationIcon = (props) => {
  return <GraduationCap {...props} />;
};

export default PublicPageLayout;
