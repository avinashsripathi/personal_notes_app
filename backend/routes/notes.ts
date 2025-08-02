import express from "express";
import Note from "../models/Note";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

// ✅ GET all notes for the logged-in user (pinned first, newest first)
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const notes = await Note.find({ userId: req.user }).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// ✅ CHECK FOR DUPLICATE TITLE — moved above :id route
router.get("/check-title", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const existingNote = await Note.findOne({
      userId: req.user,
      title: title.toString().trim(),
    });

    if (existingNote) {
      return res.json({ exists: true, noteId: existingNote._id });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Check title error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET a single note by ID
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.user });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
});

// ✅ POST create note
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  const { title, content, tags } = req.body;
  const newNote = new Note({ title, content, tags, userId: req.user });
  const savedNote = await newNote.save();
  res.status(201).json(savedNote);
});

// ✅ PUT update note
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
  const updatedNote = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user },
    { ...req.body, updatedAt: new Date() },
    { new: true }
  );
  if (!updatedNote) return res.status(404).json({ message: "Note not found" });
  res.json(updatedNote);
});

// ✅ DELETE note
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  const deleted = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user });
  if (!deleted) return res.status(404).json({ message: "Note not found" });
  res.json({ message: "Note deleted" });
});

// ✅ PATCH toggle pin
router.patch("/:id/pin", authenticateToken, async (req: AuthRequest, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.user });
  if (!note) return res.status(404).json({ message: "Note not found" });
  note.isPinned = !note.isPinned;
  await note.save();
  res.json(note);
});

export default router;
