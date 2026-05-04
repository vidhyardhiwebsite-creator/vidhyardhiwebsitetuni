import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, ChevronUp, CheckCircle, Truck, Package, Clock } from "lucide-react"
import { useAdminStore } from "../../store/adminStore"
import { formatINR, formatDate } from "../../utils/format"
import { supabase } from "../../lib/supabase"
import toast from "react-hot-toast"

const ORDER_FLOW = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
]

const PAYMENT_STATUSES = ["all", "paid", "pending", "failed"]

function StatusStepper({ orderId, currentStatus, onUpdate }) {
  const [updating, setUpdating] = useState(false)
  const steps = ORDER_FLOW
  const currentIdx = steps.findIndex(s => s.key === currentStatus)

  const advance = async () => {
    const nextIdx = currentIdx + 1
    if (nextIdx >= steps.length) return
    const nextStep = steps[nextIdx]
    setUpdating(true)
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: nextStep.key })
        .eq("id", orderId)
      if (error) throw error
      onUpdate(orderId, nextStep.key)
      toast.success("Status updated to " + nextStep.label)
    } catch (e) {
      toast.error(e.message || "Update failed")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => {
          const done = idx < currentIdx
          const active = idx === currentIdx
          const Icon = step.icon
          return (
            <div key={step.key} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                active ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]" :
                done ? "bg-green-500/10 border-green-500/30 text-green-400" :
                "bg-[#222] border-[#333] text-gray-600"
              }`}>
                <Icon size={12} />
                {step.label}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-6 h-px ${done ? "bg-green-500/40" : "bg-[#333]"}`} />
              )}
            </div>
          )
        })}
      </div>
      {currentIdx < steps.length - 1 && (
        <button
          onClick={advance}
          disabled={updating}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black text-xs font-semibold rounded-lg hover:bg-[#F0D060] transition-all disabled:opacity-60"
        >
          {updating && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
          Mark as {steps[currentIdx + 1]?.label} →
        </button>
      )}
      {currentIdx === steps.length - 1 && (
        <p className="text-green-400 text-xs font-medium">✓ Order fully delivered</p>
      )}
    </div>
  )
}

export default function AdminOrders() {
  const { orders, loadOrders } = useAdminStore()
  const [localOrders, setLocalOrders] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { loadOrders() }, [])
  useEffect(() => { setLocalOrders(orders) }, [orders])

  const handleStatusUpdate = (orderId, newStatus) => {
    setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o))
  }

  const filtered = localOrders.filter(o => {
    const matchStatus = statusFilter === "all" || o.payment_status === statusFilter
    const matchSearch = !search || String(o.id).toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const getAddress = (order) => {
    try {
      if (typeof order.address === "object" && order.address) return order.address
      return JSON.parse(order.address)
    } catch { return {} }
  }

  const getStatusInfo = (o) => {
    if (o.payment_status === "pending") return { label: "Pending Payment", color: "bg-yellow-500/20 text-yellow-400" }
    if (o.payment_status === "failed") return { label: "Payment Failed", color: "bg-red-500/20 text-red-400" }
    if (o.order_status === "cancelled") return { label: "Cancelled – Refund Pending", color: "bg-red-500/20 text-red-400" }
    const status = o.order_status || "confirmed"
    const map = {
      confirmed: { label: "Order Confirmed", color: "bg-blue-500/20 text-blue-400" },
      shipping: { label: "Shipping", color: "bg-orange-500/20 text-orange-400" },
      delivered: { label: "Delivered", color: "bg-green-500/20 text-green-400" },
    }
    return map[status] || { label: status, color: "bg-gray-500/20 text-gray-400" }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{localOrders.length} total orders</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID..."
            className="w-full bg-[#111] border border-[#D4AF37]/20 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {PAYMENT_STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-[#D4AF37] text-black" : "bg-[#111] text-gray-400 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", count: localOrders.length, color: "text-white" },
          { label: "Paid", count: localOrders.filter(o => o.payment_status === "paid").length, color: "text-green-400" },
          { label: "Shipping", count: localOrders.filter(o => o.order_status === "shipping").length, color: "text-yellow-400" },
          { label: "Delivered", count: localOrders.filter(o => o.order_status === "delivered").length, color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#111] border border-[#D4AF37]/10 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders found</div>
        ) : filtered.map(order => {
          const addr = getAddress(order)
          const isExpanded = expanded === order.id
          const statusInfo = getStatusInfo(order)
          return (
            <div key={order.id} className="bg-[#111] border border-[#D4AF37]/10 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : order.id)}>
                <div>
                  <p className="text-white text-sm font-mono">#{String(order.id).slice(-8).toUpperCase()}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[#D4AF37] font-semibold text-sm hidden sm:block">{formatINR(order.total_amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                  {isExpanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="border-t border-[#D4AF37]/10 p-4 space-y-4">
                      {order.payment_status === "paid" && order.order_status !== "cancelled" && (
                        <div className="bg-[#1A1A1A] rounded-xl p-4">
                          <p className="text-gray-400 text-xs font-medium mb-3">Update Delivery Status</p>
                          <StatusStepper
                            orderId={order.id}
                            currentStatus={order.order_status || "confirmed"}
                            onUpdate={handleStatusUpdate}
                          />
                        </div>
                      )}
                      {order.order_status === "cancelled" && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                          <p className="text-red-400 text-sm font-medium mb-1">Order Cancelled by Customer</p>
                          <p className="text-gray-400 text-xs mb-3">
                            Refund status: <span className={order.refund_status === "refunded" ? "text-green-400" : "text-yellow-400"}>
                              {order.refund_status === "refunded" ? "Refunded" : "Pending"}
                            </span>
                          </p>
                          {order.refund_status !== "refunded" && (
                            <button
                              onClick={async () => {
                                const { error } = await supabase.from("orders").update({ refund_status: "refunded" }).eq("id", order.id)
                                if (!error) {
                                  handleStatusUpdate(order.id, "cancelled")
                                  setLocalOrders(prev => prev.map(o => o.id === order.id ? { ...o, refund_status: "refunded" } : o))
                                  toast.success("Marked as refunded")
                                }
                              }}
                              className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 text-xs rounded-lg hover:bg-green-500/30 transition-all"
                            >
                              ✓ Mark Refund as Processed
                            </button>
                          )}
                          {order.refund_status === "refunded" && (
                            <p className="text-green-400 text-xs">✓ Refund has been processed</p>
                          )}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs font-medium mb-2">Order Items</p>
                          <div className="space-y-2">
                            {order.order_items?.map(item => (
                              <div key={item.id} className="flex items-center gap-3 bg-[#1A1A1A] rounded-lg p-2">
                                {item.products?.images?.[0] && (
                                  <img src={item.products.images[0]} alt={item.products?.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => { if(e.target.src !== "https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80") e.target.src="https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80" }} />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-xs truncate">{item.products?.name || "Product"}</p>
                                  <p className="text-gray-500 text-xs">Qty: {item.quantity} x {formatINR(item.price)}</p>
                                </div>
                                <p className="text-[#D4AF37] text-xs">{formatINR(item.quantity * item.price)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        {addr.full_name && (
                          <div className="bg-[#1A1A1A] rounded-lg p-3">
                            <p className="text-gray-400 text-xs font-medium mb-1">Delivery Address</p>
                            <p className="text-white text-xs">{addr.full_name}</p>
                            <p className="text-gray-400 text-xs">{addr.phone}</p>
                            <p className="text-gray-400 text-xs">{addr.address1}{addr.address2 ? ", " + addr.address2 : ""}</p>
                            <p className="text-gray-400 text-xs">{addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
