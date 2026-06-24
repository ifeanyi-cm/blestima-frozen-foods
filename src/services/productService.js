const prisma = require("../db/prisma");

async function getRandomProduct() {

  const products = await prisma.product.findMany({
    where: {
      isActive: true
    }
  });

  if (!products.length) {
    throw new Error("No products found");
  }

  const randomIndex =
    Math.floor(Math.random() * products.length);

  return products[randomIndex];
}

module.exports = {
  getRandomProduct,
};