const fs = require("fs").promises;

class ProductManager {
  constructor(jsonPath) {
    this.jsonPath = jsonPath;
  }

  async loadJSON() {
    try {
      const data = await fs.readFile(this.jsonPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.saveJSON([]);
        return [];
      }
      throw error;
    }
  }

  async saveJSON(products) {
    await fs.writeFile(this.jsonPath, JSON.stringify(products, null, 2));
  }

  async addProduct(product) {
    const products = await this.loadJSON();
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    if (!Object.values(product).every(value => value)) {
      console.error("Você esqueceu alguma informação do produto.");
      return;
    }
    if (products.some(p => p.code === product.code)) {
      console.error("Código de produto duplicado!");
      return;
    }
    products.push({ id, ...product });
    await this.saveJSON(products);
    console.log(`Produto "${product.title}" adicionado!`);
  }

  async getProducts(limit = null) {
    const products = await this.loadJSON();
    return limit ? products.slice(0, limit) : products;
  }

  async getProductById(pid) {
    const products = await this.getProducts();
    return products.find(product => product.id === pid) || null;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      Object.assign(product, updatedFields);
      await this.saveJSON(products);
      console.log(`Produto "${product.title}" atualizado!`);
    } else {
      console.error("Produto não encontrado.");
    }
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    const initialLength = products.length;
    products = products.filter(product => product.id !== id);
    if (products.length < initialLength) {
      await this.saveJSON(products);
      console.log("🚮 Produto removido!");
    } else {
      console.error("Produto não encontrado.");
    }
  }
}

module.exports = ProductManager;