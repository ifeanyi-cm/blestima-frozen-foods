const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function optimizeProductImages(req, res, next) {
  try {
    if (!req.files) {
      return next();
    }

    const fields = ["image", "image2"];

    for (const field of fields) {
      if (
        !req.files[field] ||
        !req.files[field][0]
      ) {
        continue;
      }

      const file = req.files[field][0];

      const inputPath = file.path;

      const parsed = path.parse(file.filename);

      const optimizedFilename =
        `${parsed.name}.webp`;

      const outputPath =
        path.join(
          path.dirname(inputPath),
          optimizedFilename
        );

      await sharp(inputPath)
        .rotate()
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality: 82,
        })
        .toFile(outputPath);

      await fs.promises.unlink(inputPath);

      file.filename = optimizedFilename;
      file.path = outputPath;
      file.mimetype = "image/webp";
    }

    next();

  } catch (error) {

    console.error(
      "Product image optimization failed:",
      error
    );

    if (req.files) {
      const fields = ["image", "image2"];

      for (const field of fields) {
        if (
          req.files[field] &&
          req.files[field][0] &&
          req.files[field][0].path
        ) {
          try {
            await fs.promises.unlink(
              req.files[field][0].path
            );
          } catch (cleanupError) {
            console.error(
              "Failed to clean up uploaded image:",
              cleanupError
            );
          }
        }
      }
    }

    next(error);
  }
}

module.exports =
  optimizeProductImages;