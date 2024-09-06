import express from "express";
import { engine } from "express-handlebars";

const app = express();
const port = 8080;

// import usersRouter from "./routes/users.js";
// import petsRouter from "./routes/pets.js";

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api/users", usersRouter);
// app.use("/api/pets", petsRouter);

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
    scripts: ["/assets/scripts/chat.js"],
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
