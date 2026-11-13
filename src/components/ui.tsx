import { useId } from "react";

export function Avatar({
  name,
  hue,
  size = 36,
  online,
}: {
  name: string;
  hue?: number;
  size?: number;
  online?: boolean;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const color = hue ?? [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;

  return (
    <span className="relative inline-flex shrink-0">
      <span
        className="keep-light grid place-items-center rounded-full font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.34,
          background: `linear-gradient(145deg, hsl(${color} 78% 62%), hsl(${(color + 28) % 360} 72% 42%))`,
        }}
      >
        {initials}
      </span>
      {online !== undefined && (
        <span
          className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-black/40 ${online ? "bg-emerald-400" : "bg-white/35"}`}
        />
      )}
    </span>
  );
}

export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const id = `spark-${useId().replace(/:/g, "")}`;
  const width = 160;
  const height = 46;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - 6 - ((value - min) / (max - min || 1)) * (height - 12);
    return { x, y };
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-11 w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Ring({
  value,
  color = "#f5b042",
  size = 92,
  animate = true,
}: {
  value: number;
  color?: string;
  size?: number;
  animate?: boolean;
}) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={stroke}
        />
        <circle
          className={animate ? "ring-draw" : undefined}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ ["--ring-from" as string]: `${circumference}px`, ["--ring-to" as string]: `${offset}px` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-lg font-semibold">{value}%</div>
    </div>
  );
}

export const fieldClass =
  "w-full rounded-xl border border-white/50 bg-[#eef0f4]/80 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#eef0f4]";

export const primaryBtn =
  "keep-light inline-flex items-center justify-center rounded-full bg-[#2f7cf6] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(47,124,246,0.35)] transition hover:bg-[#4690ff] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";
