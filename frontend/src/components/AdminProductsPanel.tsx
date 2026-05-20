import { useState, useRef, useCallback } from "react"
import type { Product } from "../types"
import api from "../lib/api"

interface Props {
  products:         Product[]
  onRefresh:        () => void
  openAddModal?:    boolean
  onCloseAddModal?: () => void
}

const PRESET_CATEGORIES = [
  "Hot Coffee", "Cold Brew", "Frappe", "Tea",
  "Pastry", "Food", "Other",
]

interface ProductForm {
  name:         string
  category:     string
  customCat:    string
  price:        string
  status:       "available" | "unavailable"
  description:  string
  image_path:   string
  imageFile:    File | null
  imagePreview: string
}

const EMPTY_FORM: ProductForm = {
  name: "", category: "Hot Coffee", customCat: "",
  price: "", status: "available",
  description: "", image_path: "",
  imageFile: null, imagePreview: "",
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload  = () => res((reader.result as string).split(",")[1])
    reader.onerror = rej
    reader.readAsDataURL(file)
  })
}

export default function AdminProductsPanel({ products, onRefresh, openAddModal, onCloseAddModal }: Props) {
  const [search,      setSearch]      = useState("")
  const [showModal,   setShowModal]   = useState(openAddModal ?? false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form,        setForm]        = useState<ProductForm>(EMPTY_FORM)
  const [loading,     setLoading]     = useState(false)
  const [flash,       setFlash]       = useState("")
  const [filterCat,   setFilterCat]   = useState("All")
  const [deleting,    setDeleting]    = useState<string | null>(null)
  const [dragOver,    setDragOver]    = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const finalCategory = form.category === "Other" ? form.customCat.trim() : form.category

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true) }

  const openEdit = (p: Product) => {
    const isPreset = PRESET_CATEGORIES.slice(0, -1).includes(p.category)
    setEditProduct(p)
    setForm({
      name: p.name, category: isPreset ? p.category : "Other",
      customCat: isPreset ? "" : p.category, price: String(p.price),
      status: p.status, description: p.description || "",
      image_path: p.image_path || "", imageFile: null,
      imagePreview: p.image_path || "",
    })
    setShowModal(true)
  }

  const closeModal = () => {
    if (form.imagePreview && form.imageFile) URL.revokeObjectURL(form.imagePreview)
    setShowModal(false); setEditProduct(null); setForm(EMPTY_FORM); onCloseAddModal?.()
  }

  const setField = <K extends keyof ProductForm>(k: K, v: ProductForm[K]) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { setFlash("Please select an image file (JPG, PNG, WebP)."); return }
    if (file.size > 5 * 1024 * 1024) { setFlash("Image must be smaller than 5 MB."); return }
    if (form.imagePreview && form.imageFile) URL.revokeObjectURL(form.imagePreview)
    const preview = URL.createObjectURL(file)
    setForm(prev => ({ ...prev, imageFile: file, imagePreview: preview, image_path: "" }))
    setFlash("")
  }, [form.imagePreview, form.imageFile])

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageFile(file)
    e.target.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleImageFile(file)
  }

  const removeImage = () => {
    if (form.imagePreview && form.imageFile) URL.revokeObjectURL(form.imagePreview)
    setForm(prev => ({ ...prev, imageFile: null, imagePreview: "", image_path: "" }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setFlash("Product name is required."); return }
    if (!form.price) { setFlash("Price is required."); return }
    if (form.category === "Other" && !form.customCat.trim()) { setFlash("Please type the category name."); return }
    setLoading(true); setFlash("")
    try {
      let imagePath = form.image_path
      if (form.imageFile) {
        const base64 = await fileToBase64(form.imageFile)
        const { data: uploadData } = await api.post("/api/products/upload-image", {
          base64, filename: form.imageFile.name, mimeType: form.imageFile.type,
        })
        imagePath = uploadData.url
      }
      const payload = {
        name: form.name.trim(), category: finalCategory,
        price: Number(form.price), status: form.status,
        description: form.description.trim(), image_path: imagePath,
      }
      if (editProduct) {
        await api.put("/api/products/" + editProduct.id, payload)
      } else {
        await api.post("/api/products", payload)
      }
      closeModal(); onRefresh()
    } catch (err: any) {
      setFlash(err.response?.data?.message || "Failed to save product.")
    } finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    setDeleting(id)
    try { await api.delete("/api/products/" + id); onRefresh() }
    catch { alert("Failed to delete product.") }
    finally { setDeleting(null) }
  }

  const toggleStatus = async (p: Product) => {
    try { await api.put("/api/products/" + p.id, { status: p.status === "available" ? "unavailable" : "available" }); onRefresh() }
    catch { alert("Failed to update status.") }
  }

  const cats = ["All", ...Array.from(new Set(products.map(p => p.category))).sort()]
  const filtered = products.filter(p => {
    const matchCat = filterCat === "All" || p.category === filterCat
    const matchQ   = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchQ
  })
  const isFlashOk = flash.includes("success") || flash.includes("added") || flash.includes("updated")
  const previewSrc = form.imagePreview || form.image_path

  return (
    <>
      {flash && (
        <div className={"admin-flash " + (isFlashOk ? "ok" : "err")}>
          <i className={"fas fa-" + (isFlashOk ? "circle-check" : "circle-exclamation")} />
          {flash}
          <button onClick={() => setFlash("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", opacity: 0.6, fontSize: "0.85rem" }}>x</button>
        </div>
      )}

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2>Products <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 400 }}>({filtered.length})</span></h2>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <select className="admin-input" style={{ padding: "0.38rem 0.7rem", fontSize: "0.78rem", width: "auto" }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="admin-search">
              <i className="fas fa-magnifying-glass" />
              <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={openAdd}><i className="fas fa-plus" /> Add Product</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty"><i className="fas fa-mug-hot" /><p>No products found.</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{i + 1}</td>
                    <td>
                      <div className="inventory-product-cell">
                        {p.image_path
                          ? <img src={p.image_path} alt={p.name} className="inventory-thumb" />
                          : <div className="inventory-thumb-ph"><i className="fas fa-mug-hot" style={{ color: "#d1d5db" }} /></div>}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{p.name}</div>
                          {p.description && <div style={{ fontSize: "0.7rem", color: "#9ca3af", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: "0.78rem", color: "#4f46e5", fontWeight: 600 }}>{p.category}</span></td>
                    <td style={{ fontWeight: 700, fontSize: "0.9rem" }}>P{Number(p.price).toFixed(2)}</td>
                    <td>
                      <button onClick={() => toggleStatus(p)} className={"badge " + (p.status === "available" ? "badge-available" : "badge-unavailable")} style={{ border: "none", cursor: "pointer", fontFamily: "var(--sans)" }}>{p.status}</button>
                    </td>
                    <td style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{p.date_added?.slice(0, 10)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button className="btn-secondary" onClick={() => openEdit(p)} style={{ padding: "0.3rem 0.7rem" }}><i className="fas fa-pen" /></button>
                        <button className="btn-danger" onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ padding: "0.3rem 0.7rem" }}>
                          {deleting === p.id ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-trash" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="admin-modal" style={{ maxWidth: 560 }}>
            <div className="admin-modal-header">
              <h3>{editProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="admin-modal-close" onClick={closeModal}><i className="fas fa-times" /></button>
            </div>

            <div className="admin-modal-body" style={{ maxHeight: "72vh", overflowY: "auto" }}>

              {/* IMAGE UPLOAD — top of form for visibility */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="admin-label" style={{ marginBottom: "0.5rem", display: "block" }}>Product Image</label>

                {previewSrc ? (
                  <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                    <img src={previewSrc} alt="Preview"
                      style={{ width: "100%", height: 170, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb", display: "block" }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
                    <button onClick={removeImage} style={{
                      position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%",
                      background: "rgba(220,38,38,0.9)", border: "none", color: "#fff",
                      cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center",
                    }} title="Remove image"><i className="fas fa-times" /></button>
                    {form.imageFile && (
                      <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: 4, maxWidth: "80%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <i className="fas fa-file-image" style={{ marginRight: 4 }} />{form.imageFile.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: "100%", height: 140, border: "2px dashed " + (dragOver ? "#4f46e5" : "#d1d5db"),
                      borderRadius: 8, background: dragOver ? "#eef2ff" : "#f9fafb",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s", gap: "0.4rem", marginBottom: "0.75rem",
                    }}
                  >
                    <i className="fas fa-cloud-arrow-up" style={{ fontSize: "2rem", color: dragOver ? "#4f46e5" : "#9ca3af" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: dragOver ? "#4f46e5" : "#374151" }}>Click to upload or drag and drop</span>
                    <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>JPG, PNG, WebP — max 5 MB</span>
                  </div>
                )}

                <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={onFileInput} style={{ display: "none" }} />

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ fontSize: "0.78rem", padding: "0.4rem 0.85rem" }}>
                    <i className="fas fa-folder-open" style={{ marginRight: 6 }} />{previewSrc ? "Change Image" : "Choose from Files"}
                  </button>
                  <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>or paste a URL:</span>
                  <input className="admin-input" style={{ flex: 1, minWidth: 160, fontSize: "0.78rem", padding: "0.4rem 0.7rem" }}
                    placeholder="https://..."
                    value={form.image_path}
                    onChange={e => {
                      const val = e.target.value
                      if (val && form.imageFile) {
                        URL.revokeObjectURL(form.imagePreview)
                        setForm(prev => ({ ...prev, imageFile: null, imagePreview: "", image_path: val }))
                      } else {
                        setField("image_path", val)
                      }
                    }} />
                </div>
                <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "0.35rem" }}>
                  <i className="fas fa-circle-info" style={{ marginRight: 4, color: "#6366f1" }} />
                  Upload from your computer, or paste a link from Unsplash, ImgBB, or Supabase Storage.
                </p>
              </div>

              {/* PRODUCT FIELDS */}
              <div className="admin-form-grid cols-2">
                <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-label">Product Name *</label>
                  <input className="admin-input" placeholder="e.g. Signature Velvet Latte" value={form.name} onChange={e => setField("name", e.target.value)} />
                </div>

                <div className="admin-field">
                  <label className="admin-label">Category *</label>
                  <select className="admin-input" value={form.category} onChange={e => { setField("category", e.target.value); if (e.target.value !== "Other") setField("customCat", "") }}>
                    {PRESET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {form.category === "Other" ? (
                  <div className="admin-field">
                    <label className="admin-label">Custom Category Name *</label>
                    <input className="admin-input" placeholder="e.g. Smoothie, Iced Tea, Cake..." value={form.customCat} onChange={e => setField("customCat", e.target.value)} autoFocus />
                  </div>
                ) : (
                  <div className="admin-field">
                    <label className="admin-label">Price (P) *</label>
                    <input className="admin-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={e => setField("price", e.target.value)} />
                  </div>
                )}

                {form.category === "Other" && (
                  <div className="admin-field">
                    <label className="admin-label">Price (P) *</label>
                    <input className="admin-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={e => setField("price", e.target.value)} />
                  </div>
                )}

                <div className="admin-field" style={form.category !== "Other" ? {} : { gridColumn: "2 / 3" }}>
                  <label className="admin-label">Status</label>
                  <select className="admin-input" value={form.status} onChange={e => setField("status", e.target.value as "available" | "unavailable")}>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-label">Description</label>
                  <textarea className="admin-input" placeholder="Short product description..." value={form.description} onChange={e => setField("description", e.target.value)} rows={2} />
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? <><i className="fas fa-circle-notch fa-spin" /> Saving...</> : <><i className="fas fa-check" /> {editProduct ? "Save Changes" : "Add Product"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
