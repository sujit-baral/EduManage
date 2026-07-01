import React, { useState } from "react";
import {
  Users as UsersIcon,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  UserCheck,
} from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import AdminActionButton from "../../components/admin/AdminActionButton";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const emptyUserForm = {
  name: "",
  email: "",
  password: "",
  role: "student",
  phone: "",
  address: "",
  studentId: "",
  facultyId: "",
  adminId: "",
  course: "",
  semester: "",
  department: "",
  designation: "",
  subjects: "",
  permissions: "user_management, course_management, reports",
  status: "active",
};

const buildPayload = (form, isEdit = false) => {
  const payload = {
    name: form.name,
    email: form.email,
    role: form.role,
    phone: form.phone,
    address: form.address,
    status: form.status,
    course: form.role === "student" ? form.course || form.department : undefined,
    semester: form.role === "student" ? Number(form.semester) || undefined : undefined,
    studentId: form.role === "student" ? form.studentId : undefined,
    facultyId: form.role === "faculty" ? form.facultyId : undefined,
    designation: form.role === "faculty" ? form.designation : undefined,
    subjects:
      form.role === "faculty"
        ? form.subjects
            .split(",")
            .map((subject) => subject.trim())
            .filter(Boolean)
        : undefined,
    adminId: form.role === "admin" ? form.adminId : undefined,
    permissions:
      form.role === "admin"
        ? form.permissions
            .split(",")
            .map((permission) => permission.trim())
            .filter(Boolean)
        : undefined,
    department: form.role !== "student" ? form.department : undefined,
  };

  if (!isEdit || form.password) {
    payload.password = form.password || "password";
  }

  return payload;
};

const userToForm = (user) => ({
  ...emptyUserForm,
  name: user.name || "",
  email: user.email || "",
  role: user.role || "student",
  phone: user.phone || "",
  address: user.address || "",
  studentId: user.studentId || "",
  facultyId: user.facultyId || "",
  adminId: user.adminId || "",
  course: user.course || "",
  semester: user.semester?.toString() || "",
  department: user.department || "",
  designation: user.designation || "",
  subjects: user.subjects?.join(", ") || "",
  permissions: user.permissions?.join(", ") || emptyUserForm.permissions,
  status: user.status || "active",
});

const inputClass =
  "w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

const AdminUsers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [userForm, setUserForm] = useState(emptyUserForm);

  const { data: allUsers, setData: setAllUsers } = useApiResource(api.getUsers);
  const { user: currentUser } = useAuth();

  const openAddModal = () => {
    setUserForm(emptyUserForm);
    setShowAddModal(true);
  };

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const createdUser = await api.createUser(buildPayload(userForm));
      setAllUsers([...allUsers, createdUser]);
      setUserForm(emptyUserForm);
      setShowAddModal(false);
      toast.success("User created successfully");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setUserForm(userToForm(user));
    setShowEditModal(true);
  };

  const handleEditUser = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await api.updateUser(
        selectedUser.id,
        buildPayload(userForm, true)
      );
      setAllUsers(
        allUsers.map((item) => (item.id === updatedUser.id ? updatedUser : item))
      );
      setShowEditModal(false);
      setSelectedUser(null);
      setUserForm(emptyUserForm);
      toast.success("User updated successfully");
    } finally {
      setIsSaving(false);
    }
  };

  const initiateDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmModal(true);
  };

  const executeDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteUser(userToDelete.id);
      setAllUsers(allUsers.filter((user) => user.id !== userToDelete.id));
      toast.success("User deleted successfully");
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const totalUsers = allUsers.length;
  const studentCount = allUsers.filter((user) => user.role === "student").length;
  const facultyCount = allUsers.filter((user) => user.role === "faculty").length;
  const activeUsers = allUsers.filter((user) => user.status !== "inactive").length;

  const renderUserForm = (mode) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={userForm.name}
            onChange={handleInputChange}
            className={inputClass}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={userForm.email}
            onChange={handleInputChange}
            className={inputClass}
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <select
            name="role"
            value={userForm.role}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={userForm.phone}
            onChange={handleInputChange}
            className={inputClass}
            placeholder="Phone number"
          />
        </div>

        <div>
          <label className={labelClass}>
            Password {mode === "edit" && "(leave blank to keep)"}
          </label>
          <input
            type="password"
            name="password"
            value={userForm.password}
            onChange={handleInputChange}
            className={inputClass}
            placeholder={mode === "edit" ? "Keep current password" : "Default: password"}
          />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            value={userForm.status}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg bg-slate-50 p-4">
        <p className="mb-3 text-sm font-semibold text-slate-900">
          Role Details
        </p>
        {userForm.role === "student" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>Student ID</label>
              <input
            name="studentId"
                required={userForm.role === "student"}
                value={userForm.studentId}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Course</label>
              <input
                name="course"
                required={userForm.role === "student"}
                value={userForm.course}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                name="semester"
                required={userForm.role === "student"}
                value={userForm.semester}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {userForm.role === "faculty" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Faculty ID</label>
              <input
                name="facultyId"
                required={userForm.role === "faculty"}
                value={userForm.facultyId}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <input
                name="department"
                required={userForm.role === "faculty"}
                value={userForm.department}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Designation</label>
              <input
                name="designation"
                value={userForm.designation}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Subjects</label>
              <input
                name="subjects"
                value={userForm.subjects}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Comma separated"
              />
            </div>
          </div>
        )}

        {userForm.role === "admin" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Admin ID</label>
              <input
                name="adminId"
                required={userForm.role === "admin"}
                value={userForm.adminId}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <input
                name="department"
                required={userForm.role === "admin"}
                value={userForm.department}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Permissions</label>
              <input
                name="permissions"
                value={userForm.permissions}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Comma separated"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <textarea
          name="address"
          rows={3}
          value={userForm.address}
          onChange={handleInputChange}
          className={inputClass}
          placeholder="Address"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Management"
        description="Manage student, faculty, and administrative accounts with protected controls."
        actions={
          <AdminActionButton icon={Plus} onClick={openAddModal}>
            Add User
          </AdminActionButton>
        }
      />

      {/* ----------------------------------Stats --------------------------------------*/}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminMetricCard icon={UsersIcon} label="Total Users" value={totalUsers} tone="cyan" />
        <AdminMetricCard icon={UserCheck} label="Students" value={studentCount} tone="emerald" />
        <AdminMetricCard icon={UsersIcon} label="Faculty" value={facultyCount} tone="violet" />
        <AdminMetricCard icon={UserCheck} label="Active Users" value={activeUsers} tone="amber" />
      </div>

      {/*------------------------------------ Search and Filter------------------------------ */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6 rounded-lg bg-slate-50 p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/*-------------------------------------- Users Table--------------------------------- */}
        <Table
          headers={[
            "User",
            "Role",
            "Email",
            "Department/Course",
            "Status",
            "Actions",
          ]}
        >
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <UsersIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      ID:{" "}
                      {"studentId" in user
                        ? user.studentId
                        : "facultyId" in user
                        ? user.facultyId
                        : user.id}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs rounded-full capitalize ${
                    user.role === "student"
                      ? "bg-blue-100 text-blue-800"
                      : user.role === "faculty"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">{user.email}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">
                  {"course" in user
                    ? user.course
                    : "department" in user
                    ? user.department
                    : "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs rounded-full capitalize ${
                    user.status === "inactive"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.status || "active"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-1 text-cyan-700 hover:bg-cyan-50 rounded"
                    title="Edit user"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => initiateDeleteUser(user)}
                    disabled={user.id === currentUser?.id}
                    className="p-1 text-red-600 hover:bg-red-100 rounded disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                    title={user.id === currentUser?.id ? "You cannot delete yourself" : "Delete user"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/*----------------------------------- Add User Modal-------------------------------------- */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setUserForm(emptyUserForm);
        }}
        title="Add New User"
        className="sm:max-w-4xl"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          {renderUserForm("add")}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setUserForm(emptyUserForm);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-slate-950 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
          setUserForm(emptyUserForm);
        }}
        title="Edit User"
        className="sm:max-w-4xl"
      >
        <form onSubmit={handleEditUser} className="space-y-4">
          {renderUserForm("edit")}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
                setUserForm(emptyUserForm);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-slate-950 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setUserToDelete(null);
        }}
        onConfirm={executeDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name || "this user"}? This action cannot be undone and will remove their academic historical records.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminUsers;
