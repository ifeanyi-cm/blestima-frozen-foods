import ChatBot from "../components/ChatBot";

import {
  useEffect,
  useState,
} from "react";

function Catalog() {

  const [products, setProducts] =
    useState([]);

  const [currentImages, setCurrentImages] =
    useState({});

  const [cart, setCart] =
    useState(() => {

      const savedCart =
        localStorage.getItem(
          "cart"
        );

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    });

  const [showCheckoutForm, setShowCheckoutForm] =
    useState(false);

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [customerAddress, setCustomerAddress] =
    useState("");
const [showCart, setShowCart] =
  useState(false);

const [selectedProduct, setSelectedProduct] =
  useState(null);

const [selectedImage, setSelectedImage] =
  useState(0);

const [addedProduct, setAddedProduct] =
  useState(null);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [search, setSearch] =
    useState("");

  useEffect(() => {

  fetch(

  `${import.meta.env.VITE_API_URL}/api/products`,
  {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  }
)
    .then((res) =>
      res.json()
    )
    .then((data) => {

      setProducts(
        data.products || []
      );

    })
    .catch((error) => {

      console.error(error);

    });

}, []);

useEffect(() => {

  const interval =
    setInterval(() => {

      console.log(
        "Catalog slideshow running"
      );

      setCurrentImages(
        (prev) => {

          const updated = {
            ...prev,
          };

          products.forEach(
            (product) => {

              if (
                product.imageUrl2
              ) {

                updated[
                  product.id
                ] =
                  updated[
                    product.id
                  ] === 1
                    ? 0
                    : 1;

              }

            }
          );

          return updated;

        }
      );

    }, 3000);

  return () =>
    clearInterval(
      interval
    );

}, [products]);

useEffect(() => {

  if (
    !selectedProduct ||
    !selectedProduct.imageUrl2
  ) {
    return;
  }

  const interval =
    setInterval(() => {

      setSelectedImage(
        (prev) =>
          prev === 0 ? 1 : 0
      );

      console.log(
        "Popup image switched"
      );

    }, 3000);

  return () =>
    clearInterval(interval);

}, [selectedProduct]);

useEffect(() => {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}, [cart]);

function addToCart(product) {

  const existingItem =
    cart.find(
      (item) =>
        item.id === product.id
    );

  if (existingItem) {

    setCart(

      cart.map((item) =>

        item.id === product.id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item

      )

    );

  } else {

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
      },
    ]);

  }

}

function removeFromCart(productId) {

  setCart(
    cart.filter(
      (item) =>
        item.id !== productId
    )
  );

}

const cartTotal =
  cart.reduce(
    (total, item) =>
      total +
      (
        Number(
          String(item.price)
            .replace("₦", "")
            .replace(/,/g, "")
            .replace(/ Per\/.*/g, "")
        ) * item.quantity
      ),
    0
  );

function checkoutWhatsApp() {

  const orderDetails =
    cart
      .map(
        (item) =>
          `${item.name} x${item.quantity}`
      )
      .join("\n");

  const message =
`Hello, I would like to place an order.

Customer Name: ${customerName}

Phone Number: ${customerPhone}

Delivery Address: ${customerAddress}

Order Details:
${orderDetails}

Total: ₦${cartTotal.toLocaleString()}`;

 window.open(
  `https://wa.me/2348036429649?text=${encodeURIComponent(message)}`,
  "_blank"
);

setCart([]);

localStorage.removeItem(
  "cart"
);

setShowCheckoutForm(
  false
);

setShowCart(
  false
);

}

  const categories = [
    "All",
    ...new Set(
      products
        .map(
          (p) => p.category
        )
        .filter(Boolean)
    ),
  ];

  const filteredProducts =
    products.filter((product) => {

      const categoryMatch =
        selectedCategory ===
          "All" ||
        product.category ===
          selectedCategory;

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        categoryMatch &&
        searchMatch
      );

    });

 return (

  <>

    <div
      className="
        max-w-7xl
        mx-auto
        px-6
        py-12
      "
    >

      <h1
  className="
    text-lg
    md:text-4xl
    font-bold
  "
>
  Product Catalog
</h1>

<div
  className="
    flex
    justify-end
    mb-4
  "
>

  <button
    onClick={() =>
      setShowCart(
        !showCart
      )
    }
    className="
      bg-green-600
      text-white
      px-3
      py-3
      rounded-lg
      font-semibold
    "
  >
    🛒 {cart.length}
  </button>

</div>

      <div
        className="
          flex
          flex-wrap
          gap-3
          mb-8
        "
      >

        {categories.map(
          (cat) => (

            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(
                  cat
                )
              }
              className={
                selectedCategory ===
cat
  ? "bg-green-600 text-white px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base rounded-full"
  : "bg-gray-200 px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base rounded-full"
              }
            >
              {cat}
            </button>

          )
        )}

      </div>

      <div
 className="
    grid
    grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    gap-4
    md:gap-6
  " 
      >

        {filteredProducts.map(
          (product) => (

        <div
  key={product.id}
  onClick={() => {

  console.log(
    "PRODUCT CLICKED",
    product.name
  );

  setSelectedProduct(product);

  setSelectedImage(0);


  }}
  className="
    bg-white
    rounded-xl
    shadow-md
    overflow-hidden
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-2xl
  "
>

  <div className="overflow-hidden relative">

    <img
      src={
        currentImages[product.id] === 1 &&
        product.imageUrl2
          ? product.imageUrl2
          : product.imageUrl
      }
      alt={product.name}
      className="
  w-full
  h-44
  md:h-78
  object-cover
  transition-all
  duration-700
"
    />

    <div
      className={`
        absolute
        top-2
        left-2
        px-2
        py-1
        rounded-full
        text-white
        text-xs
        md:text-sm
        font-medium
        ${
          product.stockStatus === "In Stock"
            ? "bg-green-600"
            : "bg-red-600"
        }
      `}
    >
      {product.stockStatus}
    </div>

  </div>

  <div
   className="
  p-2
  md:p-5
"
  >

    <h3
      className="
  text-sm
  md:text-xl
  font-bold
  mb-1
  text-gray-900
"
    >
      {product.name}
    </h3>

    <p
      className="
  text-xs
  md:text-sm
  text-gray-600
  mb-2
"
    >
      {product.description}
    </p>

    <div
      className="
        relative
        flex
        flex-col
        gap-2
        mt-2
      "
    >

      <span
        className="
  text-green-700
  text-xs
  md:text-lg
  font-semibold
"
      >
        ₦{product.price}
      </span>

      {addedProduct === product.id && (

        <div
          className="
            absolute
            right-0
            top-0
            bg-green-600
            text-white
            text-xs
            md:text-sm
            px-2
            py-1
            rounded-full
            shadow-lg
            animate-bounce
            z-50
            pointer-events-none
          "
        >
          ✓ Added
        </div>

      )}

            <button
        onClick={(e) => {

          e.stopPropagation();

          addToCart(product);

          setAddedProduct(
            product.id
          );

          setTimeout(() => {

            setAddedProduct(
              null
            );

          }, 1000);

        }}
        disabled={
          product.stockStatus ===
          "Out of Stock"
        }
        className={
          product.stockStatus ===
          "Out of Stock"
            ? `
                bg-gray-400
                text-white
                text-xs
                md:text-base
                py-1.5
                md:py-2
                px-3
                md:px-4
                rounded-lg
                cursor-not-allowed
              `
            : `
                bg-green-600
                hover:bg-green-700
                text-white
                text-xs
                md:text-base
                py-1.5
                md:py-2
                px-3
                md:px-4
                rounded-lg
                font-semibold
              `
        }
      >
        {product.stockStatus ===
        "Out of Stock"
          ? "Unavailable"
          : "Add To Cart"}
      </button>

    </div>

  </div>

</div>

          )
        )}

      </div>

    </div>

{selectedProduct && (

  <div
    onClick={() =>
      setSelectedProduct(null)
    }
    className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
      p-4
    "
  >

    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      className="
        bg-white
        rounded-2xl
        max-w-lg
        w-full
        overflow-hidden
      "
    >

     <img
  src={
    selectedImage === 0
      ? selectedProduct.imageUrl
      : selectedProduct.imageUrl2
  }
  alt={selectedProduct.name}
  className="
    w-full
    h-72
    md:h-80
    object-cover
  "

/>

      <div 
  className="
    p-2
    md:p-6
  "

>

        <h2
          className="
  text-xl
  md:text-3xl
  font-bold
  mb-1
"
        >
          {selectedProduct.name}
        </h2>

        <p
          className="
  text-green-700
  text-lg
  md:text-2xl
  font-bold
  mb-2
"
        >
          ₦{selectedProduct.price}
        </p>

        <p
          className="
  text-sm
  md:text-base
  text-gray-600
  mb-3
"
        >
         {selectedProduct.description}
</p>

<div className="relative inline-block">

  {addedProduct === selectedProduct.id && (

    <div
      className="
        absolute
        -top-8
        left-1/2
        -translate-x-1/2
        bg-green-600
        text-white
        text-xs
        px-2
        py-1
        rounded-full
        shadow-lg
        animate-bounce
        z-50
      "
    >
      ✓ Added
    </div>

  )}

  <button
    onClick={() => {

      addToCart(
        selectedProduct
      );

      setAddedProduct(
        selectedProduct.id
      );

      setTimeout(() => {

        setAddedProduct(
          null
        );

      }, 1000);

    }}
    className="
      bg-green-600
      hover:bg-green-700
      text-white
      px-4
      md:px-6
      py-2
      md:py-3
      rounded-lg
      font-semibold
      text-sm
      md:text-base
    "
  >
    Add To Cart
  </button>

</div>

      </div>

    </div>

  </div>

)} 

{showCart && (

  <div

    onClick={() =>
      setShowCart(false)
    }

    className="
      fixed
      inset-0
      bg-black/60
      flex
      justify-center
      items-center
      z-50
      p-4
    "
  >

    <div
      className="
        bg-white
        rounded-2xl
        w-full
        max-w-xl
        p-6
        max-h-[80vh]
        overflow-y-auto
      "
    >

      <div
        className="
          flex
          justify-between
          items-center
          mb-6
        "
      >

        <h2
          className="
            text-2xl
            font-semi-bold
          "
        >
         Shopping Cart
        </h2>

        <button
          onClick={() =>
            setShowCart(false)
          }
          className="
            text-2xl
            font-bold
          "
        >
          
        </button>

      </div>

      {cart.length === 0 ? (

        <p
          className="
            text-gray-500
          "
        >
          Cart is empty.
        </p>

      ) : (

        <>

          {cart.map(
            (item) => (

              <div
                key={item.id}
                className="
                  flex
                  justify-between
                  border-b
                  py-3
                "
              >

           <div
  className="
    flex
    items-start
    gap-2
  "
>

  <button
    onClick={(e) => {

      e.stopPropagation();

      removeFromCart(
        item.id
      );

    }}
    className="
      text-red-600
      font-bold
      text-sm
      hover:text-red-800
      mt-1
    "
  >
    ✕
  </button>

  <div>

    <h3
      className="
        font-semibold
      "
    >
      {item.name}
    </h3>

    <p>
      Qty:
      {" "}
      {item.quantity}
    </p>

  </div>

</div>
                <div
  className="
    font-bold
    text-green-700
  "
>
  ₦
{(
 Number(
  item.price
    .replace(/,/g, "")
    .replace(/ Per\/.*/g, "")
 ) * item.quantity
).toLocaleString()}
</div>
              </div>

            )
          )}

          <div
            className="
              mt-6
              text-right
              text-2xl
              font-bold
            "
          >
  Total:
  {" "}
  ₦
  {cartTotal.toLocaleString()}
</div>
<button
  onClick={() =>
    setShowCheckoutForm(true)
  }
  className="
    mt-6
    w-full
    bg-green-600
    hover:bg-green-700
    text-white
    py-3
    rounded-lg
    font-semibold
  "
>
 Order on WhatsApp
</button>

        </>

      )}

    </div>

  </div>

)}

{showCheckoutForm && (

  <div
    onClick={() =>
      setShowCheckoutForm(false)
    }
    className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
      p-4
    "
  >

    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      className="
        bg-white
        rounded-2xl
        p-6
        w-full
        max-w-md
      "
    >

      <h2
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        Delivery Information
      </h2>

      <input
        type="text"
        placeholder="Full Name"
        value={customerName}
        onChange={(e) =>
          setCustomerName(
            e.target.value
          )
        }
        className="
          w-full
          border
          p-3
          rounded-lg
          mb-3
        "
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={customerPhone}
        onChange={(e) =>
          setCustomerPhone(
            e.target.value
          )
        }
        className="
          w-full
          border
          p-3
          rounded-lg
          mb-3
        "
      />

      <textarea
        placeholder="Delivery Address"
        value={customerAddress}
        onChange={(e) =>
          setCustomerAddress(
            e.target.value
          )
        }
        className="
          w-full
          border
          p-3
          rounded-lg
          mb-4
        "
        rows="3"
      />

      <button
  onClick={() => {

    if (
      !customerName ||
      !customerPhone ||
      !customerAddress
    ) {

      alert(
        "Please complete all fields"
      );

      return;

    }

    checkoutWhatsApp();

  }}
  className="
    w-full
    bg-green-600
    text-white
    py-3
    rounded-lg
    font-semibold
  "
>
  Continue to WhatsApp
</button>

    </div>

  </div>

)}

{/* FLOATING WHATSAPP */}

<a
  href="https://wa.me/2348036429649"
  target="_blank"
  rel="noreferrer"
  className="
    fixed
    bottom-6
    right-1
    bg-green-500
    text-white
    w-10
    h-10
    rounded-full
    flex
    items-center
    justify-center
    text-base
    shadow-xl
    hover:scale-110
    transition
  "
>
  📱
</a>

<ChatBot />
  </>

  );

}

export default Catalog;