import express from "express";
import Session from "../models/Session.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/** PUBLIC: list published sessions */
router.get("/public", async (_req, res) => {
  const items = await Session.find({ status: "published" }).sort({ createdAt: -1 });
  res.json(items);
});

/** PROTECTED: list my sessions */
router.get("/mine", auth, async (req, res) => {
  const items = await Session.find({ userId: req.userId }).sort({ updatedAt: -1 });
  res.json(items);
});

/** PROTECTED: create draft */
router.post("/", auth, async (req, res) => {
  const { title, description, type, date, duration } = req.body;
  const created = await Session.create({
    userId: req.userId, title, description, type, date, duration, status: "draft",
  });
  res.status(201).json(created);
});

/** PROTECTED: update (used by auto-save) */
router.put("/:id", auth, async (req, res) => {
  const updated = await Session.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

/** PROTECTED: publish */
router.post("/:id/publish", auth, async (req, res) => {
  const updated = await Session.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status: "published" },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

/** PROTECTED: delete */
router.delete("/:id", auth, async (req, res) => {
  await Session.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
});

export default router;