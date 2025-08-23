import { useEffect, useState } from "react";
import { API } from "../src/lib/api";

export default function PublicView() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('${API}/api/sessions/public').then(r => r.json()).then(setItems);
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h1>Public Wellness Sessions</h1>
      {items.length === 0 ? <p>No published sessions yet.</p> : (
        <ul>
          {items.map(s => (
            <li key={s._id}>
              <strong>{s.title}</strong> — {s.type} · {s.duration}m · {s.date}
              <p>{s.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}