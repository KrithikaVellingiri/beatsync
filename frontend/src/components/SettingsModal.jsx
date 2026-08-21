import { useEffect } from "react";
import { Hash, Phone, Users, X } from "lucide-react";
import { deliveryBoys } from "../data/mockData";

export default function SettingsModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="glass w-full max-w-2xl max-h-[min(90vh,42rem)] overflow-y-auto rounded-2xl border border-slate-200 p-5 text-slate-900 shadow-2xl dark:border-slate-800 dark:text-white sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="settings-title" className="text-xl font-bold">Settings</h2>
            <p className="mt-1 text-xs text-slate-500">Distributor account and delivery team</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-950 dark:bg-blue-950/25">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB] text-white">
              <Hash size={17} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Team code</div>
              <div className="mt-1 font-bold tracking-[0.18em] text-[#2563EB]">SHARMA24</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <Users size={17} className="text-[#2563EB]" />
            <h3 className="font-bold">Delivery team</h3>
            <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {deliveryBoys.length} assigned
            </span>
          </div>

          <div className="space-y-2">
            {deliveryBoys.map((boy) => (
              <div
                key={boy.id}
                className="flex flex-col gap-3 rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-[#2563EB]">
                    {boy.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{boy.name}</div>
                    <div className="text-xs text-slate-500">{boy.area}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-12 text-xs sm:pl-0">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone size={13} />
                    {boy.phone || "Not available"}
                  </div>
                  {boy.status && (
                    <span className="rounded-full bg-white px-2.5 py-1 font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                      {boy.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}