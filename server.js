const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "notes.json");

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readNotes() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeNotes(notes) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), "utf8");
}

// GET /notes — return all notes
app.get("/notes", (req, res) => {
  res.json(readNotes().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// POST /notes — create a note
app.post("/notes", (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";

  if (!title || !content) {
    return res.status(400).json({ error: "Please enter both a title and note content." });
  }
  if (title.length > 100 || content.length > 2000) {
    return res.status(400).json({ error: "Title must be 100 characters or less and note content 2000 characters or less." });
  }

  const notes = readNotes();
  const note = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString()
  };
  notes.push(note);
  writeNotes(notes);
  res.status(201).json(note);
});

// DELETE /notes/:id — delete one note
app.delete("/notes/:id", (req, res) => {
  const notes = readNotes();
  const updated = notes.filter(note => note.id !== req.params.id);
  if (updated.length === notes.length) {
    return res.status(404).json({ error: "Note not found." });
  }
  writeNotes(updated);
  res.json({ message: "Note deleted successfully." });
});

// Simple API error response for malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body." });
  }
  next(err);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  ensureStore();
  console.log(`Quick Note Application running on port ${PORT}`);
});