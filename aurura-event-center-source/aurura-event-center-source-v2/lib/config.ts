// ---------------------------------------------------------------------------
// VENUE CONFIGURATION
// ---------------------------------------------------------------------------
// Everything specific to Aurura Event Center lives in this one file. The
// rest of the application (estimator engine, tour scheduler, quote/contract
// pipeline, admin dashboard) reads from this config rather than hard-coding
// Aurura's brand, pricing, or policies. A second venue is, in principle, a
// second file that satisfies the same `VenueConfig` type plus its own
// calendar/payment credentials — the booking platform underneath stays
// identical. See /admin/pricing for where an owner would eventually edit
// this data through a UI instead of code.
// ---------------------------------------------------------------------------

export type PricingModel = "flat" | "per_guest" | "per_hour" | "quantity";

export type AddOn = {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  price: number;
  model: PricingModel;
  unitLabel?: { en: string; es: string };
  max?: number;
  category: "logistics" | "decor" | "food_beverage" | "entertainment" | "staffing";
};

export type Package = {
  id: string;
  name: { en: string; es: string };
  tagline: { en: string; es: string };
  startingPrice: number;
  includedHours: number;
  includedGuests: number;
  photoId: string;
  featured?: boolean;
  inclusions: { en: string[]; es: string[] };
};

export type EventType = {
  id: string;
  name: { en: string; es: string };
  photoId: string;
};

export const venue = {
  slug: "aurura-event-center",
  name: "Aurura Event Center",
  shortName: "Aurura",
  monogram: "AE",
  tagline: {
    en: "Your Celebration Deserves an Extraordinary Setting",
    es: "Tu Celebración Merece un Escenario Extraordinario",
  },
  subheading: {
    en: "Weddings, quinceañeras, birthdays, graduations and unforgettable celebrations.",
    es: "Bodas, quinceañeras, cumpleaños, graduaciones y celebraciones inolvidables.",
  },
  description: {
    en: "A refined ballroom in the heart of Cedar Hollow, thoughtfully designed for celebrations that deserve to be remembered.",
    es: "Un salón refinado en el corazón de Cedar Hollow, diseñado con cuidado para celebraciones que merecen ser recordadas.",
  },
  address: {
    line1: "4820 Meridian Grove Lane",
    city: "Cedar Hollow",
    state: "TX",
    zip: "75024",
  },
  phone: "(555) 010-2847",
  phoneHref: "+15550102847",
  whatsapp: "+15550102847",
  email: "events@aururaeventcenter.com",
  instagram: "@aururaeventcenter",
  facebook: "aururaeventcenter",
  capacity: 350,
  parkingSpaces: 200,
  brand: {
    ivory: "#FAF6EF",
    ivoryDeep: "#F3ECDF",
    charcoal: "#211F1C",
    charcoalSoft: "#3A3733",
    gold: "#B4914F",
    goldSoft: "#D8C08D",
    goldDeep: "#8C6E36",
  },
  currency: "USD",
  currencySymbol: "$",
  depositPercent: 0.3,
  serviceFeePercent: 0.06,
  quoteValidDays: 14,
  tourDurationMinutes: 30,
  businessHours: {
    start: 9,
    end: 19,
  },
};

export const eventTypes: EventType[] = [
  { id: "wedding", name: { en: "Weddings", es: "Bodas" }, photoId: "wedding-toast" },
  { id: "quinceanera", name: { en: "Quinceañeras", es: "Quinceañeras" }, photoId: "quince-1" },
  { id: "sweet16", name: { en: "Sweet Sixteens", es: "Dulces Dieciséis" }, photoId: "quince-2" },
  { id: "birthday", name: { en: "Birthday Celebrations", es: "Cumpleaños" }, photoId: "party-lights" },
  { id: "graduation", name: { en: "Graduations", es: "Graduaciones" }, photoId: "celebration" },
  { id: "babyshower", name: { en: "Baby Showers", es: "Baby Showers" }, photoId: "florals" },
  { id: "corporate", name: { en: "Corporate Events", es: "Eventos Corporativos" }, photoId: "corporate" },
  { id: "family", name: { en: "Family Celebrations", es: "Celebraciones Familiares" }, photoId: "table-setting-1" },
  { id: "private", name: { en: "Private Events", es: "Eventos Privados" }, photoId: "lounge" },
];

export const packages: Package[] = [
  {
    id: "essential",
    name: { en: "Essential Package", es: "Paquete Esencial" },
    tagline: {
      en: "A beautifully appointed foundation for intimate celebrations.",
      es: "Una base elegante para celebraciones íntimas.",
    },
    startingPrice: 3200,
    includedHours: 5,
    includedGuests: 150,
    photoId: "table-setting-2",
    inclusions: {
      en: [
        "5-hour venue rental",
        "Tables & chairs for up to 150 guests",
        "Classic table linens",
        "On-site event coordinator",
        "Standard ambient lighting",
        "Post-event cleaning",
      ],
      es: [
        "Alquiler del salón por 5 horas",
        "Mesas y sillas para hasta 150 invitados",
        "Manteles clásicos",
        "Coordinador de eventos en el sitio",
        "Iluminación ambiental estándar",
        "Limpieza posterior al evento",
      ],
    },
  },
  {
    id: "signature",
    name: { en: "Signature Package", es: "Paquete Distintivo" },
    tagline: {
      en: "Our most requested experience — polished, generous, effortless.",
      es: "Nuestra experiencia más solicitada — refinada y sin esfuerzo.",
    },
    startingPrice: 5800,
    includedHours: 7,
    includedGuests: 220,
    photoId: "ballroom-2",
    featured: true,
    inclusions: {
      en: [
        "Everything in Essential",
        "7-hour venue rental",
        "Premium linens & chiavari chairs",
        "Enhanced ambient & accent lighting",
        "Private bridal / VIP suite access",
        "Dedicated day-of coordinator",
      ],
      es: [
        "Todo lo del paquete Esencial",
        "Alquiler del salón por 7 horas",
        "Manteles premium y sillas chiavari",
        "Iluminación ambiental y de acento mejorada",
        "Acceso a suite privada VIP",
        "Coordinador dedicado el día del evento",
      ],
    },
  },
  {
    id: "premium",
    name: { en: "Premium Celebration", es: "Celebración Premium" },
    tagline: {
      en: "The full Aurura experience, curated down to the smallest detail.",
      es: "La experiencia Aurura completa, cuidada hasta el último detalle.",
    },
    startingPrice: 9500,
    includedHours: 9,
    includedGuests: 350,
    photoId: "ballroom-1",
    inclusions: {
      en: [
        "Everything in Signature",
        "9-hour full-day venue rental",
        "Custom floral centerpieces",
        "Premium bar service package",
        "DJ & MC services",
        "Photo booth & late-night snack station",
      ],
      es: [
        "Todo lo del paquete Distintivo",
        "Alquiler del salón por 9 horas (día completo)",
        "Centros de mesa florales personalizados",
        "Paquete de servicio de barra premium",
        "Servicios de DJ y maestro de ceremonias",
        "Cabina de fotos y estación de bocadillos nocturna",
      ],
    },
  },
];

export const addOns: AddOn[] = [
  { id: "extra_hour", name: { en: "Additional Event Hour", es: "Hora Adicional" }, description: { en: "Extend your celebration beyond included hours.", es: "Extiende tu celebración más allá de las horas incluidas." }, price: 350, model: "per_hour", category: "logistics" },
  { id: "decor_standard", name: { en: "Decorations", es: "Decoraciones" }, description: { en: "Curated florals, drapery and accent pieces.", es: "Flores, cortinas y detalles decorativos seleccionados." }, price: 450, model: "flat", category: "decor" },
  { id: "decor_premium", name: { en: "Premium Decorations", es: "Decoraciones Premium" }, description: { en: "Elevated floral design and statement installations.", es: "Diseño floral elevado e instalaciones llamativas." }, price: 1200, model: "flat", category: "decor" },
  { id: "catering", name: { en: "Catering", es: "Servicio de Banquete" }, description: { en: "Plated or buffet-style dinner service.", es: "Servicio de cena tipo bufé o emplatado." }, price: 45, model: "per_guest", unitLabel: { en: "per guest", es: "por invitado" }, category: "food_beverage" },
  { id: "bartender", name: { en: "Bartender / Service Staff", es: "Bartender / Personal de Servicio" }, description: { en: "Licensed bartender for beverage service.", es: "Bartender con licencia para el servicio de bebidas." }, price: 250, model: "quantity", unitLabel: { en: "per staff member", es: "por miembro del personal" }, max: 6, category: "staffing" },
  { id: "security", name: { en: "Security Staff", es: "Personal de Seguridad" }, description: { en: "Licensed security for the duration of your event.", es: "Seguridad con licencia durante todo el evento." }, price: 40, model: "per_hour", category: "staffing" },
  { id: "cleaning", name: { en: "Additional Cleaning", es: "Limpieza Adicional" }, description: { en: "Extended post-event cleaning service.", es: "Servicio de limpieza extendido después del evento." }, price: 150, model: "flat", category: "logistics" },
  { id: "dj", name: { en: "DJ Services", es: "Servicio de DJ" }, description: { en: "Professional DJ & MC for your full event.", es: "DJ profesional y maestro de ceremonias." }, price: 600, model: "flat", category: "entertainment" },
  { id: "photography", name: { en: "Photography", es: "Fotografía" }, description: { en: "Professional event photography.", es: "Fotografía profesional del evento." }, price: 900, model: "flat", category: "entertainment" },
  { id: "videography", name: { en: "Videography", es: "Videografía" }, description: { en: "Cinematic event videography.", es: "Videografía cinematográfica del evento." }, price: 1100, model: "flat", category: "entertainment" },
  { id: "photobooth", name: { en: "Photo Booth", es: "Cabina de Fotos" }, description: { en: "Open-air photo booth with props & prints.", es: "Cabina de fotos con accesorios e impresiones." }, price: 650, model: "flat", category: "entertainment" },
  { id: "lighting", name: { en: "Special Lighting", es: "Iluminación Especial" }, description: { en: "Uplighting, monogram projection & accents.", es: "Iluminación de acento, monograma y detalles." }, price: 500, model: "flat", category: "decor" },
  { id: "linens", name: { en: "Premium Table Linens", es: "Manteles Premium" }, description: { en: "Upgraded linens per table.", es: "Manteles mejorados por mesa." }, price: 12, model: "quantity", unitLabel: { en: "per table", es: "por mesa" }, max: 40, category: "decor" },
  { id: "chair_covers", name: { en: "Chair Covers", es: "Fundas para Sillas" }, description: { en: "Elegant chair covers with sash.", es: "Fundas elegantes para sillas con banda." }, price: 4, model: "per_guest", unitLabel: { en: "per guest", es: "por invitado" }, category: "decor" },
  { id: "centerpieces", name: { en: "Centerpieces", es: "Centros de Mesa" }, description: { en: "Designer centerpieces per table.", es: "Centros de mesa de diseñador por mesa." }, price: 35, model: "quantity", unitLabel: { en: "per table", es: "por mesa" }, max: 40, category: "decor" },
  { id: "cake_table", name: { en: "Cake Table Setup", es: "Mesa de Pastel" }, description: { en: "Styled cake table with linens & risers.", es: "Mesa de pastel decorada con manteles y bases." }, price: 75, model: "flat", category: "decor" },
  { id: "dessert_table", name: { en: "Dessert Table", es: "Mesa de Postres" }, description: { en: "Styled dessert display table.", es: "Mesa de exhibición de postres decorada." }, price: 125, model: "flat", category: "decor" },
  { id: "extra_tables", name: { en: "Additional Tables", es: "Mesas Adicionales" }, description: { en: "Extra tables beyond your package.", es: "Mesas adicionales fuera de tu paquete." }, price: 15, model: "quantity", unitLabel: { en: "per table", es: "por mesa" }, max: 20, category: "logistics" },
  { id: "extra_chairs", name: { en: "Additional Chairs", es: "Sillas Adicionales" }, description: { en: "Extra chairs beyond your package.", es: "Sillas adicionales fuera de tu paquete." }, price: 3, model: "quantity", unitLabel: { en: "per chair", es: "por silla" }, max: 100, category: "logistics" },
];

export const contractTerms = {
  cancellation: {
    en: "Deposits are non-refundable. Cancellations made more than 90 days before the event date may receive a credit toward a future booking, less the deposit. Cancellations within 90 days forfeit all payments made.",
    es: "Los depósitos no son reembolsables. Las cancelaciones realizadas con más de 90 días de anticipación pueden recibir un crédito para una reserva futura, menos el depósito. Las cancelaciones dentro de los 90 días pierden todos los pagos realizados.",
  },
  policies: {
    en: "Client agrees to Aurura Event Center's venue policies including approved vendor list, noise ordinance compliance, decor restrictions, and end-of-event timing. Full policy document provided upon booking.",
    es: "El cliente acepta las políticas del recinto de Aurura Event Center, incluyendo la lista de proveedores aprobados, cumplimiento de ordenanzas de ruido, restricciones de decoración y horario de finalización del evento. El documento completo se entrega al reservar.",
  },
  paymentSchedule: {
    en: "A deposit of 30% is due to secure your date. The remaining balance is due no later than 14 days before the event date.",
    es: "Se requiere un depósito del 30% para asegurar tu fecha. El saldo restante vence a más tardar 14 días antes del evento.",
  },
};
