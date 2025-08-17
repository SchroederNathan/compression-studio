import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://compression-studio.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      images: [`${baseUrl}/preview.jpg`],
    },
    {
      url: `${baseUrl}/image-compression`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${baseUrl}/preview.jpg`],
    },
    {
      url: `${baseUrl}/video-compression`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${baseUrl}/preview.jpg`],
    },
  ]
}
