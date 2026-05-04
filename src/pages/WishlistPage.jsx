import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlistStore } from '../store/wishlistStore'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const { items } = useWishlistStore()
  const products = items.map(i => i.products).filter(Boolean)

  if (products.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart size={64} className="text-gray-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save pieces you love to revisit later</p>
        <Link to="/products" className="px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-all">
          Browse Jewelry
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        My Wishlist <span className="text-gray-500 text-lg font-normal">({products.length})</span>
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
