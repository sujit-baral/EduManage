import React, { useState } from "react";
import { Building, Edit3, Mail, Save, Shield, User, Users } from "lucide-react";
import Card from "../../components/common/Card";
import ProfilePhotoManager from "../../components/common/ProfilePhotoManager";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminActionButton from "../../components/admin/AdminActionButton";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { useApiResource } from "../../hooks/useApiResource";

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const { data: summary } = useApiResource(api.getSummary, {
    users: 0,
    students: 0,
    faculty: 0,
  });

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
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Profile"
        description="Maintain your administrator identity, profile photo, and account information."
        actions={
          !isEditing ? (
            <AdminActionButton icon={Edit3} onClick={() => setIsEditing(true)}>
              Edit Profile
            </AdminActionButton>
          ) : (
            <>
              <AdminActionButton icon={Save} variant="success" onClick={handleSave}>
                Save
              </AdminActionButton>
              <AdminActionButton variant="secondary" onClick={handleCancel}>
                Cancel
              </AdminActionButton>
            </>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <div className="text-center">
            <ProfilePhotoManager user={user} />
            <h3 className="mt-4 text-xl font-bold text-slate-950">
              {user?.name}
            </h3>
            <p className="text-sm text-slate-500">System Administrator</p>
            <p className="mt-1 text-xs font-medium text-slate-400">{user?.adminId}</p>
          </div>
        </Card>

        <Card title="Personal Information" subtitle="Editable contact fields">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <User className="mr-2 h-4 w-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                />
              ) : (
                <p className="text-slate-950">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <Mail className="mr-2 h-4 w-4" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                />
              ) : (
                <p className="text-slate-950">{user?.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Admin ID
              </label>
              <p className="text-slate-950">{user?.adminId}</p>
            </div>

            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-slate-700">
                <Building className="mr-2 h-4 w-4" />
                Department
              </label>
              <p className="text-slate-950">{user?.department}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <AdminMetricCard icon={Users} label="Total Users" value={summary.users} tone="cyan" />
        <AdminMetricCard icon={User} label="Students" value={summary.students} tone="emerald" />
        <AdminMetricCard icon={Building} label="Faculty" value={summary.faculty} tone="violet" />
      </div>

      <Card title="Administrative Permissions" subtitle="Your active access scope">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {user?.permissions?.map((permission) => (
            <div
              key={permission}
              className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3"
            >
              <Shield className="h-5 w-5 text-emerald-700" />
              <span className="font-medium capitalize text-slate-900">
                {permission.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
