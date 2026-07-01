import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Hash,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { api } from "../../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    course: "",
    semester: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.registerStudent(formData);
      navigate("/student/login");
    } catch (err) {
      setError(err.message || "Unable to create account");
    }
  };

  const inputClass =
    "block w-full rounded-lg border border-slate-250/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25";
  const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-100/75 via-slate-50/55 to-[#fcfcfe] text-slate-900 antialiased font-sans">
      
      {/* Grid lines details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40" />

      <button
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-lg border border-slate-250/70 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </button>

      <main className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        
        {/* Left Side Info Block */}
        <section className="hidden lg:block">
          <div className="max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-indigo-150 bg-indigo-50/75 px-3 py-1.5 backdrop-blur-md shadow-2xs">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700">
                Student Registration Portal
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl leading-tight">
              Create your student workspace.
            </h1>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-500 font-normal">
              Register a student profile to access assignments, attendance sheets, digital materials, events trackers, leave requests, and your personal academic files from one place.
            </p>
          </div>
        </section>

        {/* Right Side Signup Form Card */}
        <section className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-150/40 backdrop-blur-md sm:p-8">
            <div className="mb-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-500/10">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold tracking-widest text-indigo-650 uppercase">
                Student Registration
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-950 tracking-tight">
                Join EduManage
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Fill in your academic details to create a student account.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Alex Johnson"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="name@student.edu"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="studentId" className={labelClass}>
                    Student ID
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      required
                      value={formData.studentId}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="CS2026001"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Course
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Computer Science", "Information Technology"].map(
                      (course) => (
                        <button
                          key={course}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, course })
                          }
                          className={`min-h-12 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition cursor-pointer ${
                            formData.course === course
                              ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-2xs"
                              : "border-slate-250 bg-white/70 text-slate-650 hover:bg-white hover:border-slate-350"
                          }`}
                        >
                          {course === "Computer Science" ? "Computer Science" : "Information Tech"}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Semester
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, semester: String(sem) })
                        }
                        className={`h-12 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          formData.semester === String(sem)
                            ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-2xs"
                            : "border-slate-250 bg-white/70 text-slate-655 hover:bg-white hover:border-slate-350"
                        }`}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-11`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-655"
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

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${inputClass} pr-11`}
                      placeholder="Repeat password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-655"
                      title={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-255 bg-rose-50/60 px-3 py-2 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition duration-200 hover:from-indigo-505 hover:to-violet-505 cursor-pointer"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center text-xs text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/student/login")}
                  className="font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Signup;
