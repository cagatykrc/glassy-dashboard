import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Mail, MapPin, Paperclip, Phone, Search, Send, Video } from "lucide-react";
import { Avatar } from "../components/ui";
import { useDashboard } from "../store";

export function MessagesView() {
  const { chats, activeChatId, openChat, sendMessage, notify, compact } = useDashboard();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const active = chats.find((chat) => chat.id === activeChatId) ?? chats[0];
  const visible = chats.filter((chat) => chat.name.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const end = endRef.current;
    const scroller = end?.parentElement;
    if (!end || !scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [active?.id, active?.messages.length]);

  if (!active) {
    return (
      <div className="glass grid h-full min-h-64 place-items-center rounded-[22px] text-sm text-white/60">
        No conversations yet.
      </div>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(draft);
    setDraft("");
  };

  return (
    <div className={`grid h-full min-h-[680px] grid-cols-1 ${compact ? "gap-2" : "gap-3"} xl:grid-cols-[280px_minmax(0,1fr)_280px]`}>
      <section className="glass flex min-h-0 flex-col rounded-[22px] p-3">
        <label className="relative mb-3 block">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages"
            className="w-full rounded-xl border border-white/50 bg-[#eef0f4]/80 py-2 pr-3 pl-8 text-[13px] outline-none placeholder:text-slate-500 focus:border-[#eef0f4]"
          />
        </label>
        <ul className="min-h-0 flex-1 space-y-1 overflow-auto">
          {visible.map((chat) => {
            const selected = chat.id === active.id;
            return (
              <li key={chat.id}>
                <button
                  type="button"
                  onClick={() => openChat(chat.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left ${selected ? "border border-slate-900/10 bg-slate-900/[0.05]" : "hover:bg-slate-900/[0.03]"}`}
                >
                  <Avatar name={chat.name} hue={chat.hue} size={40} online={chat.online} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13px] font-semibold">{chat.name}</span>
                      <span className="shrink-0 text-[10px] text-white/40">{chat.time}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-white/55">{chat.preview}</span>
                  </span>
                  {chat.unread > 0 && (
                    <span className="keep-light grid h-5 min-w-5 place-items-center rounded-full bg-[#2f7cf6] px-1 text-[10px] font-semibold text-white">
                      {chat.unread}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          {visible.length === 0 && <li className="px-2 py-6 text-center text-[13px] text-white/45">No matches.</li>}
        </ul>
      </section>

      <section className="glass flex min-h-[420px] flex-col rounded-[22px] p-4">
        <header className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={active.name} hue={active.hue} size={40} online={active.online} />
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">{active.name}</h2>
              <p className="text-[11px] text-white/50">{active.online ? "Online" : "Away"} · {active.role}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button type="button" aria-label="Call" onClick={() => notify(`Calling ${active.name}`)} className="grid h-9 w-9 place-items-center rounded-full text-white/80 hover:bg-white/10">
              <Phone size={16} />
            </button>
            <button type="button" aria-label="Video" onClick={() => notify(`Starting a video call with ${active.name}`)} className="grid h-9 w-9 place-items-center rounded-full text-white/80 hover:bg-white/10">
              <Video size={16} />
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
          {active.messages.map((message) => (
            <div key={message.id} className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                  message.from === "me"
                    ? "keep-light rounded-br-md bg-[#2f7cf6] text-white"
                    : "rounded-bl-md border border-slate-200 bg-[#eef0f4] text-white"
                }`}
              >
                <p>{message.text}</p>
                <p className={`mt-1 text-[10px] ${message.from === "me" ? "text-white/70" : "text-white/40"}`}>{message.time}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={submit} className="mt-3 flex items-center gap-2">
          <label className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/15">
            <Paperclip size={16} />
            <span className="sr-only">Attach a file</span>
            <input
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) sendMessage(`Shared a file: ${file.name}`);
                event.target.value = "";
              }}
            />
          </label>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message"
            className="h-10 min-w-0 flex-1 rounded-full border border-white/50 bg-[#eef0f4]/80 px-4 text-[13px] outline-none placeholder:text-slate-500 focus:border-[#eef0f4]"
          />
          <button type="submit" aria-label="Send" disabled={!draft.trim()} className="keep-light grid h-10 w-10 place-items-center rounded-full bg-[#2f7cf6] text-white disabled:opacity-40">
            <Send size={16} />
          </button>
        </form>
      </section>

      <section className="glass flex min-h-0 flex-col rounded-[22px] p-4">
        <div className="flex flex-col items-center pt-3 text-center">
          <Avatar name={active.name} hue={active.hue} size={76} online={active.online} />
          <h2 className="mt-3 text-base font-semibold">{active.name}</h2>
          <p className="text-[12px] text-white/55">{active.role}</p>
        </div>
        <dl className="mt-5 space-y-3 text-[13px]">
          <div className="flex items-center gap-3 text-white/80">
            <Mail size={15} className="text-white/45" />
            <dd className="truncate">{active.email}</dd>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Phone size={15} className="text-white/45" />
            <dd>{active.phone}</dd>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <MapPin size={15} className="text-white/45" />
            <dd>{active.location}</dd>
          </div>
        </dl>
        <h3 className="mt-6 mb-2 text-[12px] font-medium text-white/50">Shared</h3>
        <div className="grid grid-cols-3 gap-2">
          {["from-sky-400/70 to-blue-700/40", "from-amber-300/70 to-orange-600/40", "from-fuchsia-400/70 to-violet-700/40"].map((tone) => (
            <div key={tone} className={`h-16 rounded-xl bg-gradient-to-br ${tone}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
