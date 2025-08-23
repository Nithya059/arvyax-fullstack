export const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export function authHeaders() {
  const t = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return { "Content-Type": "application/json", Authorization: t || "" };
}