import { pageMetadata } from "@/lib/seo";
import { MyBookingPageClient } from "./MyBookingPageClient";

export const metadata = pageMetadata({
  title: "My Booking",
  description: "Track the status of your Aurura Event Center booking.",
  path: "/my-booking",
  noIndex: true,
});

export default function Page() {
  return <MyBookingPageClient />;
}
