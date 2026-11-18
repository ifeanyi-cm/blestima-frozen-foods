const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const prisma = require("../db/prisma");
const upload = require("../config/multer");
const uploadToSupabase = require("../utils/supabaseUpload");

function parseItems(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch (_) { return null; }
  }
  return null;
}

async function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "An offer must include at least one product.";
  }
  const ids = items.map((item) => Number(item.productId));
  if (ids.some((id) => !Number.isInteger(id) || id <= 0) {
    return "Each offer item must have a valid productId.";
  }
  if (new Set(ids).size !== ids.length) {
    return "Duplicate products are not allowed in an offer.";
  }
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true, stockStatus: "In Stock" },
    select: { id: true },
  });
  if (products.length !== ids.length) {
    return "All selected products must be active and in stock.";
  }
  return null;
}

function normalizedItems(items) {
  return items.map((item) => ({
    productId: Number(item.productId),
    offerPrice: item.offerPrice == null || item.offerPrice === "" ? null : String(item.offerPrice),
    isActive: item.isActive !== false,
  }));
}

// Public: currently active offers and their eligible products
router.get("/active", async (req, res) => {
  try {
    const now = new Date();
    const offers = await prisma.specialOffer.findMany({
      where: { status: "active", startAt: { lte: now }, endAt: { gt: now } },
      orderBy: { endAt: "asc" },
      include: {
        items: {
          where: { isActive: true },
          include: { product: true },
        },
      },
    });
    const filtered = offers.map((offer) => ({
      ...offer,
      items: offer.items.filter((item) =>
        item.product.isActive && item.product.stockStatus === "In Stock"
      ),
    })).filter((offer) => offer.items.length > 0);
    res.json({ success: true, offers: filtered });
  } catch (error) {
    console.error("Special offers public fetch failed:", error);
    res.status(500).json({ success: false, message: "Failed to load special offers." });
  }
});

// Admin: list all offers
router.get("/admin", auth, async (req, res) => {
  try {
    const offers = await prisma.specialOffer.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    });
    res.json({ success: true, offers });
  } catch (error) {
    console.error("Special offers admin fetch failed:", error);
    res.status(500).json({ success: false, message: "Failed to load special offers." });
  }
});

// Admin: create offer
router.post("/", auth, upload.single("banner"), async (req, res) => {
  try {
    const { title, description, message, startAt, endAt, status } = req.body;
    const items = parseItems(req.body.items);
    if (!title || !startAt || !endAt) {
      return res.status(400).json({ success: false, message: "Title, start date, and end date are required." });
    }
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ success: false, message: "Please provide valid offer dates; the end must be after the start." });
    }
    const itemError = await validateItems(items);
    if (itemError) return res.status(400).json({ success: false, message: itemError });

    let bannerUrl = null;
    if (req.file) bannerUrl = await uploadToSupabase(req.file, "special-offers");

    const offer = await prisma.specialOffer.create({
      data: {
        title: String(title).trim(),
        description: description || null,
        message: message || null,
        bannerUrl,
        startAt: start,
        endAt: end,
        status: status === "active" ? "active" : "draft",
        items: { create: normalizedItems(items) },
      },
      include: { items: { include: { product: true } } },
    });
    res.status(201).json({ success: true, offer });
  } catch (error) {
    console.error("Special offer create failed:", error);
    res.status(500).json({ success: false, message: "Failed to create special offer." });
  }
});

// Admin: update offer
router.put("/:id", auth, upload.single("banner"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ success: false, message: "Invalid offer ID." });
    const existing = await prisma.specialOffer.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Special offer not found." });

    const { title, description, message, startAt, endAt, status } = req.body;
    const items = parseItems(req.body.items);
    if (!title || !startAt || !endAt) {
      return res.status(400).json({ success: false, message: "Title, start date, and end date are required." });
    }
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ success: false, message: "Please provide valid offer dates; the end must be after the start." });
    }
    const itemError = await validateItems(items);
    if (itemError) return res.status(400).json({ success: false, message: itemError });

    let bannerUrl = existing.bannerUrl;
    if (req.file) bannerUrl = await uploadToSupabase(req.file, "special-offers");

    const offer = await prisma.specialOffer.update({
      where: { id },
      data: {
        title: String(title).trim(),
        description: description || null,
        message: message || null,
        bannerUrl,
        startAt: start,
        endAt: end,
        status: status === "active" ? "active" : "draft",
        items: {
          deleteMany: {},
          create: normalizedItems(items),
        },
      },
      include: { items: { include: { product: true } } },
    });
    res.json({ success: true, offer });
  } catch (error) {
    console.error("Special offer update failed:", error);
    res.status(500).json({ success: false, message: "Failed to update special offer." });
  }
});

// Admin: change status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = req.body.status;
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ success: false, message: "Invalid offer ID." });
    if (!["draft", "active", "paused"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be draft, active, or paused." });
    }
    const offer = await prisma.specialOffer.update({ where: { id }, data: { status } });
    res.json({ success: true, offer });
  } catch (error) {
    console.error("Special offer status update failed:", error);
    res.status(500).json({ success: false, message: "Failed to update offer status." });
  }
});

module.exports = router;
