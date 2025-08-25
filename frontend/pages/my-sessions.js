import { useState } from "react";

export default function MySessions() {
  const [items, setItems] = useState([]);

  return (
    <div>
      <h1>My Sessions Page</h1>
      <p>Total sessions: {items.length}</p>
    </div>
  );
}
