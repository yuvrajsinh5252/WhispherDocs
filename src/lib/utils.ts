import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) {
    return `${SEO_CONFIG.siteUrl}${path}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export const SEO_CONFIG = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "WhispherDocs",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://whispherdocs.yuvrajsinh.dev",
  defaultTitle:
    process.env.NEXT_PUBLIC_DEFAULT_TITLE ||
    "WhispherDocs - Chat with Your Documents Intelligently",
  defaultDescription:
    process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION ||
    "Get instant, accurate answers from your PDFs using advanced AI technology. Upload documents and chat naturally with your content.",
  defaultImage: process.env.NEXT_PUBLIC_DEFAULT_IMAGE || "/thumbnail.png",
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@yuvrajsinh099",
  keywords: [
    "PDF chat",
    "document AI",
    "PDF analysis",
    "AI document reader",
    "intelligent document search",
    "PDF question answering",
    "document intelligence",
    "AI-powered PDF reader",
  ],
  authors: [{ name: "WhispherDocs Team" }],
  creator: "WhispherDocs",
  publisher: "WhispherDocs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
} as const;

export function constructMetadata({
  title,
  description,
  image,
  icons = "/favicon.ico",
  noIndex = false,
  keywords,
  canonical,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  keywords?: string[];
  canonical?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: Array<{ name: string }>;
  section?: string;
  tags?: string[];
} = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;
  const pageDescription = description || SEO_CONFIG.defaultDescription;
  const pageImage = image || SEO_CONFIG.defaultImage;
  const pageKeywords = keywords || SEO_CONFIG.keywords;

  const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords.join(", "),
    authors: authors || [...SEO_CONFIG.authors],
    creator: SEO_CONFIG.creator,
    publisher: SEO_CONFIG.publisher,
    formatDetection: SEO_CONFIG.formatDetection,
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    alternates: {
      canonical: canonical || SEO_CONFIG.siteUrl,
      languages: {
        "en-US": SEO_CONFIG.siteUrl,
        "x-default": SEO_CONFIG.siteUrl,
      },
    },
    openGraph: {
      type,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      siteName: SEO_CONFIG.siteName,
      locale: "en_US",
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors: authors.map((a) => a.name) }),
      ...(section && { section }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: SEO_CONFIG.twitterHandle,
      site: SEO_CONFIG.twitterHandle,
    },
    icons: {
      icon: icons,
      apple: "/favicon.ico",
    },
    ...(!noIndex && {
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
    }),
    verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "PGoceaWXj9AkjGmmKyMlP-Ns9EoR_rb_j4exhV6gR60",
    },
  };

  return metadata;
}

export function generateJsonLd(
  type: "website" | "article" | "organization" = "website",
  additionalData?: Record<string, any>
) {
  const baseData = {
    "@context": "https://schema.org",
    "@type":
      type === "website"
        ? "WebSite"
        : type === "article"
        ? "Article"
        : "Organization",
  };

  switch (type) {
    case "website":
      return {
        ...baseData,
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
        description: SEO_CONFIG.defaultDescription,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        sameAs: [
          `https://twitter.com/${SEO_CONFIG.twitterHandle.replace("@", "")}`,
        ],
      };

    case "organization":
      return {
        ...baseData,
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
        logo: `${SEO_CONFIG.siteUrl}/thumbnail.png`,
        description: SEO_CONFIG.defaultDescription,
        sameAs: [
          `https://twitter.com/${SEO_CONFIG.twitterHandle.replace("@", "")}`,
        ],
      };

    case "article":
      return {
        ...baseData,
        headline: additionalData?.title || SEO_CONFIG.defaultTitle,
        description:
          additionalData?.description || SEO_CONFIG.defaultDescription,
        image: [
          `${SEO_CONFIG.siteUrl}${
            additionalData?.image || SEO_CONFIG.defaultImage
          }`,
        ],
        datePublished: additionalData?.publishedTime,
        dateModified: additionalData?.modifiedTime,
        author: {
          "@type": "Person",
          name: additionalData?.author || SEO_CONFIG.authors[0].name,
        },
        publisher: {
          "@type": "Organization",
          name: SEO_CONFIG.siteName,
          logo: {
            "@type": "ImageObject",
            url: `${SEO_CONFIG.siteUrl}/thumbnail.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": additionalData?.canonical || SEO_CONFIG.siteUrl,
        },
      };

    default:
      return baseData;
  }
}
