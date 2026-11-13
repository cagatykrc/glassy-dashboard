import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Bell, Bookmark, Home, MessageCircle, Settings, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { todayLabel } from "./data";
import type { View } from "./data";
import { Avatar, fieldClass, primaryBtn } from "./components/ui";
import { useDashboard } from "./store";
import { HomeView } from "./views/HomeView";
import { InvoicesView } from "./views/InvoicesView";
import { MessagesView } from "./views/MessagesView";
import { ProjectsView } from "./views/ProjectsView";
import { SavedView } from "./views/SavedView";
import { SettingsView } from "./views/SettingsView";

const nav: { id: View; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "invoices", label: "Invoices" },
  { id: "settings", label: "Settings" },
];

const dock: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "settings", label: "Settings", icon: Settings },
];

const titles: Record<View, string> = {
  home: "Good evening, Robert",
  messages: "Messages",
  saved: "Saved",
  projects: "Projects",
  invoices: "Invoices",
  settings: "Settings",
};

const kickers: Record<View, string> = {
  home: todayLabel(),
  messages: "Workspace",
  saved: "Library",
  projects: "Boards",
  invoices: "Billing",
  settings: "Account",
};

const actionLabel: Partial<Record<View, string>> = {
  home: "Import",
  messages: "New chat",
  saved: "Add new",
  projects: "New project",
  invoices: "New invoice",
};

export default function App() {
  const dashboard = useDashboard();
  const {
    view,
    setView,
    dialog,
    setDialog,
    notifOpen,
    setNotifOpen,
    toast,
    alerts,
    chats,
    notifications,
    reduceMotion,
    detailId,
    setDetailId,
  } = dashboard;
  const unreadChats = chats.reduce((sum, chat) => sum + chat.unread, 0);
  const unreadNotes = notifications.some((note) => !note.read);
  const detail = dashboard.saved.find((item) => item.id === detailId) ?? null;
  const scrollerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = scrollerRef.current;
    if (node) node.scrollTop = 0;
  }, [view]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDialog(null);
      setNotifOpen(false);
      setDetailId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDialog, setDetailId, setNotifOpen]);

  return (
    <div className="relative h-full overflow-hidden">
      <div className="room" aria-hidden="true">
        <img src="/room-elite.jpg" alt="" className="room-photo" />
        <div className="room-light" />
      </div>

      <div className="light-glass relative mx-auto flex h-full w-full max-w-[1560px] items-stretch gap-3 px-3 py-[3.5vh] sm:gap-4 sm:px-5">
        <DropletNav
          view={view}
          label="Primary"
          shape="square"
          reduceMotion={reduceMotion}
          className="glass flex shrink-0 flex-col items-center gap-1.5 self-center rounded-full px-1.5 py-2"
        >
          {dock.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-tab={item.id}
                title={item.label}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                onClick={() => setView(item.id)}
                className="relative z-10 grid h-11 w-11 place-items-center rounded-2xl text-white/70 hover:bg-white/25"
              >
                <Icon size={18} />
                {item.id === "messages" && unreadChats > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#49a6ff]" />
                )}
              </button>
            );
          })}
        </DropletNav>

        <section className="glass-strong min-w-0 flex-1 overflow-hidden rounded-[30px]">
          <div className="shell-content">
            <header className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-3.5 sm:px-5">
              <div className="min-w-0">
                <p className="truncate text-[11px] text-white/50">{kickers[view]}</p>
                <h1 className="truncate text-[20px] leading-tight font-semibold tracking-tight sm:text-[22px]">{titles[view]}</h1>
              </div>
              <DropletNav
                view={view}
                label="Sections"
                shape="pill"
                reduceMotion={reduceMotion}
                className="relative hidden items-center gap-1 rounded-full bg-slate-900/[0.14] p-1 md:flex"
              >
                {nav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    data-tab={item.id}
                    aria-current={view === item.id ? "page" : undefined}
                    onClick={() => setView(item.id)}
                    className="relative z-10 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/70 hover:bg-white/20"
                  >
                    {item.label}
                  </button>
                ))}
              </DropletNav>
              <div className="flex items-center justify-end gap-2">
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Notifications"
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative grid h-9 w-9 place-items-center rounded-full text-white/80 hover:bg-white/10"
                  >
                    <Bell size={16} />
                    {alerts && unreadNotes && <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-amber-300" />}
                  </button>
                  {notifOpen && (
                    <div className="glass absolute top-11 right-0 z-20 w-72 rounded-2xl p-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <p className="text-[12px] font-semibold">Notifications</p>
                        <button type="button" onClick={dashboard.markAllRead} className="text-[11px] text-white/55 hover:text-slate-900">
                          Mark read
                        </button>
                      </div>
                      {!alerts && <p className="px-2 py-3 text-[12px] text-white/50">Notifications are paused in Settings.</p>}
                      {alerts &&
                        notifications.map((note) => (
                          <button
                            key={note.id}
                            type="button"
                            onClick={() => dashboard.openNotification(note.id)}
                            className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left hover:bg-white/10"
                          >
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${note.read ? "bg-white/25" : "bg-sky-300"}`} />
                            <span>
                              <span className="block text-[13px]">{note.title}</span>
                              <span className="text-[11px] text-white/40">{note.time}</span>
                            </span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                <button type="button" aria-label="Account settings" onClick={() => setView("settings")} className="rounded-full">
                  <Avatar name="Robert" hue={24} size={34} />
                </button>
                {actionLabel[view] && (
                  <button type="button" className={primaryBtn} onClick={() => setDialog(dialogFor(view))}>
                    {actionLabel[view]}
                  </button>
                )}
              </div>
            </header>

            <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 pb-3.5 sm:px-4">
              <ViewPanes view={view} />
            </div>

            {dialog && <Dialogs key={dialog} />}
            {detail && (
                <Modal key={detail.id} title={detail.title} onClose={() => setDetailId(null)}>
                  <p className="text-[12px] font-semibold tracking-[0.14em] text-white/50 uppercase">{detail.tag}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{detail.note}</p>
                  <div className="mt-5 flex justify-end gap-2">
                    <button type="button" onClick={() => setDetailId(null)} className="rounded-full px-4 py-2 text-[13px] text-white/70 hover:bg-white/10">
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => dashboard.removeSaved(detail.id)}
                      className="rounded-full bg-rose-500/80 px-4 py-2 text-[13px] font-semibold hover:bg-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                </Modal>
            )}

            {toast && (
              <div role="status" className="glass view-in absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-[13px]">
                {toast}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ViewPanes({ view }: { view: View }) {
  const mountedRef = useRef(new Set<View>([view]));
  mountedRef.current.add(view);

  const panes: { id: View; node: ReactNode }[] = [
    { id: "home", node: <HomeView /> },
    { id: "messages", node: <MessagesView /> },
    { id: "saved", node: <SavedView /> },
    { id: "projects", node: <ProjectsView /> },
    { id: "invoices", node: <InvoicesView /> },
    { id: "settings", node: <SettingsView /> },
  ];

  return panes.map((pane) =>
    mountedRef.current.has(pane.id) ? (
      <div key={pane.id} className={view === pane.id ? "view-pane is-on" : "view-pane"} aria-hidden={view !== pane.id}>
        {pane.node}
      </div>
    ) : null,
  );
}

function DropletNav({
  view,
  label,
  shape,
  reduceMotion,
  className,
  children,
}: {
  view: View;
  label: string;
  shape: "pill" | "square";
  reduceMotion: boolean;
  className: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const dropRef = useRef<HTMLSpanElement>(null);
  const fromRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const seenRef = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const drop = dropRef.current;
    if (!root || !drop) return;

    const place = (animate: boolean) => {
      const held = fromRef.current;
      if (held) {
        drop.style.width = `${held.w}px`;
        drop.style.height = `${held.h}px`;
        drop.style.transform = `translate3d(${held.x}px, ${held.y}px, 0)`;
      }
      drop.getAnimations().forEach((animation) => animation.cancel());
      const target = root.querySelector<HTMLElement>(`[data-tab="${view}"]`);
      const rootBox = root.getBoundingClientRect();
      const box = target?.getBoundingClientRect();
      if (!target || !box || box.width < 2 || rootBox.width < 2) {
        drop.style.opacity = "0";
        return;
      }
      const next = {
        x: box.left - rootBox.left,
        y: box.top - rootBox.top,
        w: box.width,
        h: box.height,
      };
      const prev = fromRef.current;
      if (!animate || !seenRef.current || reduceMotion || !prev) {
        drop.style.width = `${next.w}px`;
        drop.style.height = `${next.h}px`;
        drop.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
        drop.style.opacity = "1";
      } else {
        const horizontal = Math.abs(next.x - prev.x) >= Math.abs(next.y - prev.y);
        const arrive = (t: number) => 1 - (1 - t) ** 3;
        const follow = (t: number) => {
          const u = Math.max(0, (t - 0.24) / 0.76);
          return u * u * (3 - 2 * u);
        };
        const span = (pos: number, size: number, pos1: number, size1: number, along: boolean, t: number) => {
          if (!along) {
            const base = size + (size1 - size) * arrive(t);
            const thin = 1 - 0.2 * Math.sin(Math.PI * t);
            const nextSize = base * thin;
            const center = pos + size / 2 + (pos1 + size1 / 2 - (pos + size / 2)) * arrive(t);
            return { pos: center - nextSize / 2, size: nextSize };
          }
          const forward = pos1 + size1 / 2 >= pos + size / 2;
          const trail0 = forward ? pos : pos + size;
          const trail1 = forward ? pos1 : pos1 + size1;
          const lead0 = forward ? pos + size : pos;
          const lead1 = forward ? pos1 + size1 : pos1;
          const trail = trail0 + (trail1 - trail0) * follow(t);
          const lead = lead0 + (lead1 - lead0) * arrive(t);
          const start = Math.min(trail, lead);
          return { pos: start, size: Math.max(lead, trail) - start };
        };
        const marks = [0, 0.16, 0.34, 0.52, 0.7, 0.86, 1];
        drop.animate(
          marks.map((t) => {
            const x = span(prev.x, prev.w, next.x, next.w, horizontal, t);
            const y = span(prev.y, prev.h, next.y, next.h, !horizontal, t);
            return {
              transform: `translate3d(${x.pos}px, ${y.pos}px, 0)`,
              width: `${x.size}px`,
              height: `${y.size}px`,
              opacity: 1,
              offset: t,
            };
          }),
          { duration: 480, easing: "linear", fill: "forwards" },
        );
      }
      seenRef.current = true;
      fromRef.current = next;
    };

    place(true);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [view, reduceMotion]);

  return (
    <nav ref={rootRef} className={`relative ${className}`} aria-label={label}>
      <span ref={dropRef} className={shape === "square" ? "droplet droplet-square" : "droplet droplet-pill"} aria-hidden="true" />
      {children}
    </nav>
  );
}

function dialogFor(view: View) {
  if (view === "home") return "import" as const;
  if (view === "messages") return "chat" as const;
  if (view === "saved") return "saved" as const;
  if (view === "projects") return "project" as const;
  return "invoice" as const;
}

function Dialogs() {
  const { dialog, setDialog, notify, addChat, addSaved, addProject, addInvoice } = useDashboard();
  if (!dialog) return null;

  return (
    <Modal
      title={
        dialog === "import"
          ? "Import workspace"
          : dialog === "chat"
            ? "New chat"
            : dialog === "saved"
              ? "Save a note"
              : dialog === "project"
                ? "New project"
                : "New invoice"
      }
      onClose={() => setDialog(null)}
    >
      {dialog === "import" && <ImportForm onDone={(name) => { setDialog(null); notify(`Imported ${name}`); }} />}
      {dialog === "chat" && <NamedForm label="Name" placeholder="Stephanie Lane" submit="Start chat" onSubmit={addChat} />}
      {dialog === "saved" && <SavedForm onSubmit={addSaved} />}
      {dialog === "project" && <ProjectForm onSubmit={addProject} />}
      {dialog === "invoice" && <InvoiceForm onSubmit={addInvoice} />}
    </Modal>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="view-in absolute inset-0 z-30 grid place-items-center bg-white/25 p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        className="glass-strong view-in w-full max-w-md rounded-[24px] p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NamedForm({
  label,
  placeholder,
  submit,
  onSubmit,
}: {
  label: string;
  placeholder: string;
  submit: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        onSubmit(value);
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="mb-1.5 block text-[12px] text-white/55">{label}</span>
        <input autoFocus className={fieldClass} value={value} placeholder={placeholder} onChange={(event) => setValue(event.target.value)} />
      </label>
      <button type="submit" className={primaryBtn} disabled={!value.trim()}>
        {submit}
      </button>
    </form>
  );
}

function SavedForm({ onSubmit }: { onSubmit: (title: string, note: string) => void }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(title, note);
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-[12px] text-white/55">Title</span>
        <input autoFocus className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Designing the system" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[12px] text-white/55">Note</span>
        <textarea className={`${fieldClass} min-h-24 resize-none`} value={note} onChange={(event) => setNote(event.target.value)} placeholder="What should you remember?" />
      </label>
      <button type="submit" className={primaryBtn} disabled={!title.trim()}>
        Save
      </button>
    </form>
  );
}

function ProjectForm({ onSubmit }: { onSubmit: (title: string, client: string) => void }) {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(title, client);
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-[12px] text-white/55">Project</span>
        <input autoFocus className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Onboarding rewrite" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[12px] text-white/55">Client</span>
        <input className={fieldClass} value={client} onChange={(event) => setClient(event.target.value)} placeholder="Northwind" />
      </label>
      <button type="submit" className={primaryBtn} disabled={!title.trim()}>
        Create
      </button>
    </form>
  );
}

function InvoiceForm({ onSubmit }: { onSubmit: (client: string, amount: number) => void }) {
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(client, Number(amount));
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-[12px] text-white/55">Client</span>
        <input autoFocus className={fieldClass} value={client} onChange={(event) => setClient(event.target.value)} placeholder="Harbor & Co" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[12px] text-white/55">Amount</span>
        <input className={fieldClass} inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="4800" />
      </label>
      <button type="submit" className={primaryBtn} disabled={!client.trim() || !(Number(amount) > 0)}>
        Create invoice
      </button>
    </form>
  );
}

function ImportForm({ onDone }: { onDone: (name: string) => void }) {
  return (
    <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-white/25 bg-white/5 px-4 py-10 text-center text-sm text-white/70 hover:bg-white/10">
      Drop a file, or click to choose one
      <input
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onDone(file.name);
        }}
      />
    </label>
  );
}
