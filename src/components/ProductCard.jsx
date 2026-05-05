import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { formatINR } from '../utils/format'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { user } = useAuthStore()
  const { addToCart } = useCartStore()
  const { toggleWishlist, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to add to cart')
      return
    }
    try {
      await addToCart(product, user?.id)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart')
    }
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to save to wishlist')
      return
    }
    try {
      const added = await toggleWishlist(product, user?.id)
      toast.success(added ? 'Added to wishlist!' : 'Removed from wishlist')
    } catch (err) {
      toast.error(err.message || 'Failed to update wishlist')
    }
  }

  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#111] rounded-xl overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]"
    >
      <Link to={`/products/${product.id}`}>
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-[#1A1A1A]">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80' }}
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-red-600/80 px-3 py-1 rounded">Out of Stock</span>
            </div>
          )}
          {/* Tags */}
          {product.tags?.includes('bridal') && (
            <span className="absolute top-2 left-2 bg-[#D4AF37] text-black text-xs px-2 py-0.5 rounded font-medium">Bridal</span>
          )}
          {product.tags?.includes('premium') && !product.tags?.includes('bridal') && (
            <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-medium">Premium</span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-[#D4AF37] mb-1 uppercase tracking-wider">{product.category}</p>
          <h3 className="text-white text-sm font-medium line-clamp-2 mb-2 group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-[#D4AF37] font-semibold">{formatINR(product.price)}</span>
            <span className="text-xs text-gray-500">{product.size}</span>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-[#D4AF37]/30 whitespace-nowrap"
        >
          <ShoppingCart size={12} /> <span className="hidden sm:inline">Add to </span>Cart
        </button>
        <button
          onClick={handleWishlist}
          className={`p-2 rounded-lg border transition-all ${wishlisted ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-[#1A1A1A] border-[#D4AF37]/20 text-gray-400 hover:text-red-400 hover:border-red-400/40'}`}
        >
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
    </motion.div>
  )
}
