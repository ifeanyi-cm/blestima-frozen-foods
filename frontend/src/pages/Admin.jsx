import "../blestimaRefresh.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const productFormRef = useRef(null);
  const productNameRef = useRef(null);
 
console.log("ADMIN COMPONENT STARTED");

const navigate =
  useNavigate();

  const [products, setProducts] = useState([]);\n
// SPECIAL OFFERS
const [specialOffers, setSpecialOffers] = useState([]);
const [offerEditingId, setOfferEditingId] = useState(null);
const [offerTitle, setOfferTitle] = useState("");
const [offerDescription, setOfferDescription] = useState("");
const [offerMessage, setOfferMessage] = useState("");
const [offerStartAt, setOfferStartAt] = useState("");
const [offerEndAt, setOfferEndAt] = useState("");
const [offerStatus, setOfferStatus] = useState("draft");
const [offerBanner, setOfferBanner] = useState(null);
const [offerItems, setOfferItems] = useState([]);
const [offerSaving, setOfferSaving] = useState(false);


const [analytics, setAnalytics] = useState(null);
const [analyticsRange, setAnalyticsRange] = useState("7daysAgo");
const [analyticsLoading, setAnalyticsLoading] = useState(false);

const [analyticsBreakdowns, setAnalyticsBreakdowns] =
  useState(null);

  const [editingId, setEditingId] =
    useState(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

const [category, setCategory] =
  useState("");

const [stockStatus, setStockStatus] =
  useState("In Stock");

  const [price, setPrice] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

const [imageFile2, setImageFile2] =
  useState(null);

  // BUSINESS SETTINGS

  const [businessName, setBusinessName] =
    useState("");

  const [whatsappNumber, setWhatsappNumber] =
    useState("");

  const [address, setAddress] =
    useState("");

const [facebook, setFacebook] =
  useState("");

const [instagram, setInstagram] =
  useState("");

const [tiktok, setTiktok] =
  useState("");

  const [logoFile, setLogoFile] =
    useState(null);

  const [bannerFile, setBannerFile] =
    useState(null);

const [aboutText, setAboutText] =
  useState("");

const [
  storefrontFile,
  setStorefrontFile
] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD PRODUCTS
  |--------------------------------------------------------------------------
  */

  async function loadProducts() {
    try {
     const token =
  localStorage.getItem("adminToken");

const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/products`,
  {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  }
);
      const data =
        await res.json();

      setProducts(
        data.products || []
      );
    } catch (error) {
      console.error(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LOAD SETTINGS
  |--------------------------------------------------------------------------
  */

  async function loadSettings() {
    try {
      const token =
 localStorage.getItem("adminToken")

const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/settings`,
  {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data =
        await res.json();

console.log("SETTINGS DATA:", data);
      if (data.success) {
        setBusinessName(
          data.settings.businessName || ""
        );

        setWhatsappNumber(
          data.settings.whatsappNumber || ""
        );

        setAddress(
          data.settings.address || ""
        );
      
setAboutText(
  data.settings.aboutText || ""
);

setFacebook(
  data.settings.facebook || ""
);

setInstagram(
  data.settings.instagram || ""
);

setTiktok(
  data.settings.tiktok || ""
);

      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadAnalytics(range = analyticsRange) {
    try {
      setAnalyticsLoading(true);

      const token =
        localStorage.getItem("adminToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/analytics/overview?startDate=${range}&endDate=today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setAnalytics(data.overview);
      } else {
        console.error(
          "Analytics error:",
          data
        );
      }
    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function loadAnalyticsBreakdowns(
    range = analyticsRange
  ) {
    try {
      const token =
        localStorage.getItem("adminToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/analytics/breakdowns?startDate=${range}&endDate=today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      if (data.success) {

        console.log("ANALYTICS BREAKDOWNS:", data);

        setAnalyticsBreakdowns(data);
      } else {
        console.error(
          "Analytics breakdowns error:",
          data
        );
      }
    } catch (error) {
      console.error(
        "Failed to load analytics breakdowns:",
        error
      );
    }
  }

  async function saveSettings() {
  try {

    const formData =
      new FormData();

    formData.append(
      "businessName",
      businessName
    );

    formData.append(
      "whatsappNumber",
      whatsappNumber
    );

    formData.append(
      "address",
      address
    );

formData.append(
  "facebook",
  facebook
);

formData.append(
  "instagram",
  instagram
);

formData.append(
  "tiktok",
  tiktok
);

    formData.append(
      "aboutText",
      aboutText
    );

    if (logoFile) {

      formData.append(
        "logo",
        logoFile
      );

    }

    if (bannerFile) {

      formData.append(
        "banner",
        bannerFile
      );

    }

    if (storefrontFile) {

      formData.append(
        "storefrontImage",
        storefrontFile
      );

    }

   const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/settings`,
  {
    method: "PUT",

    headers: {
      Authorization:
        `Bearer ${token}`,
    },

    body: formData,
  }
);

    const data =
      await res.json();

    if (data.success) {

      alert(
        "Settings saved successfully"
      );

      loadSettings();

    }

  } catch (error) {

    console.error(error);

  }
}
async function loadSpecialOffers() {
  try {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/special-offers/admin`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) setSpecialOffers(data.offers || []);
  } catch (error) { console.error("Failed to load special offers", error); }
}
function resetSpecialOfferForm() {
  setOfferEditingId(null); setOfferTitle(""); setOfferDescription(""); setOfferMessage("");
  setOfferStartAt(""); setOfferEndAt(""); setOfferStatus("draft"); setOfferBanner(null); setOfferItems([]);
}
function toggleOfferProduct(product) {
  setOfferItems((current) => current.some((item) => item.productId === product.id)
    ? current.filter((item) => item.productId !== product.id)
    : [...current, { productId: product.id, offerPrice: "", isActive: true }]);
}
function changeOfferItem(productId, field, value) {
  setOfferItems((current) => current.map((item) => item.productId === productId ? { ...item, [field]: value } : item));
}
function editSpecialOffer(offer) {
  setOfferEditingId(offer.id); setOfferTitle(offer.title || ""); setOfferDescription(offer.description || "");
  setOfferMessage(offer.message || "");
  setOfferStartAt(offer.startAt ? new Date(offer.startAt).toISOString().slice(0,16) : "");
  setOfferEndAt(offer.endAt ? new Date(offer.endAt).toISOString().slice(0,16) : "");
  setOfferStatus(offer.status || "draft"); setOfferBanner(null);
  setOfferItems((offer.items || []).map((item) => ({ productId: item.productId, offerPrice: item.offerPrice || "", isActive: item.isActive !== false })));
  document.getElementById("bl-admin-special-offers")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
async function saveSpecialOffer() {
  if (!offerTitle.trim() || !offerStartAt || !offerEndAt || !offerItems.length) { alert("Please enter the offer title, dates, and select at least one product."); return; }
  if (new Date(offerEndAt) <= new Date(offerStartAt)) { alert("The offer end date must be after the start date."); return; }
  setOfferSaving(true);
  try {
    const token = localStorage.getItem("adminToken"); const fd = new FormData();
    fd.append("title", offerTitle.trim()); fd.append("description", offerDescription); fd.append("message", offerMessage);
    fd.append("startAt", new Date(offerStartAt).toISOString()); fd.append("endAt", new Date(offerEndAt).toISOString());
    fd.append("status", offerStatus); fd.append("items", JSON.stringify(offerItems)); if (offerBanner) fd.append("banner", offerBanner);
    const endpoint = offerEditingId ? `${import.meta.env.VITE_API_URL}/api/special-offers/${offerEditingId}` : `${import.meta.env.VITE_API_URL}/api/special-offers`;
    const res = await fetch(endpoint, { method: offerEditingId ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (!res.ok || !data.success) { alert(data.message || "Could not save the special offer."); return; }
    alert(offerEditingId ? "Special offer updated." : "Special offer created."); resetSpecialOfferForm(); loadSpecialOffers();
  } catch (error) { console.error(error); alert("An error occurred while saving the special offer."); }
  finally { setOfferSaving(false); }
}
async function changeSpecialOfferStatus(offer, status) {
  try {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/special-offers/${offer.id}/status`, {
      method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }),
    });
    const data = await res.json(); if (!res.ok || !data.success) { alert(data.message || "Could not update offer status."); return; }
    loadSpecialOffers();
  } catch (error) { console.error(error); alert("Failed to update offer status."); }
}
\n  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */
const token =
  localStorage.getItem("adminToken");

useEffect(() => {

  if (!token) {
    navigate("/login");
    return;
  }

  loadProducts();
  loadSettings();
  loadAnalytics();
  loadAnalyticsBreakdowns();

}, [navigate, token]);

  
  /*
  |--------------------------------------------------------------------------
  | RESET FORM
  |--------------------------------------------------------------------------
  */

  function resetForm() {

  setEditingId(null);
  setCategory("");
  setStockStatus("In Stock");

  setName("");

  setDescription("");

  setPrice("");

  setImageUrl("");

  setImageFile(null);

  setImageFile2(null);

  }

  function openNewProductForm() {
    resetForm();
    productFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => productNameRef.current?.focus(), 350);
  }

  /*
  |--------------------------------------------------------------------------
  | ADD / UPDATE PRODUCT
  |--------------------------------------------------------------------------
  */

  async function addProduct() {
    if (
      !name ||
      !description ||
      !price
    ) {
      alert(
        "Please fill all required fields"
      );
      return;
    }

    try {
      const formData =
        new FormData();

      formData.append(
        "name",
        name
      );

      formData.append(
        "description",
        description
      );

formData.append(
  "category",
  category
);

formData.append(
  "stockStatus",
  stockStatus
);

      formData.append(
        "price",
        price
      );

      formData.append(
        "imageUrl",
        imageUrl
      );

      if (imageFile) {
        formData.append(
          "image",
          imageFile
        );
      }

if (imageFile2) {

  formData.append(
    "image2",
    imageFile2
  );

}

      const endpoint = editingId
  ? `${import.meta.env.VITE_API_URL}/api/products/${editingId}`
  : `${import.meta.env.VITE_API_URL}/api/products`;
      const method =
        editingId
          ? "PUT"
          : "POST";

      const token =
  localStorage.getItem("adminToken")

const res = await fetch(
  endpoint,
  {
    method,

    headers: {
      Authorization:
        `Bearer ${token}`,
    },

    body: formData,
  }
);

      const data =
        await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || data.error || "Could not save the product. Please try again.");
        return;
      }
      if (data.success) {
        alert(
          editingId
            ? "Product updated successfully"
            : "Product added successfully"
        );

        resetForm();
        loadProducts();
      }
    } catch (error) {
      console.error(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | EDIT PRODUCT
  |--------------------------------------------------------------------------
  */

  function editProduct(product) {
    setEditingId(
      product.id
    );

    setName(
      product.name
    );

    setDescription(
      product.description
    );

    setPrice(
      product.price
    );

    setImageUrl(
      product.imageUrl || ""
    );

    productFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE PRODUCT
  |--------------------------------------------------------------------------
  */

  async function deleteProduct(id) {
    if (
      !window.confirm(
        "Delete this product?"
      )
    ) {
      return;
    }

    try {
      const token =
  localStorage.getItem("adminToken")

const res =
  await fetch(
    `${import.meta.env.VITE_API_URL}/api/products/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

      const data =
        await res.json();

      if (data.success) {
        loadProducts();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="blestima-admin min-h-screen bg-gray-100 p-6">

      <div
  className="
    flex
    justify-between
    items-center
    mb-8
  "
>

  <h1
   className=" 
  text-2xl
  md:text-4xl
  font-bold
"
  >
    Admin Dashboard
  </h1>

  <button
    onClick={() => {

      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminUsername"
      );

      navigate("/login");

    }}
    className="
  bg-red-600
  text-white
  px-3
  py-1.5
  md:px-4
  md:py-2
  rounded-lg
  text-sm
  md:text-base
"
  >
    Logout
  </button>

</div>

<div className="mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-2xl p-5 shadow-sm border border-green-100">
  <div>
    <h2 className="font-bold text-lg text-green-950">Product management</h2>
    <p className="text-sm text-gray-600">Create a brand-new product or edit an existing one below.</p>
  </div>
  <button type="button" onClick={openNewProductForm} className="bl-admin-create-action">＋ Create New Product</button>
</div>

{/* ORDERS */}

<div
  className="
    bg-white
    p-6
    rounded-2xl
    shadow-lg
    mb-10
  "
>

  <div
    className="
      flex
      flex-col
      md:flex-row
      md:items-center
      md:justify-between
      gap-4
    "
  >

    <div>

      <h2 className="text-2xl font-bold">
        Customer Orders
      </h2>

      <p className="text-gray-600 mt-1">
        View and manage customer orders.
      </p>

    </div>

    <button
      onClick={() => navigate("/orders")}
      className="
        bg-blue-600
        text-white
        px-5
        py-3
        rounded-lg
        font-bold
        hover:bg-blue-700
      "
    >
      Manage Orders
    </button>

  </div>

</div>

{/* ANALYTICS */}

<div
  className="
    bg-white
    p-6
    rounded-2xl
    shadow-lg
    mb-10
  "
>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

    <div>
      <h2 className="text-2xl font-bold">
        Analytics
      </h2>

      <p className="text-gray-600 mt-1">
        Monitor customer activity and website performance.
      </p>
    </div>

    <select
      value={analyticsRange}
      onChange={(e) => {
        setAnalyticsRange(e.target.value);
        loadAnalytics(e.target.value);
      }}
      className="border p-3 rounded-lg"
    >
      <option value="today">
        Today
      </option>

      <option value="7daysAgo">
        Last 7 Days
      </option>

      <option value="30daysAgo">
        Last 30 Days
      </option>

      <option value="monthStart">
        This Month
      </option>
    </select>

  </div>

  {analyticsLoading ? (
    <p className="text-gray-600">
      Loading analytics...
    </p>
  ) : analytics ? (

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-600">
          Active Users
        </p>
        <p className="text-2xl font-bold mt-1">
          {analytics.activeUsers}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-600">
          New Users
        </p>
        <p className="text-2xl font-bold mt-1">
          {analytics.newUsers}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-600">
          Sessions
        </p>
        <p className="text-2xl font-bold mt-1">
          {analytics.sessions}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-600">
          Page Views
        </p>
        <p className="text-2xl font-bold mt-1">
          {analytics.pageViews}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-600">
          Add to Cart
        </p>
        <p className="text-2xl font-bold mt-1">
          {analytics.addToCart}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-600">
          Checkout Starts
        </p>
        <p className="text-2xl font-bold mt-1">
          {analytics.checkoutStarts}
        </p>
      </div>

    </div>

  ) : (
    <p className="text-gray-600">
      Analytics data is not available.
    </p>
  )}

</div>

  {analyticsBreakdowns && (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

      {/* VISITOR LOCATIONS */}

      <div className="bg-gray-50 p-5 rounded-xl">

        <h3 className="text-lg font-bold mb-4">
          🌍 Visitor Locations
        </h3>

        {analyticsBreakdowns.countries?.length > 0 ? (
          <div className="space-y-3">

            {analyticsBreakdowns.countries.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center"
                >

                  <span className="text-gray-700">
                    {item.country}
                  </span>

                  <span className="font-bold">
                    {item.activeUsers}
                  </span>

                </div>
              )
            )}

          </div>
        ) : (
          <p className="text-gray-500">
            No visitor location data.
          </p>
        )}

      </div>


      {/* DEVICE BREAKDOWN */}

      <div className="bg-gray-50 p-5 rounded-xl">

        <h3 className="text-lg font-bold mb-4">
          💻 Device Breakdown
        </h3>

        {analyticsBreakdowns.devices?.length > 0 ? (
          <div className="space-y-3">

            {analyticsBreakdowns.devices.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center"
                >

                  <span className="text-gray-700 capitalize">
                    {item.device}
                  </span>

                  <span className="font-bold">
                    {item.activeUsers}
                  </span>

                </div>
              )
            )}

          </div>
        ) : (
          <p className="text-gray-500">
            No device data.
          </p>
        )}

      </div>


      {/* TRAFFIC SOURCES */}

      <div className="bg-gray-50 p-5 rounded-xl">

        <h3 className="text-lg font-bold mb-4">
          🔗 Traffic Sources
        </h3>

        {analyticsBreakdowns.trafficSources?.length > 0 ? (
          <div className="space-y-3">

            {analyticsBreakdowns.trafficSources.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center"
                >

                  <span className="text-gray-700">
                    {item.source}
                  </span>

                  <span className="font-bold">
                    {item.sessions}
                  </span>

                </div>
              )
            )}

          </div>
        ) : (
          <p className="text-gray-500">
            No traffic source data.
          </p>
        )}

      </div>

    </div>
  )}

{/* SPECIAL OFFERS */}
<section id="bl-admin-special-offers" className="bg-white p-5 md:p-6 rounded-2xl shadow-lg mb-10">
<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5"><div><h2 className="text-2xl font-bold">Special Offers</h2><p className="text-gray-600 mt-1">Create promotions with selected products, offer prices, dates, and banners.</p></div><button type="button" onClick={resetSpecialOfferForm} className="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold">＋ New Offer</button></div>
<div className="border rounded-xl p-4 mb-6 grid gap-4"><h3 className="text-lg font-bold">{offerEditingId ? "Edit Special Offer" : "Create Special Offer"}</h3>
<input value={offerTitle} onChange={(e)=>setOfferTitle(e.target.value)} placeholder="Offer title" className="border rounded-lg p-3"/>
<textarea value={offerDescription} onChange={(e)=>setOfferDescription(e.target.value)} placeholder="Offer description" rows={3} className="border rounded-lg p-3"/>
<textarea value={offerMessage} onChange={(e)=>setOfferMessage(e.target.value)} placeholder="Optional promotional message" rows={2} className="border rounded-lg p-3"/>
<div className="grid md:grid-cols-2 gap-3"><label className="grid gap-1 text-sm font-medium">Starts<input type="datetime-local" value={offerStartAt} onChange={(e)=>setOfferStartAt(e.target.value)} className="border rounded-lg p-3"/></label><label className="grid gap-1 text-sm font-medium">Ends<input type="datetime-local" value={offerEndAt} onChange={(e)=>setOfferEndAt(e.target.value)} className="border rounded-lg p-3"/></label></div>
<label className="grid gap-1 text-sm font-medium">Banner image (JPEG, PNG, WebP; max 10 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>setOfferBanner(e.target.files?.[0]||null)} className="border rounded-lg p-3"/></label>
{offerBanner && <p className="text-sm text-gray-500">Selected: {offerBanner.name}</p>}
<label className="grid gap-1 text-sm font-medium">Status<select value={offerStatus} onChange={(e)=>setOfferStatus(e.target.value)} className="border rounded-lg p-3"><option value="draft">Draft</option><option value="active">Active</option></select></label>
<div><h4 className="font-semibold mb-2">Select products and optional offer prices</h4><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{products.filter(p=>p.isActive&&p.stockStatus==="In Stock").map(product=>{const selected=offerItems.find(item=>item.productId===product.id);return <div key={product.id} className="border rounded-lg p-3 grid gap-2"><label className="flex items-center gap-2 font-medium"><input type="checkbox" checked={!!selected} onChange={()=>toggleOfferProduct(product)}/>{product.name}</label><p className="text-sm text-gray-500">Regular price: ₦{product.price}</p>{selected&&<input value={selected.offerPrice} onChange={(e)=>changeOfferItem(product.id,"offerPrice",e.target.value)} placeholder="Offer price (optional)" className="border rounded p-2 text-sm"/>}</div>})}</div>{offerItems.length>0&&<p className="mt-2 text-sm text-green-700">{offerItems.length} selected product(s).</p>}</div>
<div className="flex flex-wrap gap-2"><button type="button" disabled={offerSaving} onClick={saveSpecialOffer} className="bg-green-600 disabled:opacity-50 text-white rounded-lg px-5 py-3 font-bold">{offerSaving?"Saving...":offerEditingId?"Update Offer":"Save Offer"}</button>{offerEditingId&&<button type="button" onClick={resetSpecialOfferForm} className="border rounded-lg px-4 py-3">Cancel Edit</button>}</div></div>
<div className="grid md:grid-cols-2 gap-4">{specialOffers.map(offer=><article key={offer.id} className="border rounded-xl p-4">{offer.bannerUrl&&<img src={offer.bannerUrl} alt={offer.title} className="w-full max-h-52 object-cover rounded-lg mb-3"/>}<div className="flex justify-between gap-2 items-start"><h3 className="font-bold text-lg">{offer.title}</h3><span className="text-xs uppercase font-semibold border rounded px-2 py-1">{offer.status}</span></div>{offer.description&&<p className="text-sm text-gray-600 mt-2">{offer.description}</p>}<p className="text-xs text-gray-500 mt-2">{new Date(offer.startAt).toLocaleString()} — {new Date(offer.endAt).toLocaleString()}</p><p className="text-sm mt-2">{offer.items?.length||0} product(s)</p><div className="flex flex-wrap gap-2 mt-3"><button type="button" onClick={()=>editSpecialOffer(offer)} className="bg-blue-600 text-white rounded px-3 py-2 text-sm">Edit</button>{offer.status==="active"?<button type="button" onClick={()=>changeSpecialOfferStatus(offer,"paused")} className="bg-amber-500 text-white rounded px-3 py-2 text-sm">Pause</button>:<button type="button" onClick={()=>changeSpecialOfferStatus(offer,"active")} className="bg-green-600 text-white rounded px-3 py-2 text-sm">Activate</button>}{offer.status!=="draft"&&<button type="button" onClick={()=>changeSpecialOfferStatus(offer,"draft")} className="border rounded px-3 py-2 text-sm">Set Draft</button>}</div></article>)}{specialOffers.length===0&&<p className="text-gray-500">No special offers created yet.</p>}</div></section>
\n      {/* BUSINESS SETTINGS */}

      <div
  className="
    bg-white
    p-6
    rounded-2xl
    shadow-lg
    mb-10

    -mx-6
    md:mx-0
  "
>

        <h2 className="text-lg font-bold mb-4">
          Business Settings
        </h2>

        <div className="grid gap-4">

          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) =>
              setBusinessName(
                e.target.value
              )
            }
            className="
  border
  p-3
  rounded-lg
  w-full
  text-sm
  md:text-base
"
          />

          <input
            type="text"
            placeholder="WhatsApp Number"
            value={whatsappNumber}
            onChange={(e) =>
              setWhatsappNumber(
                e.target.value
              )
            }
            className="
  border
  p-3
  rounded-lg
  w-full
  text-sm
  md:text-base
"
          />

<input
  type="text"
  placeholder="Facebook URL"
  value={facebook}
  onChange={(e) =>
    setFacebook(
      e.target.value
    )
  }
  className="
  border
  p-3
  rounded-lg
  w-full
  text-sm
  md:text-base
"
/>

<input
  type="text"
  placeholder="Instagram URL"
  value={instagram}
  onChange={(e) =>
    setInstagram(
      e.target.value
    )
  }
  className="
  border
  p-3
  rounded-lg
  w-full
  text-sm
  md:text-base
"
/>

<input
  type="text"
  placeholder="TikTok URL"
  value={tiktok}
  onChange={(e) =>
    setTiktok(
      e.target.value
    )
  }
  className="
  border
  p-3
  rounded-lg
  w-full
  text-sm
  md:text-base
"
/>

          <input
            type="text"
            placeholder="Business Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            className="
  border
  p-3
  rounded-lg
  w-full
  text-sm
  md:text-base
"
          />

<textarea
  placeholder="About Us"
  value={aboutText}
  onChange={(e) =>
    setAboutText(
      e.target.value
    )
  }
  rows="5"
  className="
    border
    p-3
    rounded-lg
    w-full
  "
/>

<div className="flex flex-col gap-2">

  <label className="font-semibold">
    Store Frontage Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setStorefrontFile(
        e.target.files[0]
      )
    }
    className="
      border
      p-3
      rounded-lg
    "
  />

</div>

          <label className="font-semibold">
            Upload Logo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setLogoFile(
                e.target.files[0]
              )
            }
            className="border p-3 rounded-lg"
          />

          <label className="font-semibold">
            Upload Banner
          </label>

       <label className="font-semibold">
  Upload Banner
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setBannerFile(
      e.target.files[0]
    )
  }
  className="border p-3 md:p-2 md:h-10 rounded-lg"


          />

          <button
            onClick={saveSettings}
            className="bg-green-600 text-white py-3 rounded-lg font-bold"
          >
            Save Settings
          </button>

        </div>

      </div>

      {/* PRODUCT FORM */}

      <div ref={productFormRef} id="bl-admin-product-form"
  className="
    bg-white
    p-6
    rounded-2xl
    shadow-lg
    mb-10

    -mx-6
    md:mx-0
  "

>
        <h2 className="text-2xl font-bold mb-4">

          {editingId
            ? "Edit Product"
            : "Create New Product"}

        </h2>

        <p className="bl-admin-form-note">Enter a product name, description, category, stock status, price and an optional image. The product will be added to your existing catalog.</p>
        <div className="grid gap-4">

          <input
            ref={productNameRef}
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          />

<input
  type="text"
  placeholder="Category (Fish, Chicken, Meat, Sausage, Gizzard, Turkey, Seafood...)"
  value={category}
  onChange={(e) =>
    setCategory(e.target.value)
  }
  className="border p-3 rounded-lg"
/>

<select
  value={stockStatus}
  onChange={(e) =>
    setStockStatus(
      e.target.value
    )
  }
  className="border p-3 rounded-lg"
>

  <option value="In Stock">
    🟢 In Stock
  </option>

  <option value="Out of Stock">
    🔴 Out of Stock
  </option>

</select>


          <input
  type="text"
  placeholder="Price / Package Size"
  value={price}
  onChange={(e) =>
    setPrice(e.target.value)
  }
  className="border p-3 rounded-lg"
/>

          <input
            type="text"
            placeholder="Image URL (Optional)"
            value={imageUrl}
            onChange={(e) =>
              setImageUrl(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                e.target.files[0]
              )
            }
            className="border p-3 rounded-lg"
          />

 <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile2(
                e.target.files[0]
              )
            }
            className="border p-3 rounded-lg"
          />
          
<div className="flex gap-3"></div>

          {editingId && <button type="button" onClick={openNewProductForm} className="bl-admin-cancel">Cancel editing / Create new product</button>}
          <button
            onClick={addProduct}
            className="bg-green-600 text-white py-3 rounded-lg font-bold"
          >
            {editingId
              ? "Update Product"
              : "Add Product"}
          </button>

        </div>

      </div>

      {/* PRODUCTS */}

      <div
  className="
    grid
    grid-cols-2
    lg:grid-cols-4
    gap-1
    md:gap-4
  "
>

        {products.map((product) => (

          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >

           <img
  src={
    product.imageUrl
      ? product.imageUrl.includes("supabase.co")
        ? product.imageUrl
        : `${import.meta.env.VITE_API_URL}${product.imageUrl}`
      : undefined
  }
  alt={product.name}
  className="
    w-full
    h-75
    md:h-40
    object-cover
  "
/>

            <div className="p-2">

              <h3 className="text-bg md:text-xl font-bold">
                {product.name}
              </h3>

              <p className="text-gray-600 text-xs my-1">
                {product.description}
              </p>

              <p  className="text-green-700 font-semi-bold text-bg">
                ₦{product.price}
              </p>

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() =>
                    editProduct(product)
                  }
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(
                      product.id
                    )
                  }
                  className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Admin;