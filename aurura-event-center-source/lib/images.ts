// Curated placeholder photography (Unsplash) styled to match Aurura's luxury
// aesthetic. Swap these for the venue's real photography via this single
// file — nothing else in the app needs to change.
//
// Each entry includes a `q` (search-style label, used only for alt text /
// fallback texture selection) so a broken remote image degrades gracefully
// to an on-brand placeholder instead of a broken-image icon.

export type VenuePhoto = {
  id: string;
  url: string;
  alt: string;
  category:
    | "ballroom"
    | "wedding"
    | "quinceanera"
    | "decor"
    | "stage"
    | "tables"
    | "celebration"
    | "exterior";
};

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photos: VenuePhoto[] = [
  { id: "hero", url: u("photo-1519167758481-83f550bb49b3", 2000), alt: "Candlelit reception tables beneath string lighting", category: "ballroom" },
  { id: "ballroom-1", url: u("photo-1478146059778-26028b07395a", 1800), alt: "Grand ballroom set for an elegant reception", category: "ballroom" },
  { id: "ballroom-2", url: u("photo-1522673607200-164d1b6ce486", 1800), alt: "Long banquet table beneath crystal chandeliers", category: "ballroom" },
  { id: "chandelier", url: u("photo-1544161515-4ab6ce6db874", 1400), alt: "Crystal chandelier detail", category: "decor" },
  { id: "dance-floor", url: u("photo-1465495976277-4387d4b0b4c6", 1800), alt: "Illuminated dance floor with ambient stage lighting", category: "stage" },
  { id: "stage", url: u("photo-1470229722913-7c0e2dbbafd3", 1800), alt: "Stage set for a live celebration", category: "stage" },
  { id: "table-setting-1", url: u("photo-1522863407823-99a5e3fe9d5b", 1600), alt: "Gold rim place setting with floral centerpiece", category: "tables" },
  { id: "table-setting-2", url: u("photo-1520854221256-17451cc331bf", 1600), alt: "Round table with gold chiavari chairs", category: "tables" },
  { id: "table-setting-3", url: u("photo-1587271636175-90d58cbec7c6", 1600), alt: "Elegant table linens and place settings", category: "tables" },
  { id: "florals", url: u("photo-1519225421980-715cb0215aed", 1400), alt: "Blush floral centerpiece detail", category: "decor" },
  { id: "aisle", url: u("photo-1525258628-df44b6cc0d40", 1800), alt: "Reception aisle lined with florals and drapery", category: "wedding" },
  { id: "wedding-couple", url: u("photo-1511795409834-ef04bbd61622", 1600), alt: "Wedding celebration detail", category: "wedding" },
  { id: "wedding-toast", url: u("photo-1519741497674-611481863552", 1600), alt: "Reception toast beneath twinkling lights", category: "wedding" },
  { id: "quince-1", url: u("photo-1470753323753-3f8091c86924", 1600), alt: "Colorful celebration decor with balloon backdrop", category: "quinceanera" },
  { id: "quince-2", url: u("photo-1478147427282-58a87a120781", 1600), alt: "Festive celebration lighting and decor", category: "quinceanera" },
  { id: "party-lights", url: u("photo-1533174072545-7a4b6ad7a6c3", 1600), alt: "Warm string lighting over a celebration space", category: "celebration" },
  { id: "cake-table", url: u("photo-1464349095431-e9a21285b5f3", 1400), alt: "Elegant dessert and cake table display", category: "decor" },
  { id: "lounge", url: u("photo-1560184897-ae75f418493e", 1600), alt: "Lounge seating area within the venue", category: "ballroom" },
  { id: "exterior", url: u("photo-1519167758481-83f550bb49b3", 1800), alt: "Venue entrance in the evening", category: "exterior" },
  { id: "corporate", url: u("photo-1511578314322-379afb476865", 1600), alt: "Elegant space arranged for a corporate gala", category: "celebration" },
  { id: "detail-1", url: u("photo-1509610973905-3e07f2733d5c", 1200), alt: "Gold flatware detail", category: "decor" },
  { id: "detail-2", url: u("photo-1466354424719-343280469104", 1200), alt: "Champagne toast detail", category: "decor" },
];

export function photo(id: string): VenuePhoto {
  return photos.find((p) => p.id === id) ?? photos[0];
}

export function byCategory(category: VenuePhoto["category"]): VenuePhoto[] {
  return photos.filter((p) => p.category === category);
}
