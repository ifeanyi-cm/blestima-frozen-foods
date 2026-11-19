const express = require("express");
const auth = require("../middleware/auth");
const prisma = require("../db/prisma");
const { generateSocialCaption } = require("../services/socialCaptionService");

const router = express.Router();

// Generate a caption for an existing product. Admin authentication is required.
router.post("/caption", auth, async (req, res) => {
  try {
    const productId = Number(req.body?.productId);
    const platform = typeof req.body?.platform === "string" ? req.body.platform : "facebook";
    const tone = typeof req.body?.tone === "string" ? req.body.tone : "friendly";

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ success: false, error: "A valid productId is required." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, error: "Product not found or inactive." });
    }

    const caption = await generateSocialCaption(product, platform, tone);
    return res.json({ success: true, caption });
  } catch (error) {
    console.error("Social caption generation failed:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message || "Caption generation failed.",
    });
  }
});

module.exports = router;
