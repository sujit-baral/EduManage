import User from "../models/User.js";

/**
 * Shared user service — extracts duplicated business logic from controllers.
 * Issue #9: The "check if last admin" logic was duplicated in updateUser and deleteUser.
 */

/**
 * Check if demoting/deleting this user would remove the last admin.
 * @param {string} userId - The user's ID
 * @param {string} [newRole] - The proposed new role (for updates). Omit for delete checks.
 * @throws {Error} if the operation would remove the last admin
 */
export const ensureNotLastAdmin = async (userId, newRole) => {
  const targetUser = await User.findById(userId);
  if (!targetUser) return;

  const isRemovingAdmin =
    targetUser.role === "admin" && (newRole ? newRole !== "admin" : true);

  if (isRemovingAdmin) {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      const error = new Error("At least one admin account is required");
      error.statusCode = 400;
      throw error;
    }
  }
};
