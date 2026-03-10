// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const path = require("path");

// Esempio per users.json
const USERS_FILE = path.join(__dirname, "users.json");

// Esempio per products.json
const PRODUCTS_FILE = path.join(__dirname, "products.json");


// --- Lettura dati ---
let users = fs.existsSync(USERS_FILE) 
  ? JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"))
  : [
      { id: 1, name: "Mario", credits: 100 },
      { id: 2, name: "Luigi", credits: 50 }
    ];

let products = fs.existsSync(PRODUCTS_FILE)
  ? JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"))
  : [
      { id: 1, name: "Prodotto A", price: 30, stock: 5 },
      { id: 2, name: "Prodotto B", price: 20, stock: 10 }
    ];

// --- API ---
// GET catalogo prodotti
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET lista utenti (solo admin)
app.get("/api/users", (req, res) => {
  res.json(users);
});

// POST acquisto prodotto
app.post("/api/buy", (req, res) => {
  const { userId, productId } = req.body;

  const user = users.find(u => u.id === userId);
  const product = products.find(p => p.id === productId);

  if (!user || !product) return res.status(404).json({ error: "Utente o prodotto non trovato" });
  if (product.stock <= 0) return res.status(400).json({ error: "Prodotto esaurito" });
  if (user.credits < product.price) return res.status(400).json({ error: "Crediti insufficienti" });

  // Aggiorna dati
  user.credits -= product.price;
  product.stock -= 1;

  // Salva su file JSON
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

  res.json({ success: true, user, product });
});

// POST aggiungi prodotto (admin)
app.post("/api/addProduct", (req, res) => {
  const { name, price, stock } = req.body;
  const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id: newId, name, price, stock };
  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  res.json({ success: true, product: newProduct });
});

// POST aggiungi crediti (admin)
app.post("/api/addCredits", (req, res) => {
  const { userId, credits } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "Utente non trovato" });
  user.credits += credits;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, user });
});



// ROUTE LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Controllo che arrivino correttamente
  if(!username || !password){
    return res.status(400).json({ error: "Username e password richiesti" });
  }

  // Cerca utente
  const user = users.find(u => u.username === username && u.password === password);
    console.log("POST login:", username, password);
  if(!user){
    return res.status(401).json({ error: "Credenziali errate" });
  }

  // Restituisce dati senza password
  res.json({
    id: user.id,
    name: user.name,
    credits: user.credits,
    isAdmin: user.isAdmin
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
