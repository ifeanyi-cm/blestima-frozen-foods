const OpenAI = require("openai");

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("AI caption generation is not configured. Set OPENAI_API_KEY in the backend environment.");
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function generateSocialCaption(product, platform = "facebook", tone = "friendly") {
  if (!product || typeof product !== "object" || !product.name) {
    throw new Error("A valid product with a name is required.");
  }

  const client = getOpenAIClient();
  const model = process.env.OPENAI_MODEL;

  if (!model) {
    throw new Error("AI caption generation is not configured. Set OPENAI_MODEL in the backend environment.");
  }

  const productFacts = {
    name: product.name,
    description: product.description || "",
    price: product.price ?? null,
    category: product.category || "",
    stockStatus: product.stockStatus || "",
  };

  const response = await client.chat.completions.create({
    model,
    temperature: 0.7,
    max_tokens: 350,
    messages: [
      {
        role: "system",
        content:
          "You are a social media copywriter for Blestima ColdRoom & Frozen Foods. Write engaging promotional captions for frozen food products. Use only facts supplied about the product; never invent discounts, stock availability, delivery promises, prices, certifications, or claims. Include a natural call to action. Keep the caption ready to post, with a few relevant emojis and hashtags. Do not explain your process.",
      },
      {
        role: "user",
        content: `Create a ${platform} caption in a ${tone} tone for this product:\n${JSON.stringify(productFacts, null, 2)}`,
      },
    ],
  });

  const caption = response.choices?.[0]?.message?.content?.trim();
  if (!caption) {
    throw new Error("The AI provider returned an empty caption.");
  }

  return caption;
}

module.exports = { generateSocialCaption };
