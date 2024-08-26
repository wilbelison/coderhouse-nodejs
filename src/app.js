const express = require("express");

const ProductManager = require("./ProductManager");
const Products = new ProductManager("./src/ProductManager.json");

const app = express();
const port = 3000;

app.use(express.static('public'))

app.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || null;
    const products = await Products.getProducts(limit);

    const productsList = products.map(product => 
      `<li><a href="/products/${product.id}" title="${product.title}">➞ ${product.title}</a></li>`
    ).join('');

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Manager</title>
        <link rel="stylesheet" href="ProductManager.css">
      </head>
      <body>
        <h1>Product Manager</h1>
        <ul class="options">
          <li><a href="/products">➞ Todos os produtos</a></li>
          <li><a href="/products?limit=10">➞ Apenas 10 produtos</a></li>
        </ul>
        <h2>Lista de produtos${limit ? ` limitado a ${limit}` : ''}:</h2>
        <ul class="products-list">
          ${productsList}
        </ul>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).send('Erro interno do servidor');
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
