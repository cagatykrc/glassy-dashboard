import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  chatsSeed,
  clockTime,
  invoicesSeed,
  notesSeed,
  projectsSeed,
  savedSeed,
} from "./data";
import type {
  Chat,
  Dialog,
  Invoice,
  InvoiceStatus,
  Note,
  Project,
  ProjectColumn,
  SavedItem,
  View,
} from "./data";

type DashboardContextValue = {
  view: View;
  setView: (view: View) => void;
  dialog: Dialog;
  setDialog: (dialog: Dialog) => void;
  notifOpen: boolean;
  setNotifOpen: (open: boolean) => void;
  toast: string | null;
  notify: (message: string) => void;
  compact: boolean;
  setCompact: (value: boolean) => void;
  alerts: boolean;
  setAlerts: (value: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  chats: Chat[];
  activeChatId: string;
  openChat: (id: string) => void;
  addChat: (name: string) => void;
  sendMessage: (text: string) => void;
  saved: SavedItem[];
  detailId: string | null;
  setDetailId: (id: string | null) => void;
  addSaved: (title: string, note: string) => void;
  removeSaved: (id: string) => void;
  projects: Project[];
  addProject: (title: string, client: string) => void;
  advanceProject: (id: string) => void;
  invoices: Invoice[];
  addInvoice: (client: string, amount: number) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  notifications: Note[];
  openNotification: (id: string) => void;
  markAllRead: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const tones = [
  "from-sky-300/55 to-blue-500/35",
  "from-amber-200/60 to-orange-400/35",
  "from-fuchsia-300/50 to-violet-500/32",
  "from-emerald-200/55 to-teal-500/32",
  "from-rose-300/55 to-pink-500/32",
];

const order: ProjectColumn[] = ["progress", "review", "done"];

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("home");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [chats, setChats] = useState<Chat[]>(() => structuredClone(chatsSeed));
  const [activeChatId, setActiveChatId] = useState(chatsSeed[0].id);
  const [saved, setSaved] = useState<SavedItem[]>(() => structuredClone(savedSeed));
  const [detailId, setDetailId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => structuredClone(projectsSeed));
  const [invoices, setInvoices] = useState<Invoice[]>(() => structuredClone(invoicesSeed));
  const [notifications, setNotifications] = useState<Note[]>(() => structuredClone(notesSeed));
  const timer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const openChat = useCallback((id: string) => {
    setActiveChatId(id);
    setChats((current) => current.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat)));
  }, []);

  const addChat = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const id = crypto.randomUUID();
      const chat: Chat = {
        id,
        name: trimmed,
        role: "New contact",
        email: `${trimmed.toLowerCase().replace(/\s+/g, ".")}@northwind.co`,
        phone: "—",
        location: "Remote",
        hue: trimmed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360,
        online: true,
        preview: "Conversation started",
        time: "Now",
        unread: 0,
        messages: [
          {
            id: crypto.randomUUID(),
            from: "them",
            text: `Hey Robert — ${trimmed.split(" ")[0]} just joined the thread.`,
            time: clockTime(),
          },
        ],
      };
      setChats((current) => [chat, ...current]);
      setActiveChatId(id);
      setView("messages");
      setDialog(null);
      notify(`Started a chat with ${trimmed}`);
    },
    [notify],
  );

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const time = clockTime();
    setChats((current) => {
      const next = current.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return {
          ...chat,
          preview: trimmed,
          time: "Now",
          messages: [...chat.messages, { id: crypto.randomUUID(), from: "me" as const, text: trimmed, time }],
        };
      });
      const index = next.findIndex((chat) => chat.id === activeChatId);
      if (index <= 0) return next;
      const [item] = next.splice(index, 1);
      return [item, ...next];
    });
  }, [activeChatId]);

  const addSaved = useCallback(
    (title: string, note: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      const item: SavedItem = {
        id: crypto.randomUUID(),
        title: trimmed,
        note: note.trim() || "Saved from the workspace.",
        tag: "UI",
        icon: "spark",
        tone: tones[saved.length % tones.length],
      };
      setSaved((current) => [item, ...current]);
      setView("saved");
      setDialog(null);
      notify("Saved to your library");
    },
    [notify, saved.length],
  );

  const removeSaved = useCallback(
    (id: string) => {
      setSaved((current) => current.filter((item) => item.id !== id));
      setDetailId(null);
      notify("Removed from Saved");
    },
    [notify],
  );

  const addProject = useCallback(
    (title: string, client: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      const project: Project = {
        id: crypto.randomUUID(),
        title: trimmed,
        client: client.trim() || "Internal",
        tag: "New",
        column: "progress",
        progress: 12,
      };
      setProjects((current) => [project, ...current]);
      setView("projects");
      setDialog(null);
      notify("Project added");
    },
    [notify],
  );

  const advanceProject = useCallback((id: string) => {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== id) return project;
        const column = order[(order.indexOf(project.column) + 1) % order.length];
        return { ...project, column, progress: column === "done" ? 100 : project.progress };
      }),
    );
  }, []);

  const addInvoice = useCallback(
    (client: string, amount: number) => {
      const trimmed = client.trim();
      if (!trimmed || !Number.isFinite(amount) || amount <= 0) {
        notify("Enter a client and an amount");
        return;
      }
      const invoice: Invoice = {
        id: `INV-${Date.now().toString().slice(-4)}`,
        client: trimmed,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        amount,
        status: "Pending",
      };
      setInvoices((current) => [invoice, ...current]);
      setView("invoices");
      setDialog(null);
      notify(`${invoice.id} created`);
    },
    [notify],
  );

  const setInvoiceStatus = useCallback((id: string, status: InvoiceStatus) => {
    setInvoices((current) => current.map((invoice) => (invoice.id === id ? { ...invoice, status } : invoice)));
  }, []);

  const openNotification = useCallback((id: string) => {
    const note = notifications.find((item) => item.id === id);
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
    if (note) setView(note.target);
    setNotifOpen(false);
  }, [notifications]);

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }, []);

  const value = useMemo<DashboardContextValue>(
    () => ({
      view,
      setView,
      dialog,
      setDialog,
      notifOpen,
      setNotifOpen,
      toast,
      notify,
      compact,
      setCompact,
      alerts,
      setAlerts,
      reduceMotion,
      setReduceMotion,
      chats,
      activeChatId,
      openChat,
      addChat,
      sendMessage,
      saved,
      detailId,
      setDetailId,
      addSaved,
      removeSaved,
      projects,
      addProject,
      advanceProject,
      invoices,
      addInvoice,
      setInvoiceStatus,
      notifications,
      openNotification,
      markAllRead,
    }),
    [
      view,
      dialog,
      notifOpen,
      toast,
      notify,
      compact,
      alerts,
      reduceMotion,
      chats,
      activeChatId,
      openChat,
      addChat,
      sendMessage,
      saved,
      detailId,
      addSaved,
      removeSaved,
      projects,
      addProject,
      advanceProject,
      invoices,
      addInvoice,
      setInvoiceStatus,
      notifications,
      openNotification,
      markAllRead,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value) throw new Error("useDashboard must be used inside DashboardProvider");
  return value;
}
