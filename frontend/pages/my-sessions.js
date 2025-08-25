import { useState, useEffect } from "react";

export default function MySessions() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sessions`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📌 My Sessions</h1>
      {items.length === 0 ? (
        <p>No sessions saved yet.</p>
      ) : (
        <ul>
          {items.map((session, index) => (
            <li key={index}>
              <strong>{session.title}</strong> – {session.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
