// index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Temporary in-memory session store
let sessions = [];

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running ✅" });
});

// Get all sessions
app.get("/api/sessions", (req, res) => {
  res.json(sessions);
});

// Add a new session
app.post("/api/sessions", (req, res) => {
  const { title, description, date, type } = req.body;

  if (!title || !description || !date || !type) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const newSession = {
    id: sessions.length + 1,
    title,
    description,
    date,
    type,
  };

  sessions.push(newSession);

  res.json(newSession);
});

// Start server
app.listen(PORT, () => {
  console.log('✅ Backend running at http://localhost:${PORT}');
});