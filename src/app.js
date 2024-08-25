const express = require("express");

const ProductManager = require("./ProductManager");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Product Manager</h1>");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}: http://localhost:${port}`);
});

const catalog = new ProductManager("./ProductManager.json");

console.table(catalog.getProducts());
