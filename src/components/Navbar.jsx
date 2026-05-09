import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, ChevronDown, Package, Settings } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { CATEGORIES } from "../data/products"
import logoImg from "../assets/image.png"
import toast from "react-hot-toast"

const ADMIN_EMAIL = "nashejewels@gmail.com"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [catOpen, setCatOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const { user, signOut } = useAuthStore()
  const cartCount = useCartStore(s => s.getCount())
  const navigate = useNavigate()
  const userRef = useRef(null)
  const isAdmin = user?.email === ADMIN_EMAIL || user?.user_metadata?.role === "admin"

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success("Signed out successfully")
    navigate("/")
    setUserOpen(false)
    setMenuOpen(false)
  }

  const closeAll = () => { setMenuOpen(false); setUserOpen(false) }

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeAll}>
            <img src={logoImg} alt="NaShe Jewels" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-xl font-bold hidden sm:block" style={{ fontFamily: "Georgia, serif", color: "#D4AF37", letterSpacing: "0.05em" }}>
              NaShe
            </span>
            <span className="text-xs text-gray-400 hidden sm:block tracking-widest uppercase">Jewels</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-[#D4AF37] text-sm transition-colors">Home</Link>
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1 text-gray-300 hover:text-[#D4AF37] text-sm transition-colors">
                Categories <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-[#111] border border-[#D4AF37]/20 rounded-lg shadow-xl py-2">
                    {CATEGORIES.map(cat => (
                      <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                        onClick={() => setCatOpen(false)}>
                        {cat}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/products" className="text-gray-300 hover:text-[#D4AF37] text-sm transition-colors">All Jewelry</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-300 hover:text-[#D4AF37] transition-colors p-1">
              <Search size={20} />
            </button>
            <Link to={user ? "/wishlist" : "/login"} className="text-gray-300 hover:text-[#D4AF37] transition-colors p-1">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="relative text-gray-300 hover:text-[#D4AF37] transition-colors p-1">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User - tap to toggle on mobile */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(o => !o)}
                  className="flex items-center gap-1 text-gray-300 hover:text-[#D4AF37] transition-colors p-1"
                >
                  {user.user_metadata?.avatar_url
                    ? <img src={user.user_metadata.avatar_url} alt="avatar" className="w-7 h-7 rounded-full object-cover" onError={e => { if(e.target.src !== "https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80") e.target.src="https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80" }} />
                    : <User size={20} />
                  }
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-[#D4AF37]/20 rounded-xl shadow-2xl py-2 z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-2 border-b border-[#D4AF37]/10 mb-1">
                        <p className="text-white text-xs font-medium truncate">{user.user_metadata?.full_name || user.user_metadata?.name || "User"}</p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                        <User size={14} /> Profile
                      </Link>
                      <Link to="/orders" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                        <Package size={14} /> My Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                        <Heart size={14} /> Wishlist
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors font-medium">
                          <Settings size={14} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-[#D4AF37]/10 mt-1 pt-1">
                        <button onClick={handleSignOut}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-red-400/10 w-full transition-colors">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="text-sm px-3 py-1.5 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-black transition-all">
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button className="lg:hidden text-gray-300 hover:text-[#D4AF37] p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search jewelry..."
                  className="flex-1 bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]" />
                <button type="submit" className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg text-sm font-medium hover:bg-[#F0D060] transition-colors">
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-[#D4AF37]/10 py-4">
              <div className="flex flex-col gap-1">
                <Link to="/" className="text-gray-300 hover:text-[#D4AF37] text-sm py-2 px-1" onClick={closeAll}>Home</Link>
                <Link to="/products" className="text-gray-300 hover:text-[#D4AF37] text-sm py-2 px-1" onClick={closeAll}>All Jewelry</Link>

                {/* Categories */}
                <p className="text-gray-600 text-xs uppercase tracking-wider px-1 mt-2 mb-1">Categories</p>
                {CATEGORIES.map(cat => (
                  <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-gray-400 hover:text-[#D4AF37] text-sm py-1.5 pl-3" onClick={closeAll}>
                    {cat}
                  </Link>
                ))}

                {/* User links in mobile menu */}
                {user && (
                  <>
                    <div className="border-t border-[#D4AF37]/10 mt-3 pt-3">
                      <p className="text-gray-600 text-xs uppercase tracking-wider px-1 mb-1">Account</p>
                      <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] text-sm py-2 px-1" onClick={closeAll}>
                        <User size={15} /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] text-sm py-2 px-1" onClick={closeAll}>
                        <Package size={15} /> My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] text-sm py-2 px-1" onClick={closeAll}>
                        <Heart size={15} /> Wishlist
                      </Link>
                      <button onClick={handleSignOut} className="flex items-center gap-2 text-red-400 text-sm py-2 px-1 w-full">
                        <LogOut size={15} /> Sign Out
                      </button>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 text-[#D4AF37] text-sm py-2 px-1 font-medium" onClick={closeAll}>
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
