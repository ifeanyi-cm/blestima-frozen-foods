const multer = require("multer");
const path = require("path");

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      if (
        file.fieldname ===
        "logo"
      ) {

        cb(
          null,
          "uploads/logos"
        );

      } else if (
        file.fieldname ===
        "banner"
      ) {

        cb(
          null,
          "uploads/banners"
        );

      } else if (
        file.fieldname ===
        "storefrontImage"
      ) {

        cb(
          null,
          "uploads/storefront"
        );

      } else {

        cb(
          null,
          "uploads"
        );

      }

    },

    filename: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        Date.now() +
        path.extname(
          file.originalname
        )
      );

    },

  });

module.exports =
  multer({
    storage,
  });