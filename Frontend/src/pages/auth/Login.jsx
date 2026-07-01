import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRoundCog,
  Users,
} from "lucide-react";

const roleConfigMap = {
  student: {
    label: "Student Portal",
    icon: BookOpen,
    accent: "from-indigo-500 to-indigo-600",
    glow: "shadow-indigo-500/10",
    summary: "Access assignments, track attendance, read digital materials, check out library books, and register for events.",
  },
  faculty: {
    label: "Faculty Portal",
    icon: Users,
    accent: "from-violet-500 to-violet-600",
    glow: "shadow-violet-500/10",
    summary: "Log student attendances, post lecture notes, inspect student files, and evaluate project grades.",
  },
  admin: {
    label: "Admin Console",
    icon: UserRoundCog,
    accent: "from-sky-500 to-sky-600",
    glow: "shadow-sky-500/10",
    summary: "Modify user databases, configure course rosters, inspect system settings, and download operational reports.",
  },
};

const Login = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const currentRole = roleConfigMap[role] || roleConfigMap.student;
  const RoleIcon = currentRole.icon;

  const getDemoCredentials = () => {
    switch (role) {
      case "student":
        return { email: "alex.johnson@student.edu", password: "password" };
      case "faculty":
        return { email: "michael.brown@faculty.edu", password: "password" };
      case "admin":
        return { email: "jennifer.davis@admin.edu", password: "password" };
      default:
        return { email: "", password: "" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password, role);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  const demoCredentials = getDemoCredentials();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-100/75 via-slate-50/55 to-[#fcfcfe] text-slate-900 antialiased font-sans">
      
      {/* Grid line details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40" />

      <button
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-lg border border-slate-250/70 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </button>

      <main className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        
        {/* Left Side Feature Block */}
        <section className="hidden lg:block">
          <div className="max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-indigo-150 bg-indigo-50/75 px-3 py-1.5 backdrop-blur-md shadow-2xs">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700">
                Secure Authentication Gateway
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl leading-tight">
              Sign into a focused campus workspace.
            </h1>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-500 font-normal">
              Access your personalized portal panel, fully backed by real-time MongoDB data queries, JWT routing guardrails, and role-authorized controllers.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                "Token-protected sessions (JWT-authenticated)",
                "Role separated dashboards & router guards",
                "Instant live API-backed databases",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-650"
                >
                  <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side Form Card */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-150/40 backdrop-blur-md sm:p-8">
            <div className="mb-8">
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${currentRole.accent} shadow-md ${currentRole.glow}`}
              >
                <RoleIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold tracking-widest text-indigo-650 uppercase">
                {currentRole.label}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-950 tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {currentRole.summary}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-slate-250/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25"
                    placeholder="name@college.edu"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-250/70 bg-white/70 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-650"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-250 bg-rose-50/60 px-3 py-2 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition duration-200 hover:from-indigo-505 hover:to-violet-505 cursor-pointer"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="rounded-lg border border-slate-200/60 bg-slate-50/80 p-4">
                <p className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">
                  Demo credentials
                </p>
                <p className="mt-2 break-all font-mono text-2xs text-slate-600">
                  <span className="font-bold select-all">{demoCredentials.email}</span>
                </p>
                <p className="mt-1 font-mono text-2xs text-slate-600">
                  Password: <span className="font-bold select-all">{demoCredentials.password}</span>
                </p>
              </div>
            </form>

            {role === "student" && (
              <div className="mt-6 text-center text-xs text-slate-500">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  Create one
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
