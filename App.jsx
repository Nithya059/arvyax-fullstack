import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState("login"); // login | register | dashboard | editor
  const [token, setToken] = useState(null);
  const [sessions, setSessions] = useState([]);

  // 🔹 Fetch published sessions (Dashboard)
  useEffect(() => {
    if (page === "dashboard") {
      fetch(`${import.meta.env.VITE_API_URL}/sessions/public`)
        .then(res => res.json())
        .then(data => setSessions(data))
        .catch(err => console.error(err));
    }
  }, [page]);

  // 🔹 Register user
  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      alert("Registered! Now login.");
      setPage("login");
    }
  };

  // 🔹 Login user
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      setPage("dashboard");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Arvyax Wellness Sessions</h1>

      {/* 🔹 Login Page */}
      {page === "login" && (
        <form onSubmit={handleLogin}>
          <h2 className="text-lg mb-2">Login</h2>
          <input name="email" type="email" placeholder="Email" className="border p-2 block mb-2" />
          <input name="password" type="password" placeholder="Password" className="border p-2 block mb-2" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
          <p className="mt-2">No account? <button onClick={() => setPage("register")} className="underline">Register</button></p>
        </form>
      )}

      {/* 🔹 Register Page */}
      {page === "register" && (
        <form onSubmit={handleRegister}>
          <h2 className="text-lg mb-2">Register</h2>
          <input name="email" type="email" placeholder="Email" className="border p-2 block mb-2" />
          <input name="password" type="password" placeholder="Password" className="border p-2 block mb-2" />
          <button type="submit" className="bg-green-500 text-white px-4 py-2">Register</button>
          <p className="mt-2">Already have an account? <button onClick={() => setPage("login")} className="underline">Login</button></p>
        </form>
      )}

      {/* 🔹 Dashboard Page */}
      {page === "dashboard" && (
        <div>
          <h2 className="text-lg mb-2">Published Sessions</h2>
          <ul>
            {sessions.map((s) => (
              <li key={s._id} className="border p-2 mb-2">
                <strong>{s.title}</strong> - {s.status}
              </li>
            ))}
          </ul>
          <button onClick={() => setPage("editor")} className="bg-purple-500 text-white px-4 py-2 mt-4">Create Session</button>
        </div>
      )}

      {/* 🔹 Session Editor Page */}
      {page === "editor" && (
        <div>
          <h2 className="text-lg mb-2">Create/Edit Session</h2>
          <form>
            <input name="title" placeholder="Title" className="border p-2 block mb-2" />
            <input name="tags" placeholder="Tags (comma separated)" className="border p-2 block mb-2" />
            <input name="jsonFileUrl" placeholder="JSON File URL" className="border p-2 block mb-2" />
            <button type="button" className="bg-yellow-500 text-white px-4 py-2 mr-2">Save Draft</button>
            <button type="button" className="bg-green-600 text-white px-4 py-2">Publish</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
