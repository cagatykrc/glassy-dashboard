import { useState } from "react";
import { Avatar, fieldClass, primaryBtn } from "../components/ui";
import { useDashboard } from "../store";

export function SettingsView() {
  const { compact, setCompact, alerts, setAlerts, reduceMotion, setReduceMotion, notify } = useDashboard();
  const [name, setName] = useState("Robert");
  const [email, setEmail] = useState("robert@northwind.co");
  const [timezone, setTimezone] = useState("Europe/Istanbul");

  return (
    <div className="grid h-full min-h-[680px] grid-cols-1 gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
      <section className="glass flex flex-col items-center rounded-[22px] px-5 py-8 text-center">
        <Avatar name={name || "Robert"} hue={24} size={84} online />
        <h2 className="mt-4 text-lg font-semibold">{name || "Robert"}</h2>
        <p className="text-[13px] text-white/55">Product designer</p>
        <p className="mt-1 text-[12px] text-white/40">Northwind</p>
      </section>
      <section className="glass rounded-[22px] p-5">
        <h2 className="text-sm font-semibold">Profile</h2>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            notify("Settings saved");
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-[12px] text-white/55">Display name</span>
            <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] text-white/55">Email</span>
            <input className={fieldClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[12px] text-white/55">Timezone</span>
            <select className={fieldClass} value={timezone} onChange={(event) => setTimezone(event.target.value)}>
              <option value="Europe/Istanbul">Istanbul (GMT+3)</option>
              <option value="Europe/London">London</option>
              <option value="America/Los_Angeles">San Francisco</option>
            </select>
          </label>
          <div className="sm:col-span-2 space-y-2">
            <Toggle on={alerts} label="Notifications" hint="Show the bell badge and the inbox." onClick={() => setAlerts(!alerts)} />
            <Toggle on={compact} label="Compact layout" hint="Tighten the gaps between cards." onClick={() => setCompact(!compact)} />
            <Toggle on={reduceMotion} label="Reduce motion" hint="Keep the glass, skip the lifts and bars." onClick={() => setReduceMotion(!reduceMotion)} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={primaryBtn}>
              Save changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Toggle({ on, label, hint, onClick }: { on: boolean; label: string; hint: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-slate-900/[0.03] px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-[12px] text-white/45">{hint}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-[#2f7cf6]" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-out ${on ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}
