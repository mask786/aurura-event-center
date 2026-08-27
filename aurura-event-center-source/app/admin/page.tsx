import { pageMetadata } from "@/lib/seo";
import { AdminPageClient } from "./AdminPageClient";

export const metadata = pageMetadata({
  title: "Venue Admin",
  description: "Staff operations dashboard for Aurura Event Center.",
  path: "/admin",
  noIndex: true,
});

export default function Page() {
  return <AdminPageClient />;
}
