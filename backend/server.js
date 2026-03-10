const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let messages = [
  { text: "ciao mondo" },
  { text: "test API" }
]

app.get("/api/messages", (req, res) => {
  res.json(messages)
})

app.post("/api/messages", (req, res) => {
  const newMessage = req.body
  messages.push(newMessage)
  res.json({ success: true })
})

const PORT = process.env.PORT || 3000; // usa la porta di Render o 3000 in locale
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});