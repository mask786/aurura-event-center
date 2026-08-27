import { pageMetadata } from "@/lib/seo";
import { VenuePageClient } from "./VenuePageClient";

export const metadata = pageMetadata({
  title: "The Venue",
  description:
    "A refined ballroom in Cedar Hollow, TX with room for up to 350 guests, 200+ parking spaces, and flexible layouts for weddings, quinceañeras, and celebrations of every kind.",
  path: "/venue",
});

export default function Page() {
  return <VenuePageClient />;
}
