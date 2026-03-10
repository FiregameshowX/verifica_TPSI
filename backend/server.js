const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "messages.json";

// Legge file o crea default
const fs = require("fs");

let messages = [];
if (fs.existsSync(DATA_FILE)) {
  messages = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")); // ← legge messages.json
} else {
  messages = [
    { text: "ciao mondo" },
    { text: "test API" }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}
// GET
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// POST
app.post("/api/messages", (req, res) => {
  const newMessage = req.body;
  messages.push(newMessage);
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));