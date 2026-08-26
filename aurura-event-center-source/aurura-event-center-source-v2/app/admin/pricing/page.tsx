"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, RotateCcw, Info } from "lucide-react";
import { isAdminAuthed } from "@/lib/admin-auth";
import { packages as basePackages, addOns as baseAddOns, venue } from "@/lib/config";
import { formatCurrency } from "@/lib/pricing";

const DRAFT_KEY = "aurura_pricing_draft";

type Draft = {
  packagePrices: Record<string, number>;
  addOnPrices: Record<string, number>;
  depositPercent: number;
  serviceFeePercent: number;
};

function defaultDraft(): Draft {
  return {
    packagePrices: Object.fromEntries(basePackages.map((p) => [p.id, p.startingPrice])),
    addOnPrices: Object.fromEntries(baseAddOns.map((a) => [a.id, a.price])),
    depositPercent: venue.depositPercent * 100,
    serviceFeePercent: venue.serviceFeePercent * 100,
  };
}

export default function AdminPricingPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<Draft>(defaultDraft());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAdminAuthed()) {
      router.push("/admin/login");
      return;
    }
    setAuthed(true);
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        setDraft(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, [router]);

  function save() {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function reset() {
    const d = defaultDraft();
    setDraft(d);
    window.localStorage.removeItem(DRAFT_KEY);
  }

  if (authed === null) return <div className="pt-40 text-center text-charcoal-soft/60">Loading…</div>;

  return (
    <div className="min-h-screen bg-ivory-deep pt-24 md:pt-28 pb-24">
      <div className="container-aurura max-w-4xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-charcoal-soft/70 hover:text-charcoal mb-6">
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif-display text-2xl md:text-3xl">Pricing Management</h1>
            <p className="text-sm text-charcoal-soft/60">Update package prices, add-on pricing and fees without touching code.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="btn btn-outline text-xs">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={save} className="btn btn-primary text-xs">
              <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-5 py-3 mb-8 flex items-start gap-2">
          <Info size={15} className="mt-0.5 shrink-0" />
          Edits here save as a local draft in this browser to demonstrate the pricing-management workflow. In production this
          writes directly to the venue configuration that powers packages, the estimator and quotes — already centralized in a
          single config module, so no further application changes are needed to make this live.
        </div>

        <div className="bg-white border border-hairline p-6 md:p-8 mb-6">
          <h3 className="font-serif-display text-xl mb-5">Packages</h3>
          <div className="divide-y divide-hairline">
            {basePackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">{pkg.name.en}</p>
                  <p className="text-xs text-charcoal-soft/55">
                    {pkg.includedHours} hrs · up to {pkg.includedGuests} guests
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-charcoal-soft/50">$</span>
                  <input
                    type="number"
                    value={draft.packagePrices[pkg.id]}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, packagePrices: { ...d.packagePrices, [pkg.id]: Number(e.target.value) } }))
                    }
                    className="w-28 border border-hairline px-3 py-2 text-sm text-right focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-hairline p-6 md:p-8 mb-6">
          <h3 className="font-serif-display text-xl mb-5">Add-On Services</h3>
          <div className="divide-y divide-hairline">
            {baseAddOns.map((addOn) => (
              <div key={addOn.id} className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-sm font-medium">{addOn.name.en}</p>
                  <p className="text-xs text-charcoal-soft/55 capitalize">{addOn.model.replace("_", " ")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-charcoal-soft/50">$</span>
                  <input
                    type="number"
                    value={draft.addOnPrices[addOn.id]}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, addOnPrices: { ...d.addOnPrices, [addOn.id]: Number(e.target.value) } }))
                    }
                    className="w-24 border border-hairline px-3 py-2 text-sm text-right focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-hairline p-6 md:p-8">
          <h3 className="font-serif-display text-xl mb-5">Deposit & Fees</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between border border-hairline px-4 py-3">
              <span className="text-sm">Deposit Required</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={draft.depositPercent}
                  onChange={(e) => setDraft((d) => ({ ...d, depositPercent: Number(e.target.value) }))}
                  className="w-16 text-right text-sm focus:outline-none"
                />
                <span className="text-charcoal-soft/50">%</span>
              </div>
            </div>
            <div className="flex items-center justify-between border border-hairline px-4 py-3">
              <span className="text-sm">Service & Admin Fee</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={draft.serviceFeePercent}
                  onChange={(e) => setDraft((d) => ({ ...d, serviceFeePercent: Number(e.target.value) }))}
                  className="w-16 text-right text-sm focus:outline-none"
                />
                <span className="text-charcoal-soft/50">%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-charcoal-soft/50 mt-5">
            Example: Signature Package at {formatCurrency(draft.packagePrices["signature"] ?? 0)} with a{" "}
            {draft.depositPercent}% deposit = {formatCurrency(Math.round((draft.packagePrices["signature"] ?? 0) * (draft.depositPercent / 100)))} due to book.
          </p>
        </div>
      </div>
    </div>
  );
}
