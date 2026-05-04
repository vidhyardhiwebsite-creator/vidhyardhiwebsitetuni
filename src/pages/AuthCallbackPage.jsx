import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useCartStore } from "../store/cartStore"
import { useWishlistStore } from "../store/wishlistStore"
import { isAdmin } from "../components/AdminRoute"
import toast from "react-hot-toast"

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { mergeLocalCart, loadCart } = useCartStore()
  const { loadWishlist } = useWishlistStore()

  useEffect(() => {
    const handle = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        toast.error("Authentication failed")
        navigate("/login")
        return
      } 
      const user = session.user
      await mergeLocalCart(user.id)
      await loadCart(user.id)
      await loadWishlist(user.id)
      toast.success(`Welcome, ${user.user_metadata?.full_name || user.email}!`)
      if (isAdmin(user)) {
        navigate("/admin")
      } else {
        navigate("/")
      }
    }
    handle()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}
