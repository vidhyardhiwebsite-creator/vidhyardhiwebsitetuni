import { useEffect, useState } from "react"
import { Users, ShoppingBag, DollarSign, Search } from "lucide-react"
import { useAdminStore } from "../../store/adminStore"
import { formatINR, formatDate } from "../../utils/format"

export default function AdminUsers() {
  const { orders, loadOrders } = useAdminStore()
  const [search, setSearch] = useState("")

  useEffect(() => { loadOrders() }, [])

  // Aggregate user data from real orders
  const userMap = {}
  orders.forEach(o => {
    const key = o.user_id || "unknown"
    let addrObj = {}
    try { addrObj = typeof o.address === "string" ? JSON.parse(o.address) : (o.address || {}) } catch {}
    const name = addrObj.full_name || "Customer"
    if (!userMap[key]) {
      userMap[key] = { userId: key, name, orders: 0, totalSpent: 0, lastOrder: null }
    }
    userMap[key].orders += 1
    if (o.payment_status === "paid") userMap[key].totalSpent += o.total_amount || 0
    if (!userMap[key].lastOrder || new Date(o.created_at) > new Date(userMap[key].lastOrder)) {
      userMap[key].lastOrder = o.created_at
    }
  })

  const users = Object.values(userMap)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.userId.includes(search))

  const totalRevenue = users.reduce((s, u) => s + u.totalSpent, 0)
  const paidCount = orders.filter(o => o.payment_status === "paid").length
  const avgOrderValue = paidCount ? Math.round(totalRevenue / paidCount) : 0

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>Users</h1>
        <p className="text-gray-500 text-sm mt-1">Customer activity from real orders</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111] border border-[#D4AF37]/10 rounded-xl p-5">
          <Users size={18} className="text-[#D4AF37] mb-3" />
          <p className="text-2xl font-bold text-white">{users.length}</p>
          <p className="text-gray-500 text-xs mt-1">Total Customers</p>
        </div>
        <div className="bg-[#111] border border-[#D4AF37]/10 rounded-xl p-5">
          <DollarSign size={18} className="text-green-400 mb-3" />
          <p className="text-2xl font-bold text-white">{formatINR(totalRevenue)}</p>
          <p className="text-gray-500 text-xs mt-1">Total Revenue</p>
        </div>
        <div className="bg-[#111] border border-[#D4AF37]/10 rounded-xl p-5">
          <ShoppingBag size={18} className="text-blue-400 mb-3" />
          <p className="text-2xl font-bold text-white">{formatINR(avgOrderValue)}</p>
          <p className="text-gray-500 text-xs mt-1">Avg Order Value</p>
        </div>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or user ID..."
          className="w-full bg-[#111] border border-[#D4AF37]/20 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
      </div>

      <div className="bg-[#111] border border-[#D4AF37]/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#D4AF37]/10">
              <tr>{["Customer","Orders","Total Spent","Avg Order","Last Order","Tier"].map(h => (
                <th key={h} className="text-left text-gray-500 text-xs px-4 py-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/5">
              {users.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-500 py-10 text-sm">No orders yet</td></tr>
              ) : users.map(u => {
                const tier = u.totalSpent >= 20000 ? "Gold" : u.totalSpent >= 8000 ? "Silver" : "Bronze"
                const tierColor = tier === "Gold" ? "text-[#D4AF37] bg-[#D4AF37]/10" : tier === "Silver" ? "text-gray-300 bg-gray-500/10" : "text-orange-400 bg-orange-500/10"
                return (
                  <tr key={u.userId} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37]/15 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[#D4AF37] text-xs font-bold">{u.name[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-white text-xs">{u.name}</p>
                          <p className="text-gray-600 text-xs">ID: {u.userId.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{u.orders}</td>
                    <td className="px-4 py-3 text-[#D4AF37] text-xs font-medium">{formatINR(u.totalSpent)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatINR(u.orders ? Math.round(u.totalSpent / u.orders) : 0)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.lastOrder ? formatDate(u.lastOrder) : "—"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tierColor}`}>{tier}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
