// pages/login.js
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/login`,
        { email, password }
      );

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);

      setMessage("✅ Login successful!");
      window.location.href = "/dashboard"; // redirect to dashboard
    } catch (err) {
      setMessage("❌ Login failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          className="border p-2 mb-2 block"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 mb-2 block"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}