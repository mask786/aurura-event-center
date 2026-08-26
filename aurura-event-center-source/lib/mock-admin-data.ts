// Seed / sample data for the admin dashboard. Per the platform spec this is
// intentionally configuration data for the first demo — swapping this
// function for a real database query is the only change needed once a
// backend exists.

import { listLocalBookings, type Booking } from "./booking";
import { getPackage } from "./pricing";

export type ContractStatus = "not_sent" | "sent" | "viewed" | "signed";
export type DepositStatus = "pending" | "paid" | "partial" | "paid_in_full";
export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";
export type LeadSource = "google" | "facebook" | "instagram" | "whatsapp" | "direct" | "referral" | "other";

export type AdminRecord = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  packageName: string;
  estimateTotal: number;
  finalQuoteTotal: number | null;
  quoteStatus: QuoteStatus;
  contractStatus: ContractStatus;
  depositStatus: DepositStatus;
  depositAmount: number;
  balance: number;
  leadSource: LeadSource;
  createdAt: string;
  tour: { date: string; time: string } | null;
  isLive?: boolean;
};

export const seedRecords: AdminRecord[] = [
  {
    id: "AU-9F2K1L",
    customerName: "Maria Rodriguez",
    phone: "(214) 555-0148",
    email: "maria.rodriguez@example.com",
    eventType: "Quinceañera",
    eventDate: "2026-10-17",
    guestCount: 150,
    packageName: "Signature Package",
    estimateTotal: 7850,
    finalQuoteTotal: 8200,
    quoteStatus: "accepted",
    contractStatus: "signed",
    depositStatus: "paid",
    depositAmount: 2000,
    balance: 6200,
    leadSource: "instagram",
    createdAt: "2026-07-02T14:20:00Z",
    tour: { date: "2026-07-10", time: "3:00 PM" },
  },
  {
    id: "AU-7B4M9C",
    customerName: "Ashley & Devon Carter",
    phone: "(469) 555-0122",
    email: "ashley.carter@example.com",
    eventType: "Wedding",
    eventDate: "2027-04-24",
    guestCount: 280,
    packageName: "Premium Celebration",
    estimateTotal: 15400,
    finalQuoteTotal: 15900,
    quoteStatus: "sent",
    contractStatus: "not_sent",
    depositStatus: "pending",
    depositAmount: 4770,
    balance: 11130,
    leadSource: "google",
    createdAt: "2026-08-05T18:02:00Z",
    tour: { date: "2026-08-14", time: "11:00 AM" },
  },
  {
    id: "AU-3Q8V2X",
    customerName: "Priya Natarajan",
    phone: "(972) 555-0177",
    email: "priya.n@example.com",
    eventType: "Corporate Event",
    eventDate: "2026-11-05",
    guestCount: 120,
    packageName: "Essential Package",
    estimateTotal: 4950,
    finalQuoteTotal: null,
    quoteStatus: "draft",
    contractStatus: "not_sent",
    depositStatus: "pending",
    depositAmount: 1485,
    balance: 3465,
    leadSource: "referral",
    createdAt: "2026-08-12T09:41:00Z",
    tour: null,
  },
  {
    id: "AU-5H1D7W",
    customerName: "Jasmine Lee",
    phone: "(817) 555-0193",
    email: "jasmine.lee@example.com",
    eventType: "Sweet Sixteen",
    eventDate: "2026-09-19",
    guestCount: 90,
    packageName: "Signature Package",
    estimateTotal: 6700,
    finalQuoteTotal: 6700,
    quoteStatus: "accepted",
    contractStatus: "viewed",
    depositStatus: "pending",
    depositAmount: 2010,
    balance: 4690,
    leadSource: "facebook",
    createdAt: "2026-07-28T20:15:00Z",
    tour: { date: "2026-08-02T00:00:00Z".slice(0, 10), time: "5:00 PM" },
  },
  {
    id: "AU-2N6R4T",
    customerName: "The Whitfield Family",
    phone: "(214) 555-0110",
    email: "whitfield.family@example.com",
    eventType: "Graduation",
    eventDate: "2026-09-02",
    guestCount: 60,
    packageName: "Essential Package",
    estimateTotal: 3800,
    finalQuoteTotal: 3800,
    quoteStatus: "accepted",
    contractStatus: "signed",
    depositStatus: "paid_in_full",
    depositAmount: 3800,
    balance: 0,
    leadSource: "whatsapp",
    createdAt: "2026-07-15T12:00:00Z",
    tour: { date: "2026-07-20", time: "2:00 PM" },
  },
  {
    id: "AU-8K3P5Y",
    customerName: "Elena Vasquez",
    phone: "(469) 555-0166",
    email: "elena.vasquez@example.com",
    eventType: "Baby Shower",
    eventDate: "2026-10-03",
    guestCount: 45,
    packageName: "Essential Package",
    estimateTotal: 3200,
    finalQuoteTotal: null,
    quoteStatus: "draft",
    contractStatus: "not_sent",
    depositStatus: "pending",
    depositAmount: 960,
    balance: 2240,
    leadSource: "direct",
    createdAt: "2026-08-16T08:30:00Z",
    tour: { date: "2026-08-21", time: "4:00 PM" },
  },
  {
    id: "AU-6T9J2Z",
    customerName: "Marcus & Renee Owens",
    phone: "(972) 555-0134",
    email: "owens.wedding@example.com",
    eventType: "Wedding",
    eventDate: "2026-12-12",
    guestCount: 210,
    packageName: "Premium Celebration",
    estimateTotal: 12900,
    finalQuoteTotal: 13350,
    quoteStatus: "declined",
    contractStatus: "not_sent",
    depositStatus: "pending",
    depositAmount: 4005,
    balance: 9345,
    leadSource: "google",
    createdAt: "2026-06-30T16:45:00Z",
    tour: { date: "2026-07-06", time: "10:00 AM" },
  },
  {
    id: "AU-4W7L8Q",
    customerName: "Sofia Martinez",
    phone: "(817) 555-0159",
    email: "sofia.martinez@example.com",
    eventType: "Quinceañera",
    eventDate: "2027-02-13",
    guestCount: 175,
    packageName: "Premium Celebration",
    estimateTotal: 10600,
    finalQuoteTotal: null,
    quoteStatus: "draft",
    contractStatus: "not_sent",
    depositStatus: "pending",
    depositAmount: 3180,
    balance: 7420,
    leadSource: "instagram",
    createdAt: "2026-08-15T21:10:00Z",
    tour: null,
  },
];

function bookingToAdminRecord(b: Booking): AdminRecord | null {
  if (!b.estimate || !b.lead) return null;
  const pkg = getPackage(b.estimate.packageId);
  const quoteStatus: QuoteStatus = b.quote?.status ?? "draft";
  const contractStatus: ContractStatus = b.contract?.signedAt ? "signed" : b.quote?.status === "accepted" ? "sent" : "not_sent";
  const depositStatus: DepositStatus = b.payment?.depositPaid
    ? "paid"
    : "pending";

  return {
    id: b.id,
    customerName: `${b.lead.firstName} ${b.lead.lastName}`.trim(),
    phone: b.lead.phone,
    email: b.lead.email,
    eventType: b.estimate.eventType,
    eventDate: b.estimate.eventDate,
    guestCount: b.estimate.guestCount,
    packageName: pkg ? pkg.name.en : "—",
    estimateTotal: b.estimate.breakdown.total,
    finalQuoteTotal: b.quote?.finalTotal ?? null,
    quoteStatus,
    contractStatus,
    depositStatus,
    depositAmount: b.payment?.amount ?? b.quote?.deposit ?? b.estimate.breakdown.deposit,
    balance: b.quote ? b.quote.balance : b.estimate.breakdown.balance,
    leadSource: "direct",
    createdAt: b.createdAt,
    tour: b.tour ? { date: b.tour.date, time: b.tour.time } : null,
    isLive: true,
  };
}

/** Merges seed data with any bookings created live in this browser during the demo. */
export function listAllRecords(): AdminRecord[] {
  const live = listLocalBookings()
    .map(bookingToAdminRecord)
    .filter((r): r is AdminRecord => !!r);
  // de-dupe by id, live entries take priority
  const liveIds = new Set(live.map((r) => r.id));
  return [...live, ...seedRecords.filter((r) => !liveIds.has(r.id))];
}

export function computeMetrics(records: AdminRecord[]) {
  return {
    newLeads: records.length,
    toursScheduled: records.filter((r) => r.tour).length,
    quotesSent: records.filter((r) => r.quoteStatus === "sent" || r.quoteStatus === "accepted").length,
    bookingsConfirmed: records.filter((r) => r.depositStatus === "paid" || r.depositStatus === "paid_in_full").length,
    pipelineValue: records.reduce((sum, r) => sum + (r.finalQuoteTotal ?? r.estimateTotal), 0),
  };
}
