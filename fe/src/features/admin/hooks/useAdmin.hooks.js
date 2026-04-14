import { useCallback, useContext } from "react";
import { AdminContext } from "../admin.context";
import {
  fetchUsers,
  banUser,
  unbanUser,
  deleteUser,
} from "../services/admin.api";

export const useAdmin = () => {
  const {
    users,
    setUsers,
    loading,
    setLoading,
    error,
    setError,
  } = useContext(AdminContext);

  // GET USERS
  const getUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers(params);
      setUsers(data.users || []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [setUsers, setLoading, setError]);

  // BAN USER
  const banUserById = useCallback(async (id, reason) => {
    try {
      await banUser(id, reason);
    } catch (err) {
      setError(err.message || "Failed to ban user");
    }
  }, [setError]);

  // UNBAN USER
  const unbanUserById = useCallback(async (id) => {
    try {
      await unbanUser(id);
    } catch (err) {
      setError(err.message || "Failed to unban user");
    }
  }, [setError]);

  // DELETE USER
  const removeUser = useCallback(async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  }, [setUsers, setError]);

  return {
    users,
    loading,
    error,
    getUsers,
    banUserById,
    unbanUserById,
    removeUser,
  };
};