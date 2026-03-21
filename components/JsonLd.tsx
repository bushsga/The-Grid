// components/JsonLd.tsx
export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "THE GRID",
    "description": "Nigeria's premier solar power solutions provider based in Ilorin, Kwara State",
    "url": "https://thegridglobal.com",
    "logo": "https://thegridglobal.com/images/logo.png",
    "image": "https://thegridglobal.com/images/og-image.jpg",
    "telephone": "08144414547",
    "email": "thegridgloballtd@gmail.com",
    "priceRange": "₦₦",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ilorin",
      "addressRegion": "Kwara",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "8.4966",
      "longitude": "4.5421"
    },
    "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-15:00",
    "sameAs": [
      "https://facebook.com/thegridng",
      "https://twitter.com/thegridng",
      "https://instagram.com/thegridng"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "08144414547",
        "contactType": "customer service",
        "areaServed": "NG",
        "availableLanguage": ["English", "Yoruba", "Hausa"]
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}