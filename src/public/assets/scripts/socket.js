const socket = io();

socket.on("connect", () => {
  console.log(socket.id);
});

const textAreaHistory = document.getElementById("history");
const inputMessage = document.getElementById("message");
const buttonSend = document.getElementById("send");

buttonSend.addEventListener("click", () => {
  socket.emit("message", inputMessage.value);
});

socket.on("new", (data) => {
  textAreaHistory.value += `${data.id}: ${data.message}\n`;
});
