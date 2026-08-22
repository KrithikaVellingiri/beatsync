import {
  LayoutDashboard,
  ListChecks,
  Moon,
  Settings,
  Sun,
  Store,
  Truck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useBeatSyncStore } from "../store/useBeatSyncStore";
import { translate } from "../i18n";

export default function Sidebar({ onSettings }) {
  const { theme, setTheme, language, distributorInfo } = useBeatSyncStore();
  const t = (key) => translate(language, key);

  const ownerName = distributorInfo?.name || "";
  const businessName = distributorInfo?.distributor?.name || "";
  const displayName = ownerName || businessName;
  const initials = displayName
    ? displayName.substring(0, 2).toUpperCase()
    : "—";

  const links = [
    ["/beat", ListChecks, t("beatGenerator")],
    ["/dashboard", LayoutDashboard, t("liveDashboard")],
    ["/ledger", Store, t("storeLedger")],
  ];

  return (
    <aside className="w-64 shrink-0 min-h-screen hidden lg:flex flex-col sticky top-0 bg-white/80 dark:bg-[#092027]/95 border-r border-slate-200 dark:border-blue-950 backdrop-blur-xl">

      {/* LOGO */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white grid place-items-center">
            <Truck size={19} />
          </div>
          <div>
            <div className="font-extrabold tracking-tight text-lg">BeatSync</div>
            <div className="text-[10px] text-slate-500">Distributor operations</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="px-3 space-y-1">
        {links.map(([to, Icon, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-md"
                  : "text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] dark:text-slate-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="mt-auto p-4 space-y-1">

        <button
          onClick={onSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-blue-950/30"
        >
          <Settings size={17} />
          {t("settings")}
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-blue-950/30"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          {theme === "dark" ? t("lightTheme") : t("darkTheme")}
        </button>

        {/* AUTHENTICATED DISTRIBUTOR — always from real API, never hardcoded */}
        <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563eb] grid place-items-center font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                {displayName || t("owner")}
              </div>
              <div className="text-xs text-slate-500">{t("owner")}</div>
            </div>
          </div>
        </div>

      </div>

    </aside>
  );
}
