// Fallback placeholder — a gold jewelry SVG data URI so it never makes a network request
const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%231A1A1A'/%3E%3Ccircle cx='200' cy='160' r='60' fill='none' stroke='%23D4AF37' stroke-width='3' opacity='0.4'/%3E%3Ccircle cx='200' cy='160' r='40' fill='none' stroke='%23D4AF37' stroke-width='2' opacity='0.3'/%3E%3Cpath d='M170 220 Q200 260 230 220' fill='none' stroke='%23D4AF37' stroke-width='2' opacity='0.4'/%3E%3Ctext x='200' y='310' text-anchor='middle' fill='%23D4AF37' font-size='14' opacity='0.5' font-family='Georgia'%3ENaShe Jewels%3C/text%3E%3C/svg%3E"

export default function SafeImage({ src, alt = '', className = '', ...props }) {
  const handleError = (e) => {
    if (e.target.src !== FALLBACK) {
      e.target.src = FALLBACK
    }
  }

  return (
    <img
      src={src || FALLBACK}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  )
}
