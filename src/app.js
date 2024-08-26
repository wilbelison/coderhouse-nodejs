const express = require("express");

const ProductManager = require("./ProductManager");
const Products = new ProductManager("./src/ProductManager.json");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || null;
    const products = await Products.getProducts(limit);

    const productsList = products
      .map(
        (product) =>
          `<li><a href="/products/${product.id}" title="${product.title}">${product.id < 10 ? "0" + product.id : product.id} ➞ ${product.title}</a></li>`
      )
      .join("");

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Manager</title>
        <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png" />
        <link rel="manifest" href="./site.webmanifest" />
        <link rel="stylesheet" href="./assets/styles/ProductManager.css">
      </head>
      <body>
        <div class="title"><h1 class="stroke" data-content="Product Manager">Product Manager</h1></div>
        <ul class="options">
          <li><a href="/products">getProducts();<br /><span class="sub">Todos os produtos</span></a></li>
          <li><a href="/products?limit=10">getProducts(10);<br /><span class="sub">Limitado a 10 produtos</span></a></li>
          <li><a href="/products/3">getProductById(3);<br /><span class="sub">Produto com ID 3</span></a></li>
        </ul>
        <h2 data-content="Lista de produtos${limit ? ` limitado a ${limit}` : ''}">Lista de produtos${limit ? ` limitado a ${limit}` : ''}</h2>
        <ul class="products-list">
          ${productsList}
        </ul>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

app.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit) || null;
  const products = await Products.getProducts(limit);
  res.json(products);
});

app.get("/products/:pid", async (req, res) => {
  const product = await Products.getProductById(parseInt(req.params.pid));
  if (product) { 
    res.json(product);
  } else {
    res.status(404).json("Produto não encontrado");
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}: http://localhost:${port}`);
});
