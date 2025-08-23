// backend/controllers/sessionController.mjs
import Session from "../models/session.mjs";

export async function createSession(req, res) {
  try {
    const { title, content } = req.body;
    const s = await Session.create({ title: title || "Untitled Session", content: content || "", owner: req.userId });
    res.json(s);
  } catch (err) {
    console.error("createSession", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function listMySessions(req, res) {
  try {
    const sessions = await Session.find({ owner: req.userId }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("listMySessions", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getSession(req, res) {
  try {
    const { id } = req.params;
    const s = await Session.findById(id);
    if (!s) return res.status(404).json({ message: "Not found" });
    // if not published and not owner → forbidden
    if (!s.published && s.owner.toString() !== req.userId) return res.status(403).json({ message: "Forbidden" });
    res.json(s);
  } catch (err) {
    console.error("getSession", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateSession(req, res) {
  try {
    const { id } = req.params;
    const s = await Session.findById(id);
    if (!s) return res.status(404).json({ message: "Not found" });
    if (s.owner.toString() !== req.userId) return res.status(403).json({ message: "Forbidden" });

    const { title, content } = req.body;
    if (title !== undefined) s.title = title;
    if (content !== undefined) s.content = content;
    await s.save();
    res.json(s);
  } catch (err) {
    console.error("updateSession", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteSession(req, res) {
  try {
    const { id } = req.params;
    const s = await Session.findById(id);
    if (!s) return res.status(404).json({ message: "Not found" });
    if (s.owner.toString() !== req.userId) return res.status(403).json({ message: "Forbidden" });
    await s.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error("deleteSession", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function publishSession(req, res) {
  try {
    const { id } = req.params;
    const s = await Session.findById(id);
    if (!s) return res.status(404).json({ message: "Not found" });
    if (s.owner.toString() !== req.userId) return res.status(403).json({ message: "Forbidden" });
    s.published = true;
    await s.save();
    res.json(s);
  } catch (err) {
    console.error("publishSession", err);
    res.status(500).json({ message: "Server error" });
  }
}