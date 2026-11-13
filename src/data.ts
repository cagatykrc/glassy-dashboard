export type View = "home" | "messages" | "saved" | "projects" | "invoices" | "settings";

export type Dialog = null | "import" | "chat" | "saved" | "project" | "invoice";

export type Author = "me" | "them";

export type ChatMessage = {
  id: string;
  from: Author;
  text: string;
  time: string;
};

export type Chat = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  hue: number;
  online: boolean;
  preview: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
};

export type SavedIcon =
  | "layout"
  | "spark"
  | "waves"
  | "phone"
  | "contrast"
  | "shapes"
  | "receipt"
  | "users"
  | "palette"
  | "droplet";

export type SavedItem = {
  id: string;
  title: string;
  note: string;
  tag: string;
  icon: SavedIcon;
  tone: string;
};

export type ProjectColumn = "progress" | "review" | "done";

export type Project = {
  id: string;
  title: string;
  client: string;
  tag: string;
  column: ProjectColumn;
  progress: number;
};

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export type Invoice = {
  id: string;
  client: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
};

export type Note = {
  id: string;
  title: string;
  time: string;
  read: boolean;
  target: View;
};

export const chatsSeed: Chat[] = [
  {
    id: "stephanie",
    name: "Stephanie Lane",
    role: "Product lead",
    email: "stephanie@northwind.co",
    phone: "+1 415 555 0148",
    location: "San Francisco",
    hue: 199,
    online: true,
    preview: "Let's review it after standup.",
    time: "9:41",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "Morning Robert — did you see the latest glass pass?", time: "9:12" },
      { id: "m2", from: "me", text: "Yes. The blur feels right. I lifted the stat cards a little.", time: "9:18" },
      { id: "m3", from: "them", text: "Clients loved the blue bar. Can we keep that glow?", time: "9:24" },
      { id: "m4", from: "me", text: "Already in. I'll send the saved grid next.", time: "9:31" },
      { id: "m5", from: "them", text: "Perfect. Let's review it after standup.", time: "9:41" },
    ],
  },
  {
    id: "noah",
    name: "Noah Brooks",
    role: "Brand designer",
    email: "noah@northwind.co",
    phone: "+1 415 555 0172",
    location: "Oakland",
    hue: 28,
    online: true,
    preview: "Icons are in the Figma file.",
    time: "8:56",
    unread: 2,
    messages: [
      { id: "n1", from: "them", text: "Icons are in the Figma file. 24px, rounded caps.", time: "8:40" },
      { id: "n2", from: "me", text: "Got them. The bookmark still feels heavy.", time: "8:48" },
      { id: "n3", from: "them", text: "I'll thin the stroke and re-export tonight.", time: "8:56" },
    ],
  },
  {
    id: "maya",
    name: "Maya Chen",
    role: "Engineer",
    email: "maya@northwind.co",
    phone: "+1 628 555 0114",
    location: "Remote",
    hue: 332,
    online: true,
    preview: "Homepage is approved.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: "y1", from: "them", text: "Homepage is approved. Shipping the contrast fixes with it.", time: "Yesterday" },
      { id: "y2", from: "me", text: "Thank you. Leave the amber card until I recheck the type.", time: "Yesterday" },
    ],
  },
  {
    id: "liam",
    name: "Liam Ortiz",
    role: "Research",
    email: "liam@northwind.co",
    phone: "+1 510 555 0190",
    location: "Berkeley",
    hue: 152,
    online: false,
    preview: "Can we move review to 4?",
    time: "Yesterday",
    unread: 1,
    messages: [
      { id: "l1", from: "them", text: "Can we move review to 4? The morning session ran long.", time: "Yesterday" },
    ],
  },
  {
    id: "ava",
    name: "Ava Kaplan",
    role: "Finance",
    email: "ava@northwind.co",
    phone: "+1 415 555 0166",
    location: "San Francisco",
    hue: 262,
    online: false,
    preview: "INV-179 is paid.",
    time: "Mon",
    unread: 0,
    messages: [
      { id: "a1", from: "them", text: "INV-179 is paid. I'll send the receipt to Lumen.", time: "Mon" },
      { id: "a2", from: "me", text: "Perfect. Atlas is the only one still open.", time: "Mon" },
    ],
  },
  {
    id: "priya",
    name: "Priya Shah",
    role: "Accessibility",
    email: "priya@northwind.co",
    phone: "+1 650 555 0133",
    location: "Palo Alto",
    hue: 12,
    online: true,
    preview: "White at 70% fails on amber.",
    time: "Mon",
    unread: 0,
    messages: [
      { id: "p1", from: "them", text: "White at 70% fails on the amber card. Bump the note to 85.", time: "Mon" },
      { id: "p2", from: "me", text: "Done on the saved grid. I'll mirror it on invoices.", time: "Mon" },
    ],
  },
];

export const savedSeed: SavedItem[] = [
  {
    id: "s1",
    title: "Designing the system",
    note: "Type, spacing, and the glass recipe for the main shell.",
    tag: "UI",
    icon: "layout",
    tone: "from-sky-300/55 to-blue-500/35",
  },
  {
    id: "s2",
    title: "Quiet pricing page",
    note: "Fewer plans, one highlighted offer, no hard borders.",
    tag: "Product",
    icon: "spark",
    tone: "from-amber-200/60 to-orange-400/35",
  },
  {
    id: "s3",
    title: "Motion interactions",
    note: "Cards lift a few pixels. Nothing else moves without a reason.",
    tag: "UI",
    icon: "waves",
    tone: "from-fuchsia-300/50 to-violet-500/32",
  },
  {
    id: "s4",
    title: "The empty state",
    note: "One sentence and one action. No illustration.",
    tag: "Product",
    icon: "palette",
    tone: "from-emerald-200/55 to-teal-500/32",
  },
  {
    id: "s5",
    title: "Mobile app onboarding",
    note: "Three steps, then the first saved board.",
    tag: "Mobile",
    icon: "phone",
    tone: "from-rose-300/55 to-pink-500/32",
  },
  {
    id: "s6",
    title: "Color contrast checker",
    note: "White at 70% fails on amber. The note sits at 85 now.",
    tag: "UI",
    icon: "contrast",
    tone: "from-cyan-200/55 to-sky-500/32",
  },
  {
    id: "s7",
    title: "Icon set, 24px",
    note: "Rounded caps, 1.75 stroke, aligned to the pixel grid.",
    tag: "UI",
    icon: "shapes",
    tone: "from-amber-100/60 to-yellow-400/34",
  },
  {
    id: "s8",
    title: "Invoice table spacing",
    note: "Row height 52. The status chip never wraps.",
    tag: "Finance",
    icon: "receipt",
    tone: "from-violet-200/55 to-indigo-500/32",
  },
  {
    id: "s9",
    title: "Team presence",
    note: "The online dot only shows if someone acted today.",
    tag: "Product",
    icon: "users",
    tone: "from-lime-200/55 to-emerald-500/30",
  },
  {
    id: "s10",
    title: "Glass border recipes",
    note: "A 1px white edge plus a soft highlight along the top.",
    tag: "UI",
    icon: "droplet",
    tone: "from-rose-200/55 to-orange-400/30",
  },
];

export const projectsSeed: Project[] = [
  { id: "pr1", title: "Glassy Dashboard", client: "Northwind", tag: "UI", column: "progress", progress: 72 },
  { id: "pr2", title: "Onboarding rewrite", client: "Lumen", tag: "Mobile", column: "progress", progress: 46 },
  { id: "pr3", title: "Invoice export", client: "Harbor", tag: "Finance", column: "review", progress: 90 },
  { id: "pr4", title: "Icon library", client: "Studio", tag: "Brand", column: "review", progress: 80 },
  { id: "pr5", title: "Contrast pass", client: "Internal", tag: "A11y", column: "done", progress: 100 },
  { id: "pr6", title: "Landing refresh", client: "Northwind", tag: "Web", column: "done", progress: 100 },
];

export const invoicesSeed: Invoice[] = [
  { id: "INV-184", client: "Harbor & Co", date: "Oct 12", amount: 4800, status: "Pending" },
  { id: "INV-179", client: "Lumen Studio", date: "Oct 2", amount: 12400, status: "Paid" },
  { id: "INV-176", client: "Northwind", date: "Sep 28", amount: 8250, status: "Paid" },
  { id: "INV-171", client: "Atlas Retail", date: "Sep 14", amount: 3600, status: "Overdue" },
  { id: "INV-166", client: "Studio North", date: "Sep 2", amount: 6900, status: "Paid" },
];

export const notesSeed: Note[] = [
  { id: "nt1", title: "Maya approved the homepage", time: "12m", read: false, target: "home" },
  { id: "nt2", title: "Stephanie sent a message", time: "26m", read: false, target: "messages" },
  { id: "nt3", title: "Invoice INV-171 is overdue", time: "2h", read: false, target: "invoices" },
];

export const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function clockTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
