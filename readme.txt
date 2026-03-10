# Verifica TPSI - E-Commerce Client-Server

## 1. Architettura
Il client sviluppato è un **Thin Client**:
- Tutta la logica di business (controllo crediti, acquisti, aggiornamento stock) è gestita dal **backend Node.js**.
- Il frontend in **HTML/CSS/Vanilla JS** si limita a mostrare dati, interfaccia utente e inviare/ricevere richieste tramite **fetch()**.
- Non ci sono framework frontend complessi; la maggior parte delle elaborazioni avviene lato server.

---

## 2. Endpoint API

| Metodo | Rotta                   | Funzione                                   |
|--------|------------------------|--------------------------------------------|
| GET    | `/users`               | Restituisce la lista degli utenti         |
| GET    | `/products`            | Restituisce il catalogo prodotti          |
| POST   | `/login`               | Login utente/admin, restituisce dati utente senza password |
| POST   | `/buy`                 | Effettua l’acquisto di un prodotto (verifica crediti e stock) |
| POST   | `/addProduct`          | Aggiunge un nuovo prodotto (solo admin)    |
| POST   | `/addCredits`          | Aggiunge crediti a un utente (solo admin) |

---

## 3. Sicurezza lato server
- Controllo crediti prima di completare un acquisto: l’utente non può comprare se i crediti sono insufficienti.
- Controllo stock: un prodotto esaurito non può essere acquistato.
- Login basato su username/password salvati in `users.json`.
- Le rotte admin (`addProduct`, `addCredits`) devono essere chiamate solo da utenti autenticati come admin (simulazione tramite flag `isAdmin`).
- Tutte le modifiche (crediti, stock, prodotti) vengono salvate su file `.json` persistenti nel backend.

---

## 4. Uso dell’IA
L’IA (ChatGPT) è stata utilizzata per:
- Scrivere e correggere il codice del backend e frontend.
- Risolvere problemi di CORS e fetch tra GitHub Pages e Render.
- Suggerire strutture di file, gestione dei dati e validazioni lato server.
- Creare un README schematico e spiegare la pipeline del progetto.

---

## 5. Link
- **Backend (Node.js su Render):** [https://verifica-tpsi.onrender.com](https://verifica-tpsi.onrender.com)  
- **Frontend (GitHub Pages):** [https://firegameshowx.github.io/verifica_TPSI/](https://firegameshowx.github.io/verifica_TPSI/)

---

> Nota: I dati persistono su file JSON (`users.json`, `products.json`). L’aggiornamento in tempo reale avviene tramite fetch tra frontend e backend.
