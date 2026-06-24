const auth =
  require("../middleware/auth");

const express = require("express");

const router = express.Router();

const prisma = require("../db/prisma");

const upload = require("../config/multer");

/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {

  try {

    const products =
      await prisma.product.findMany({
        where: {
          isActive: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.json({
      success: true,
      products,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

/*
|--------------------------------------------------------------------------
| ADD PRODUCT
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  auth,

  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "image2",
      maxCount: 1,
    },
  ]),

  async (req, res) => {
    
    try {

       const {
  name,
  description,
  category,
  stockStatus,
  price,
  imageUrl,
  imageUrl2,
} = req.body;

let finalImageUrl =
  imageUrl || "";

let finalImageUrl2 =
  imageUrl2 || "";
      if (
        req.files &&
        req.files.image
      ) {

        finalImageUrl =
  `/uploads/${req.files.image[0].filename}`;

      }
      
      /*
      |--------------------------------------------------------------------------
      | PRIORITIZE UPLOADED FILE
      |--------------------------------------------------------------------------
      */

        if (
  req.files &&
  req.files.image2
) {

  finalImageUrl2 =
    `/uploads/${req.files.image2[0].filename}`;

}

      const product =
        await prisma.product.create({

         data: {
  name,
  description,
  category,
  stockStatus,
  price,
  imageUrl: finalImageUrl,
  imageUrl2: finalImageUrl2,
},
        });

      res.json({
        success: true,
        product,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error:
          "Failed to add product",
      });

    }

  }
);
/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  auth,

  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "image2",
      maxCount: 1,
    },
  ]),

  async (req, res) => {


    try {

      const id =
        parseInt(req.params.id);

const existingProduct =
  await prisma.product.findUnique({
    where: { id },
  });

      const {
  name,
  description,
  category,
  stockStatus,
  price,
  imageUrl,
  imageUrl2,
} = req.body;
     
let finalImageUrl =
  existingProduct.imageUrl || "";

let finalImageUrl2 =
  existingProduct.imageUrl2 || "";
    
  if (
  req.files &&
  req.files.image
) {

  finalImageUrl =
    `/uploads/${req.files.image[0].filename}`;

}

      if (
  req.files &&
  req.files.image2
) {

  finalImageUrl2 =
    `/uploads/${req.files.image2[0].filename}`;

}

      const product =
  await prisma.product.update({
    where: {
      id,
    },

    data: {
  name,
  description,
  category,
  stockStatus,
  price,
  imageUrl: finalImageUrl,
  imageUrl2: finalImageUrl2,
},
        });

      res.json({
        success: true,
        product,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error:
          "Failed to update product",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  auth,
  async (req, res) => {

    try {

      const id =
        parseInt(req.params.id);

      await prisma.product.delete({
        where: {
          id,
        },
      });

      res.json({
        success: true,
        message:
          "Product deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error:
          "Failed to delete product",
      });
    }
  }
);

module.exports = router;