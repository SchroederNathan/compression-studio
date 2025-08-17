import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://compression-studio.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/temp/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
