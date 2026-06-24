function generateCustomerReply(message) {

  const lowerMessage =
    message.toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | PRODUCT ENQUIRIES
  |--------------------------------------------------------------------------
  */

  if (
    lowerMessage.includes("frozen chicken") ||
    lowerMessage.includes("chicken")
  ) {

    return `
Hello 👋

Yes, Frozen Chicken is currently available.

Price: ₦12,000.

Would you like to place an order or know more about the product?
`;
  }

  if (
    lowerMessage.includes("turkey")
  ) {

    return `
Hello 👋

Yes, Turkey is available right now.

Price: ₦18,000.

Would you like to place an order?
`;
  }

  if (
    lowerMessage.includes("fish")
  ) {

    return `
Hello 👋

Fresh frozen Fish is available.

Price: ₦8,000.

Would you like to place an order?
`;
  }

  /*
  |--------------------------------------------------------------------------
  | CUSTOMER WANTS TO BUY
  |--------------------------------------------------------------------------
  */

  if (
    lowerMessage.includes("i want to buy") ||
    lowerMessage.includes("i'll buy") ||
    lowerMessage.includes("i will buy") ||
    lowerMessage.includes("yes i want") ||
    lowerMessage.includes("order")
  ) {

    return `
Great 😊

How many packs/pieces would you like to order?
`;
  }

  /*
  |--------------------------------------------------------------------------
  | QUANTITY RESPONSE
  |--------------------------------------------------------------------------
  */

  if (
    lowerMessage.includes("1 pack") ||
    lowerMessage.includes("2 packs") ||
    lowerMessage.includes("3 packs") ||
    lowerMessage.includes("4 packs") ||
    lowerMessage.includes("5 packs") ||
    lowerMessage.includes("pieces")
  ) {

    return `
Alright 👍

Would you prefer:

1. Home delivery
or
2. Pickup?
`;
  }

  /*
  |--------------------------------------------------------------------------
  | DELIVERY OPTION
  |--------------------------------------------------------------------------
  */

  if (
    lowerMessage.includes("delivery") ||
    lowerMessage.includes("home delivery")
  ) {

    return `
Okay 😊

Would you like us to deliver to your location?
If yes, please send your delivery address.
`;
  }

  /*
  |--------------------------------------------------------------------------
  | PICKUP OPTION
  |--------------------------------------------------------------------------
  */

  if (
    lowerMessage.includes("pickup")
  ) {

    return `
Okay 👍

You can visit our pickup location during business hours.

The business owner will contact you shortly with more details.
`;
  }

  /*
  |--------------------------------------------------------------------------
  | ADDRESS DETECTION
  |--------------------------------------------------------------------------
  */

  if (
    lowerMessage.includes("street") ||
    lowerMessage.includes("road") ||
    lowerMessage.includes("close") ||
    lowerMessage.includes("avenue")
  ) {

    return `
Thank you 😊

Your order request has been received successfully ✅

The business owner will contact you shortly for confirmation.
`;
  }

  /*
  |--------------------------------------------------------------------------
  | DEFAULT RESPONSE
  |--------------------------------------------------------------------------
  */

  return `
Hello 👋

Thank you for contacting us.

Please tell us the product you are interested in:
- Frozen Chicken
- Turkey
- Fish
`;
}

module.exports = {
  generateCustomerReply,
};