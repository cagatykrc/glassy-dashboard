import {
  Contrast,
  Droplet,
  LayoutGrid,
  Palette,
  Receipt,
  Shapes,
  Smartphone,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import type { SavedIcon } from "../data";
import { useDashboard } from "../store";

const icons: Record<SavedIcon, typeof LayoutGrid> = {
  layout: LayoutGrid,
  spark: Sparkles,
  waves: Waves,
  phone: Smartphone,
  contrast: Contrast,
  shapes: Shapes,
  receipt: Receipt,
  users: Users,
  palette: Palette,
  droplet: Droplet,
};

export function SavedView() {
  const { saved, setDetailId, compact } = useDashboard();
  const gap = compact ? "gap-2" : "gap-3";

  if (saved.length === 0) {
    return (
      <div className="glass grid h-64 place-items-center rounded-[22px] text-sm text-white/60">
        Nothing saved yet. Use Add new to keep a note.
      </div>
    );
  }

  return (
    <div className={`grid h-full min-h-[520px] grid-cols-2 md:grid-cols-3 xl:grid-cols-5 xl:auto-rows-fr ${gap}`}>
      {saved.map((item) => {
        const Icon = icons[item.icon];
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setDetailId(item.id)}
            className={`lift relative h-full min-h-[176px] overflow-hidden rounded-[22px] border border-white/40 bg-[#eef0f4]/75 bg-gradient-to-br p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ${item.tone}`}
          >
            <span className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30" />
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/25">
              <Icon size={18} />
            </span>
            <p className="relative mt-8 text-[10px] font-semibold tracking-[0.14em] text-white/75 uppercase">{item.tag}</p>
            <h3 className="relative mt-1 text-[15px] leading-snug font-semibold">{item.title}</h3>
            <p className="relative mt-1 line-clamp-2 text-[12px] text-white/80">{item.note}</p>
          </button>
        );
      })}
    </div>
  );
}
