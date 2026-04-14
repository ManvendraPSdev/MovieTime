import axios from "axios";
import { API_ORIGIN } from "../../../config/api.js";

const api = axios.create({
  baseURL: `${API_ORIGIN}/api/admin`,
  withCredentials: true,
});

// GET USERS
export const fetchUsers = async (params = {}) => {
  try {
    const res = await api.get("/users", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// BAN USER
export const banUser = async (id, reason) => {
  try {
    const res = await api.patch(`/users/${id}/ban`, { reason });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// UNBAN USER
export const unbanUser = async (id) => {
  try {
    const res = await api.patch(`/users/${id}/unban`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// DELETE USER
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};