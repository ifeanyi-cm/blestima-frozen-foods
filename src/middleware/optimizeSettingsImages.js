const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function optimizeSettingsImages(req, res, next) {
  try {
    if (!req.files) {
      return next();
    }

    const fields = [
      "logo",
      "banner",
      "storefrontImage",
    ];

    for (const field of fields) {
      if (!req.files[field] || !req.files[field][0]) {
        continue;
      }

      const file = req.files[field][0];

      const inputPath = file.path;

      const outputFilename =
        `${path.parse(file.filename).name}.webp`;

      const outputPath =
        path.join(
          path.dirname(inputPath),
          outputFilename
        );

      let image = sharp(inputPath);

      if (field === "logo") {
        image = image.resize({
          width: 600,
          withoutEnlargement: true,
        });
      }

      if (field === "storefrontImage") {
        image = image.resize({
          width: 1200,
          withoutEnlargement: true,
        });
      }

      if (field === "banner") {
        image = image.resize({
          width: 1600,
          withoutEnlargement: true,
        });
      }

      await image
        .webp({
          quality: 82,
        })
        .toFile(outputPath);

      if (inputPath !== outputPath) {
        fs.unlinkSync(inputPath);
      }

      file.filename = outputFilename;
      file.path = outputPath;
      file.mimetype = "image/webp";
      file.originalname = outputFilename;
    }

    next();

  } catch (error) {
    console.error(
      "Settings image optimization error:",
      error
    );

    next(error);
  }
}

module.exports = optimizeSettingsImages;