function loadMessages() {

fetch("http://localhost:3000/api/messages")
.then(res => res.json())
.then(data => {

const list = document.getElementById("messages")

list.innerHTML = ""

data.forEach(msg => {
const li = document.createElement("li")
li.textContent = msg.text
list.appendChild(li)
})

})

}