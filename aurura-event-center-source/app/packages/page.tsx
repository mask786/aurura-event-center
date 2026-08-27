import { pageMetadata } from "@/lib/seo";
import { PackagesPageClient } from "./PackagesPageClient";

export const metadata = pageMetadata({
  title: "Packages & Pricing",
  description:
    "Thoughtfully curated event packages at Aurura Event Center, starting at $3,200 — compare guest counts, hours, and inclusions to find the right fit for your celebration.",
  path: "/packages",
});

export default function Page() {
  return <PackagesPageClient />;
}
