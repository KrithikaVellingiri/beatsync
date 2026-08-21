import { useState } from "react";


import {
  Bot,
  Building2,
  Menu,
  CalendarDays,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";


import { useLocation } from "react-router-dom";
import PendingCalendar from "./PendingCalendar";
import { translate } from "../i18n";
import { useBeatSyncStore } from "../store/useBeatSyncStore";

export default function Topbar({ onAsk }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const language = useBeatSyncStore((state) => state.language);
  const t = (key) => translate(language, key);

  const title =
    location.pathname.includes("beat")
      ? t("beatGenerator")
      : location.pathname.includes("ledger")
      ? t("storeLedger")
      : t("liveDashboard");

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
          {t("askBeatSyncAI")}
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


        <div className="relative">
          <button
            onClick={() => setProfileOpen((value) => !value)}
            className="w-8 h-8 rounded-full bg-white/15 grid place-items-center text-xs font-bold hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/70"
            aria-label="Open owner profile"
            aria-expanded={profileOpen}
            title="Owner profile"
          >
            SJ
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2rem))] glass rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 text-slate-900 dark:text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-[#2563eb] grid place-items-center font-bold">
                    SJ
                  </div>
                  <div>
                    <div className="font-bold">Sharma ji</div>
                    <div className="text-xs text-slate-500">Owner</div>
                  </div>
                </div>

                <button
                  onClick={() => setProfileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close owner profile"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4 text-sm">
                <div className="flex items-center gap-3">
                  <Building2 size={16} className="text-[#2563eb]" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{t("business")}</div>
                    <div className="font-semibold">Sharma Distributors</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserRound size={16} className="text-[#2563eb]" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{t("ownerName")}</div>
                    <div className="font-semibold">Sharma ji</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#2563eb]" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{t("emailAddress")}</div>
                    <div className="font-semibold truncate">sharma.distributors@example.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#2563eb]" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{t("phoneNumber")}</div>
                    <div className="font-semibold">+91 98765 43210</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {t("logout")}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}