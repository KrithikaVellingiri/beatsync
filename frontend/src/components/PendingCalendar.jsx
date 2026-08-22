import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useBeatSyncStore } from "../store/useBeatSyncStore";
import { translate } from "../i18n";

export default function PendingCalendar({ onClose }) {
  const language = useBeatSyncStore((state) => state.language);
  const deliveryBoys = useBeatSyncStore((state) => state.deliveryBoys);
  const fetchTeam = useBeatSyncStore((state) => state.fetchTeam);
  const t = (key) => translate(language, key);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch team on mount if not already loaded
  useEffect(() => {
    if (!deliveryBoys || deliveryBoys.length === 0) {
      fetchTeam();
    }
  }, []);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const monthName = selectedDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const getDateKey = (day) => {
    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  };


  const previousMonth = () => {
    setSelectedDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setSelectedDate(
      new Date(year, month + 1, 1)
    );
  };

  return (
    <div className="absolute right-0 top-12 w-[360px] glass rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 text-slate-900 dark:text-white">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">

        <div>
          <div className="font-bold">
            {t("pendingItems")}
          </div>

          <div className="text-[10px] text-slate-500">
            {t("selectDatePending")}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={16} />
        </button>

      </div>


      {/* MONTH NAVIGATION */}

      <div className="flex items-center justify-between mb-3">

        <button
          onClick={previousMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="text-sm font-bold">
          {monthName}
        </div>

        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronRight size={16} />
        </button>

      </div>


      {/* WEEK DAYS */}

      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">

        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
          (day) => (
            <div key={day}>
              {day}
            </div>
          )
        )}

      </div>


      {/* CALENDAR DAYS */}

      <div className="grid grid-cols-7 gap-1">

        {Array.from({
          length: firstDay,
        }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}


        {Array.from({
          length: daysInMonth,
        }).map((_, index) => {

          const day = index + 1;
          const dateKey = getDateKey(day);

          const hasPending = false; // Future: populate from beat API

          const isSelected =
            day === selectedDate.getDate();

          return (
            <button
              key={day}
              onClick={() =>
                setSelectedDate(
                  new Date(year, month, day)
                )
              }
              className={`
                relative h-8 rounded-lg text-xs font-semibold
                hover:bg-blue-50 dark:hover:bg-blue-950/40
                ${
                  isSelected
                    ? "bg-[#2563EB] text-white"
                    : ""
                }
              `}
            >

              {day}

              {hasPending && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
              )}

            </button>
          );
        })}

      </div>


      {/* SELECTED DATE */}

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-slate-500">
              {t("selectedDate")}
            </div>
            <div className="font-bold text-sm mt-1">
              {selectedDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            No pending data
          </span>
        </div>

        <div className="text-center py-4 text-xs text-slate-500">
          {t("noPendingItems")}
        </div>

      </div>

      {/* DELIVERY TEAM */}
      {deliveryBoys && deliveryBoys.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-3">
            Delivery Team
          </div>
          <div className="space-y-2">
            {deliveryBoys.map((boy) => {
              const initials = (boy.name || "?").substring(0, 2).toUpperCase();
              return (
                <div
                  key={boy.id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563eb] grid place-items-center font-bold text-xs shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs truncate">{boy.name}</div>
                    {boy.phone && (
                      <div className="text-[10px] text-slate-500">{boy.phone}</div>
                    )}
                  </div>
                  <span className="ml-auto text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}