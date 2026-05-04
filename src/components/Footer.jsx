import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/products'

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#D4AF37]/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-[#D4AF37] text-xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>✦ NaShe Jewels</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Premium handcrafted jewelry celebrating India's rich heritage. Every piece tells a story.</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${encodeURIComponent(cat)}`} className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">All Jewelry</Link></li>
              <li><Link to="/cart" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Cart</Link></li>
              <li><Link to="/wishlist" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">Wishlist</Link></li>
              <li><Link to="/orders" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>support@nashejewels.in</li>
              <li>+91 98765 43210</li>
              <li>Mon–Sat, 10am–7pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#D4AF37]/10 mt-8 pt-6 text-center text-gray-600 text-xs">
          © 2024 NaShe Jewels. All rights reserved. | Crafted with ♥ in India
        </div>
      </div>
    </footer>
  )
}
