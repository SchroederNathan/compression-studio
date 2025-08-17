import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Compression Studio - Free Online Image & Video Compressor",
    template: "%s | Compression Studio",
  },
  description:
    "Free online tool to compress images and videos instantly. Reduce file sizes for JPEG, PNG, WebP, AVIF images and MP4 videos with high quality. No registration required.",
  keywords: [
    "image compression",
    "video compression",
    "file size reducer",
    "compress images online",
    "compress videos online",
    "JPEG compression",
    "PNG compression",
    "WebP compression",
    "AVIF compression",
    "MP4 compression",
    "free compression tool",
    "online image optimizer",
    "video file reducer",
    "lossless compression",
    "image quality optimization",
  ],
  authors: [{ name: "Compression Studio" }],
  creator: "Compression Studio",
  publisher: "Compression Studio",
  category: "Technology",
  classification: "Image and Video Compression Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://compression-studio.com",
    title: "Compression Studio - Free Online Image & Video Compressor",
    description:
      "Free online tool to compress images and videos instantly. Reduce file sizes for JPEG, PNG, WebP, AVIF images and MP4 videos with high quality.",
    siteName: "Compression Studio",
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 630,
        alt: "Compression Studio - Online Image and Video Compression Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compression Studio - Free Online Image & Video Compressor",
    description:
      "Free online tool to compress images and videos instantly. Reduce file sizes with high quality.",
    images: ["/preview.jpg"],
    creator: "@compressionstudio",
    site: "@compressionstudio",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://compression-studio.com",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://compression-studio.com/#webapp",
        name: "Compression Studio",
        description:
          "Free online tool to compress images and videos instantly. Reduce file sizes for JPEG, PNG, WebP, AVIF images and MP4 videos with high quality.",
        url: "https://compression-studio.com",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Image compression for JPEG, PNG, WebP, AVIF formats",
          "Video compression for MP4 format",
          "Quality adjustment controls",
          "Batch processing support",
          "No registration required",
          "Privacy-focused processing",
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
        screenshot: "https://compression-studio.com/preview.jpg",
      },
      {
        "@type": "WebSite",
        "@id": "https://compression-studio.com/#website",
        name: "Compression Studio",
        description: "Free online image and video compression tool",
        url: "https://compression-studio.com",
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://compression-studio.com/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        ],
        mainEntity: {
          "@id": "https://compression-studio.com/#webapp",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://compression-studio.com/#software",
        name: "Compression Studio",
        applicationCategory: "Multimedia",
        operatingSystem: "Web Browser",
        url: "https://compression-studio.com",
        description:
          "Professional online tool for compressing images and videos while maintaining quality",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "JPEG image compression",
          "PNG image compression",
          "WebP image compression",
          "AVIF image compression",
          "MP4 video compression",
          "Quality control",
          "Batch processing",
          "Real-time preview",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://compression-studio.com/#organization",
        name: "Compression Studio",
        url: "https://compression-studio.com",
        logo: {
          "@type": "ImageObject",
          url: "https://compression-studio.com/logos/logo-dark.svg",
        },
        sameAs: ["https://twitter.com/compressionstudio"],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          suppressHydrationWarning={true}
        />
        {/* Additional social media meta tags */}
        <meta property="og:image" content="/preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta
          property="og:image:alt"
          content="Compression Studio - Free Online Image and Video Compression Tool"
        />
        <meta name="twitter:image" content="/preview.jpg" />
        <meta
          name="twitter:image:alt"
          content="Compression Studio - Free Online Image and Video Compression Tool"
        />
        {/* LinkedIn specific */}
        <meta property="og:image:secure_url" content="/preview.jpg" />
        {/* WhatsApp and other messaging apps */}
        <meta property="og:image:url" content="/preview.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(var(--color-muted)_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-0 -z-5 h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,color-mix(in_srgb,var(--color-primary)_10%,transparent),transparent)]"></div>
        {children}
      </body>
    </html>
  );
}
