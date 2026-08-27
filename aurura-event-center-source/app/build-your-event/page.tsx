import { pageMetadata } from "@/lib/seo";
import { BuildYourEventPageClient } from "./BuildYourEventPageClient";

export const metadata = pageMetadata({
  title: "Build Your Event",
  description:
    "Get an instant estimate for your event at Aurura Event Center — pick a package, guest count, and add-ons to see live pricing before you book.",
  path: "/build-your-event",
});

export default function Page() {
  return <BuildYourEventPageClient />;
}
