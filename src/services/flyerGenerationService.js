const OpenAI = require("openai");
const axios = require("axios");
const sharp = require("sharp");
const supabase = require("../config/supabase");

const WIDTH = 1080;
const HEIGHT = 1080;

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildFlyerOverlay(product) {
  const productName = escapeXml(product.name || "Frozen Food");
  const price = product.price ? escapeXml(`₦${product.price}`) : "";
  const description = escapeXml((product.description || "").slice(0, 110));
  const stock = escapeXml(product.stockStatus || "");

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#082b36" stop-opacity="0.97"/>
          <stop offset="100%" stop-color="#126a65" stop-opacity="0.94"/>
        </linearGradient>
      </defs>
      <rect x="38" y="38" width="1004" height="1004" rx="44" fill="none" stroke="#ffffff" stroke-opacity="0.65" stroke-width="4"/>
      <rect x="60" y="60" width="960" height="245" rx="32" fill="url(#panel)"/>
      <text x="100" y="125" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff" letter-spacing="3">BLESTIMA</text>
      <text x="100" y="170" font-family="Arial, sans-serif" font-size="22" fill="#d8f5ee">COLDROOM &amp; FROZEN FOODS</text>
      <text x="100" y="245" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#ffffff">${productName}</text>
      <rect x="80" y="825" width="920" height="175" rx="28" fill="#ffffff" fill-opacity="0.96"/>
      <text x="115" y="885" font-family="Arial, sans-serif" font-size="27" font-weight="700" fill="#0a544d">QUALITY FROZEN FOODS</text>
      <text x="115" y="935" font-family="Arial, sans-serif" font-size="25" fill="#143b39">${description}</text>
      <text x="115" y="978" font-family="Arial, sans-serif" font-size="23" fill="#143b39">${stock}</text>
      ${price ? `<text x="960" y="975" text-anchor="end" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#d65b18">${price}</text>` : ""}
      <text x="540" y="790" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#ffffff">MESSAGE US TO ORDER</text>
    </svg>
  `);
}

async function generatePromoFlyer(product) {
  if (!product || !product.name || !product.imageUrl) {
    throw new Error("A product with a name and imageUrl is required to create a flyer.");
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Flyer generation is not configured. Set OPENAI_API_KEY in the backend environment.");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const imageModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.6-flare";

  const backgroundPrompt =
    "Create a premium square promotional background for a frozen-food business advertisement. " +
    "Use an elegant deep teal and fresh green palette, subtle cold mist, ice crystals, clean studio lighting, " +
    "abstract food-market visual accents around the edges, and a large clear central area for a real product photo " +
    "to be placed later. Do not include text, lettering, logos, labels, packaging, or products. " +
    "Professional commercial advertising art, clean composition, high contrast.";

  const generated = await client.images.generate({
    model: imageModel,
    prompt: backgroundPrompt,
    size: "1024x1024",
    quality: "medium",
    output_format: "png",
  });

  const backgroundB64 = generated.data?.[0]?.b64_json;
  if (!backgroundB64) {
    throw new Error("Image AI returned no background image.");
  }

  const productResponse = await axios.get(product.imageUrl, {
    responseType: "arraybuffer",
    timeout: 20000,
  });

  const productImage = await sharp(Buffer.from(productResponse.data))
    .rotate()
    .resize(650, 560, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const background = Buffer.from(backgroundB64, "base64");
  const flyer = await sharp(background)
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .composite([
      { input: productImage, top: 280, left: 215 },
      { input: buildFlyerOverlay(product), top: 0, left: 0 },
    ])
    .png()
    .toBuffer();

  const filePath = `social-flyers/${Date.now()}-${product.id}.png`;
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, flyer, {
      contentType: "image/png",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error("Flyer uploaded but public URL was not returned.");

  return data.publicUrl;
}

module.exports = { generatePromoFlyer };
