import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  Award,
  Book,
  Edit3,
  Save,
  X,
} from "lucide-react";
import Card from "../../components/common/Card";
import ProfilePhotoManager from "../../components/common/ProfilePhotoManager";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const FacultyProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "subjects") {
      setFormData({
        ...formData,
        subjects: value.split(",").map((s) => s.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = await api.updateProfile(formData);
      updateUser(updatedUser);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const inputClass =
    "w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white/70 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition";
  const labelClass =
    "flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans antialiased">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Faculty Profile
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your professional information and teaching details
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-md shadow-indigo-500/10"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*--------------------------------------- Profile Picture and Basic Info------------------------------- */}
        <Card className="text-center hover:-translate-y-0.5 transition duration-200 flex flex-col justify-center items-center py-8">
          <div className="space-y-4 flex flex-col items-center">
            <ProfilePhotoManager user={user} />
            <div className="mt-2">
              <h3 className="text-xl font-bold text-slate-955 font-display">{user?.name}</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">{user?.designation}</p>
              <span className="inline-block font-mono text-xs text-slate-600 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded mt-2">
                ID: {user?.facultyId}
              </span>
            </div>
          </div>
        </Card>

        {/*------------------------------------ Personal Information------------------------------------- */}
        <div className="lg:col-span-2">
          <Card title="Personal Information" subtitle="Update your contact credentials and credentials visibility">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  <User className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
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
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
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
                  <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
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
                  <p className="text-sm font-semibold text-slate-800">{user?.phone || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Faculty ID
                </label>
                <p className="text-sm font-mono font-semibold text-slate-700 bg-slate-50 border border-slate-150/80 rounded px-2.5 py-1.5 w-max">
                  {user?.facultyId}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ------------------------------------Professional Information------------------------------ */}
        <div className="lg:col-span-3">
          <Card title="Professional Information" subtitle="Your designation and classroom areas of expertise">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>
                  <Building className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  Department
                </label>
                <p className="text-sm font-semibold text-slate-800">{user?.department}</p>
              </div>

              <div>
                <label className={labelClass}>
                  <Award className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  Designation
                </label>
                <p className="text-sm font-semibold text-slate-800">{user?.designation}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Experience
                </label>
                <p className="text-sm font-semibold text-slate-800">8 Years</p>
              </div>

              <div className="md:col-span-3">
                <label className={labelClass}>
                  <Book className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  Subjects Teaching
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="subjects"
                    value={formData?.subjects?.join(", ") || ""}
                    onChange={handleInputChange}
                    placeholder="Enter subjects separated by commas"
                    className={inputClass}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user?.subjects?.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100/50 rounded-full text-xs font-semibold"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/*------------------------------------- Teaching Statistics----------------------------------------- */}
        <div className="lg:col-span-3">
          <Card title="Teaching Statistics" subtitle="Key metrics on student numbers and performance indexes">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100/80">
                <div className="bg-indigo-50/80 text-indigo-650 border border-indigo-100/30 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                  <Book className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold text-slate-900 font-display">3</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Subjects</p>
              </div>

              <div className="text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100/80">
                <div className="bg-emerald-50/80 text-emerald-650 border border-emerald-100/30 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold text-slate-900 font-display">125</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Students</p>
              </div>

              <div className="text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100/80">
                <div className="bg-purple-50/80 text-purple-650 border border-purple-100/30 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold text-slate-900 font-display">4.8</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Rating</p>
              </div>

              <div className="text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100/80">
                <div className="bg-amber-50/80 text-amber-650 border border-amber-100/30 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                  <Building className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold text-slate-900 font-display">8</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Years Exp.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
