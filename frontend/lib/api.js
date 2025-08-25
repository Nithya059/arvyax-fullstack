import axios from 'axios';
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL });
export function bearer(token){ return { headers: { Authorization: `Bearer ${token}` } } }
export function getToken(){ if (typeof window === 'undefined') return null; return localStorage.getItem('token'); }
export function setToken(t){ if (typeof window === 'undefined') return; localStorage.setItem('token', t); }
export function clearToken(){ if (typeof window === 'undefined') return; localStorage.removeItem('token'); }
