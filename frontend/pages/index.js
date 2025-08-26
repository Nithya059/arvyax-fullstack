import { useEffect, useState } from "react";
import { getProtectedData } from "../lib/api";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getProtectedData();
        setData(res);
      } catch (err) {
        setError("Please login first ❌");
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome</h1>
      {error && <p>{error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
