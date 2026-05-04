import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { formatINR } from '../utils/format'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const total = getTotal()
  const hasOutOfStock = items.some(i => i.products?.stock === 0)

  const handleRemove = async (item) => {
    await removeFromCart(item.id || item.product_id, user?.id)
    toast.success('Removed from cart')
  }

  const handleQty = async (item, delta) => {
    const newQty = item.quantity + delta
    await updateQuantity(item.id || item.product_id, newQty, user?.id)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="text-gray-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Discover our beautiful jewelry collection</p>
        <Link to="/products" className="px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-all">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(item => {
              const product = item.products || {}
              const image = product.images?.[0] || 'https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=200&q=80'
              return (
                <motion.div
                  key={item.id || item.product_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 bg-[#111] border border-[#D4AF37]/10 rounded-xl p-4"
                >
                  <Link to={`/products/${item.product_id}`}>
                    <img
                      src={image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      onError={e => { if (e.target.src !== 'https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=200&q=80') e.target.src = 'https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=200&q=80' }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product_id}`}>
                      <h3 className="text-white text-sm font-medium hover:text-[#D4AF37] transition-colors line-clamp-2">{product.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-xs mt-1">{product.category}</p>
                    {product.stock === 0 && (
                      <p className="text-red-400 text-xs mt-1">⚠ Out of stock</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleQty(item, -1)} className="w-7 h-7 flex items-center justify-center bg-[#1A1A1A] hover:bg-[#D4AF37]/20 text-gray-300 rounded-lg transition-all">
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => handleQty(item, 1)} className="w-7 h-7 flex items-center justify-center bg-[#1A1A1A] hover:bg-[#D4AF37]/20 text-gray-300 rounded-lg transition-all">
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#D4AF37] font-semibold text-sm">{formatINR((product.price || 0) * item.quantity)}</span>
                        <button onClick={() => handleRemove(item)} className="text-gray-600 hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-6 h-fit sticky top-20">
          <h2 className="text-white font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id || item.product_id} className="flex justify-between text-sm">
                <span className="text-gray-400 truncate mr-2">{item.products?.name} × {item.quantity}</span>
                <span className="text-gray-300 shrink-0">{formatINR((item.products?.price || 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#D4AF37]/10 pt-4 mb-6">
            <div className="flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-[#D4AF37] font-bold text-lg">{formatINR(total)}</span>
            </div>
            {total >= 2000 && <p className="text-green-400 text-xs mt-1">✓ Free shipping</p>}
          </div>
          <button
            onClick={() => navigate('/checkout')}
            disabled={hasOutOfStock || !user}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
          {!user && <p className="text-gray-500 text-xs text-center mt-2">Please login to checkout</p>}
          {hasOutOfStock && <p className="text-red-400 text-xs text-center mt-2">Remove out-of-stock items to proceed</p>}
        </div>
      </div>
    </div>
  )
}
