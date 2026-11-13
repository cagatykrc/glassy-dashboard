import { useMemo, useState } from "react";
import { money } from "../data";
import type { InvoiceStatus } from "../data";
import { Avatar } from "../components/ui";
import { useDashboard } from "../store";

const filters: ("All" | InvoiceStatus)[] = ["All", "Paid", "Pending", "Overdue"];

const chip: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-500/15 text-emerald-800",
  Pending: "bg-amber-500/15 text-amber-800",
  Overdue: "bg-rose-500/15 text-rose-800",
};

export function InvoicesView() {
  const { invoices, setInvoiceStatus } = useDashboard();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const rows = invoices.filter((invoice) => filter === "All" || invoice.status === filter);
  const totals = useMemo(() => {
    const paid = invoices.filter((invoice) => invoice.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
    const open = invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
    const overdue = invoices.filter((invoice) => invoice.status === "Overdue").length;
    return { paid, open, overdue };
  }, [invoices]);

  return (
    <div className="grid h-full min-h-[680px] grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
      <section className="glass flex min-h-0 flex-col rounded-[22px] p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium ${filter === item ? "bg-slate-900/8 text-white" : "text-white/60 hover:bg-slate-900/5"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid grid-cols-[1.1fr_1.4fr_0.8fr_0.9fr_auto] gap-3 px-2 pb-2 text-[11px] tracking-wide text-white/40 uppercase">
            <span>Invoice</span>
            <span>Client</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          <ul className="space-y-1.5">
            {rows.map((invoice) => (
              <li key={invoice.id} className="grid grid-cols-[1.1fr_1.4fr_0.8fr_0.9fr_auto] items-center gap-3 rounded-2xl bg-slate-900/[0.03] px-2 py-2.5">
                <span className="text-[13px] font-semibold">{invoice.id}</span>
                <span className="flex min-w-0 items-center gap-2 text-[13px]">
                  <Avatar name={invoice.client} size={26} />
                  <span className="truncate">{invoice.client}</span>
                </span>
                <span className="text-[13px] text-white/60">{invoice.date}</span>
                <span className="text-[13px] font-medium">{money.format(invoice.amount)}</span>
                <select
                  aria-label={`Status for ${invoice.id}`}
                  value={invoice.status}
                  onChange={(event) => setInvoiceStatus(invoice.id, event.target.value as InvoiceStatus)}
                  className={`rounded-full px-2.5 py-1 text-[12px] font-medium outline-none ${chip[invoice.status]}`}
                >
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                </select>
              </li>
            ))}
          </ul>
          {rows.length === 0 && <p className="py-16 text-center text-sm text-white/45">No invoices in this view.</p>}
        </div>
      </section>
      <aside className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <Summary label="Outstanding" value={money.format(totals.open)} hint="Pending and overdue" />
        <Summary label="Paid" value={money.format(totals.paid)} hint="Cleared invoices" />
        <Summary label="Overdue" value={String(totals.overdue)} hint={totals.overdue === 1 ? "Needs a follow-up" : "Need a follow-up"} />
      </aside>
    </div>
  );
}

function Summary({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="glass rounded-[22px] p-4">
      <p className="text-[12px] text-white/55">{label}</p>
      <p className="mt-2 text-[26px] leading-none font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-[12px] text-white/45">{hint}</p>
    </article>
  );
}
