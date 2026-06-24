const prisma = require("../db/prisma");

const {
  getRandomProduct,
} = require("./productService");

const {
  generatePromoPost,
} = require("./aiPostService");

const {
  publishToFacebook,
} = require("./facebookService");

const {
  publishToInstagram,
} = require("./instagramService");

async function createDailyPromo() {

  /*
  |--------------------------------------------------------------------------
  | GET RANDOM PRODUCT
  |--------------------------------------------------------------------------
  */

  const product =
    await getRandomProduct();

  /*
  |--------------------------------------------------------------------------
  | GENERATE PROMO CONTENT
  |--------------------------------------------------------------------------
  */

  const content =
    await generatePromoPost(product);

  /*
  |--------------------------------------------------------------------------
  | SAVE PROMO TO DATABASE
  |--------------------------------------------------------------------------
  */

  const promo =
    await prisma.promoPost.create({
      data: {
        productId: product.id,
        platform: "multi-platform",
        content,
        status: "generated",
      },
    });

  /*
  |--------------------------------------------------------------------------
  | PUBLISH TO FACEBOOK
  |--------------------------------------------------------------------------
  */

  const facebookResult =
    await publishToFacebook(content);

  /*
  |--------------------------------------------------------------------------
  | PUBLISH TO INSTAGRAM
  |--------------------------------------------------------------------------
  */

  const instagramResult =
    await publishToInstagram(content);

  /*
  |--------------------------------------------------------------------------
  | UPDATE DATABASE
  |--------------------------------------------------------------------------
  */

  await prisma.promoPost.update({
    where: {
      id: promo.id,
    },

    data: {
      status: "published",
      facebookPostId:
        facebookResult.postId,

      instagramMediaId:
        instagramResult.mediaId,

      publishedAt: new Date(),
    },
  });

  console.log("Promo published successfully ✅");

  return promo;
}

module.exports = {
  createDailyPromo,
};