// frontend/script.js
function loadMessages() {
  fetch("https://verifica-tpsi.onrender.com/api/messages")
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

// Esempio POST
function addMessage(text) {
  fetch("https://verifica-tpsi.onrender.com/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error("Errore:", err));
}