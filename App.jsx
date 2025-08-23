import { useState, useEffect } from "react";

function App() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ This gets your backend URL from .env.local
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/sessions`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch sessions");
        }
        return res.json();
      })
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Arvyax Wellness Platform</h1>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul>
          {sessions.map((s) => (
            <li key={s._id}>{s.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
