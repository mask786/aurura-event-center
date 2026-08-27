import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Public marketing routes only — booking-flow pages (/pay/[id], /contract/[id],
// /confirmation/[id]), /my-booking, and /admin are visitor/staff-specific and
// intentionally left out (also marked noindex on their own metadata).
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/venue", "/gallery", "/packages", "/build-your-event", "/schedule-tour", "/contact"];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
