import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
 
console.log("ADMIN COMPONENT STARTED");

const navigate =
  useNavigate();

  const [products, setProducts] = useState([]);

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
  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */
const token =
  localStorage.getItem(
    "adminToken"
  );

if (!token) {

  navigate("/login");

  return;
}

  useEffect(() => {
    loadProducts();
    loadSettings();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RESET FORM
  |--------------------------------------------------------------------------
  */

  function resetForm() {

  setEditingId(null);

  setName("");

  setDescription("");

  setPrice("");

  setImageUrl("");

  setImageFile(null);

  setImageFile2(null);

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
    <div className="min-h-screen bg-gray-100 p-6">

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

      {/* BUSINESS SETTINGS */}

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

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setBannerFile(
                e.target.files[0]
              )
            }
            className="border p-3 rounded-lg"
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
        <h2 className="text-2xl font-bold mb-4">

          {editingId
            ? "Edit Product"
            : "Add Product"}

        </h2>

        <div className="grid gap-4">

          <input
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
    product.imageUrl ||
    "https://via.placeholder.com/400"
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