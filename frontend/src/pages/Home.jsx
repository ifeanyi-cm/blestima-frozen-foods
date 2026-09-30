import "../blestimaRefresh.css";
import { Link } from "react-router-dom";

import ChatBot from "../components/ChatBot";
import { trackEvent } from "../utils/analytics";

import {
  useEffect,
  useState,
  useRef,
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

  const featuredTrackRef = useRef(null);

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
  filteredProducts;

  useEffect(() => {

console.log("API_URL =", API_URL);
fetch(
  `${import.meta.env.VITE_API_URL}/api/products`,
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
  `${import.meta.env.VITE_API_URL}/api/settings`,
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
  const productsWithSecondImage = products.filter(
    (product) => product.imageUrl2
  );

  if (productsWithSecondImage.length === 0) {
    return;
  }

  const interval = setInterval(() => {
    setCurrentImages((prev) => {
      const updated = { ...prev };

      productsWithSecondImage.forEach((product) => {
        updated[product.id] =
          updated[product.id] === 1 ? 0 : 1;
      });

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

  trackEvent("add_to_cart", {
    currency: "NGN",
    value: Number(product.price) || 0,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        price: Number(product.price) || 0,
        quantity: 1,
      },
    ],
  });

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
    <div className="blestima-home bg-gray-100 min-h-screen">

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

      {/* PREMIUM STOREFRONT HERO — visual refresh; uses existing settings and routes */}
      <section className="bl-hero" aria-label="Welcome to Blestima">
        <div className="bl-hero-inner">
          <div className="bl-hero-copy">
            <span className="bl-kicker"><span className="bl-live-dot" /> FRESHNESS YOU CAN COUNT ON</span>
            {settings.logoUrl && <img className="bl-hero-logo" src={settings.logoUrl.startsWith("http") ? settings.logoUrl : `${API_URL}${settings.logoUrl}`} alt="Blestima logo" />}
            <h2>Quality frozen foods, <em>made easy.</em></h2>
            <p>Stock your kitchen with quality frozen foods for your home, restaurant or business. Browse our selection and order with confidence.</p>
            <div className="bl-hero-actions">
              <a className="bl-btn-primary" href="#products">Explore our products <span aria-hidden="true">↗</span></a>
              <Link className="bl-btn-outline" to="/catalog">Shop full catalog <span aria-hidden="true">→</span></Link>
            </div>
            <div className="bl-hero-trust" aria-label="Why shop with us">
              <span><b>✓</b> Hygienically handled</span><span><b>✓</b> Quality selection</span><span><b>✓</b> Convenient ordering</span>
            </div>
          </div>
          <div className="bl-hero-visual">
            {settings.storefrontImageUrl ? (
              <img src={settings.storefrontImageUrl.startsWith("http") ? settings.storefrontImageUrl : `${API_URL}${settings.storefrontImageUrl}`} alt="Blestima cold room storefront" fetchPriority="high" decoding="async" />
            ) : (
              <div className="bl-hero-placeholder" aria-label="Blestima frozen foods">BL<span>ESTIMA</span><small>COLDROOM & FROZEN FOODS</small></div>
            )}
            <div className="bl-hero-visual-badge"><span aria-hidden="true">❄</span><div><strong>Freshly selected</strong><small>From our cold room to you</small></div></div>
          </div>
        </div>
      </section>
      <div className="bl-value-strip" aria-label="Our commitment">
        <div><span aria-hidden="true">❄</span><p><strong>Quality frozen foods</strong><small>Carefully handled products</small></p></div>
        <div><span aria-hidden="true">◈</span><p><strong>For every kitchen</strong><small>Homes, restaurants & businesses</small></p></div>
        <div><span aria-hidden="true">↗</span><p><strong>Simple ordering</strong><small>Choose your items, then checkout</small></p></div>
      </div>
      <section className="bl-story-section">
        <div className="bl-story-inner">
          <div><span className="bl-section-kicker">GET TO KNOW US</span><h2>Good food starts with <em>great care.</em></h2></div>
          <div><p>{settings.aboutText || "Blestima ColdRoom & Frozen Foods is your trusted source for quality frozen foods, offering fresh, affordable, and hygienically handled products for homes, restaurants, and businesses."}</p>
          {settings.address && <p className="bl-story-address"><HiMapPin aria-hidden="true" /> {settings.address}</p>}</div>
        </div>
      </section>
      {settings.bannerUrl && (
        <section className="bl-promo-section" aria-label="Special offers">
          <div className="bl-section-heading"><span className="bl-section-kicker">JUST FOR YOU</span><h2>Special offers</h2></div>
          <img src={settings.bannerUrl.startsWith("http") ? settings.bannerUrl : `${API_URL}${settings.bannerUrl}`} alt="Current Blestima promotional offer" loading="lazy" decoding="async" />
        </section>
      )}
      {/* PRODUCTS */}

      <section
        id="products"
        className="bl-featured-section p-6"
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
  Fresh picks for you
</h2>

<div
  className="
    max-w-xl
    mx-auto
    mb-8
  "
>

</div>

        <div className="bl-carousel-toolbar">
          <div><span className="bl-carousel-eyebrow">THE BLESTIMA SELECTION</span><p>Browse our featured frozen foods</p></div>
          <div className="bl-carousel-controls">
            <button type="button" aria-label="Previous products" onClick={() => featuredTrackRef.current?.scrollBy({left: -featuredTrackRef.current.clientWidth, behavior: "smooth"})}>‹</button>
            <button type="button" aria-label="Next products" onClick={() => featuredTrackRef.current?.scrollBy({left: featuredTrackRef.current.clientWidth, behavior: "smooth"})}>›</button>
          </div>
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
      onClick={() => {
        setSelectedCategory(cat);
        featuredTrackRef.current?.scrollTo({left: 0, behavior: "smooth"});
      }}
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

<div ref={featuredTrackRef} className="bl-featured-track" role="region" aria-label="Featured products" tabIndex={0}>
         
         {featuredProducts.map((product) => (
        
        <div
              key={product.id}
             onClick={() => {
  setSelectedProduct(product);
  setSelectedImage(0);
}}
        
 className="
    bl-product-card
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

          <div className="bl-product-image overflow-hidden relative">

 <img
  src={
  currentImages[product.id] === 1 &&
  product.imageUrl2
    ? product.imageUrl2.startsWith("http")
      ? product.imageUrl2
      : `${API_URL}${product.imageUrl2}`
    : product.imageUrl
      ? product.imageUrl.startsWith("http")
        ? product.imageUrl
        : `${API_URL}${product.imageUrl}`
      : undefined
}
  onError={() =>
    console.log(
      "BROKEN:",
      product.id,
      product.name
    )
  }
  alt={product.name}
  loading="lazy"
  decoding="async"
  width="600"
  height="600"
  className="
    w-full
    aspect-square
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
  bl-product-body
  p-1
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
    View all products →
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
      <section className="bl-why-section" aria-labelledby="bl-why-title">
        <div className="bl-lower-container">
          <div className="bl-lower-heading">
            <span className="bl-lower-eyebrow">THE BLESTIMA PROMISE</span>
            <h2 id="bl-why-title">Good food. Great service. <em>Every time.</em></h2>
            <p>Thoughtful service and carefully handled frozen foods for everyday cooking.</p>
          </div>
          <div className="bl-benefits-grid">
            <article className="bl-benefit"><span className="bl-benefit-icon" aria-hidden="true">❄</span><span className="bl-benefit-num">01 / QUALITY</span><h3>Quality frozen foods</h3><p>Carefully selected and hygienically handled products for your kitchen.</p></article>
            <article className="bl-benefit"><span className="bl-benefit-icon" aria-hidden="true">₦</span><span className="bl-benefit-num">02 / VALUE</span><h3>Fair, transparent prices</h3><p>Clear product pricing and a selection to suit different shopping needs.</p></article>
            <article className="bl-benefit"><span className="bl-benefit-icon" aria-hidden="true">↗</span><span className="bl-benefit-num">03 / CONVENIENCE</span><h3>Easy ordering</h3><p>Browse our products, add what you need to your cart, and check out with ease.</p></article>
          </div>
        </div>
      </section>

      {/* DELIVERY / SHOPPING CTA */}
      <section className="bl-lower-showcase">
      <section className="bl-delivery-section" aria-labelledby="bl-delivery-title">
        <div className="bl-delivery-inner">
          <div className="bl-delivery-copy">
            <span className="bl-lower-eyebrow">SHOP WITH CONFIDENCE</span>
            <h2 id="bl-delivery-title">Your favourites, <em>one easy order away.</em></h2>
            <p>From fish and seafood to chicken and more, find the frozen foods you need in one place.</p>
            <Link to="/catalog" className="bl-delivery-link">Browse the full catalog <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="bl-delivery-image">
            <img src="/images/blestima-delivery-banner.webp" alt="Blestima frozen foods delivery illustration" loading="lazy" width="800" height="610" />
          </div>
        </div>
      </section>

{/* TESTIMONIALS */}
<section className="bl-testimonials" aria-labelledby="bl-reviews-title">
  <div className="bl-reviews-container">
    <header className="bl-reviews-heading">
      <span className="bl-reviews-eyebrow">CUSTOMER STORIES</span>
      <h2 id="bl-reviews-title">Kind words from <em>our customers.</em></h2>
      <p>Hear what shoppers have shared about their Blestima experience.</p>
    </header>
    <div className="bl-reviews-grid">
      {[
        {quote: "Fresh products and excellent customer service. Delivery was fast and reliable.", name: "Adetomiwa Oluwadamilola"},
        {quote: "The fish and chicken were fresh and neatly packaged. Highly recommended.", name: "Febisara O."},
        {quote: "Affordable prices and great quality. I will definitely order again.", name: "Progress Ifeanyi"},
      ].map((review, index) => (
        <article className="bl-review-card" key={review.name}>
          <div className="bl-review-top"><span className="bl-review-quote-mark" aria-hidden="true">“</span><span className="bl-review-number">0{index + 1} / 03</span></div>
          <blockquote>{review.quote}</blockquote>
          <div className="bl-review-author"><span className="bl-review-avatar" aria-hidden="true">{review.name.charAt(0)}</span><span className="bl-review-author-text"><strong>{review.name}</strong><small>Customer feedback</small></span></div>
        </article>
      ))}
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
    selectedImage === 1 && selectedProduct.imageUrl2
      ? selectedProduct.imageUrl2.includes("supabase.co")
        ? selectedProduct.imageUrl2
        : `${import.meta.env.VITE_API_URL}${selectedProduct.imageUrl2}`
      : selectedProduct.imageUrl
        ? selectedProduct.imageUrl.includes("supabase.co")
          ? selectedProduct.imageUrl
          : `${import.meta.env.VITE_API_URL}${selectedProduct.imageUrl}`
        : undefined
  }
  alt={selectedProduct.name}
  className="
    w-full
    h-56
    md:h-80
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
<footer className="bl-footer">
  <div className="bl-footer-inner">
    <div className="bl-footer-brand">
      <span className="bl-footer-kicker">BLESTIMA COLDROOM</span>
      <h2>Fresh choices.<br/><em>Better everyday meals.</em></h2>
      <p>Blestima ColdRoom &amp; Frozen Foods — quality frozen foods for homes, restaurants, and businesses.</p>
      <Link to="/catalog" className="bl-footer-shop">Explore our products <span aria-hidden="true">↗</span></Link>
    </div>
    <div className="bl-footer-column">
      <h3>Explore</h3>
      <a href="#products">Featured products</a>
      <Link to="/catalog">Full catalog</Link>
      <a href="#bl-why-title">Why Blestima</a>
    </div>
    <div className="bl-footer-column">
      <h3>Get in touch</h3>
      {settings.whatsappNumber && <a href={`https://wa.me/${settings.whatsappNumber.replace(/\\D/g, "")}`} target="_blank" rel="noopener noreferrer">WhatsApp us ↗</a>}
      {settings.whatsappNumber && <a href={`tel:+${settings.whatsappNumber.replace(/\\D/g, "")}`}>Call +{settings.whatsappNumber}</a>}
      {settings.address && <p>{settings.address}</p>}
    </div>
    <div className="bl-footer-column">
      <h3>Follow Blestima</h3>
      <div className="bl-footer-social">
        {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>}
        {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>}
        {settings.tiktok && <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>}
      </div>
      <p>Stay connected for product updates and special offers.</p>
    </div>
  </div>
  <div className="bl-footer-bottom"><span>© {new Date().getFullYear()} Blestima ColdRoom &amp; Frozen Foods. All rights reserved.</span><span>Freshness delivered with care.</span></div>
</footer>

    </div>

  );
}

export default Home;


