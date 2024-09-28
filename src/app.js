import express from "express";
import { engine } from "express-handlebars";

const app = express();
const port = 8080;

import usersRouter from "./routes/users.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);

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
    title: "Chat",
    styles: ["/assets/styles/chat.css"],
    scripts: ["https://cdn.socket.io/4.7.5/socket.io.min.js", "/assets/scripts/chat.js"],
  });
});

app.get("/crud", (req, res) => {
  res.render("crud", {
    title: "CRUD",
    styles: ["/assets/styles/crud.css"],
    scripts: ["/assets/scripts/crud.js"],
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
