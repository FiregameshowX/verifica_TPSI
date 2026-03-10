// backend/server.js
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());           // consente richieste da GitHub Pages
app.use(express.json());    // consente JSON nel body

const DATA_FILE = "messages.json";

// Carica i messaggi da messages.json
let messages = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    messages = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (err) {
    console.error("Errore nel leggere messages.json:", err);
    messages = [];
  }
} else {
  // Se il file non esiste, inizializza array vuoto (Render non permette scrittura durante il deploy)
  messages = [];
}

// GET /api/messages → restituisce tutti i messaggi
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// POST /api/messages → aggiunge un nuovo messaggio (in memoria)
app.post("/api/messages", (req, res) => {
  const newMessage = req.body;
  if (!newMessage || !newMessage.text) {
    return res.status(400).json({ error: "Messaggio mancante" });
  }

  messages.push(newMessage);

  // ⚠️ Non scriviamo su file durante il deploy
  res.json({ success: true, message: newMessage });
});

// Porta compatibile con Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));