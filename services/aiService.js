async function generatePost(product) {

  const templates = [
    `Fresh ${product.name} now available for only ₦${product.price}. Order now before stock runs out!`,
    
    `Looking for quality frozen ${product.name}? Get yours today at ₦${product.price}. Send us a message now!`,
    
    `🔥 Hot Deal! Fresh ${product.name} available today for ₦${product.price}. Fast delivery available.`,
    
    `Need affordable frozen ${product.name}? We’ve got you covered at just ₦${product.price}.`
  ];

  const randomIndex =
    Math.floor(Math.random() * templates.length);

  return templates[randomIndex];
}

module.exports = { generatePost };