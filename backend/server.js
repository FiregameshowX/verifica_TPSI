const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Percorsi file JSON
const USERS_FILE = path.join(__dirname, "users.json");
const PRODUCTS_FILE = path.join(__dirname, "products.json");

// --- Lettura dati iniziale ---
let users = fs.existsSync(USERS_FILE)
  ? JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"))
  : [
      { id: 1, name: "Mario", credits: 100, isAdmin: false, username: "mario", password: "1234" },
      { id: 2, name: "Luigi", credits: 50, isAdmin: false, username: "luigi", password: "1234" },
      { id: 3, name: "Admin", credits: 0, isAdmin: true, username: "admin", password: "admin" }
    ];

let products = fs.existsSync(PRODUCTS_FILE)
  ? JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"))
  : [
      { id: 1, name: "Prodotto A", price: 30, stock: 5 },
      { id: 2, name: "Prodotto B", price: 20, stock: 10 }
    ];

// --- API / ROTTE ---

// GET catalogo prodotti
app.get("/products", (req, res) => {
  res.json(products);
});

// GET lista utenti (solo admin)
app.get("/users", (req, res) => {
  res.json(users);
});

// POST login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if(!username || !password){
    return res.status(400).json({ error: "Username e password richiesti" });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if(!user){
    return res.status(401).json({ error: "Credenziali errate" });
  }

  res.json({
    id: user.id,
    name: user.name,
    credits: user.credits,
    isAdmin: user.isAdmin
  });
});

// POST acquisto prodotto (utente)
app.post("/buy", (req, res) => {
  const { userId, productId } = req.body;

  const user = users.find(u => u.id === parseInt(userId));
  const product = products.find(p => p.id === parseInt(productId));

  if (!user || !product) return res.status(404).json({ error: "Utente o prodotto non trovato" });
  if (product.stock <= 0) return res.status(400).json({ error: "Prodotto esaurito" });
  if (user.credits < product.price) return res.status(400).json({ error: "Crediti insufficienti" });

  user.credits -= product.price;
  product.stock -= 1;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

  res.json({ success: true, user, product });
});

// POST aggiungi prodotto (admin)
app.post("/addProduct", (req, res) => {
  const { name, price, stock } = req.body;
  const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

  const newProduct = { id: newId, name, price: parseInt(price), stock: parseInt(stock) };
  products.push(newProduct);

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  res.json({ success: true, product: newProduct });
});

// POST aggiungi crediti (admin)
app.post("/addCredits", (req, res) => {
  const { userId, credits } = req.body;
  const uid = parseInt(userId);
  const cr = parseInt(credits);

  const user = users.find(u => u.id === uid);
  if (!user) return res.status(404).json({ error: "Utente non trovato" });

  user.credits += cr;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, user });
});

// --- Avvio server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));