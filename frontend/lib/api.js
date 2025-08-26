import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let authToken = null;

export function setToken(token) {
  authToken = token;
}

export async function login(data) {
  const res = await axios.post(`${API_BASE}/api/login`, data);
  return res.data;
}

export async function register(data) {
  const res = await axios.post(`${API_BASE}/api/register`, data);
  return res.data;
}

export async function getProtectedData() {
  if (!authToken) throw new Error("No token found. Please log in.");
  const res = await axios.get(`${API_BASE}/api/protected`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return res.data;
}
