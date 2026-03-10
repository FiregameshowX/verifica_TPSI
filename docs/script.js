const backendURL = "https://verifica-tpsi.onrender.com/api";

// --- UTENTI ---
let currentUserId = null;

// Carica utenti in select
function loadUsers() {
  fetch(`${backendURL}/users`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("userSelect");
      select.innerHTML = "";
      data.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.name;
        select.appendChild(option);
      });
      currentUserId = data[0]?.id || null;
      updateCredits();
    });
}

// Aggiorna crediti utente
function updateCredits() {
  const select = document.getElementById("userSelect");
  currentUserId = parseInt(select.value);
  fetch(`${backendURL}/users`)
    .then(res => res.json())
    .then(data => {
      const user = data.find(u => u.id === currentUserId);
      document.getElementById("userCredits").textContent = user.credits;
    });
}

document.getElementById("userSelect")?.addEventListener("change", updateCredits);

// --- PRODOTTI ---
function loadProducts() {
  fetch(`${backendURL}/products`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("products");
      list.innerHTML = "";
      data.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - Prezzo: ${p.price} - Stock: ${p.stock}`;
        if (document.body.title.includes("Utente")) {
          const btn = document.createElement("button");
          btn.textContent = "Compra";
          btn.onclick = () => buyProduct(p.id);
          li.appendChild(btn);
        }
        list.appendChild(li);
      });
    });
}

// --- ACQUISTO ---
function buyProduct(productId) {
  fetch(`${backendURL}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: currentUserId, productId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) alert(data.error);
      loadProducts();
      updateCredits();
    });
}

// --- ADMIN ---
function addProduct() {
  const name = document.getElementById("prodName").value;
  const price = parseInt(document.getElementById("prodPrice").value);
  const stock = parseInt(document.getElementById("prodStock").value);

  fetch(`${backendURL}/addProduct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, stock })
  })
    .then(res => res.json())
    .then(data => {
      alert("Prodotto aggiunto!");
      loadProducts();
    });
}

function addCredits() {
  const userId = parseInt(document.getElementById("userSelect").value);
  const credits = parseInt(document.getElementById("creditsToAdd").value);

  fetch(`${backendURL}/addCredits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, credits })
  })
    .then(res => res.json())
    .then(data => {
      alert("Crediti aggiunti!");
      updateCredits();
    });
}

// --- INIT ---
loadUsers();
loadProducts();