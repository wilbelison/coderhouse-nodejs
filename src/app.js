import express from "express";
import { engine } from "express-handlebars";

const app = express();
const port = 8080;

import apiUsersArrayRouter from "./routes/api_users_array.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users/array", apiUsersArrayRouter);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("./src/public"));

app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

app.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat (Websockets)",
    styles: ["/assets/styles/chat.css"],
    scripts: ["https://cdn.socket.io/4.7.5/socket.io.min.js", "/assets/scripts/chat.js"],
  });
});

app.get("/users/array", (req, res) => {
  res.render("users_array", {
    title: "Users CRUD (Server Array)",
    styles: ["/assets/styles/users.css"],
    scripts: ["/assets/scripts/users.js"],
  });
});

const httpServer = app.listen(port, () => {
  console.log(`App listening on port ${port}: http://localhost:${port}`);
});

import { Server } from "socket.io";

const io = new Server(httpServer);

const history = [];

io.on("connection", (socket) => {
  const color = Math.floor(Math.random() * 360);
  console.log(`${socket.id}: connected! color: ${color}`);
  socket.on("message", (message) => {
    const date = new Date().toLocaleString();
    console.log(`Date: ${date} | Socket ID: ${socket.id} | Message: ${message}`)
    history.push({ color, id: socket.id, message, date });
    io.emit("history", history);
  });
  io.emit("history", history);
});
