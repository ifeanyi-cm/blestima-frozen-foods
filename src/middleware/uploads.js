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
  path.join(process.cwd(), "uploads", "logos")
);

      } else if (
        file.fieldname ===
        "banner"
      ) {

        cb(
  null,
  path.join(process.cwd(), "uploads", "banners")
);
      } else if (
        file.fieldname ===
        "storefrontImage"
      ) {

       cb(
  null,
  path.join(process.cwd(), "uploads", "storefront")
);

      } else {

        cb(
  null,
  path.join(process.cwd(), "uploads")
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