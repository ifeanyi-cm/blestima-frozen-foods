import { Link } from "react-router-dom";

import ChatBot from "../components/ChatBot";

import {
  useEffect,
  useState,
} from "react";

import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

import { HiMapPin } from "react-icons/hi2";

function Home() {

  useEffect(() => {

    window.scrollTo(
      0,
      0
    );

  }, []);

  const API_URL =
    import.meta.env.VITE_API_URL;

  const [products, setProducts] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [currentImages, setCurrentImages] =
    useState({});

const [selectedProduct, setSelectedProduct] =
  useState(null);

const [cart, setCart] = useState(() => {

  const savedCart =
    localStorage.getItem("cart");

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

const [selectedImage, setSelectedImage] =
  useState(0);

const [addedProduct, setAddedProduct] =
  useState(null);

  const [settings, setSettings] = useState({
  businessName: "Blestima ColdRoom & Frozen Foods",
  whatsappNumber: "2348036429649",
  address: "",
  bannerUrl: "",
  logoUrl: "",

  aboutText: "",
  storefrontImageUrl: "",
  facebook: "",
instagram: "",
tiktok: "",
});

const filteredProducts =
  products.filter((product) => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : product.category ===
          selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );

  });

const featuredProducts =
  filteredProducts.slice(0, 6);

  useEffect(() => {

console.log("API_URL =", API_URL);

 fetch(
  `/api/products`,
  {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  }
)
.then(res => res.json())
.then(data => {
  console.log(data);
  setProducts(data.products || []);
})
.catch(console.error);

  fetch(
  `/api/settings`,
  {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  }
)
.then(res => res.json())
.then(data => {
  console.log(data);

  if (data.success) {

    console.log(
      "LOGO URL:",
      data.settings.logoUrl
    );

    console.log(
      "STOREFRONT URL:",
      data.settings.storefrontImageUrl
    );

    console.log(
      "API URL:",
      import.meta.env.VITE_API_URL
    );

    setSettings(data.settings);
  }
})
.catch(console.error);
}, []);

useEffect(() => {

  const interval = setInterval(() => {

    setCurrentImages((prev) => {

      const updated = { ...prev };

      products.forEach((product) => {

  if (
    product.imageUrl2
  ) {

    if (!product.imageUrl) {
  console.log("MISSING IMAGE:", product);
}

if (product.imageUrl2 === "") {
  console.log("EMPTY IMAGE2:", product.id, product.name);
}

    updated[
      product.id
    ] =
      updated[
        product.id
      ] === 1
        ? 0
        : 1;

  }

});

console.log(updated);

      return updated;

    });

  }, 3000);

  return () => {
    clearInterval(interval);
  };

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

const cartTotal = cart.reduce(
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

function order(product) {
    const phone = settings.whatsappNumber;

    const message =
      `Hello, I want to order ${product.name}`;

    const url =
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

function checkoutWhatsApp() {

  const phone =
    settings.whatsappNumber;

  let message =
  `Hello, I want to place an order.

Customer Name: ${customerName}

Phone Number: ${customerPhone}

Delivery Address: ${customerAddress}

Order Details:

`;
  cart.forEach((item) => {

    message +=
      `${item.name} x ${item.quantity}\n`;

  });

  message +=
  `\n\nTotal: ₦${cartTotal.toLocaleString()}`;
  const url =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

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

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* NAVBAR */}

      <nav
  className="
    bg-green-700
    text-white
    px-2
    md:px-6
    py-2
  "
>

  <div
    className="
      flex
      justify-between
      items-center
    "
  >

  <div

>
  

  <h1
    className="
      text-xs
      md:text-2xl
      font-bold
      leading-tight
    "
  >
    Blestima Frozen Foods
  </h1>
</div>

    <button
      onClick={() =>
        setShowCart(
          !showCart
        )
      }
      className="
  bg-white
  text-green-700
  px-3
  md:px-5
  py-2
  rounded-lg
  font-semibold
  shadow-md
"
    >
      🛒 {cart.length}
    </button>

  </div>

</nav>

      {/* HERO */}

      <section
      className="bg-gradient-to-r from-green-700 to-green-500 text-white pt-6 pb-10 md:pt-24 md:pb-24 px-6 text-center"
>
  <div
  className="
    flex
    flex-col
    items-center
    mb-0
  "
>

  {settings.logoUrl && (

    <img
  src={`${import.meta.env.VITE_API_URL}${settings.logoUrl}`}
  alt="Logo"
  className="
    h-20
    md:h-32
    w-auto
    object-contain
    rounded-3xl
    shadow-xl
    bg-white
    p-3
    mb-4
  "
    />

  )}

  <h2
 className="
  text-3xl
  md:text-5xl
  font-bold
  mb-1
  px-4
  leading-tight
"
>

  Blestima ColdRoom & Frozen Foods
  </h2>

</div>

  <p
  className="
    text-xs
    md:text-lg
    max-w-lg
    mx-auto
    mb-0
    text-white
    px-4
    leading-4
  "
>
   Fresh frozen foods,
delivered to your doorstep.
  </p>

 <section
  className="
    relative
    w-screen
    -mx-6
    mt-6
    md:mt-10
    h-[400px]
    md:h-[650px]
    overflow-hidden
  "

>

  {settings.storefrontImageUrl && (
<img
  src={`${import.meta.env.VITE_API_URL}${settings.storefrontImageUrl}`}
  alt="Store Frontage"
  className="
    absolute
    inset-0
    w-full
    h-full
    object-cover
    scale-155
md:scale-100
  "
    />

  )}

  <div
  className="
    absolute
    inset-0
    bg-black/60
    flex
    items-center
    justify-center
    px-6
  "

>

    <div
  className="
    max-w-5xl
    mx-auto
    text-center
    text-white
    px-10
  "
>

      <h2
  className="
    text-base
    md:text-3xl
    font-semibold
    mb-3
  "

>
  About Us
</h2>

     <p
 
 className="
  text-sm
  md:text-xl
  leading-6
  md:leading-8
  max-w-sm
  md:max-w-3xl
  mx-auto
  px-4
  font-light
"
>
  Blestima ColdRoom & Frozen Foods is your trusted source for quality frozen foods, offering fresh, affordable, and hygienically handled products for homes, restaurants, and businesses.
</p>

    </div>

  </div>

</section>

<section
  className="
    bg-white
    py-8
    md:py-16
    px-4
    md:px-10
  "
>
  <div
    className="
      max-w-5xl
      mx-auto
    "
  >
    <h2
      className="
    text-2xl
    md:text-3xl
    font-bold
    text-green-700
    text-center
    mb-6
    font-Cinzel
  "
    >
      Our Story
    </h2>

    <p
      className="
        text-sm
        md:text-lg
        leading-7
        md:leading-9
        text-gray-700
        text-left
      "
    >
      {settings.aboutText}
    </p>
  </div>
</section>

<section
  className="
    py-12
    bg-white
    w-screen
    -mx-6
  "
>

  <div
      className="
    w-full
    px-6
  "
  >

    <div
  className="
    w-full
    bg-gray-50
    rounded-2xl
    shadow-md
    p-4
md:p-8
    flex
    flex-col
    justify-start
    items-start
  "
      
    >

      <div
  className="
    flex
    items-center
    gap-2
    mb-2
  "
>
 <HiMapPin
  className="
    text-red-500
    text-lg
  "
  />

  <p
    className="
      text-green-700
      font-bold
      text-xs
      md:text-sm
      uppercase
      tracking-wider
    "
  >
    Our Store Address
  </p>
</div>

      <p
  className="
    text-gray-800
    text-sm
    md:text-xl
    leading-relaxed
    md:leading-8
    ml-6
    md:ml-0
"
      >
        {settings.address}
      </p>

    </div>

  </div>

</section>

{/* PROMOTIONAL BANNER */}

{settings.bannerUrl && (

  <section
  className="
    bg-white
    py-6
    md:py-6
    w-screen
    -mx-6
    mt-8
    md:mt-12
  "
  >

    <h2
  className="
    text-center
    text-bg
    md:text-4xl
    font-bold
    text-red-600
    mb-0
    md:mb-4
  "

    >
      Special Offers
    </h2>

    <div
    
  className="
    w-[95%]
    md:w-[85%]
    mx-auto
    overflow-hidden
    rounded-xl
    md:rounded-2xl
    shadow-xl
  "
    >

      <img
        src={`${import.meta.env.VITE_API_URL}${settings.bannerUrl}`}
        alt="Promotional Banner"
        className="
  w-full
  h-[250px]
  md:h-auto
  object-contain
"
      />

    </div>

  </section>

)}

</section>
      {/* PRODUCTS */}

      <section
        id="products"
        className="p-6"
      >

        <h2
  className="
    text-xl
    md:text-3xl
    font-bold
    text-center
    mb-6
  "
>
  Our Products
</h2>

<div
  className="
    max-w-xl
    mx-auto
    mb-8
  "
>

</div>

        <div
  className="
    flex
    flex-wrap
    justify-center
    gap-2
    mb-6
    px-3
  "

>
   {[
    "All",
    "Fish",
    "Chicken",
    "Meat",
    "Sausage",
    "Gizzard",
    "Turkey",
    "Seafood"
  ].map((cat) => (

    <button
      key={cat}
      onClick={() =>
        setSelectedCategory(cat)
      }
      className={
        selectedCategory === cat
          ? "bg-green-600 text-white px-4 py-2 rounded-full transition-all duration-200"
          : "bg-gray-200 px-4 py-2 rounded-full transition-all duration-200"
      }
    >
      {cat}
    </button>

  ))}

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
         
         {featuredProducts.map((product) => (
        
        <div
              key={product.id}
             onClick={() => {
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
    ? `${import.meta.env.VITE_API_URL}${product.imageUrl2}`
    : product.imageUrl
      ? `${import.meta.env.VITE_API_URL}${product.imageUrl}`
      : null
}
  onError={() =>
  console.log(
    "BROKEN:",
    product.id,
    product.name,
    `${import.meta.env.VITE_API_URL}${product.imageUrl2}`
  )
}
  alt={product.name}
  className="
    w-full
    h-45
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

  {false && product.imageUrl2 && (
    <div
      className="
        flex
        justify-center
        gap-2
        py-2
      "
    >

      <span
        className={
          currentImages[product.id] === 0 ||
          currentImages[product.id] === undefined
            ? "text-green-600"
            : "text-gray-400"
        }
      >
        ●
      </span>

      <span
        className={
          currentImages[product.id] === 1
            ? "text-green-600"
            : "text-gray-400"
        }
      >
        ●
      </span>

    </div>

  )}

</div>

<div
  className="
    p-3
    md:p-5
  "
>
              
  <h3
    className="
      text-base
      md:text-xl
      font-bold
      mb-1
      text-gray-900
    "
  >
    {product.name}
  </h3>

                <p className="text-sm text-gray-600 mb-3">
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
  text-sm
  md:text-lg
  font-semibold
"
>
  ₦{product.price}
</span>

{addedProduct ===
  product.id && (

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

  
        ))}

</div>

<div
  className="
    flex
    justify-start
    mt-6
    mb-4
    md:mt-8
    md:mb-6
  "
>

  <Link
    to="/catalog"
    className="
  bg-green-600
  hover:bg-green-700
  text-white
  text-xs
  md:text-lg
  px-3
  md:px-5
  py-1.5
  md:py-2
  rounded-xl
  font-medium
  transition-all
  duration-200
"
  >
    More Products 
  </Link>

</div>

 {filteredProducts.length === 0 && (

    <div
      className="
        text-center
        text-gray-500
        text-xl
        py-12
      "
    >
      No products found.
    </div>

  )}


      </section>

      {/* WHY CHOOSE US */}

      <section className="bg-white py-6 px-3 md:py-4 md:px-6 mt-0">
        <h2 className="
  text-1x1
  md:text-3xl
  font-bold
  text-center
  mb-4
  md:mb-12
">
          Why Choose {settings.businessName}?
        </h2>

       <div
  className="
    grid
    grid-cols-1
    md:grid-cols-3
    gap-6
    text-center
  "
>
          <div className="flex flex-col items-center">

            <h3
  className="
    text-sm
    md:text-2xl
    font-bold
  "
>
  Quality Products
</h3>

            <p
  className="
    text-xs
    md:text-lg
  "
>
  Fresh and hygienically handled frozen foods.
</p>

          </div>

          <div className="flex flex-col items-center">


           <h3  className="
    text-sm
    md:text-2xl
    font-bold
  ">
            Affordable Prices
            </h3>

            <p
 className="
    text-xs
    md:text-lg
  ">Fair prices and excellent customer service 
</p>

          </div>

          <div className="flex flex-col items-center">


           <h3  className="
    text-sm
    md:text-2xl
    font-bold
  ">
            Fast Delivery
            </h3>

           <p className="
    text-xs
    md:text-lg
  ">
convenient ordering options and delivery
  .
</p>

          </div>

        </div>

      </section>

      {/* CONTACT */}

      {/* CONTACT */}

<section
  className="
    bg-green-400
    text-white
    py-0
    px-0
    text-center
  "

>

<section
 className="
  bg-gradient-to-b
  from-sky-500
  to-sky-100
  py-4
  md:py-3
  px-0
"
>

  <div
  
  className="
    max-w-6xl
    mx-auto
    flex
    justify-center
  "

  >

    <img
  src="/images/blestima-delivery-banner.png"
  alt="Blestima Delivery Service"
  className="
    mx-auto
    md:w-[80%]
    md:rounded-3xl
    md:overflow-hidden
    md:shadow-2xl
  "
    />

  </div>

</section>

{/* TESTIMONIALS */}

<section
   className="
    bg-gray-50
    py-6
    px-4
  "
>
<h2
  className="
    text-lg
    md:text-2xl
    font-bold
    text-center
    text-gray-800
    mb-4
  "
  >
    What Our Customers Say:
  </h2>

  <div
    className="
      grid
grid-cols-1
md:grid-cols-3
gap-6
    "
  >

    <div

  className="
    bg-white
    p-3
    md:p-8
    rounded-lg
    shadow-sm
    md:min-h-[180px]
    md:flex
    md:flex-col
    md:justify-center
  "


    >
      <p
  className="
    text-gray-700
    text-sm
    md:text-base
  "
>
        Fresh products and excellent customer service.
        Delivery was fast and reliable.
      </p>

      <h4
  className="
    text-sm
    md:text-bg
    text-green-700
  "
>
        — Adetomiwa Oluwadamilola
      </h4>
    </div>

    <div
  className="
    bg-white
    p-3
    md:p-8
    rounded-lg
    shadow-sm
    md:min-h-[180px]
    md:flex
    md:flex-col
    md:justify-center
  "

    >
      
      <p
  className="
    text-gray-700
    text-sm
    md:text-base
  
  ">
        The fish and chicken were fresh and neatly packaged.
        Highly recommended.
      </p>

    <h4
  className="
    text-sm
    md:text-bg
    text-green-700
  "
>
        — Febisara O.
      </h4>
    </div>

    <div
  className="
    bg-white
    p-3
    md:p-8
    rounded-lg
    shadow-sm
    md:min-h-[180px]
    md:flex
    md:flex-col
    md:justify-center
  "

    >
      
      <p
  className="
    text-gray-700
    text-sm
    md:text-base
  "
>
        Affordable prices and great quality.
        I will definitely order again.
      </p>

      <h4
  className="
    text-sm
    md:text-bg
    text-green-700
  "

>
        — Progress Ifeanyi
      </h4>
    </div>

  </div>

</section>

</section>

      {/* FLOATING WHATSAPP */}

      <a
        href={`https://wa.me/${settings.whatsappNumber}`}
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
    relative
    bg-white
    rounded-2xl
    max-w-md md:max-w-lg
    w-full
    overflow-hidden
  "
>
    



    <img
  src={
    selectedImage === 1 &&
    selectedProduct.imageUrl2
      ? `${import.meta.env.VITE_API_URL}${selectedProduct.imageUrl2}`
      : `${import.meta.env.VITE_API_URL}${selectedProduct.imageUrl}`
  }
  alt={selectedProduct.name}
  className="
    w-full
    h-56 md:h-80
    object-cover
  "

/>

{selectedProduct.imageUrl2 && (

  <div
    className="
      flex
      justify-center
      items-center
      gap-4
      py-3
      bg-gray-100
    "
  >

  </div>

)}

      <div
  className="
    p-6
  "
>

        <h2
          className="
           text-xl md:text-3xl
            font-bold
            mb-3
          "
        >
          {selectedProduct.name}
        </h2>

        <p
          className="
            text-green-700
           text-lg md:text-2xl
            font-bold
            mb-3
          "
        >
          ₦{selectedProduct.price}
        </p>

        <p
          className="
            text-gray-600
            mb-6
          "
        >
          {selectedProduct.description}
        </p>

        <div
          className="
            flex
            gap-3
            relative
          "
        >

{addedProduct === selectedProduct.id && (

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
  disabled={
    selectedProduct.stockStatus ===
    "Out of Stock"
  }
  className={
    selectedProduct.stockStatus ===
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
          text-bg
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
  {selectedProduct.stockStatus ===
  "Out of Stock"
    ? "Unavailable"
    : "Add To Cart"}
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
      bg-black/70
      flex
      items-center
      justify-center
      z-50
      p-4
    "
  >

    <div
      className="
        bg-white
        rounded-2xl
        w-full
        max-w-2xl
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
    hover:text-red-600
  "
>
  
</button>

      </div>

      {cart.length === 0 ? (

        <p>Your cart is empty.</p>

      ) : (

       <>
  {cart.map((item) => (

    <div
      key={item.id}
      className="
        flex
        justify-between
        items-center
        border-b
        py-4
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
      Qty: {item.quantity}
    </p>

  </div>

</div>

      <div
        className="
          font-bold
          text-green-700
        "
      >
        ₦{
          (
            Number(
              String(item.price)
                .replace("₦", "")
                .replace(/,/g, "")
               .replace(/ Per\/.*/g, "")
            ) * item.quantity
          ).toLocaleString()
        }
      </div>

    </div>

  ))}

  <div
  className="
    mt-6
    text-right
    text-lg
    md:text-xl
    font-bold
  "
>
  Total: ₦{cartTotal.toLocaleString()}
</div>
  <button
  onClick={() =>
    setShowCheckoutForm(true)
  }
  className="
    w-full
    mt-4
    bg-green-600
    hover:bg-green-700
    text-white
    py-3
    rounded-lg
    font-semibold
    text-sm
    md:text-base
    shadow-lg
    transition-all
    duration-200
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

      <ChatBot />

{/* FOOTER */}

<footer
  className="
    bg-gray-900
    text-white
    py-6
    md:py-12
    px-4
    md:px-8
  "

>

  <div
    className="
      max-w-6xl
      mx-auto
      grid
      grid-cols-1
      md:grid-cols-3
      gap-4
    "
  >

    <div>

      <h3
  className="
    text-sm
    md:text-2xl
    font-lg
    mb-2
    md:mb-4
  "
      >
        Blestima ColdRoom & Frozen Foods
      </h3>

      <p 
  className="
    text-xs
    md:text-base
    text-gray-300
    leading-2
    md:leading-5
  "
>
        Premium frozen foods delivered fresh and affordable.
      </p>

    </div>

    <div>

      <h3
       className="
  text-sm
  md:text-xl
  text-gray-300
  leading-5
">
      
        Call:
      </h3>

<p
  className="
    text-sm
    md:text-lg
    font-medium
  "
>
  +{settings.whatsappNumber}
</p>

    </div>

    <div>

      <h3
       className="
  text-sm
  md:text-xl
  text-gray-300
  leading-5
  mb-2
">
        Click To Follow Us On:
      </h3>

     <div
  className="
    flex
    gap-4
    md:gap-6
    items-center
  "
>

  <a
    href={settings.facebook}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaFacebook
      className="
        text-xl
        md:text-3xl
        hover:text-blue-500
      "
    />
  </a>

  <a
    href={settings.instagram}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaInstagram
      className="
        text-xl
        md:text-3xl
        hover:text-pink-500
      "
    />
  </a>

  <a
    href={settings.tiktok}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaTiktok
      className="
        text-xl
        md:text-3xl
      "
    />
  </a>

</div>
    </div>

  </div>

  <div
    className="
      border-t
      border-gray-700
      mt-1
      pt-1
      text-center
      text-xs
      text-gray-400
    "
  >

    © {new Date().getFullYear()} Blestima ColdRoom & Frozen Foods.
    All Rights Reserved.

  </div>

</footer>

    </div>

  );
}

export default Home;