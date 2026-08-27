// ---------------------------------------------------------------------------
// SEO / METADATA HELPERS
// ---------------------------------------------------------------------------
// Centralizes per-page <title>/description/canonical/OG/Twitter metadata so
// every route builds it the same way. Used by each route's server-component
// page.tsx (metadata can only be exported from a Server Component, so pages
// that need client-side interactivity keep their UI in a sibling
// "*Client.tsx" file and this metadata lives in the thin page.tsx wrapper).
// ---------------------------------------------------------------------------
import type { Metadata } from "next";
import { venue } from "./config";

// No custom domain yet (see project backlog) — update this once one exists.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aurura-event-center-app.vercel.app";

// Reuse the existing ballroom hero photo as the default social-share image
// until the venue has real branded photography (see project backlog).
export const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=1200&h=630&q=80";

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string; // e.g. "/venue" — root is "/"
  noIndex?: boolean;
  ogImage?: string;
}): Metadata {
  const url = opts.path === "/" ? SITE_URL : `${SITE_URL}${opts.path}`;
  const fullTitle = opts.path === "/" ? opts.title : `${opts.title} | ${venue.name}`;
  const image = opts.ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title: fullTitle,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url,
      siteName: venue.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: venue.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [image],
    },
  };
}
