import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  User,
  BookOpen,
  Calendar,
  FileText,
  Users,
  Settings,
  GraduationCap,
  Upload,
  ClipboardList,
  PieChart,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case "student":
        return [
          { icon: Home, label: "Dashboard", path: "/student/dashboard" },
          { icon: User, label: "Profile", path: "/student/profile" },
          { icon: BookOpen, label: "Assignments", path: "/student/assignments" },
          { icon: Calendar, label: "Events", path: "/student/events" },
          { icon: FileText, label: "Leave Requests", path: "/student/leave" },
          { icon: BookOpen, label: "Library", path: "/student/library" },
        ];
      case "faculty":
        return [
          { icon: Home, label: "Dashboard", path: "/faculty/dashboard" },
          { icon: User, label: "Profile", path: "/faculty/profile" },
          { icon: ClipboardList, label: "Attendance", path: "/faculty/attendance" },
          { icon: Upload, label: "Materials", path: "/faculty/materials" },
          { icon: Calendar, label: "Events", path: "/faculty/events" },
          { icon: GraduationCap, label: "Submissions", path: "/faculty/submissions" },
          { icon: FileText, label: "Leave Requests", path: "/faculty/leave" },
        ];
      case "admin":
        return [
          { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
          { icon: User, label: "Profile", path: "/admin/profile" },
          { icon: Users, label: "Users", path: "/admin/users" },
          { icon: BookOpen, label: "Courses", path: "/admin/courses" },
          { icon: Calendar, label: "Events", path: "/admin/events" },
          { icon: PieChart, label: "Reports", path: "/admin/reports" },
          { icon: Settings, label: "Settings", path: "/admin/settings" },
          { icon: FileText, label: "Leave Requests", path: "/admin/leave" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-905">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-100"
                    : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
