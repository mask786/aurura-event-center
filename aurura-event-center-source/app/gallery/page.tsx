import { pageMetadata } from "@/lib/seo";
import { GalleryPageClient } from "./GalleryPageClient";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "Browse photos of Aurura Event Center's ballroom, table settings, stage lighting, and decor — from weddings and quinceañeras to corporate celebrations.",
  path: "/gallery",
});

export default function Page() {
  return <GalleryPageClient />;
}
