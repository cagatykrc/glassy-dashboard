import type { ProjectColumn } from "../data";
import { useDashboard } from "../store";

const columns: { id: ProjectColumn; label: string; dot: string; action: string }[] = [
  { id: "progress", label: "In progress", dot: "bg-sky-400", action: "Send to review" },
  { id: "review", label: "Review", dot: "bg-amber-300", action: "Mark done" },
  { id: "done", label: "Done", dot: "bg-emerald-400", action: "Reopen" },
];

export function ProjectsView() {
  const { projects, advanceProject, compact } = useDashboard();

  return (
    <div className={`grid h-full min-h-[680px] grid-cols-1 lg:grid-cols-3 ${compact ? "gap-2" : "gap-3"}`}>
      {columns.map((column) => {
        const cards = projects.filter((project) => project.column === column.id);
        return (
          <section key={column.id} className="glass flex min-h-0 flex-col rounded-[22px] p-4">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <span className={`h-2 w-2 rounded-full ${column.dot}`} />
                {column.label}
              </h2>
              <span className="text-[11px] text-white/45">{cards.length}</span>
            </header>
            <div className="min-h-0 flex-1 space-y-2.5 overflow-auto">
              {cards.map((project) => (
                <article key={project.id} className="rounded-2xl border border-slate-900/8 bg-slate-900/[0.03] p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[14px] font-semibold">{project.title}</h3>
                      <p className="text-[12px] text-white/50">{project.client}</p>
                    </div>
                    <span className="rounded-full bg-slate-900/[0.05] px-2 py-0.5 text-[10px] font-medium text-white/70">{project.tag}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-[#49a6ff]" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-[11px] text-white/55">{project.progress}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => advanceProject(project.id)}
                    className="mt-3 text-[12px] font-medium text-sky-700 hover:text-sky-900"
                  >
                    {column.action}
                  </button>
                </article>
              ))}
              {cards.length === 0 && <p className="px-1 py-8 text-center text-[13px] text-white/40">Nothing here.</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
