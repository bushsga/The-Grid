import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://thegridglobal.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',           // Admin area - don't index
          '/cart/',            // Shopping cart - don't index
          '/checkout/',        // Checkout process - don't index
          '/checkout/success/', // Order confirmation - don't index
          '/api/',             // API endpoints - don't index
          // REMOVED: '/*?category=*' - we WANT Google to index category pages
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/', 
          '/api/',
        ],
        // Googlebot can crawl category pages
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}