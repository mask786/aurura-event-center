import { pageMetadata } from "@/lib/seo";
import { ScheduleTourPageClient } from "./ScheduleTourPageClient";

export const metadata = pageMetadata({
  title: "Schedule a Tour",
  description:
    "Book a 30-minute in-person tour of Aurura Event Center. Pick a date and time that works for you and see the ballroom for yourself.",
  path: "/schedule-tour",
});

export default function Page() {
  return <ScheduleTourPageClient />;
}
