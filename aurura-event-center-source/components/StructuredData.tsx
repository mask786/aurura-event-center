import { venue } from "@/lib/config";
import { SITE_URL } from "@/lib/seo";

/**
 * JSON-LD structured data (schema.org EventVenue) so search engines and AI
 * assistants can understand what Aurura is, where it is, and how to contact
 * it — without needing to parse the page's visual layout.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: venue.name,
    description: venue.description.en,
    url: SITE_URL,
    telephone: venue.phoneHref,
    email: venue.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: venue.address.line1,
      addressLocality: venue.address.city,
      addressRegion: venue.address.state,
      postalCode: venue.address.zip,
      addressCountry: "US",
    },
    maximumAttendeeCapacity: venue.capacity,
    sameAs: [
      `https://instagram.com/${venue.instagram.replace("@", "")}`,
      `https://facebook.com/${venue.facebook}`,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
