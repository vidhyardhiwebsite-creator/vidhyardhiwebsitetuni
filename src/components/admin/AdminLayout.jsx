import { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Users, Bell, Menu, X, LogOut, ChevronRight, AlertTriangle, Store, Image } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { useAdminStore } from "../../store/adminStore"
import toast from "react-hot-toast"

const NAV = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { path: "/admin/banners", label: "Banners", icon: Image },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/users", label: "Users", icon: Users },
]

function Sidebar({ pathname, onSignOut }) {
  return (
    <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
      className="flex-shrink-0 bg-[#0D0D0D] border-r border-[#D4AF37]/10 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-[#D4AF37]/10">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[#D4AF37] font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>NaShe</span>
          <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ path, label, icon: Icon }) => {
          const active = pathname === path || (path !== "/admin" && pathname.startsWith(path))
          return (
            <Link key={path} to={path} className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all " + (active ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20" : "text-gray-400 hover:text-white hover:bg-white/5")}>
              <Icon size={17} /><span>{label}</span>{active && <ChevronRight size={13} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-[#D4AF37]/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"><Store size={17} /> View Store</Link>
        <button onClick={onSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"><LogOut size={17} /> Sign Out</button>
      </div>
    </motion.aside>
  )
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const { pathname } = useLocation()
  const { signOut, user } = useAuthStore()
  const { notifications, clearNotification } = useAdminStore()
  const navigate = useNavigate()
  const notifRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler) }
  }, [])

  const handleSignOut = async () => { await signOut(); toast.success("Signed out"); navigate("/") }

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      <AnimatePresence initial={false}>
        {sidebarOpen && <Sidebar pathname={pathname} onSignOut={handleSignOut} />}
      </AnimatePresence>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-[#0D0D0D] border-b border-[#D4AF37]/10 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="text-gray-400 hover:text-white p-1 transition-colors"><Menu size={20} /></button>
            <span className="text-gray-500 text-sm hidden sm:block">{NAV.find(n => pathname === n.path || (n.path !== "/admin" && pathname.startsWith(n.path)))?.label || "Admin"}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(o => !o)} className="relative text-gray-400 hover:text-white p-1 transition-colors">
                <Bell size={18} />
                {notifications.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notifications.length > 9 ? "9+" : notifications.length}</span>}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-[#111] border border-[#D4AF37]/20 rounded-xl shadow-2xl z-[100] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#D4AF37]/10">
                      <span className="text-white text-sm font-medium">Notifications</span>
                      <button onClick={() => setNotifOpen(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0
                        ? <p className="text-gray-500 text-xs text-center py-6">No notifications</p>
                        : notifications.map(n => (
                          <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 border-b border-white/5">
                            <AlertTriangle size={14} className={n.type === "warning" ? "text-yellow-400 mt-0.5" : "text-[#D4AF37] mt-0.5"} />
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-300 text-xs">{n.msg}</p>
                              <p className="text-gray-600 text-xs mt-0.5">{new Date(n.time).toLocaleTimeString()}</p>
                            </div>
                            <button onClick={() => clearNotification(n.id)} className="text-gray-600 hover:text-gray-400"><X size={12} /></button>
                          </div>
                        ))
                      }
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] text-xs font-bold">A</span>
              </div>
              <span className="text-gray-400 text-xs hidden sm:block">{user?.email?.split("@")[0]}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
