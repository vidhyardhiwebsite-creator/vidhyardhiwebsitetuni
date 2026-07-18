import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { ArrowRight, HandHeart, Sparkles, ShieldCheck, Truck } from "lucide-react"
import { fetchProducts } from "../services/productService"
import { getSetting } from "../services/settingsService"
import ScrollReveal from "../components/ScrollReveal"
import ReviewsSection from "../components/ReviewsSection"

const FALLBACK_IMG = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80"

/* ── Hero mosaic: exactly 4 tiles (2 left, 2 right) ── */
const HERO_TILES = [
  { src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",  alt: "Photo Cube" },
  { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", alt: "T-Shirt" },
  { src: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80", alt: "Mug" },
  { src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80", alt: "Keychain" },
]

/* ── 6 grouped collection cards matching the screenshot ── */
const COLLECTION_CARDS = [
  {
    title: "Photo Gifts",
    subtitle: "Cubes, Frames, Boxes",
    link: "/products?category=Photo+Cubes",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
        {/* camera body */}
        <rect x="10" y="24" width="44" height="34" rx="5" stroke="#4DB6AC" strokeWidth="2.5" fill="none" />
        <circle cx="32" cy="41" r="10" stroke="#4DB6AC" strokeWidth="2.5" fill="none" />
        <circle cx="32" cy="41" r="4" fill="#4DB6AC" opacity="0.3" />
        <rect x="16" y="18" width="10" height="6" rx="2" stroke="#4DB6AC" strokeWidth="2" fill="none" />
        {/* photo frame beside */}
        <rect x="56" y="28" width="18" height="22" rx="2" stroke="#C9956C" strokeWidth="2" fill="none" />
        <rect x="59" y="32" width="12" height="10" rx="1" fill="#C9956C" opacity="0.25" />
      </svg>
    ),
  },
  {
    title: "Apparel & Textiles",
    subtitle: "T-Shirts, Pillows, Clothes",
    link: "/products?category=T-Shirts",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
        {/* t-shirt */}
        <path d="M28 14 L14 26 L22 30 L22 62 L58 62 L58 30 L66 26 L52 14 Q48 22 40 22 Q32 22 28 14Z"
          stroke="#4DB6AC" strokeWidth="2.5" fill="none" />
        {/* pillow beside */}
        <rect x="46" y="34" width="22" height="16" rx="6" stroke="#C9956C" strokeWidth="2" fill="none" />
        <path d="M46 42 Q57 38 68 42" stroke="#C9956C" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Drinkware & Bottles",
    subtitle: "Mugs, Custom Bottles",
    link: "/products?category=Mugs",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
        {/* mug */}
        <path d="M16 22 L16 58 Q16 62 20 62 L46 62 Q50 62 50 58 L50 22Z" stroke="#4DB6AC" strokeWidth="2.5" fill="none" />
        <path d="M50 30 Q62 30 62 40 Q62 50 50 50" stroke="#4DB6AC" strokeWidth="2.5" fill="none" />
        <line x1="16" y1="22" x2="50" y2="22" stroke="#4DB6AC" strokeWidth="2.5" />
        {/* bottle */}
        <path d="M58 18 L58 24 Q54 26 54 32 L54 60 Q54 62 56 62 L66 62 Q68 62 68 60 L68 32 Q68 26 64 24 L64 18Z"
          stroke="#C9956C" strokeWidth="2" fill="none" />
        <line x1="58" y1="18" x2="64" y2="18" stroke="#C9956C" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Engraved Wood",
    subtitle: "Frames, Decor",
    link: "/products?category=Wood+Engraving+Photo+Frames",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
        {/* CNC wood circle */}
        <circle cx="36" cy="42" r="24" stroke="#C9956C" strokeWidth="2.5" fill="none" />
        <circle cx="36" cy="42" r="14" stroke="#C9956C" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
        <circle cx="36" cy="42" r="5" fill="#C9956C" opacity="0.4" />
        {/* engraving tool */}
        <line x1="52" y1="16" x2="44" y2="30" stroke="#4DB6AC" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="44,30 40,34 48,32" fill="#4DB6AC" />
      </svg>
    ),
  },
  {
    title: "Desk & School Accessories",
    subtitle: "Pens, Banks, Keychains",
    link: "/products?category=Pens",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
        {/* pen */}
        <rect x="30" y="10" width="8" height="44" rx="4" stroke="#4DB6AC" strokeWidth="2.5" fill="none" />
        <polygon points="30,54 38,54 34,64" fill="#4DB6AC" />
        <rect x="30" y="10" width="8" height="8" rx="2" fill="#4DB6AC" opacity="0.5" />
        {/* notebook */}
        <rect x="42" y="20" width="24" height="34" rx="3" stroke="#C9956C" strokeWidth="2" fill="none" />
        <line x1="42" y1="20" x2="42" y2="54" stroke="#C9956C" strokeWidth="3" />
        <line x1="47" y1="28" x2="62" y2="28" stroke="#C9956C" strokeWidth="1.5" />
        <line x1="47" y1="34" x2="62" y2="34" stroke="#C9956C" strokeWidth="1.5" />
        <line x1="47" y1="40" x2="58" y2="40" stroke="#C9956C" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Custom Decor & Cutting Boards",
    subtitle: "Acrylic, MDF, Wood",
    link: "/products?category=Custom+Cut+Boards",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
        {/* cutting board */}
        <rect x="10" y="16" width="40" height="50" rx="3" stroke="#C9956C" strokeWidth="2.5" fill="none" />
        <circle cx="44" cy="20" r="3" fill="#C9956C" opacity="0.5" />
        <line x1="16" y1="28" x2="44" y2="28" stroke="#C9956C" strokeWidth="1.5" />
        <line x1="16" y1="36" x2="44" y2="36" stroke="#C9956C" strokeWidth="1.5" />
        <line x1="16" y1="44" x2="36" y2="44" stroke="#C9956C" strokeWidth="1.5" />
        {/* laser/tool arm */}
        <line x1="52" y1="10" x2="66" y2="10" stroke="#4DB6AC" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="66" y1="10" x2="66" y2="50" stroke="#4DB6AC" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="60,50 66,58 72,50" fill="#4DB6AC" />
      </svg>
    ),
  },
]

const FEATURES = [
  { label: "Handcrafted Quality", Icon: HandHeart },
  { label: "Easy Personalization Tools", Icon: Sparkles },
  { label: "Secure Checkout", Icon: ShieldCheck },
  { label: "Fast Shipping", Icon: Truck },
]

export default function HomePage() {
  const [features, setFeatures] = useState(FEATURES)

  useEffect(() => {
    getSetting("features_bar").then(val => {
      if (val) {
        try {
          const p = JSON.parse(val)
          if (Array.isArray(p) && p.length) setFeatures(p)
        } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <>
      <Helmet>
        <title>Vidhyrathi - Your Story, Crafted Perfectly</title>
        <meta name="description" content="Discover unique, high-quality personalized gifts and custom home decor." />
      </Helmet>

      {/* ═══════════════════════════════════════════
          HERO  —  3-col mosaic  (left | center | right)
      ═══════════════════════════════════════════ */}
      <section style={{ background: "#d8f0ee" }} className="py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-4 gap-2" style={{ height: "clamp(260px, 40vw, 440px)" }}>

            {/* Left col — 2 stacked tiles */}
            <div className="col-span-1 grid grid-rows-2 gap-2">
              {HERO_TILES.slice(0, 2).map((t, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-white">
                  <img src={t.src} alt={t.alt} className="w-full h-full object-cover"
                    onError={e => { e.target.src = FALLBACK_IMG }} />
                </div>
              ))}
            </div>

            {/* Center — text card */}
            <div className="col-span-2 bg-white rounded-2xl shadow flex flex-col items-center justify-center px-5 py-6 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1A1A2E] leading-snug mb-2"
                style={{ fontFamily: "Georgia, serif" }}>
                <span className="text-[#1A1A2E]">Vidhyrathi:</span> Your Story,<br />Crafted Perfectly
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="text-[#4A4A6A] text-xs sm:text-sm mb-5 leading-relaxed max-w-[220px]">
                Discover unique, high-quality personalized gifts and custom home decor.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Link to="/products"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-[#1A1A2E] transition-all hover:opacity-90"
                  style={{ background: "#C9956C" }}>
                  Shop Now
                </Link>
              </motion.div>
            </div>

            {/* Right col — 2 stacked tiles */}
            <div className="col-span-1 grid grid-rows-2 gap-2">
              {HERO_TILES.slice(2, 4).map((t, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-white">
                  <img src={t.src} alt={t.alt} className="w-full h-full object-cover"
                    onError={e => { e.target.src = FALLBACK_IMG }} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COLLECTIONS GRID  —  3 × 2  icon cards
      ═══════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <ScrollReveal>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-8"
            style={{ fontFamily: "Georgia, serif" }}>
            Explore Our Collections
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COLLECTION_CARDS.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.06}>
              <Link to={card.link}
                className="group bg-white border border-[#E8E0D5] rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-[#4DB6AC]/40 transition-all duration-300">
                <div className="mb-3 group-hover:scale-105 transition-transform duration-300">
                  {card.icon}
                </div>
                <p className="text-[#1A1A2E] font-semibold text-base mb-1">{card.title}</p>
                <p className="text-[#8A8AAA] text-xs">{card.subtitle}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES BAR
      ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <section style={{ background: "#d8f0ee" }} className="py-6 border-y border-[#b2dbd8]">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {FEATURES.map((f, i) => {
              const Icon = f.Icon || HandHeart
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Icon size={22} className="text-[#4DB6AC]" />
                  </div>
                  <p className="text-[#1A1A2E] text-xs font-semibold">{f.label || f.title}</p>
                </div>
              )
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* ═══════════════════════════════════════════
          REVIEWS
      ═══════════════════════════════════════════ */}
      <ScrollReveal>
        <ReviewsSection />
      </ScrollReveal>
    </>
  )
}
