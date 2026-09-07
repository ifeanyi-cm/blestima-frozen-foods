const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      path.join(process.cwd(), "uploads")
    );

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );

  },

});

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only JPEG, PNG, and WebP images are allowed."
      )
    );

  }

};

const upload = multer({

  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter,

});

module.exports = upload;