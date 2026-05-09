import { useParams } from 'react-router-dom'

const policies = {
  'shipping-policy': {
    title: 'Shipping Policy',
    content: [
      { heading: 'Free Shipping', text: 'We offer free shipping on all orders across India. No minimum order value required.' },
      { heading: 'Delivery Time', text: 'Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available at checkout for select pincodes.' },
      { heading: 'Order Processing', text: 'Orders are processed within 1–2 business days after payment confirmation. You will receive a tracking number via email once your order is shipped.' },
      { heading: 'Packaging', text: 'All jewelry is carefully packed in premium gift boxes to ensure safe delivery and a delightful unboxing experience.' },
      { heading: 'International Shipping', text: 'Currently we ship only within India. International shipping will be available soon.' },
    ]
  },
  'refund-policy': {
    title: 'Refund & Return Policy',
    content: [
      {
        heading: '💛 Our Commitment',
        text: 'Customer satisfaction is very important to us. Every product is carefully checked and packed before dispatch to ensure it reaches you in the best condition.'
      },
      {
        heading: 'General Policy',
        text: 'We follow a No Return / No Exchange policy for all orders once delivered. Returns are not accepted for reasons such as change of mind, dislike of design, or minor variations in color/finish (as some variation may occur due to photography and screen display).'
      },
      {
        heading: 'Damaged or Defective Products',
        text: 'If you receive a damaged or defective product, we are committed to resolving it quickly. Inform us within 24 hours of receiving the order.'
      },
      {
        heading: '📹 Unboxing Video — Mandatory',
        text: 'An unboxing video is REQUIRED to process any damage claim. Before opening the package, focus the camera on the tearing side properly. ❌ NO ZOOM  ❌ NO EDITING. NOTE: 360° view of the package must be recorded before tearing it open.'
      },
      {
        heading: 'How to Report',
        text: 'Send the unboxing video and clear photos of the damaged product via:\n• WhatsApp: +91 8639006849\n• Email: nashejewels@gmail.com\n\nOnce verified by our team, we will offer a replacement of the same product, or provide a refund if replacement is not possible.'
      },
      {
        heading: 'Refunds',
        text: 'Refunds will be processed to the original payment method within 5–7 working days after approval. Shipping charges are non-refundable.'
      },
      {
        heading: 'Contact Us',
        text: 'For all return or refund related queries, please contact us:\n📞 Phone / WhatsApp: +91 8639006849'
      },
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: [
      { heading: 'Information We Collect', text: 'We collect your name, email, phone number, and delivery address when you place an order or create an account.' },
      { heading: 'How We Use It', text: 'Your information is used solely to process orders, send shipping updates, and improve your shopping experience. We never sell your data.' },
      { heading: 'Payment Security', text: 'All payments are processed securely through Razorpay. We do not store your card or payment details.' },
      { heading: 'Cookies', text: 'We use cookies to remember your preferences and improve site performance. You can disable cookies in your browser settings.' },
      { heading: 'Contact', text: 'For any privacy concerns, email us at support@nashejewels.in.' },
    ]
  }
}

export default function PolicyPage() {
  const { slug } = useParams()
  const policy = policies[slug]

  if (!policy) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">Page not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>{policy.title}</h1>
      <div className="space-y-6">
        {policy.content.map((section, i) => (
          <div key={i} className="bg-[#111] border border-[#D4AF37]/10 rounded-xl p-5">
            <h2 className="text-[#D4AF37] font-semibold mb-2">{section.heading}</h2>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{section.text}</p>
          </div>
        ))}
      </div>
      <p className="text-gray-600 text-xs mt-8 text-center">Last updated: January 2024 · NaShe Jewels</p>
    </div>
  )
}
