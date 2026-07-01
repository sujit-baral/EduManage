import React, { useRef, useState } from "react";
import { Camera, Trash2, Upload, User } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ProfilePhotoManager = ({ user }) => {
  const inputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useAuth();

  const saveAvatar = async (avatar) => {
    setIsSaving(true);
    try {
      const updatedUser = await api.updateProfile({ avatar });
      updateUser(updatedUser);
      toast.success(avatar ? "Profile photo updated" : "Profile photo deleted");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be 5 MB or less");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => saveAvatar(reader.result);
    reader.onerror = () => toast.error("Unable to read image file");
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="relative mx-auto w-24 h-24">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isSaving}
          className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 disabled:bg-gray-400"
          title="Change profile photo"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isSaving}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 disabled:text-gray-400 disabled:bg-gray-100"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>{user?.avatar ? "Change" : "Upload"}</span>
        </button>
        {user?.avatar && (
          <button
            type="button"
            onClick={() => saveAvatar("")}
            disabled={isSaving}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 disabled:text-gray-400 disabled:bg-gray-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoManager;
