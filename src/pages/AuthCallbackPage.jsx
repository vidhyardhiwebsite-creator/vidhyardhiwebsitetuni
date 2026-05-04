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
    // Supabase processes the #access_token hash and fires SIGNED_IN
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe()
        const user = session.user
        try {
          await mergeLocalCart(user.id)
          await loadCart(user.id)
          await loadWishlist(user.id)
        } catch {}
        toast.success(`Welcome, ${user.user_metadata?.full_name || user.email}!`)
        if (isAdmin(user)) {
          navigate("/admin", { replace: true })
        } else {
          navigate("/", { replace: true })
        }
      } else if (event === "SIGNED_OUT" || (event !== "SIGNED_IN" && event !== "INITIAL_SESSION")) {
        // Fallback: try getSession in case hash was already consumed
        const { data: { session: s } } = await supabase.auth.getSession()
        if (s) {
          subscription.unsubscribe()
          const user = s.user
          try {
            await mergeLocalCart(user.id)
            await loadCart(user.id)
            await loadWishlist(user.id)
          } catch {}
          toast.success(`Welcome, ${user.user_metadata?.full_name || user.email}!`)
          navigate(isAdmin(user) ? "/admin" : "/", { replace: true })
        } else {
          subscription.unsubscribe()
          toast.error("Authentication failed")
          navigate("/login", { replace: true })
        }
      }
    })

    // Also try immediately in case session is already available
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        const user = session.user
        Promise.all([mergeLocalCart(user.id), loadCart(user.id), loadWishlist(user.id)])
          .catch(() => {})
          .finally(() => {
            toast.success(`Welcome, ${user.user_metadata?.full_name || user.email}!`)
            navigate(isAdmin(user) ? "/admin" : "/", { replace: true })
          })
      }
    })

    return () => subscription.unsubscribe()
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
