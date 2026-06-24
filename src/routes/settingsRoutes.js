const auth =
  require("../middleware/auth");

const upload =
  require("../config/multer");
  
const express =
  require("express");

const router =
  express.Router();

const prisma =
  require("../db/prisma");

/*
|--------------------------------------------------------------------------
| GET SETTINGS
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {

  try {

    let settings =
      await prisma.settings.findFirst();

    if (!settings) {

      settings =
        await prisma.settings.create({
          data: {},
        });

    }

    res.json({
      success: true,
      settings,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch settings",
    });

  }

});

/*
|--------------------------------------------------------------------------
| UPLOAD LOGO / BANNER ONLY
|--------------------------------------------------------------------------
*/

router.post(
  "/upload",
  auth,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "banner",
      maxCount: 1,
    },
  ]),
  async (req, res) => {

    try {

      let settings =
        await prisma.settings.findFirst();

      if (!settings) {

        settings =
          await prisma.settings.create({
            data: {},
          });

      }

      const updateData = {};

updateData.businessName =
  req.body.businessName;

updateData.whatsappNumber =
  req.body.whatsappNumber;

updateData.address =
  req.body.address;

updateData.facebook =
  req.body.facebook;

updateData.instagram =
  req.body.instagram;

updateData.tiktok =
  req.body.tiktok;

updateData.deliveryFee =
  req.body.deliveryFee;

updateData.aboutText =
  req.body.aboutText;
    
      if (
        req.files &&
        req.files.logo
      ) {

       updateData.logoUrl =
  `/uploads/${req.files.logo[0].filename}`;
      }

      if (
        req.files &&
        req.files.banner
      ) {

        updateData.bannerUrl =
  `/uploads/${req.files.banner[0].filename}`;
}

if (
  req.files &&
  req.files.storefrontImage
) {

  updateData.storefrontImageUrl =
    `/uploads/${req.files.storefrontImage[0].filename}`;
}
      const updated =
        await prisma.settings.update({

          where: {
            id: settings.id,
          },

          data: updateData,

        });

      res.json({
        success: true,
        settings: updated,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error: "Upload failed",
      });

    }

  }
);

/*
|--------------------------------------------------------------------------
| UPDATE SETTINGS
|--------------------------------------------------------------------------
*/

router.put(
  "/",
  auth,
  upload.fields([
  {
    name: "logo",
    maxCount: 1,
  },
  {
    name: "banner",
    maxCount: 1,
  },
  {
    name: "storefrontImage",
    maxCount: 1,
  },
]),

  async (req, res) => {

    try {

      let settings =
        await prisma.settings.findFirst();

     const updateData = {
  businessName:
    req.body.businessName,

  whatsappNumber:
    req.body.whatsappNumber,

  address:
    req.body.address,

  deliveryFee:
    parseFloat(
      req.body.deliveryFee || 0
    ),

  facebook:
    req.body.facebook || "",

  instagram:
    req.body.instagram || "",

  tiktok:
    req.body.tiktok || "",

    aboutText:
    req.body.aboutText || "",
};

      if (
        req.files &&
        req.files.logo
      ) {

       updateData.logoUrl =
  `/uploads/${req.files.logo[0].filename}`;
      }

      if (
        req.files &&
        req.files.banner
      ) {

        updateData.bannerUrl =
  `/uploads/${req.files.banner[0].filename}`;
      }
      
if (
  req.files &&
  req.files.storefrontImage
) {

  updateData.storefrontImageUrl =
  `/uploads/${req.files.storefrontImage[0].filename}`;
}

      if (!settings) {

        settings =
          await prisma.settings.create({
            data: updateData,
          });

      } else {

        settings =
          await prisma.settings.update({

            where: {
              id: settings.id,
            },

            data: updateData,

          });

      }

      res.json({
        success: true,
        settings,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error: "Failed to update settings",
      });

    }

  }
);

module.exports = router;