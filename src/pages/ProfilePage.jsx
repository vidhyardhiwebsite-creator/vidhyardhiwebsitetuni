import { useState, useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { useNavigate } from "react-router-dom"
import { User, Mail, LogOut, MapPin, Plus, Edit2, Trash2, Star, X, Check } from "lucide-react"
import { fetchAddresses, saveAddress, updateAddress, deleteAddress, setDefaultAddress } from "../services/addressService"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

const EMPTY_ADDR = { label: "Home", full_name: "", phone: "", address1: "", address2: "", city: "", state: "", pincode: "", is_default: false }

function AddressForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_ADDR)
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

  return (
    <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-2">
          {["Home","Work","Other"].map(l => (
            <button key={l} type="button" onClick={() => setForm(f => ({ ...f, label: l }))}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${form.label === l ? "bg-[#D4AF37] text-black" : "bg-[#222] text-gray-400 border border-[#D4AF37]/20"}`}>
              {l}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
          <input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} className="accent-[#D4AF37]" />
          Set as default
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Full Name *</label>
          <input value={form.full_name||""} onChange={e=>setForm(f=>({...f,full_name:e.target.value}))} placeholder="Your name" className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
          {errors.full_name && <p className="text-red-400 text-xs mt-0.5">{errors.full_name}</p>}
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Phone *</label>
          <input value={form.phone||""} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="10-digit number" className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
          {errors.phone && <p className="text-red-400 text-xs mt-0.5">{errors.phone}</p>}
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Address Line 1 *</label>
          <input value={form.address1||""} onChange={e=>setForm(f=>({...f,address1:e.target.value}))} placeholder="House/Flat, Street" className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
          {errors.address1 && <p className="text-red-400 text-xs mt-0.5">{errors.address1}</p>}
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Address Line 2</label>
          <input value={form.address2||""} onChange={e=>setForm(f=>({...f,address2:e.target.value}))} placeholder="Landmark (optional)" className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">City *</label>
          <input value={form.city||""} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="City" className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
          {errors.city && <p className="text-red-400 text-xs mt-0.5">{errors.city}</p>}
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">State *</label>
          <input value={form.state||""} onChange={e=>setForm(f=>({...f,state:e.target.value}))} placeholder="State" className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
          {errors.state && <p className="text-red-400 text-xs mt-0.5">{errors.state}</p>}
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">PIN Code *</label>
          <input value={form.pincode||""} onChange={e=>setForm(f=>({...f,pincode:e.target.value}))} placeholder="6-digit PIN" className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
          {errors.pincode && <p className="text-red-400 text-xs mt-0.5">{errors.pincode}</p>}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 py-2 border border-[#D4AF37]/20 text-gray-400 rounded-lg text-sm">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg text-sm hover:bg-[#F0D060] disabled:opacity-60 flex items-center justify-center gap-1">
          {saving && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
          Save Address
        </button>
      </div>
    </form>
  )
}

export default function ProfilePage() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editAddr, setEditAddr] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) fetchAddresses(user.id).then(setAddresses).catch(() => {})
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    toast.success("Signed out")
    navigate("/")
  }

  const handleSave = async (form) => {
    setSaving(true)
    try {
      if (editAddr) {
        const updated = await updateAddress(editAddr.id, user.id, form)
        setAddresses(a => a.map(x => x.id === editAddr.id ? updated : x))
        toast.success("Address updated")
      } else {
        const newAddr = await saveAddress(user.id, form)
        setAddresses(a => form.is_default ? [newAddr, ...a.map(x => ({ ...x, is_default: false }))] : [...a, newAddr])
        toast.success("Address saved")
      }
      setShowForm(false)
      setEditAddr(null)
    } catch (e) {
      toast.error(e.message || "Failed to save address")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    await deleteAddress(id, user.id)
    setAddresses(a => a.filter(x => x.id !== id))
    toast.success("Address removed")
  }

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id, user.id)
    setAddresses(a => a.map(x => ({ ...x, is_default: x.id === id })))
    toast.success("Default address updated")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-[#1A1A2E]" style={{ fontFamily: "Georgia, serif" }}>My Profile</h1>

      {/* User Info */}
      <div className="bg-[#111] border border-[#D4AF37]/20 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          {user?.user_metadata?.avatar_url
            ? <img src={user.user_metadata.avatar_url} alt="avatar" className="w-16 h-16 rounded-full object-cover" onError={e => { if(e.target.src !== "https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80") e.target.src="https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80" }} />
            : <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center"><User size={28} className="text-[#D4AF37]" /></div>
          }
          <div>
            <p className="text-white font-semibold text-lg">{user?.user_metadata?.full_name || user?.user_metadata?.name || "User"}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/10 transition-all text-sm">
          <LogOut size={15} /> Sign Out
        </button>
      </div>

      {/* Addresses */}
      <div className="bg-[#111] border border-[#D4AF37]/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2"><MapPin size={16} className="text-[#D4AF37]" /> Saved Addresses</h2>
          {!showForm && !editAddr && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F0D060] transition-colors">
              <Plus size={14} /> Add New
            </button>
          )}
        </div>

        <AnimatePresence>
          {(showForm && !editAddr) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4">
              <AddressForm onSave={handleSave} onCancel={() => setShowForm(false)} saving={saving} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {addresses.length === 0 && !showForm && (
            <p className="text-gray-500 text-sm text-center py-4">No saved addresses yet</p>
          )}
          {addresses.map(addr => (
            <div key={addr.id}>
              {editAddr?.id === addr.id ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AddressForm initial={editAddr} onSave={handleSave} onCancel={() => setEditAddr(null)} saving={saving} />
                </motion.div>
              ) : (
                <div className={`border rounded-xl p-4 transition-all ${addr.is_default ? "border-[#D4AF37]/50 bg-[#D4AF37]/5" : "border-[#D4AF37]/10 bg-[#1A1A1A]"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] rounded-full">{addr.label}</span>
                        {addr.is_default && <span className="text-xs px-2 py-0.5 bg-green-500/15 text-green-400 rounded-full flex items-center gap-1"><Check size={10} /> Default</span>}
                      </div>
                      <p className="text-white text-sm font-medium">{addr.full_name} · {addr.phone}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}</p>
                      <p className="text-gray-400 text-xs">{addr.city}, {addr.state} – {addr.pincode}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {!addr.is_default && (
                        <button onClick={() => handleSetDefault(addr.id)} className="text-gray-500 hover:text-[#D4AF37] transition-colors" title="Set as default">
                          <Star size={14} />
                        </button>
                      )}
                      <button onClick={() => setEditAddr(addr)} className="text-gray-500 hover:text-[#D4AF37] transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(addr.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
