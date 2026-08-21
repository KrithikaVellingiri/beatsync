import { useState } from "react";


import {
  Bell,
  Bot,
  Menu,
  CalendarDays,
  X, ChevronLeft, ChevronRight,
} from "lucide-react";


import { useLocation } from "react-router-dom";
import PendingCalendar from "./PendingCalendar";

export default function Topbar({ onAsk }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const location = useLocation();

  const title =
    location.pathname.includes("beat")
      ? "Beat Generator"
      : location.pathname.includes("ledger")
      ? "Store Ledger"
      : "Live Dashboard";

  const date =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(new Date());

  return (
    <header className="h-16 flex items-center justify-between px-5 md:px-8 bg-[#2563eb] text-white sticky top-0 z-30 shadow-sm">

      <div className="flex items-center gap-3">

        <button className="lg:hidden p-2 rounded-lg hover:bg-white/10">
          <Menu size={19} />
        </button>

        <div>

          <div className="text-[10px] text-white/65">
            Sharma Distributors
          </div>

          <div className="font-bold">
            {title}
          </div>

        </div>

      </div>


      <div className="flex items-center gap-3">

        <div className="hidden md:block text-xs text-white/70">
          {date}
        </div>

        
        

        <button
          onClick={onAsk}
          className="hidden sm:flex items-center gap-2 rounded-full px-3 py-2 bg-white/10 hover:bg-white/15 text-xs font-semibold"
        >
          <Bot size={15} />
          Ask BeatSync AI
        </button>

        <div className="relative">

          <button
            onClick={() =>
              setCalendarOpen((value) => !value)
            }
            className="relative p-2 rounded-lg hover:bg-white/10"
            title="View pending items by date"
          >
            <CalendarDays size={18} />
          </button>

          {calendarOpen && (
            <PendingCalendar
              onClose={() => setCalendarOpen(false)}
            />
          )}

        </div>


        <button className="relative p-2 rounded-lg hover:bg-white/10">

          <Bell size={18} />

          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 border-2 border-[#2563eb]" />

        </button>


        <div className="w-8 h-8 rounded-full bg-white/15 grid place-items-center text-xs font-bold">
          SJ
        </div>

      </div>

    </header>
  );
}