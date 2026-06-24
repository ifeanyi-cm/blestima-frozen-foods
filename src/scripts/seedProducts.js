const prisma = require("../db/prisma");

async function seedProducts() {

  const products = [
    {
      name: "Frozen Chicken",
      description: "Fresh premium frozen chicken",
      price: 12000,
      imageUrl: ""
    },

    {
      name: "Turkey",
      description: "Quality frozen turkey",
      price: 18000,
      imageUrl: ""
    },

    {
      name: "Fish",
      description: "Fresh frozen fish",
      price: 8000,
      imageUrl: ""
    }
  ];

  for (const product of products) {

    await prisma.product.create({
      data: product,
    });
  }

  console.log("Products seeded successfully ✅");
}

seedProducts()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });