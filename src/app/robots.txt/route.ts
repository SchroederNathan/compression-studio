export function GET() {
  const baseUrl = 'https://compression-studio.com'
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /temp/

Sitemap: ${baseUrl}/sitemap.xml`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
