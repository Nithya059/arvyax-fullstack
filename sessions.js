import { useEffect, useState } from "react";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    type: "yoga",
  });

  // Fetch sessions on load
  useEffect(() => {
    fetch("http://localhost:5000/api/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error("Error fetching sessions:", err));
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newSession = await res.json();
    setSessions([...sessions, newSession]);
    setForm({ title: "", description: "", date: "", type: "yoga" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Wellness Sessions</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <br />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <br />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <br />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="yoga">Yoga</option>
          <option value="meditation">Meditation</option>
        </select>
        <br />
        <button type="submit">Save Session</button>
      </form>

      <h2>Saved Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions yet</p>
      ) : (
        <ul>
          {sessions.map((s) => (
            <li key={s.id}>
              <b>{s.title}</b> ({s.type}) – {s.date}
              <p>{s.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}