import { addOns, packages, venue, type AddOn } from "./config";

export type AddOnSelection = {
  addOnId: string;
  quantity: number; // meaning depends on model — see calcAddOnTotal
};

export type EstimateInput = {
  packageId: string | null;
  guestCount: number;
  selections: AddOnSelection[];
};

export function getAddOn(id: string): AddOn | undefined {
  return addOns.find((a) => a.id === id);
}

export function getPackage(id: string | null) {
  return packages.find((p) => p.id === id) ?? null;
}

/** Returns the dollar total for a single add-on selection. */
export function calcAddOnTotal(addOn: AddOn, quantity: number, guestCount: number): number {
  if (quantity <= 0) return 0;
  switch (addOn.model) {
    case "flat":
      return addOn.price;
    case "per_guest":
      return addOn.price * guestCount;
    case "per_hour":
      return addOn.price * quantity;
    case "quantity":
      return addOn.price * quantity;
    default:
      return 0;
  }
}

export type EstimateBreakdown = {
  packageBase: number;
  packageName: string | null;
  addOnLines: Array<{
    addOn: AddOn;
    quantity: number;
    total: number;
  }>;
  addOnsSubtotal: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  deposit: number;
  balance: number;
};

export function calcEstimate(input: EstimateInput, lang: "en" | "es" = "en"): EstimateBreakdown {
  const pkg = getPackage(input.packageId);
  const packageBase = pkg?.startingPrice ?? 0;

  const addOnLines = input.selections
    .map((sel) => {
      const addOn = getAddOn(sel.addOnId);
      if (!addOn) return null;
      const total = calcAddOnTotal(addOn, sel.quantity, input.guestCount);
      return { addOn, quantity: sel.quantity, total };
    })
    .filter((line): line is { addOn: AddOn; quantity: number; total: number } => !!line && line.total > 0);

  const addOnsSubtotal = addOnLines.reduce((sum, l) => sum + l.total, 0);
  const subtotal = packageBase + addOnsSubtotal;
  const serviceFee = Math.round(subtotal * venue.serviceFeePercent);
  const total = subtotal + serviceFee;
  const deposit = Math.round(total * venue.depositPercent);
  const balance = total - deposit;

  return {
    packageBase,
    packageName: pkg ? pkg.name[lang] : null,
    addOnLines,
    addOnsSubtotal,
    subtotal,
    serviceFee,
    total,
    deposit,
    balance,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: venue.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
