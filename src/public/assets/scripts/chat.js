const socket = io();

socket.on("connect", () => {
  const chatHistory = document.querySelector("#chat .history");
  const chatMessage = document.querySelector("#chat .message");
  const chatSend = document.querySelector("#chat .send");

  socket.on("history", (data) => {
    chatHistory.innerHTML = data.map((item) => {
      const tr = document.createElement("tr");
      tr.style.color = `hsl(${item.color}, 80%, 40%)`;

      tr.innerHTML = `
        <td class="date">${item.date}</td>
        <td class="id">${item.id}:</td>
        <td class="message">${item.message}</td>
      `;

      return tr.outerHTML;
    }).join('');
  });

  chatSend.addEventListener("click", (e) => {
    e.preventDefault();
    const chatText = chatMessage.value.trim();
    if (chatText) {
      socket.emit("message", chatText);
      chatMessage.value = "";
    }
    chatMessage.focus();
  });
});