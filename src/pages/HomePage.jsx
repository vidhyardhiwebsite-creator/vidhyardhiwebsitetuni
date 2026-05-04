import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw } from "lucide-react"
import { CATEGORIES } from "../data/products"
import { fetchProducts } from "../services/productService"
import { getSetting } from "../services/settingsService"
import { useRecentlyViewedStore } from "../store/recentlyViewedStore"
import ProductCard from "../components/ProductCard"
import SkeletonCard from "../components/SkeletonCard"
import ScrollReveal from "../components/ScrollReveal"
import heroVideoFallback from "../assets/jewlaryhero.mp4"

const categoryImages = {
  "Earrings": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
  "Necklaces": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
  "Black Beads": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
  "Tikka": "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80",
  "Champaswaram": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
  "Maatilu": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
  "Bracelets": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
  "Bangles": "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80",
}

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroVideo, setHeroVideo] = useState(heroVideoFallback)
  const { items: recentItems } = useRecentlyViewedStore()

  useEffect(() => {
    fetchProducts({ sort: "newest" }).then(data => {
      setFeatured(data.slice(0, 8))
      setLoading(false)
    })
    // Load hero video URL from DB
    getSetting('hero_video_url').then(url => {
      if (url) setHeroVideo(url)
    }).catch(() => {})
  }, [])

  return (
    <>
      <Helmet>
        <title>NaShe Jewels - Premium Indian Jewelry</title>
        <meta name="description" content="Discover exquisite handcrafted Indian jewelry." />
      </Helmet>

      {/* HERO - video background, bright */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-90">
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Only a left-side gradient for text readability, no full overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} className="max-w-xl">
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] mb-4">New Collection 2024</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
              className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Wear Your <span className="text-[#D4AF37]">Story</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-300 text-lg mb-8 leading-relaxed">
              Handcrafted jewelry celebrating India&apos;s timeless heritage.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="flex flex-wrap gap-4">
              <Link to="/products" className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-all">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/products?tags=bridal" className="flex items-center gap-2 px-8 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-all">
                Bridal Collection
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features bar */}
      <ScrollReveal>
        <section className="bg-[#111] border-y border-[#D4AF37]/10 py-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={20} />, title: "Certified Quality", desc: "BIS Hallmarked Gold" },
              { icon: <Truck size={20} />, title: "Free Shipping", desc: "On all orders" },
              { icon: <RefreshCw size={20} />, title: "Easy Returns", desc: "30-day return policy" },
              { icon: <Sparkles size={20} />, title: "Handcrafted", desc: "Artisan made jewelry" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-[#D4AF37]">{f.icon}</div>
                <div>
                  <p className="text-white text-sm font-medium">{f.title}</p>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">Browse By</p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>Our Collections</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <ScrollReveal key={cat} delay={i * 0.06}>
              <Link to={`/products?category=${encodeURIComponent(cat)}`}
                className="group relative overflow-hidden rounded-xl aspect-square block">
                <img src={categoryImages[cat]} alt={cat} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=400&q=80" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm">{cat}</p>
                </div>
                <div className="absolute inset-0 border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37]/60 rounded-xl transition-all duration-300" />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-1">Handpicked</p>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>Featured Pieces</h2>
            </div>
            <Link to="/products" className="text-[#D4AF37] text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))
          }
        </div>
      </section>

      {/* Recently Viewed */}
      {recentItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <ScrollReveal>
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "Georgia, serif" }}>Recently Viewed</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentItems.slice(0, 6).map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Bridal Banner */}
      <ScrollReveal>
        <section className="relative overflow-hidden mx-4 mb-16 rounded-2xl">
          <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=80"
            alt="Bridal collection" className="w-full h-64 object-cover"
            onError={e => { e.target.src = "https://images.unsplash.com/photo-1515562153-702640cf-b037-4b1e-83b0-418397cf1be3?w=1400&q=80" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30 flex items-center px-8">
            <div>
              <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">Limited Edition</p>
              <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Georgia, serif" }}>Bridal Collection</h3>
              <Link to="/products?tags=bridal" className="px-6 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#F0D060] transition-all text-sm">
                Explore Now
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  )
}
