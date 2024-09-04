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
  res.render("home", { title: "Aula 9", name: "galerinha" });
});

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}: http://localhost:${port}`);
});
