"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { LogOut, Settings, Search } from "lucide-react";
import { isAdminAuthed, clearAdminAuthed } from "@/lib/admin-auth";
import { listAllRecords, computeMetrics, type AdminRecord } from "@/lib/mock-admin-data";
import { formatCurrency } from "@/lib/pricing";
import { venue } from "@/lib/config";

type Tab = "leads" | "tours" | "quotes" | "contracts" | "payments" | "events";

const TABS: Tab[] = ["leads", "tours", "quotes", "contracts", "payments", "events"];

const TAB_LABELS: Record<Tab, string> = {
  leads: "Leads",
  tours: "Tours",
  quotes: "Quotes",
  contracts: "Contracts",
  payments: "Payments",
  events: "Events",
};

function StatusPill({ tone, children }: { tone: "neutral" | "gold" | "green" | "red"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-ivory-deep text-charcoal-soft border-hairline",
    gold: "bg-gold/15 text-gold-deep border-gold/40",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };
  return <span className={clsx("inline-block px-2.5 py-1 text-[11px] uppercase tracking-wide border rounded-full", tones[tone])}>{children}</span>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("leads");
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAdminAuthed()) {
      router.push("/admin/login");
    } else {
      setAuthed(true);
      setRecords(listAllRecords());
    }
  }, [router]);

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) => r.customerName.toLowerCase().includes(q) || r.eventType.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  }, [records, search]);

  const metrics = useMemo(() => computeMetrics(records), [records]);

  if (authed === null) return <div className="pt-40 text-center text-charcoal-soft/60">Loading…</div>;

  return (
    <div className="min-h-screen bg-ivory-deep pt-24 md:pt-28 pb-20">
      <div className="container-aurura">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif-display text-2xl md:text-3xl">Venue Admin Dashboard</h1>
            <p className="text-sm text-charcoal-soft/60">{venue.name} — Operations Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/pricing" className="btn btn-outline text-xs">
              <Settings size={14} /> Pricing Management
            </Link>
            <button
              onClick={() => {
                clearAdminAuthed();
                router.push("/admin/login");
              }}
              className="btn btn-outline text-xs"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          <Metric label="New Leads (30d)" value={String(metrics.newLeads)} />
          <Metric label="Tours Scheduled" value={String(metrics.toursScheduled)} />
          <Metric label="Quotes Sent" value={String(metrics.quotesSent)} />
          <Metric label="Bookings Confirmed" value={String(metrics.bookingsConfirmed)} />
          <Metric label="Active Pipeline Value" value={formatCurrency(metrics.pipelineValue)} gold />
        </div>

        <div className="bg-white border border-hairline">
          <div className="flex items-center justify-between border-b border-hairline px-4 md:px-6 overflow-x-auto">
            <div className="flex">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={clsx(
                    "px-4 md:px-5 py-4 text-xs md:text-sm tracking-wide uppercase whitespace-nowrap border-b-2 transition-colors",
                    tab === t ? "border-gold text-charcoal" : "border-transparent text-charcoal-soft/50 hover:text-charcoal-soft"
                  )}
                >
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6 border-b border-hairline">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers…"
                className="w-full border border-hairline pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {tab === "leads" && <LeadsTable records={filtered} />}
            {tab === "tours" && <ToursTable records={filtered} />}
            {tab === "quotes" && <QuotesTable records={filtered} />}
            {tab === "contracts" && <ContractsTable records={filtered} />}
            {tab === "payments" && <PaymentsTable records={filtered} />}
            {tab === "events" && <EventsTable records={filtered} />}
          </div>
        </div>

        <p className="text-xs text-charcoal-soft/40 mt-6 max-w-2xl">
          This dashboard reads from configuration/seed data plus any bookings created live in this browser during the demo — swap
          `listAllRecords()` in <code>lib/mock-admin-data.ts</code> for a real database query to go to production. Tour availability
          is currently simulated; connect a live Google Calendar for samk@newmagic.ai to replace <code>lib/tour-availability.ts</code>.
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="bg-white border border-hairline p-4 md:p-5">
      <p className="text-[11px] uppercase tracking-wide text-charcoal-soft/55 mb-1.5">{label}</p>
      <p className={clsx("font-serif-display text-xl md:text-2xl", gold && "text-gold-deep")}>{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left text-[11px] uppercase tracking-wide text-charcoal-soft/55 font-medium px-4 md:px-6 py-3">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 md:px-6 py-4 text-sm align-top">{children}</td>;
}

function CustomerCell({ r }: { r: AdminRecord }) {
  return (
    <div>
      <p className="font-medium">{r.customerName}</p>
      <p className="text-xs text-charcoal-soft/55">{r.eventType} · {new Date(r.eventDate + "T00:00:00").toLocaleDateString()}</p>
      <p className="text-xs text-charcoal-soft/40">{r.id}</p>
    </div>
  );
}

function LeadsTable({ records }: { records: AdminRecord[] }) {
  return (
    <table className="w-full min-w-[720px]">
      <thead className="border-b border-hairline">
        <tr>
          <Th>Customer</Th>
          <Th>Contact</Th>
          <Th>Guests</Th>
          <Th>Estimate</Th>
          <Th>Source</Th>
          <Th>Received</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {records.map((r) => (
          <tr key={r.id}>
            <Td><CustomerCell r={r} /></Td>
            <Td>
              <p>{r.phone}</p>
              <p className="text-charcoal-soft/55">{r.email}</p>
            </Td>
            <Td>{r.guestCount}</Td>
            <Td>{formatCurrency(r.estimateTotal)}</Td>
            <Td><span className="capitalize">{r.leadSource}</span></Td>
            <Td>{new Date(r.createdAt).toLocaleDateString()}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ToursTable({ records }: { records: AdminRecord[] }) {
  const withTours = records.filter((r) => r.tour);
  return (
    <table className="w-full min-w-[640px]">
      <thead className="border-b border-hairline">
        <tr>
          <Th>Customer</Th>
          <Th>Tour Date</Th>
          <Th>Tour Time</Th>
          <Th>Event Date</Th>
          <Th>Guests</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {withTours.map((r) => (
          <tr key={r.id}>
            <Td><CustomerCell r={r} /></Td>
            <Td>{r.tour && new Date(r.tour.date + "T00:00:00").toLocaleDateString()}</Td>
            <Td>{r.tour?.time}</Td>
            <Td>{new Date(r.eventDate + "T00:00:00").toLocaleDateString()}</Td>
            <Td>{r.guestCount}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function quoteTone(status: AdminRecord["quoteStatus"]) {
  if (status === "accepted") return "green" as const;
  if (status === "sent") return "gold" as const;
  if (status === "declined") return "red" as const;
  return "neutral" as const;
}

function QuotesTable({ records }: { records: AdminRecord[] }) {
  return (
    <table className="w-full min-w-[680px]">
      <thead className="border-b border-hairline">
        <tr>
          <Th>Customer</Th>
          <Th>Package</Th>
          <Th>Estimate</Th>
          <Th>Final Quote</Th>
          <Th>Status</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {records.map((r) => (
          <tr key={r.id}>
            <Td><CustomerCell r={r} /></Td>
            <Td>{r.packageName}</Td>
            <Td>{formatCurrency(r.estimateTotal)}</Td>
            <Td>{r.finalQuoteTotal ? formatCurrency(r.finalQuoteTotal) : "—"}</Td>
            <Td><StatusPill tone={quoteTone(r.quoteStatus)}>{r.quoteStatus.replace("_", " ")}</StatusPill></Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function contractTone(status: AdminRecord["contractStatus"]) {
  if (status === "signed") return "green" as const;
  if (status === "viewed" || status === "sent") return "gold" as const;
  return "neutral" as const;
}

function ContractsTable({ records }: { records: AdminRecord[] }) {
  return (
    <table className="w-full min-w-[600px]">
      <thead className="border-b border-hairline">
        <tr>
          <Th>Customer</Th>
          <Th>Package</Th>
          <Th>Total</Th>
          <Th>Contract Status</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {records.map((r) => (
          <tr key={r.id}>
            <Td><CustomerCell r={r} /></Td>
            <Td>{r.packageName}</Td>
            <Td>{r.finalQuoteTotal ? formatCurrency(r.finalQuoteTotal) : formatCurrency(r.estimateTotal)}</Td>
            <Td><StatusPill tone={contractTone(r.contractStatus)}>{r.contractStatus.replace("_", " ")}</StatusPill></Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function depositTone(status: AdminRecord["depositStatus"]) {
  if (status === "paid_in_full") return "green" as const;
  if (status === "paid" || status === "partial") return "gold" as const;
  return "neutral" as const;
}

function PaymentsTable({ records }: { records: AdminRecord[] }) {
  return (
    <table className="w-full min-w-[680px]">
      <thead className="border-b border-hairline">
        <tr>
          <Th>Customer</Th>
          <Th>Deposit</Th>
          <Th>Balance</Th>
          <Th>Status</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {records.map((r) => (
          <tr key={r.id}>
            <Td><CustomerCell r={r} /></Td>
            <Td>{formatCurrency(r.depositAmount)}</Td>
            <Td>{formatCurrency(r.balance)}</Td>
            <Td><StatusPill tone={depositTone(r.depositStatus)}>{r.depositStatus.replace("_", " ")}</StatusPill></Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EventsTable({ records }: { records: AdminRecord[] }) {
  const confirmed = records
    .filter((r) => r.depositStatus === "paid" || r.depositStatus === "paid_in_full")
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  return (
    <table className="w-full min-w-[680px]">
      <thead className="border-b border-hairline">
        <tr>
          <Th>Customer</Th>
          <Th>Event Date</Th>
          <Th>Guests</Th>
          <Th>Package</Th>
          <Th>Total</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-hairline">
        {confirmed.map((r) => (
          <tr key={r.id}>
            <Td><CustomerCell r={r} /></Td>
            <Td>{new Date(r.eventDate + "T00:00:00").toLocaleDateString()}</Td>
            <Td>{r.guestCount}</Td>
            <Td>{r.packageName}</Td>
            <Td>{r.finalQuoteTotal ? formatCurrency(r.finalQuoteTotal) : formatCurrency(r.estimateTotal)}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
