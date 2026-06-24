const qrcode = require("qrcode-terminal");

const {
  Client,
  LocalAuth,
} = require("whatsapp-web.js");

/*
|--------------------------------------------------------------------------
| WHATSAPP CLIENT
|--------------------------------------------------------------------------
*/

const client = new Client({
  authStrategy: new LocalAuth(),
});

/*
|--------------------------------------------------------------------------
| QR CODE EVENT
|--------------------------------------------------------------------------
*/

client.on("qr", (qr) => {

  console.log("Scan QR Code Below:");

  qrcode.generate(qr, {
    small: true,
  });
});

/*
|--------------------------------------------------------------------------
| READY EVENT
|--------------------------------------------------------------------------
*/

client.on("ready", () => {

  console.log(
    "WhatsApp Alert System Ready ✅"
  );
});

/*
|--------------------------------------------------------------------------
| AUTHENTICATED
|--------------------------------------------------------------------------
*/

client.on("authenticated", () => {

  console.log(
    "WhatsApp authenticated ✅"
  );
});

/*
|--------------------------------------------------------------------------
| AUTH FAILURE
|--------------------------------------------------------------------------
*/

client.on("auth_failure", (msg) => {

  console.error(
    "WhatsApp auth failure:",
    msg
  );
});

/*
|--------------------------------------------------------------------------
| DISCONNECTED
|--------------------------------------------------------------------------
*/

client.on("disconnected", (reason) => {

  console.log(
    "WhatsApp disconnected:",
    reason
  );
});

/*
|--------------------------------------------------------------------------
| INITIALIZE CLIENT
|--------------------------------------------------------------------------
*/

client.initialize();

/*
|--------------------------------------------------------------------------
| SEND OWNER ALERT
|--------------------------------------------------------------------------
*/

async function sendWhatsAppAlert(message) {

  try {

   const ownerNumber =
      process.env.OWNER_PHONE;

    if (!ownerNumber) {

      throw new Error(
        "OWNER_PHONE missing in .env"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CLEAN NUMBER
    |--------------------------------------------------------------------------
    */

    const cleanNumber =
      ownerNumber.replace(/\D/g, "");

    const numberId =
      await client.getNumberId(
        cleanNumber
      );

    /*
    |--------------------------------------------------------------------------
    | NUMBER CHECK
    |--------------------------------------------------------------------------
    */

    if (!numberId) {

      throw new Error(
        "WhatsApp number is not valid"
      );
    }

    console.log(
      "Valid WhatsApp ID:",
      numberId._serialized
    );

    /*
    |--------------------------------------------------------------------------
    | SEND MESSAGE
    |--------------------------------------------------------------------------
    */

    await client.sendMessage(
      numberId._serialized,
      message
    );

    console.log(
      "WhatsApp alert sent successfully ✅"
    );

  } catch (error) {

    console.error(
      "WhatsApp Alert Error:"
    );

    console.error(error.message);

    throw error;
  }
}

module.exports = {
  sendWhatsAppAlert,
};