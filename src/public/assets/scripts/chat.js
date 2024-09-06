const socket = io();

socket.on("connect", () => {
  const chatHistory = document.querySelector("#chat .history");
  const chatMessage = document.querySelector("#chat .message");
  const chatSend = document.querySelector("#chat .send");

  socket.on("history", (data) => {
    chatHistory.innerHTML = "";

    data.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("style", `color: hsl(${item.color}, 80%, 40%);`);

      const date = document.createElement("td");
      const id = document.createElement("td");
      const message = document.createElement("td");

      date.classList.add("date");
      id.classList.add("id");
      message.classList.add("message");

      date.innerText = `${item.date}`;
      id.innerText = `${item.id}:`;
      message.innerText = `${item.message}`;

      tr.append(date, id, message);

      chatHistory.append(tr);
    });
  });

  chatSend.addEventListener("click", (e) => {
    e.preventDefault();
    const chatText = chatMessage.value;
    if (chatText.length > 0) {
      socket.emit("message", chatMessage.value);
      chatMessage.value = "";
    }
    chatMessage.focus();
  });
});
