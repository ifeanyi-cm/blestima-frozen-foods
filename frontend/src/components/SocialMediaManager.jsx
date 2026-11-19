import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function SocialMediaManager() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [caption, setCaption] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API}/api/products`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Could not load products.");
        const data = await response.json();
        const list = data.products || [];
        setProducts(list);
        if (list.length) setSelectedProductId(String(list[0].id));
      } catch (error) {
        setProductError(error.message || "Failed to load products.");
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const selectedProduct = products.find(
    (product) => String(product.id) === selectedProductId
  );

  return (
    <section className="social-manager" style={{ marginTop: 28, padding: 22, border: "1px solid #e5e7eb", borderRadius: 14, background: "#fff" }}>
      <header style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 6px" }}>Social Media Manager</h2>
        <p style={{ margin: 0, color: "#6b7280" }}>Create and prepare product promotions for your social channels.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        <div>
          <label htmlFor="social-product" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Choose a product</label>
          {loadingProducts ? (
            <p>Loading products…</p>
          ) : productError ? (
            <p role="alert" style={{ color: "#b91c1c" }}>{productError}</p>
          ) : (
            <select id="social-product" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
          )}

          {selectedProduct && (
            <div style={{ marginTop: 16, padding: 14, background: "#f9fafb", borderRadius: 10 }}>
              {selectedProduct.imageUrl ? <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 8 }} /> : <div style={{ height: 150, display: "grid", placeItems: "center", color: "#6b7280" }}>No product image available</div>}
              <h3 style={{ margin: "12px 0 6px" }}>{selectedProduct.name}</h3>
              <p style={{ margin: 0 }}>{selectedProduct.description || "No product description."}</p>
              <p style={{ margin: "8px 0 0", fontWeight: 600 }}>₦{Number(selectedProduct.price || 0).toLocaleString("en-NG")}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="social-caption" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Post caption</label>
          <textarea id="social-caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Your promotional caption will appear here. You can also edit it manually." rows={8} style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", resize: "vertical" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            <button type="button" disabled style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db" }}>Generate AI caption (coming next)</button>
            <button type="button" disabled style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db" }}>Create flyer (coming next)</button>
          </div>
          <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#fff7ed", color: "#9a3412" }}>
            Publishing is not enabled yet. We will connect real Facebook publishing and verify the result before enabling this button.
          </div>
          <button type="button" disabled style={{ marginTop: 12, padding: "10px 16px", borderRadius: 8 }}>Publish post (not connected)</button>
        </div>
      </div>
    </section>
  );
}
