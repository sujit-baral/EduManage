import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Issue #26: Validate API URL on startup
if (!API_BASE_URL) {
  console.error("VITE_API_URL is not configured and no fallback is available.");
}

const getToken = () => localStorage.getItem("token");

// Issue #16: Event emitter for auth-related events (401 interceptor)
const authEventListeners = new Set();

export const onAuthEvent = (listener) => {
  authEventListeners.add(listener);
  return () => authEventListeners.delete(listener);
};

const emitAuthEvent = (event) => {
  authEventListeners.forEach((listener) => listener(event));
};

export const apiRequest = async (path, options = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    // Issue #16: Auto-detect expired/invalid tokens
    if (response.status === 401) {
      emitAuthEvent("session_expired");
      throw new Error("Session expired. Please log in again.");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }
    return data;
  } catch (error) {
    toast.error(error.message || "Something went wrong");
    throw error;
  }
};

// Issue #17: API methods split by domain for better organization.
// All methods are still accessible via the `api` object for backward compatibility.

// ── Auth ──────────────────────────────────────────────────
const authApi = {
  login: (payload) =>
    apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  registerStudent: (payload) =>
    apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  getMe: () => apiRequest("/auth/me"),
};

// ── Users ─────────────────────────────────────────────────
const userApi = {
  getUsers: () => apiRequest("/users"),
  updateProfile: (payload) =>
    apiRequest("/users/profile", { method: "PATCH", body: JSON.stringify(payload) }),
  createUser: (payload) =>
    apiRequest("/users", { method: "POST", body: JSON.stringify(payload) }),
  updateUser: (id, payload) =>
    apiRequest(`/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteUser: (id) => apiRequest(`/users/${id}`, { method: "DELETE" }),
};

// ── Courses ───────────────────────────────────────────────
const courseApi = {
  getCourses: () => apiRequest("/courses"),
  createCourse: (payload) =>
    apiRequest("/courses", { method: "POST", body: JSON.stringify(payload) }),
  deleteCourse: (id) => apiRequest(`/courses/${id}`, { method: "DELETE" }),
  getSubjects: () => apiRequest("/courses/subjects"),
  createSubject: (payload) =>
    apiRequest("/courses/subjects", { method: "POST", body: JSON.stringify(payload) }),
  deleteSubject: (id) => apiRequest(`/courses/subjects/${id}`, { method: "DELETE" }),
};

// ── Events ────────────────────────────────────────────────
const eventApi = {
  getEvents: () => apiRequest("/events"),
  createEvent: (payload) =>
    apiRequest("/events", { method: "POST", body: JSON.stringify(payload) }),
  deleteEvent: (id) => apiRequest(`/events/${id}`, { method: "DELETE" }),
  getMyEventRegistrations: () => apiRequest("/events/registrations/me"),
  registerEvent: (id) => apiRequest(`/events/${id}/register`, { method: "POST" }),
};

// ── Academic ──────────────────────────────────────────────
const academicApi = {
  getAttendance: () => apiRequest("/academic/attendance"),
  saveAttendance: (payload) =>
    apiRequest("/academic/attendance", { method: "POST", body: JSON.stringify(payload) }),
  getGrades: () => apiRequest("/academic/grades"),
  getAssignments: () => apiRequest("/academic/assignments"),
  getMaterials: () => apiRequest("/academic/materials"),
  createMaterial: (payload) =>
    apiRequest("/academic/materials", { method: "POST", body: JSON.stringify(payload) }),
  deleteMaterial: (id) => apiRequest(`/academic/materials/${id}`, { method: "DELETE" }),
  getSubmissions: () => apiRequest("/academic/submissions"),
  submitAssignment: (payload) =>
    apiRequest("/academic/submissions", { method: "POST", body: JSON.stringify(payload) }),
  gradeSubmission: (id, payload) =>
    apiRequest(`/academic/submissions/${id}/grade`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

// ── Dashboard ─────────────────────────────────────────────
const dashboardApi = {
  getSummary: () => apiRequest("/dashboard/summary"),
};

// ── Leave ─────────────────────────────────────────────────
const leaveApi = {
  getLeaveRequests: () => apiRequest("/leave-requests"),
  createLeaveRequest: (payload) =>
    apiRequest("/leave-requests", { method: "POST", body: JSON.stringify(payload) }),
  reviewLeaveRequest: (id, payload) =>
    apiRequest(`/leave-requests/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

// ── Library ───────────────────────────────────────────────
const libraryApi = {
  getLibraryOverview: () => apiRequest("/library"),
  reserveBook: (bookId) =>
    apiRequest(`/library/books/${bookId}/reserve`, { method: "POST" }),
  renewLoan: (loanId) =>
    apiRequest(`/library/loans/${loanId}/renew`, { method: "PATCH" }),
  returnLoan: (loanId) =>
    apiRequest(`/library/loans/${loanId}/return`, { method: "PATCH" }),
};

// ── Settings ──────────────────────────────────────────────
const settingsApi = {
  getSettings: () => apiRequest("/settings"),
  updateSettings: (payload) =>
    apiRequest("/settings", { method: "PATCH", body: JSON.stringify(payload) }),
};

// ── Reports ───────────────────────────────────────────────
const reportApi = {
  exportReport: (payload) =>
    apiRequest("/reports/export", { method: "POST", body: JSON.stringify(payload) }),
};

// Merged api object — backward compatible with all existing imports
export const api = {
  ...authApi,
  ...userApi,
  ...courseApi,
  ...eventApi,
  ...academicApi,
  ...dashboardApi,
  ...leaveApi,
  ...libraryApi,
  ...settingsApi,
  ...reportApi,
};
