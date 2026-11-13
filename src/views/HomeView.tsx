import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Sparkline, Ring, Avatar } from "../components/ui";
import { useDashboard } from "../store";

const stats = [
  {
    label: "Revenue",
    value: "$48.2k",
    delta: "+12.4%",
    color: "#34d399",
    data: [18, 22, 20, 26, 24, 30, 28, 36, 34, 42],
  },
  {
    label: "Pipeline",
    value: "$126k",
    delta: "+4.8%",
    color: "#38bdf8",
    data: [40, 38, 44, 42, 48, 46, 52, 50, 58, 62],
  },
  {
    label: "Focus",
    value: "164h",
    delta: "+18h",
    color: "#a78bfa",
    data: [12, 16, 14, 18, 22, 20, 24, 28, 26, 32],
  },
  {
    label: "Completion",
    value: "86%",
    delta: "+3.1%",
    color: "#fbbf24",
    data: [60, 62, 64, 63, 70, 72, 74, 78, 80, 86],
  },
];

const bars = [32, 48, 40, 62, 44, 70, 38, 55, 46, 96, 58, 42, 64, 36, 50];
const barLabels = ["14", "", "16", "", "18", "", "20", "", "22", "Fri", "", "26", "", "28", ""];

const initialTasks = [
  { id: "t1", title: "Team standup", meta: "Conference room", time: "9:30", color: "#38bdf8", done: true },
  { id: "t2", title: "Design review", meta: "Usability pass", time: "11:00", color: "#a78bfa", done: false },
  { id: "t3", title: "Client sync", meta: "Baseline", time: "13:30", color: "#fbbf24", done: false },
  { id: "t4", title: "Ship the saved grid", meta: "Glassy Dashboard", time: "16:00", color: "#34d399", done: false },
  { id: "t5", title: "Release notes", meta: "Draft for Friday", time: "17:30", color: "#fb7185", done: false },
];

const activity = [
  { name: "Maya Chen", hue: 332, text: "approved the web redesign", time: "12m" },
  { name: "Noah Brooks", hue: 28, text: "commented on the icon set", time: "34m" },
  { name: "Ava Kaplan", hue: 262, text: "marked INV-179 as paid", time: "2h" },
  { name: "Liam Ortiz", hue: 152, text: "asked to move review to 4", time: "4h" },
];

const team = [
  { name: "Stephanie Lane", role: "Product", hue: 199, online: true },
  { name: "Noah Brooks", role: "Design", hue: 28, online: true },
  { name: "Maya Chen", role: "Engineering", hue: 332, online: true },
  { name: "Liam Ortiz", role: "Research", hue: 152, online: false },
];

export function HomeView() {
  const { compact, reduceMotion } = useDashboard();
  const [tasks, setTasks] = useState(initialTasks);
  const gap = compact ? "gap-2" : "gap-3";
  const remaining = tasks.filter((task) => !task.done).length;

  return (
    <div className={`flex h-full min-h-[680px] flex-col ${gap}`}>
      <div className={`grid grid-cols-2 ${gap} xl:grid-cols-4`}>
        {stats.map((stat) => (
          <article key={stat.label} className="glass lift rounded-[22px] px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-white/65">{stat.label}</p>
              <p className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-300">
                <ArrowUpRight size={12} />
                {stat.delta}
              </p>
            </div>
            <Sparkline data={stat.data} color={stat.color} />
            <p className="text-[26px] leading-none font-semibold tracking-tight">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className={`grid min-h-0 flex-1 grid-cols-1 ${gap} xl:grid-cols-12 xl:grid-rows-[minmax(240px,1.4fr)_minmax(168px,0.72fr)]`}>
        <section className="glass flex min-h-[260px] flex-col rounded-[22px] p-4 xl:col-span-8 xl:row-start-1">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Productivity</h2>
              <p className="text-[11px] text-white/45">Last 15 days</p>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              ↑ 18%
            </span>
          </header>
          <div
            className="relative min-h-0 flex-1"
            style={{
              backgroundImage: "linear-gradient(to top, rgba(28, 32, 48, 0.08) 1px, transparent 1px)",
              backgroundSize: "100% 25%",
            }}
          >
            <div className="absolute inset-0 flex items-stretch gap-1.5 sm:gap-2">
              {bars.map((bar, index) => {
                const active = index === 9;
                return (
                  <div key={index} className="relative h-full flex-1">
                    <div
                      title={`${bar}`}
                      className={`absolute inset-x-0 bottom-0 rounded-t-md ${reduceMotion ? "" : "bar-rise"} ${active ? "bg-[#49a6ff] shadow-[0_0_22px_rgba(73,166,255,0.45)]" : "bg-[#f7f8fa] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.45)]"}`}
                      style={{ height: `${bar}%`, animationDelay: `${index * 28}ms` }}
                    />
                    {active && (
                      <span
                        className="absolute left-1/2 -translate-x-1/2 rounded-md bg-[#eef0f4] px-1.5 py-0.5 text-[10px] font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200"
                        style={{ bottom: `calc(${bar}% + 8px)` }}
                      >
                        96
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-white/40">
            {barLabels.map((label, index) => (
              <span key={index} className="flex-1 text-center">
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="glass flex min-h-[260px] flex-col rounded-[22px] p-4 xl:col-span-4 xl:row-start-1">
          <header className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Today</h2>
            <span className="text-[11px] text-white/45">{remaining} open</span>
          </header>
          <ul className="min-h-0 flex-1 space-y-1 overflow-auto">
            {tasks.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() =>
                    setTasks((current) =>
                      current.map((item) => (item.id === task.id ? { ...item, done: !item.done } : item)),
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/10"
                >
                  <span
                    className="grid h-4 w-4 shrink-0 place-items-center rounded-full"
                    style={{ background: task.color, opacity: task.done ? 0.35 : 1 }}
                  >
                    {task.done && <Check size={10} className="text-slate-950" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[13px] font-medium ${task.done ? "text-white/40 line-through" : ""}`}>
                      {task.title}
                    </span>
                    <span className="block text-[11px] text-white/45">{task.meta}</span>
                  </span>
                  <span className="text-[11px] text-white/45">{task.time}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass flex min-h-[168px] flex-col rounded-[22px] p-4 xl:col-span-5">
          <h2 className="mb-2 text-sm font-semibold">Recent activity</h2>
          <ul className="min-h-0 flex-1 space-y-2 overflow-auto">
            {activity.map((item) => (
              <li key={item.name} className="flex items-center gap-3">
                <Avatar name={item.name} hue={item.hue} size={30} />
                <p className="min-w-0 flex-1 truncate text-[13px]">
                  <span className="font-medium">{item.name}</span>{" "}
                  <span className="text-white/60">{item.text}</span>
                </p>
                <span className="text-[11px] text-white/40">{item.time}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass flex min-h-[168px] flex-col rounded-[22px] p-4 xl:col-span-3">
          <h2 className="mb-2 text-sm font-semibold">Team</h2>
          <ul className="min-h-0 flex-1 space-y-2 overflow-auto">
            {team.map((member) => (
              <li key={member.name} className="flex items-center gap-2.5">
                <Avatar name={member.name} hue={member.hue} size={28} online={member.online} />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium">{member.name}</span>
                  <span className="block text-[11px] text-white/45">{member.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass flex min-h-[168px] items-center gap-4 rounded-[22px] p-4 xl:col-span-4">
          <Ring value={76} animate={!reduceMotion} />
          <div className="min-w-0">
            <p className="text-[11px] text-white/45">This quarter</p>
            <h2 className="text-sm font-semibold">Design quality</h2>
            <p className="mt-1 text-[12px] text-white/60">12 of 16 milestones are in.</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[76%] rounded-full bg-[#f5b042]" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
