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
    let done = false

    const finish = async (session) => {
      if (done) return
      done = true
      const user = session.user
      try {
        await Promise.all([
          mergeLocalCart(user.id),
          loadCart(user.id),
          loadWishlist(user.id),
        ])
      } catch {}
      toast.success(`Welcome, ${user.user_metadata?.full_name || user.email}!`)
      navigate(isAdmin(user) ? "/admin" : "/", { replace: true })
    }

    const run = async () => {
      // PKCE flow: exchange code from URL query param
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          toast.error("Sign in failed: " + error.message)
          navigate("/login", { replace: true })
          return
        }
        if (data.session) {
          await finish(data.session)
          return
        }
      }

      // Implicit flow fallback: hash fragment
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await finish(session)
        return
      }

      // Listen for auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
          subscription.unsubscribe()
          await finish(session)
        }
      })

      // Timeout fallback
      setTimeout(() => {
        if (!done) {
          done = true
          toast.error("Sign in timed out. Please try again.")
          navigate("/login", { replace: true })
        }
      }, 8000)
    }

    run()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Signing you in...</p>
        <p className="text-gray-600 text-xs mt-2">Please wait...</p>
      </div>
    </div>
  )
}
