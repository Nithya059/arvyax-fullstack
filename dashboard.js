"use client";
import { useEffect, useState } from "react";
import { API, authHeaders } from "../src/lib/api";

export default function Dashboard() {
  const [mine, setMine] = useState([]);
  useEffect(() => {
    fetch('${API}/api/sessions/mine', { headers: authHeaders() })
      .then(r => r.json()).then(setMine);
  }, []);
  const drafts = mine.filter(s => s.status === "draft").length;
  const published = mine.filter(s => s.status === "published").length;

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to Dashboard</h1>
      <p>You are logged in ✅</p>
      <div style={{ display: "flex", gap: 16 }}>
        <div>Drafts: <b>{drafts}</b></div>
        <div>Published: <b>{published}</b></div>
        <div>Total: <b>{mine.length}</b></div>
      </div>
    </div>
  );
}