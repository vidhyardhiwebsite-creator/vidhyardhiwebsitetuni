import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Zap, ChevronLeft, ChevronRight, Star, Tag } from 'lucide-react'
import { fetchProductById, fetchProducts } from '../services/productService'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useRecentlyViewedStore } from '../store/recentlyViewedStore'
import { getRecommendations } from '../utils/recommendations'
import { formatINR } from '../utils/format'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addToCart } = useCartStore()
  const { toggleWishlist, isWishlisted } = useWishlistStore()
  const { addProduct } = useRecentlyViewedStore()

  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    setLoading(true)
    setImgIdx(0)
    Promise.all([fetchProductById(id), fetchProducts()]).then(([prod, all]) => {
      // If not found by UUID, try by custom_id
      const finalProd = prod || all.find(p => p.custom_id === id) || null
      setProduct(finalProd)
      setAllProducts(all)
      if (finalProd) {
        addProduct(finalProd)
        setRecommendations(getRecommendations(finalProd, all))
      }
      setLoading(false)
    })
  }, [id])

  const wishlisted = product ? isWishlisted(product.id) : false

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login to add to cart'); navigate('/login'); return }
    await addToCart(product, user.id)
    toast.success('Added to cart!')
  }

  const handleBuyNow = async () => {
    if (!user) { toast.error('Please login'); navigate('/login'); return }
    await addToCart(product, user.id)
    navigate('/checkout')
  }

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login'); navigate('/login'); return }
    const added = await toggleWishlist(product, user.id)
    toast.success(added ? 'Added to wishlist!' : 'Removed from wishlist')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-[#1A1A1A] rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-[#1A1A1A] rounded w-1/3" />
            <div className="h-8 bg-[#1A1A1A] rounded w-3/4" />
            <div className="h-10 bg-[#1A1A1A] rounded w-1/4" />
            <div className="h-24 bg-[#1A1A1A] rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Product not found</p>
        <button onClick={() => navigate('/products')} className="mt-4 px-6 py-2 bg-[#D4AF37] text-black rounded-lg text-sm">
          Browse Products
        </button>
      </div>
    )
  }

  const images = product.images || []

  return (
    <>
      <Helmet>
        <title>{product.name} – NaShe Jewels</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={images[0]} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square bg-[#111] rounded-xl overflow-hidden mb-3">
              <motion.img
                key={imgIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[imgIdx] || 'https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=600&q=80'}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-[#D4AF37]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy"
                      onError={e => { if (e.target.src !== 'https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80') e.target.src = 'https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#D4AF37]">{Array(5).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
              <span className="text-gray-500 text-xs">(24 reviews)</span>
            </div>
            <p className="text-3xl font-bold text-[#D4AF37] mb-4">{formatINR(product.price)}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>

            <div className={`grid gap-3 mb-6 text-sm ${product.category === 'Bangles' && product.size ? 'grid-cols-1' : 'grid-cols-1'}`}>
              {/* Size — only for Bangles */}
              {product.category === 'Bangles' && product.size && (
                <div className="bg-[#111] rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-2">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.size.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                      <span key={s} className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-[#111] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Stock</p>
                <p className={`font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs rounded-full border border-[#D4AF37]/20">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-black rounded-xl font-semibold hover:bg-[#F0D060] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap size={18} /> Buy Now
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-xl border transition-all ${wishlisted ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-[#111] border-[#D4AF37]/20 text-gray-400 hover:text-red-400'}`}
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <div className="mb-6">
              <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-1">You May Also Like</p>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Similar Pieces</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recommendations.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
