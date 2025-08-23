import React, { useState, useEffect, useRef } from "react";

/**
 * Minimal full frontend UI for the Arvyax assignment.
 * - Uses import.meta.env.VITE_API_URL for API base URL.
 * - Stores JWT token in localStorage.
 * - Shows Login / Register / Dashboard / My Sessions / Editor.
 * - Autosaves draft after 5s inactivity while editing.
 *
 * NOTE: Adjust endpoint paths if your backend uses different URLs.
 */

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [page, setPage] = useState("dashboard"); // login | register | dashboard | mysessions | editor
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sessions, setSessions] = useState([]); // public sessions
  const [mySessions, setMySessions] = useState([]); // user's drafts & published
  const [editing, setEditing] = useState(null); // session object being edited
  const [statusMsg, setStatusMsg] = useState("");
  const autosaveTimer = useRef(null);

  // load public sessions whenever we show dashboard
  useEffect(() => {
    if (page === "dashboard") fetchPublicSessions();
    if (page === "mysessions" && token) fetchMySessions();
  }, [page, token]);

  function safeFetch(url, opts = {}) {
    // helper to add Authorization header when token present
    const headers = opts.headers || {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    return fetch(url, { ...opts, headers });
  }

  async function fetchPublicSessions() {
    try {
      const res = await fetch(`${API}/sessions/public`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load");
      setSessions(data);
    } catch (err) {
      console.error("fetchPublicSessions:", err);
      setStatusMsg("Could not load public sessions.");
    }
  }

  async function fetchMySessions() {
    try {
      const res = await safeFetch(`${API}/my-sessions`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load my sessions");
      setMySessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchMySessions:", err);
      setStatusMsg("Could not load your sessions. Make sure you're logged in.");
    }
  }

  // -------- Authentication --------
  async function handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Register failed");
      alert("Registered — now login.");
      setPage("login");
    } catch (err) {
      console.error("register:", err);
      alert("Register failed: " + err.message);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data?.message || "Login failed");
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setPage("dashboard");
      setStatusMsg("Logged in.");
    } catch (err) {
      console.error("login:", err);
      alert("Login error: " + err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setPage("dashboard");
    setStatusMsg("Logged out.");
  }

  // -------- Editor (create/update) --------
  function startNewSession() {
    const newSession = {
      title: "",
      tags: [],
      jsonFileUrl: "",
      status: "draft",
      content: "", // free text JSON or editor content
    };
    setEditing(newSession);
    setPage("editor");
    setStatusMsg("");
  }

  function startEdit(session) {
    // session should come from mySessions with full content
    setEditing({ ...session });
    setPage("editor");
    setStatusMsg("");
  }

  // local change -> schedule autosave
  function onEditChange(field, value) {
    setEditing((s) => ({ ...s, [field]: value }));
    setStatusMsg("Editing...");
    // autosave after 5s inactivity
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveDraft();
    }, 5000);
  }

  async function saveDraft() {
    if (!token) {
      setStatusMsg("Log in to save drafts.");
      return;
    }
    if (!editing) return;
    setStatusMsg("Saving draft...");
    try {
      // If editing has _id -> update, else create
      if (editing._id) {
        const res = await safeFetch(`${API}/my-sessions/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify({ ...editing, status: "draft" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Save failed");
        setStatusMsg("Draft saved");
      } else {
        const res = await safeFetch(`${API}/my-sessions`, {
          method: "POST",
          body: JSON.stringify({ ...editing, status: "draft" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Create draft failed");
        // backend should return created object including _id
        setEditing(data);
        setStatusMsg("Draft created & saved");
      }
      // refresh my sessions list
      fetchMySessions();
    } catch (err) {
      console.error("saveDraft:", err);
      setStatusMsg("Could not save draft.");
    }
  }

  async function publishSession() {
    if (!token) {
      alert("Log in to publish");
      return;
    }
    if (!editing || !editing._id) {
      // try to save first then publish
      await saveDraft();
    }
    try {
      const id = editing._id;
      const res = await safeFetch(`${API}/my-sessions/${id}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Publish failed");
      setStatusMsg("Published!");
      // go back to my sessions / dashboard
      setPage("mysessions");
      fetchPublicSessions();
      fetchMySessions();
    } catch (err) {
      console.error("publish:", err);
      setStatusMsg("Publish failed.");
    }
  }

  // manual save button
  async function handleManualSave(e) {
    e.preventDefault();
    // cancel autosave timer if any
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = null;
    }
    await saveDraft();
  }

  // UI small components
  function Header() {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <strong>Arvyax — Wellness Sessions</strong>
        </div>
        <div>
          <button onClick={() => setPage("dashboard")} style={{ marginRight: 6 }}>Published</button>
          <button onClick={() => { setPage("mysessions"); if (token) fetchMySessions(); }} style={{ marginRight: 6 }}>My Sessions</button>
          <button onClick={startNewSession} style={{ marginRight: 6 }}>Create</button>
          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={() => setPage("login")}>Login</button>
          )}
        </div>
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div style={{ padding: 16, fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <Header />
      <div style={{ marginBottom: 8, color: "#333" }}>{statusMsg}</div>

      {page === "login" && (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input name="email" type="email" placeholder="Email" required style={{ display: "block", width: "100%", marginBottom: 8 }} />
            <input name="password" type="password" placeholder="Password" required style={{ display: "block", width: "100%", marginBottom: 8 }} />
            <button type="submit" style={{ marginRight: 8 }}>Login</button>
            <button type="button" onClick={() => setPage("register")}>Go to Register</button>
          </form>
        </div>
      )}

      {page === "register" && (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input name="email" type="email" placeholder="Email" required style={{ display: "block", width: "100%", marginBottom: 8 }} />
            <input name="password" type="password" placeholder="Password" required style={{ display: "block", width: "100%", marginBottom: 8 }} />
            <button type="submit">Register</button>
          </form>
        </div>
      )}

      {page === "dashboard" && (
        <div>
          <h2>Published Sessions</h2>
          {sessions.length === 0 ? <div>No published sessions found.</div> :
            sessions.map(s => (
              <div key={s._id || s.id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
                <strong>{s.title || "Untitled"}</strong><div style={{ fontSize: 12 }}>{s.tags?.join?.(", ")}</div>
                <div style={{ marginTop: 6 }}>{s.summary || s.jsonFileUrl || ""}</div>
              </div>
            ))
          }
        </div>
      )}

      {page === "mysessions" && (
        <div>
          <h2>My Sessions (drafts & published)</h2>
          {!token && <div>Please log in to see your sessions.</div>}
          {token && mySessions.length === 0 && <div>You have no sessions yet.</div>}
          {token && mySessions.map(s => (
            <div key={s._id || s.id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
              <strong>{s.title || "Untitled"}</strong> <span style={{ fontSize: 12 }}>({s.status})</span>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => startEdit(s)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={async () => {
                  // quick publish button (if already has id)
                  setEditing(s);
                  await publishSession();
                }}>Publish</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {page === "editor" && editing && (
        <div>
          <h2>Editor</h2>
          <form onSubmit={handleManualSave}>
            <label style={{ display: "block", marginBottom: 6 }}>Title</label>
            <input value={editing.title} onChange={(e) => onEditChange("title", e.target.value)} style={{ display: "block", width: "100%", marginBottom: 8 }} />

            <label style={{ display: "block", marginBottom: 6 }}>Tags (comma separated)</label>
            <input value={(editing.tags || []).join?.(", ") || ""} onChange={(e) => {
              const arr = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
              onEditChange("tags", arr);
            }} style={{ display: "block", width: "100%", marginBottom: 8 }} />

            <label style={{ display: "block", marginBottom: 6 }}>JSON file URL</label>
            <input value={editing.jsonFileUrl || ""} onChange={(e) => onEditChange("jsonFileUrl", e.target.value)} style={{ display: "block", width: "100%", marginBottom: 8 }} />

            <label style={{ display: "block", marginBottom: 6 }}>Content / JSON</label>
            <textarea value={editing.content || ""} onChange={(e) => onEditChange("content", e.target.value)} rows={8} style={{ display: "block", width: "100%", marginBottom: 8 }} />

            <div>
              <button type="submit" style={{ marginRight: 8 }}>Save Draft (manual)</button>
              <button type="button" onClick={publishSession} style={{ marginRight: 8 }}>Publish</button>
              <button type="button" onClick={() => { setPage("mysessions"); fetchMySessions(); }}>Back</button>
            </div>
            <div style={{ marginTop: 8, fontSize: 12 }}>Autosave after 5s of inactivity (when logged in).</div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
