const backendURL = "https://verifica-tpsi.onrender.com/api/messages"; // URL reale Render

// Carica messaggi dal backend
function loadMessages() {
  fetch(backendURL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("messages");
      list.innerHTML = "";
      data.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg.text;
        list.appendChild(li);
      });
    })
    .catch(err => console.error("Errore:", err));
}

// Aggiunge un nuovo messaggio
function addMessage() {
  const input = document.getElementById("newMessage");
  const text = input.value.trim();
  if (!text) return alert("Inserisci un messaggio");

  fetch(backendURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Messaggio aggiunto:", data);
      input.value = "";
      loadMessages(); // ricarica la lista
    })
    .catch(err => console.error("Errore:", err));
}