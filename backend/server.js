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

app.listen(3000, () => {
  console.log("Server running")
})