import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Shield,
  Bell,
  Database,
  Users,
} from "lucide-react";
import Card from "../../components/common/Card";
import AdminActionButton from "../../components/admin/AdminActionButton";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const AdminSettings = () => {
  const defaultSettings = {
    // System Settings
    systemName: "EduManage College System",
    systemEmail: "admin@college.edu",
    timezone: "UTC+05:30",
    dateFormat: "DD/MM/YYYY",

    // Security Settings
    passwordMinLength: 8,
    sessionTimeout: 30,
    twoFactorAuth: false,
    loginAttempts: 3,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    attendanceAlerts: true,
    gradeAlerts: true,
    eventReminders: true,

    // Academic Settings
    academicYear: "2023-2024",
    semesterSystem: true,
    gradingScale: "percentage",
    attendanceThreshold: 75,
    maxAbsences: 5,
  };
  const { data: settings, setData: setSettings } = useApiResource(
    api.getSettings,
    defaultSettings
  );

  const [activeTab, setActiveTab] = useState("system");

  const handleInputChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    const updatedSettings = await api.updateSettings(settings);
    setSettings(updatedSettings);
    toast.success("Settings saved successfully");
  };

  const tabs = [
    { id: "system", name: "System", icon: SettingsIcon },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "academic", name: "Academic", icon: Users },
    { id: "database", name: "Database", icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "system":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  value={settings.systemName}
                  onChange={(e) =>
                    handleInputChange("systemName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  System Email
                </label>
                <input
                  type="email"
                  value={settings.systemEmail}
                  onChange={(e) =>
                    handleInputChange("systemEmail", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    handleInputChange("timezone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="UTC+05:30">UTC+05:30 (India)</option>
                  <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                  <option value="UTC-05:00">UTC-05:00 (EST)</option>
                  <option value="UTC-08:00">UTC-08:00 (PST)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    handleInputChange("dateFormat", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={settings.passwordMinLength}
                  onChange={(e) =>
                    handleInputChange(
                      "passwordMinLength",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleInputChange(
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Maximum Login Attempts
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={settings.loginAttempts}
                  onChange={(e) =>
                    handleInputChange("loginAttempts", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleInputChange("twoFactorAuth", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-slate-200 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Enable Two-Factor Authentication
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="text-lg font-medium text-slate-950 mb-4">
                  Notification Channels
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        handleInputChange(
                          "emailNotifications",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 border-slate-200 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Email Notifications
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) =>
                        handleInputChange("smsNotifications", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-slate-200 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      SMS Notifications
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) =>
                        handleInputChange("pushNotifications", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-slate-200 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Push Notifications
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-950 mb-4">
                  Alert Types
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.attendanceAlerts}
                      onChange={(e) =>
                        handleInputChange("attendanceAlerts", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-slate-200 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Attendance Alerts
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.gradeAlerts}
                      onChange={(e) =>
                        handleInputChange("gradeAlerts", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-slate-200 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Grade Alerts
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.eventReminders}
                      onChange={(e) =>
                        handleInputChange("eventReminders", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-slate-200 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Event Reminders
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "academic":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) =>
                    handleInputChange("academicYear", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Grading Scale
                </label>
                <select
                  value={settings.gradingScale}
                  onChange={(e) =>
                    handleInputChange("gradingScale", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="percentage">Percentage (0-100)</option>
                  <option value="gpa">GPA (0-4.0)</option>
                  <option value="letter">Letter Grade (A-F)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Attendance (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.attendanceThreshold}
                  onChange={(e) =>
                    handleInputChange(
                      "attendanceThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Maximum Absences
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={settings.maxAbsences}
                  onChange={(e) =>
                    handleInputChange("maxAbsences", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.semesterSystem}
                    onChange={(e) =>
                      handleInputChange("semesterSystem", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-slate-200 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Use Semester System
                  </span>
                </label>
                <p className="text-sm text-slate-500 ml-7">
                  Enable semester-based academic structure
                </p>
              </div>
            </div>
          </div>
        );

      case "database":
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Database className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Database Configuration
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Database settings are managed by the system administrator
                      and cannot be modified through this interface.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-950 mb-2">
                  Database Status
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Status:</span>
                    <span className="text-sm text-green-600 font-medium">
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Type:</span>
                    <span className="text-sm text-slate-950">MongoDB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Version:</span>
                    <span className="text-sm text-slate-950">Atlas / Mongoose</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-950 mb-2">
                  Backup Settings
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Auto Backup:</span>
                    <span className="text-sm text-green-600 font-medium">
                      Enabled
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Frequency:</span>
                    <span className="text-sm text-slate-950">Daily</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Last Backup:</span>
                    <span className="text-sm text-slate-950">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Settings"
        description="Configure platform preferences, security rules, notifications, and academic defaults."
        actions={
          <AdminActionButton icon={Save} onClick={handleSave}>
            Save Settings
          </AdminActionButton>
        }
      />

      <Card>
        {/*----------------------------------- Tabs -------------------------------------*/}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-cyan-600 text-cyan-700"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* -----------------------------Tab Content------------------------------------------ */}
        {renderTabContent()}
      </Card>
    </div>
  );
};

export default AdminSettings;
