import { Link } from 'react-router-dom'

const SocialIcon = ({ href, label, svgPath }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
    className="w-8 h-8 rounded-full bg-white border border-[#b2dbd8] flex items-center justify-center hover:border-[#4DB6AC] hover:text-[#4DB6AC] transition-all text-[#4A4A6A]">
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d={svgPath} /></svg>
  </a>
)

export default function Footer() {
  return (
    <footer style={{ background: "#d8f0ee" }} className="border-t border-[#b2dbd8] mt-16 text-[#1A1A2E]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Home */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#1A1A2E]">Home</h4>
            <ul className="space-y-2 text-sm text-[#4A4A6A]">
              <li><Link to="/" className="hover:text-[#4DB6AC] transition-colors">Home</Link></li>
              <li><Link to="/contact" className="hover:text-[#4DB6AC] transition-colors">About Us</Link></li>
              <li><Link to="/products" className="hover:text-[#4DB6AC] transition-colors">Careers</Link></li>
              <li><Link to="/products" className="hover:text-[#4DB6AC] transition-colors">Personalization</Link></li>
              <li><Link to="/contact" className="hover:text-[#4DB6AC] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#1A1A2E]">About</h4>
            <ul className="space-y-2 text-sm text-[#4A4A6A]">
              <li><Link to="/contact" className="hover:text-[#4DB6AC] transition-colors">Site map</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#4DB6AC] transition-colors">Terms of Use</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#4DB6AC] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-[#4DB6AC] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social Us */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#1A1A2E]">Social Us</h4>
            <div className="flex gap-2 mb-3">
              <SocialIcon href="https://facebook.com" label="Facebook"
                svgPath="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              <SocialIcon href="https://twitter.com" label="X / Twitter"
                svgPath="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              <SocialIcon href="https://www.instagram.com" label="Instagram"
                svgPath="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2.122a9.835 9.835 0 1 0 0 19.67 9.835 9.835 0 0 0 0-19.67zm0 3.338a6.497 6.497 0 1 1 0 12.994 6.497 6.497 0 0 1 0-12.994zm6.406-1.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881zm-6.406 3.123a3.374 3.374 0 1 0 0 6.748 3.374 3.374 0 0 0 0-6.748z" />
              <SocialIcon href="https://youtube.com" label="YouTube"
                svgPath="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#1A1A2E]">Business Information</h4>
            <address className="not-italic text-sm text-[#4A4A6A] space-y-1 leading-relaxed">
              <p>Vidhyrathi, venanan,</p>
              <p>Personalized, Estam Craft Shop.</p>
              <p>
                <a href="tel:+911234567870" className="hover:text-[#4DB6AC] transition-colors">
                  Call: 123 456-7870
                </a>
              </p>
            </address>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#b2dbd8] py-3 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-[#4A4A6A]">
          <span>© 2022 · All rights Vidhyrathi</span>
          <span className="text-[#4DB6AC] font-medium">sincery.com</span>
        </div>
      </div>
    </footer>
  )
}
