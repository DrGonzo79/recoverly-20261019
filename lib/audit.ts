import invoices from "../data/demo_invoices.json";

export type Invoice = typeof invoices[number];
export type Finding = Invoice & { varianceCents: number; evidence: string };

export function auditInvoices(minimumDollars: number): Finding[] {
  const minimumCents = Math.max(0, Math.round(minimumDollars * 100));
  return invoices.flatMap((invoice) => {
    const varianceCents = (invoice.billedUnitCents - invoice.contractUnitCents) * invoice.quantity;
    if (varianceCents < minimumCents || varianceCents <= 0) return [];
    return [{...invoice, varianceCents, evidence: `${invoice.quantity} units × ${format(invoice.billedUnitCents - invoice.contractUnitCents)} above contract`}];
  });
}

export function format(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
