const backendURL = "https://verifica-tpsi.onrender.com";

// --- UTENTE LOGGATO ---
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "login.html";
let currentUserId = currentUser?.id;

// Aggiorna crediti utente
function updateCreditsUser() {
  fetch(`${backendURL}/users`)
    .then(res => res.json())
    .then(data => {
      const user = data.find(u => u.id === currentUserId);
      if(user) document.getElementById("userCredits").textContent = user.credits;
    });
}

// --- PRODOTTI ---
function loadProducts() {
  const list = document.getElementById("products");
  if (!list) return;

  fetch(`${backendURL}/products`)
    .then(res => res.json())
    .then(data => {
      list.innerHTML = "";
      data.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - Prezzo: ${p.price} - Stock: ${p.stock}`;

        if(document.title.includes("Utente")) {
          const btn = document.createElement("button");
          btn.textContent = "Compra";
          btn.addEventListener("click", () => buyProduct(p.id));
          li.appendChild(btn);
        }

        list.appendChild(li);
      });
    });
}

function buyProduct(productId) {
  fetch(`${backendURL}/buy`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ userId: currentUserId, productId })
  })
  .then(res => res.json())
  .then(data => {
    if(data.error) alert(data.error);
    loadProducts();
    updateCreditsUser();
  });
}

// --- ADMIN ---
function loadUsersAdmin() {
  const select = document.getElementById("userSelect");
  if(!select) return;

  fetch(`${backendURL}/users`)
    .then(res => res.json())
    .then(data => {
      select.innerHTML = "";
      data.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.name;
        select.appendChild(option);
      });
      updateCreditsAdmin();
    });
}

function updateCreditsAdmin() {
  const select = document.getElementById("userSelect");
  if(!select) return;

  const userId = parseInt(select.value);
  fetch(`${backendURL}/users`)
    .then(res => res.json())
    .then(data => {
      const user = data.find(u => u.id === userId);
      if(user && document.getElementById("userCredits"))
        document.getElementById("userCredits").textContent = user.credits;
    });
}

function addCredits() {
  const select = document.getElementById("userSelect");
  const credits = parseInt(document.getElementById("creditsToAdd").value);
  const userId = parseInt(select.value);
  if(isNaN(credits)) return alert("Inserisci un numero valido");

  fetch(`${backendURL}/addCredits`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ userId, credits })
  })
  .then(res => res.json())
  .then(data => {
    if(data.error) alert(data.error);
    else {
      alert("Crediti aggiunti!");
      updateCreditsAdmin();
    }
  });
}

function addProduct() {
  const name = document.getElementById("prodName")?.value;
  const price = parseInt(document.getElementById("prodPrice")?.value);
  const stock = parseInt(document.getElementById("prodStock")?.value);

  if(!name || isNaN(price) || isNaN(stock)) return alert("Compila tutti i campi correttamente!");

  fetch(`${backendURL}/addProduct`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name, price, stock })
  })
  .then(res => res.json())
  .then(data => {
    alert("Prodotto aggiunto!");
    loadProducts();
  });
}

// --- EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnLoadProducts")?.addEventListener("click", loadProducts);
  document.getElementById("btnAddProduct")?.addEventListener("click", addProduct);
  document.getElementById("btnAddCredits")?.addEventListener("click", addCredits);
  document.getElementById("userSelect") && loadUsersAdmin();
  updateCreditsUser();
  loadProducts();
});