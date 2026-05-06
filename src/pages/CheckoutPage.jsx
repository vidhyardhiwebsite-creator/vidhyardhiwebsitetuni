import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { MapPin, Plus, Check, CheckCircle } from "lucide-react"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"
import { saveOrder } from "../services/orderService"
import { fetchAddresses, saveAddress } from "../services/addressService"
import { formatINR } from "../utils/format"
import toast from "react-hot-toast"

const EMPTY_ADDR = { label: "Home", full_name: "", phone: "", address1: "", address2: "", city: "", state: "", pincode: "", is_default: false }

function NewAddressForm({ onSave, onCancel, saving }) {
  const [form, setForm] = useState(EMPTY_ADDR)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = "Required"
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit number"
    if (!form.address1.trim()) e.address1 = "Required"
    if (!form.city.trim()) e.city = "Required"
    if (!form.state.trim()) e.state = "Required"
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = "6-digit PIN"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => { e.preventDefault(); if (validate()) onSave(form) }
  const inp = "w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
  const lbl = "text-xs text-gray-400 mb-1 block"

  return (
    <form onSubmit={handleSubmit} className="border border-[#D4AF37]/20 rounded-xl p-4 bg-[#1A1A1A] space-y-3">
      <div className="flex gap-2 mb-1">
        {["Home","Work","Other"].map(l => (
          <button key={l} type="button" onClick={() => setForm(f => ({ ...f, label: l }))}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${form.label === l ? "bg-[#D4AF37] text-black" : "bg-[#222] text-gray-400 border border-[#D4AF37]/20"}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={lbl}>Full Name *</label>
          <input value={form.full_name} onChange={e=>setForm(f=>({...f,full_name:e.target.value}))} placeholder="Your name" className={inp} />
          {errors.full_name && <p className="text-red-400 text-xs mt-0.5">{errors.full_name}</p>}
        </div>
        <div>
          <label className={lbl}>Phone *</label>
          <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="10-digit number" className={inp} />
          {errors.phone && <p className="text-red-400 text-xs mt-0.5">{errors.phone}</p>}
        </div>
        <div className="col-span-2">
          <label className={lbl}>Address Line 1 *</label>
          <input value={form.address1} onChange={e=>setForm(f=>({...f,address1:e.target.value}))} placeholder="House/Flat, Street" className={inp} />
          {errors.address1 && <p className="text-red-400 text-xs mt-0.5">{errors.address1}</p>}
        </div>
        <div className="col-span-2">
          <label className={lbl}>Address Line 2</label>
          <input value={form.address2} onChange={e=>setForm(f=>({...f,address2:e.target.value}))} placeholder="Landmark (optional)" className={inp} />
        </div>
        <div>
          <label className={lbl}>City *</label>
          <input value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="City" className={inp} />
          {errors.city && <p className="text-red-400 text-xs mt-0.5">{errors.city}</p>}
        </div>
        <div>
          <label className={lbl}>State *</label>
          <input value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} placeholder="State" className={inp} />
          {errors.state && <p className="text-red-400 text-xs mt-0.5">{errors.state}</p>}
        </div>
        <div>
          <label className={lbl}>PIN Code *</label>
          <input value={form.pincode} onChange={e=>setForm(f=>({...f,pincode:e.target.value}))} placeholder="6-digit PIN" className={inp} />
          {errors.pincode && <p className="text-red-400 text-xs mt-0.5">{errors.pincode}</p>}
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
        <input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} className="accent-[#D4AF37]" />
        Save as default address
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2 border border-[#D4AF37]/20 text-gray-400 rounded-lg text-sm">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg text-sm hover:bg-[#F0D060] disabled:opacity-60">
          Save & Use
        </button>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const total = getTotal()
  const grandTotal = total

  const [addresses, setAddresses] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [step, setStep] = useState("address")

  useEffect(() => {
    if (user) {
      fetchAddresses(user.id).then(addrs => {
        setAddresses(addrs)
        const def = addrs.find(a => a.is_default) || addrs[0]
        if (def) setSelectedId(def.id)
        if (addrs.length === 0) setShowNewForm(true)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [user])

  const handleSaveNew = async (form) => {
    setPaying(true)
    try {
      const newAddr = await saveAddress(user.id, form)
      const updated = form.is_default
        ? [newAddr, ...addresses.map(a => ({ ...a, is_default: false }))]
        : [...addresses, newAddr]
      setAddresses(updated)
      setSelectedId(newAddr.id)
      setShowNewForm(false)
      toast.success("Address saved")
    } catch (e) {
      toast.error(e.message || "Failed to save address")
    } finally { setPaying(false) }
  }

  const handlePayment = async () => {
    const addr = addresses.find(a => a.id === selectedId)
    if (!addr) { toast.error("Please select a delivery address"); return }
    setPaying(true)
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!razorpayKey) {
      try {
        await saveOrder({ userId: user.id, items, total: grandTotal, address: addr, paymentId: `pay_demo_${Date.now()}`, orderId: `order_demo_${Date.now()}` })
        await clearCart(user.id)
        setStep("success")
        toast.success("Order placed!")
      } catch { toast.error("Failed to place order") }
      finally { setPaying(false) }
      return
    }
    try {
      const options = {
        key: razorpayKey, amount: grandTotal * 100, currency: "INR",
        name: "NaShe Jewels", description: "Jewelry Purchase",
        handler: async (response) => {
          try {
            await saveOrder({ userId: user.id, items, total: grandTotal, address: addr, paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id })
            await clearCart(user.id)
            setStep("success")
            toast.success("Payment successful!")
          } catch { toast.error("Order save failed") }
        },
        prefill: { name: addr.full_name, contact: addr.phone, email: user.email },
        theme: { color: "#D4AF37" },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch { toast.error("Payment failed") }
    finally { setPaying(false) }
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={80} className="text-green-400 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "Georgia, serif" }}>Order Confirmed!</h2>
        <p className="text-gray-400 mb-8">Your jewelry is being prepared with care.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate("/orders")} className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-all">View Orders</button>
          <button onClick={() => navigate("/")} className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-all">Continue Shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "Georgia, serif" }}>Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2"><MapPin size={16} className="text-[#D4AF37]" /> Delivery Address</h2>
              {!showNewForm && (
                <button onClick={() => setShowNewForm(true)} className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F0D060] transition-colors">
                  <Plus size={13} /> Add New
                </button>
              )}
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 bg-[#1A1A1A] rounded-xl animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {showNewForm && (
                  <NewAddressForm onSave={handleSaveNew} onCancel={() => addresses.length > 0 && setShowNewForm(false)} saving={paying} />
                )}
                {addresses.map(addr => (
                  <div key={addr.id} onClick={() => { setSelectedId(addr.id); setShowNewForm(false) }}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedId === addr.id ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-[#D4AF37]/10 bg-[#1A1A1A] hover:border-[#D4AF37]/30"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] rounded-full">{addr.label}</span>
                          {addr.is_default && <span className="text-xs text-green-400">Default</span>}
                        </div>
                        <p className="text-white text-sm font-medium">{addr.full_name} · {addr.phone}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}</p>
                        <p className="text-gray-400 text-xs">{addr.city}, {addr.state} – {addr.pincode}</p>
                      </div>
                      {selectedId === addr.id && (
                        <div className="w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                          <Check size={12} className="text-black" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-6 h-fit sticky top-20">
          <h2 className="text-white font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map(item => (
              <div key={item.id || item.product_id} className="flex justify-between text-sm">
                <span className="text-gray-400 truncate mr-2">{item.products?.name} × {item.quantity}</span>
                <span className="text-gray-300 shrink-0">{formatINR((item.products?.price || 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#D4AF37]/10 pt-4 space-y-2 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between font-semibold pt-1 border-t border-[#D4AF37]/10">
              <span className="text-white">Total</span>
              <span className="text-[#D4AF37] text-lg">{formatINR(grandTotal)}</span>
            </div>
          </div>
          <button onClick={handlePayment} disabled={paying || !selectedId || items.length === 0}
            className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {paying && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
            Pay {formatINR(grandTotal)}
          </button>
          {!selectedId && <p className="text-yellow-400 text-xs text-center mt-2">Select a delivery address</p>}
          <p className="text-gray-600 text-xs text-center mt-2">🔒 Secured by Razorpay</p>
        </div>
      </div>
    </div>
  )
}
