// lib/api.js

let token = null;

// Set auth token after login
export function setToken(newToken) {
  token = newToken;
}

// Backend base URL (from environment variable on Vercel)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Generic API helper
export const api = {
  async login(credentials) {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  async getData() {
    const res = await fetch(`${BASE_URL}/api/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Fetching data failed");
    return res.json();
  },
};
