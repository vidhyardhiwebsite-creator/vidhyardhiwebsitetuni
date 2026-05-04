import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { useWishlistStore } from "../store/wishlistStore"
import toast from "react-hot-toast"

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuthStore()
  const { mergeLocalCart, loadCart } = useCartStore()
  const { loadWishlist } = useWishlistStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // Redirect handled by Supabase OAuth flow -> /auth/callback
    } catch (err) {
      toast.error(err.message || "Google sign-in failed")
      setGoogleLoading(false)
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Invalid email address"
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters"
    if (!isLogin && !form.name.trim()) errs.name = "Name is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (isLogin) {
        const { user } = await signIn(form.email, form.password)
        await mergeLocalCart(user.id)
        await loadCart(user.id)
        await loadWishlist(user.id)
        toast.success("Welcome back!")
      } else {
        await signUp(form.email, form.password, form.name)
        toast.success("Account created! Please check your email to verify.")
      }
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: "Georgia, serif" }}>✦ NaShe Jewels</h1>
          <p className="text-gray-400 text-sm">{isLogin ? "Welcome back" : "Create your account"}</p>
        </div>

        <div className="bg-[#111] border border-[#D4AF37]/20 rounded-2xl p-8">
          {/* Google Sign In - Primary */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-5"
          >
            {googleLoading
              ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              : <GoogleIcon />
            }
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#D4AF37]/15" />
            <span className="text-gray-600 text-xs">or use email</span>
            <div className="flex-1 h-px bg-[#D4AF37]/15" />
          </div>

          {/* Toggle */}
          <div className="flex bg-[#1A1A1A] rounded-lg p-1 mb-5">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"}`}>Sign In</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"}`}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
                    className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com"
                  className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters"
                  className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg pl-9 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
