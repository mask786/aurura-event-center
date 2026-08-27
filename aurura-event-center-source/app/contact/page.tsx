import { pageMetadata } from "@/lib/seo";
import { ContactPageClient } from "./ContactPageClient";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Aurura Event Center — call, text, WhatsApp, or send a message and our events team will respond quickly.",
  path: "/contact",
});

export default function Page() {
  return <ContactPageClient />;
}
