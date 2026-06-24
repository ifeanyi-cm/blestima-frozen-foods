async function generatePromoPost(product) {

  const templates = [

    `🔥 Fresh ${product.name} now available for ₦${product.price}. Order yours today!`,

    `Looking for premium ${product.name}? We’ve got quality stock available now for ₦${product.price}.`,

    `Affordable and fresh ${product.name} available today. Price: ₦${product.price}. Send us a message now!`,

    `🍗 Premium ${product.name} currently in stock. Fast delivery available.`
  ];

  const randomIndex =
    Math.floor(Math.random() * templates.length);

  return templates[randomIndex];
}

module.exports = {
  generatePromoPost,
};