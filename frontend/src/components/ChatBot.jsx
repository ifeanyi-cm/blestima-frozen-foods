import { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";

function ChatBot() {

  const [open, setOpen] = useState(false);

  const [products, setProducts] =
    useState([]);

  const [messages, setMessages] =
    useState([
      {
        sender: "bot",
        text:
          "Hello 👋 Welcome to Blestima Foods. Ask me about our products, prices or delivery.",
      },
    ]);

  const [input, setInput] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD PRODUCTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
  const url = `${import.meta.env.VITE_API_URL}/api/products`;

  console.log("CHATBOT URL:", url);

  fetch(url, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  })
    .then(async (res) => {
      const text = await res.text();

console.log("CHATBOT FIRST 100:", text.substring(0, 100));

      console.log("CHATBOT RESPONSE:", text);

      return JSON.parse(text);
    })
    .then((data) => {
      setProducts(data.products || []);
    })
    .catch((err) => {
      console.error("CHATBOT ERROR:", err);
    });

  }, []);

  /*
  |--------------------------------------------------------------------------
  | SEND MESSAGE
  |--------------------------------------------------------------------------
  */

  function sendMessage() {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    const lower =
      input.toLowerCase();

    let botReply =
      "I can help with products, prices, delivery and ordering.";

    /*
    |--------------------------------------------------------------------------
    | GREETINGS
    |--------------------------------------------------------------------------
    */

    if (
      lower.includes("hello") ||
      lower.includes("hi")
    ) {

      botReply =
        "Hello 👋 Welcome to Blestima Foods.";

    }

    /*
    |--------------------------------------------------------------------------
    | LIST PRODUCTS
    |--------------------------------------------------------------------------
    */

    else if (
      lower.includes("products") ||
      lower.includes("available") ||
      lower.includes("what do you have")
    ) {

      if (products.length === 0) {

        botReply =
          "No products are currently available.";

      } else {

        botReply =
          "Available products:\n\n" +
          products
            .map(
              (p) =>
                `• ${p.name}`
            )
            .join("\n");

      }

    }

    /*
    |--------------------------------------------------------------------------
    | PRODUCT SEARCH
    |--------------------------------------------------------------------------
    */

    else {

      const foundProduct =
        products.find((product) =>
          lower.includes(
            product.name.toLowerCase()
          )
        );

      if (foundProduct) {

        botReply =
          `${foundProduct.name} is available.\n\nPrice: ₦${foundProduct.price}\n\n${foundProduct.description}`;

      }

      else if (
        lower.includes("price")
      ) {

        botReply =
          "Please tell me the product name and I will provide the price.";

      }

      else if (
        lower.includes("delivery")
      ) {

        botReply =
          "Yes, we offer delivery depending on your location.";

      }

      else if (
        lower.includes("location")
      ) {

        botReply =
          "Please tell us your city or area for delivery information.";

      }

      else if (
        lower.includes("order") ||
        lower.includes("buy")
      ) {

        botReply =
          "You can click the Order button on any product or contact us on WhatsApp.";

      }

      else if (
        lower.includes("payment")
      ) {

        botReply =
          "Payment details will be provided after order confirmation.";

      }

      else if (
        lower.includes("thanks")
      ) {

        botReply =
          "You're welcome. We look forward to serving you.";

      }

    }

    const botMessage = {
      sender: "bot",
      text: botReply,
    };

    setMessages([
      ...messages,
      userMessage,
      botMessage,
    ]);

    setInput("");
  }

  return (
    <>
      <button
  onClick={() =>
    setOpen(!open)
  }
  className="
    fixed
    bottom-20
    right-1
    bg-black
    text-white
    w-10
    h-10
    rounded-full
    flex
    items-center
    justify-center
    text-base
    shadow-xl
    z-50
  "
>
  🤖
</button>

      {open && (

        <div
          className="
            fixed
            bottom-48
            right-6
            w-80
            bg-white
            rounded-2xl
            shadow-2xl
            overflow-hidden
            z-50
          "
        >

          <div
            className="
              bg-green-700
              text-white
              p-4
              font-bold
            "
          >
            Blestima Assistant
          </div>

          <div
            className="
              h-80
              overflow-y-auto
              p-4
              space-y-3
            "
          >

            {messages.map(
              (msg, index) => (

                <div
                  key={index}
                  className={
                    msg.sender === "user"
                      ? "text-right"
                      : "text-left"
                  }
                >

                  <span
                    className={`
                      inline-block
                      whitespace-pre-line
                      px-4
                      py-2
                      rounded-xl
                      ${
                        msg.sender === "user"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200"
                      }
                    `}
                  >
                    {msg.text}
                  </span>

                </div>

              )
            )}

          </div>

          <div
            className="
              flex
              border-t
            "
          >

            <input
              type="text"
              placeholder="Type message..."
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendMessage();

                }

              }}
              className="
                flex-1
                p-3
                outline-none
              "
            />

            <button
              onClick={
                sendMessage
              }
              className="
                bg-green-600
                text-white
                px-5
              "
            >
              Send
            </button>

          </div>

        </div>

      )}

    </>
  );
}

export default ChatBot;