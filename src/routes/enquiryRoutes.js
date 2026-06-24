const express = require("express");

const prisma = require("../db/prisma");

const {
  sendWhatsAppAlert,
} = require("../services/whatsappService");

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const {
      source,
      customerName,
      customerHandle,
      customerMessage,
      customerPhone,
      productId,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | SAVE ENQUIRY
    |--------------------------------------------------------------------------
    */

    const enquiry =
      await prisma.enquiry.create({
        data: {
          source,
          customerName,
          customerHandle,
          customerMessage,
          customerPhone,
          productId,
        },
      });

    console.log("New enquiry received ✅");

    console.log(enquiry);

    /*
    |--------------------------------------------------------------------------
    | CREATE ALERT MESSAGE
    |--------------------------------------------------------------------------
    */

    const alertMessage = `
📢 NEW CUSTOMER ENQUIRY

👤 Name: ${customerName}

💬 Message:
${customerMessage}

📱 Phone:
${customerPhone}

🌐 Source:
${source}
`;

    /*
    |--------------------------------------------------------------------------
    | SEND WHATSAPP ALERT
    |--------------------------------------------------------------------------
    */

    try {

      await sendWhatsAppAlert(
        alertMessage
      );

      console.log(
        "WhatsApp alert sent ✅"
      );

    } catch (whatsappError) {

      console.error(
        "WhatsApp Send Error:",
        whatsappError.message
      );
    }

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    res.json({
      success: true,
      enquiry,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;