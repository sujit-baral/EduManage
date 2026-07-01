import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Book,
  Hash,
  Edit3,
  Save,
  X,
} from "lucide-react";
import Card from "../../components/common/Card";
import ProfilePhotoManager from "../../components/common/ProfilePhotoManager";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const updatedUser = await api.updateProfile(formData);
    updateUser(updatedUser);
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user || {});
    setIsEditing(false);
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition";
  const labelClass =
    "flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Student Profile
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your personal credentials and view academic details
          </p>
        </div>
        
        <div className="flex items-center">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-700 transition cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-700 transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*------------------------------ Profile Picture and Basic Info ---------------------------------*/}
        <Card className="flex flex-col items-center justify-center text-center p-6 lg:self-start">
          <div className="space-y-5 w-full">
            <ProfilePhotoManager user={user} />
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-slate-900 font-display">{user?.name}</h3>
              <p className="text-xs font-semibold text-indigo-650 uppercase tracking-widest">{user?.role}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-150 rounded-full text-xs text-slate-500 font-medium mt-2">
                <Hash className="h-3 w-3" />
                <span>{user?.studentId}</span>
              </div>
            </div>
          </div>
        </Card>

        {/*-----------------------------Personal Information ------------------------------------*/}
        <div className="lg:col-span-2">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  <User className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700 bg-slate-50/50 border border-slate-100 px-3.5 py-2.5 rounded-lg">{user?.name}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  <Mail className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData?.email || ""}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700 bg-slate-50/50 border border-slate-100 px-3.5 py-2.5 rounded-lg">{user?.email}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  <Hash className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  Student ID
                </label>
                <p className="text-sm font-medium text-slate-700 bg-slate-50/50 border border-slate-100 px-3.5 py-2.5 rounded-lg">{user?.studentId}</p>
              </div>

              <div>
                <label className={labelClass}>
                  <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData?.phone || ""}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700 bg-slate-50/50 border border-slate-100 px-3.5 py-2.5 rounded-lg">{user?.phone || "Not Provided"}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData?.address || ""}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700 bg-slate-50/50 border border-slate-100 px-3.5 py-2.5 rounded-lg">{user?.address || "Not Provided"}</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* -------------------------------Academic Information------------------------------------ */}
        <div className="lg:col-span-3">
          <Card title="Academic Information">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Book className="h-3.5 w-3.5 mr-2" />
                  Registered Course
                </label>
                <p className="text-base font-medium text-slate-700">{user?.course}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Current Semester
                </label>
                <p className="text-base font-medium text-slate-700">Semester {user?.semester}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Academic Session
                </label>
                <p className="text-base font-medium text-slate-700">2023-2024</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
