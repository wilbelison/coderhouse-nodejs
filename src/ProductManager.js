const fs = require("fs");

class ProductManager {
  constructor(jsonPath) {
    this.jsonPath = jsonPath;
    this.products = this.loadProducts();
    this.id = this.products.length
      ? this.products[this.products.length - 1].id + 1
      : 1;
  }

  loadProducts() {
    try {
      return JSON.parse(fs.readFileSync(this.jsonPath, "utf-8"));
    } catch {
      return [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.jsonPath, JSON.stringify(this.products, null, 2));
  }

  addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error(
        "Oops! Você esqueceu algum ingrediente essencial do produto."
      );
      return;
    }
    if (this.products.some((p) => p.code === code)) {
      console.error(
        "Erro 404: Código de produto duplicado! Tente outra combinação secreta."
      );
      return;
    }
    this.products.push({
      id: this.id++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    this.saveProducts();
    console.log(
      `🎉 Uhul! Produto "${title}" adicionado com sucesso! Que tal adicionar outro?`
    );
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product)
      console.error(
        "A busca pelo produto falhou! Ele deve estar escondido em algum lugar."
      );
    return product;
  }

  updateProduct(id, updatedFields) {
    const product = this.getProductById(id);
    if (product) {
      Object.assign(product, updatedFields);
      this.saveProducts();
      console.log(
        `✨ O produto "${product.title}" passou por uma reforma e está atualizado!`
      );
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      console.log(
        "🚮 Produto deletado com sucesso. Adeus, amigo... Foi bom enquanto durou!"
      );
    } else {
      console.error(
        "Erro 404: Produto não encontrado. Será que ele foi abduzido?"
      );
    }
  }
}

module.exports = ProductManager;

// const catalog = new ProductManager("./ProductManager.json");

// catalog.addProduct({
//   title: "Refrigerante Alienígena",
//   description:
//     "Um refresco importado diretamente da Galáxia de Andrômeda. Sabor extraterrestre com bolhas que flutuam!",
//   price: 19.99,
//   thumbnail: "./products/alien_soda.jpg",
//   code: "ALIEN_SODA",
//   stock: 33,
// });

// console.table(catalog.getProducts());

// catalog.updateProduct(3, { price: 16.99 });
// console.table(catalog.getProductById(4));

// catalog.deleteProduct(3);
