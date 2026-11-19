const {
  generateSocialCaption,
} = require("./socialCaptionService");

async function generatePromoPost(product) {
  return generateSocialCaption(product, "facebook", "friendly");
}

module.exports = {
  generatePromoPost,
};
