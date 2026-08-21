import { useMemo } from "react";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ChevronRight,
  PackageX,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { deliveryBoys} from "../data/mockData";
import { useBeatSyncStore } from "../store/useBeatSyncStore";

import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const navigate = useNavigate();

  const [attentionOpen, setAttentionOpen] = useState(false);

  const setSelectedBoy = useBeatSyncStore(
    (state) => state.setSelectedBoy
  );

  const setSelectedStore = useBeatSyncStore(
    (state) => state.setSelectedStore
  );

  const openBoy = (boyId) => {
    setSelectedBoy(boyId);
    setSelectedStore(null);
    navigate("/ledger");
  };

  const statusColor = (status) => {
    if (status === "Completed") return "text-emerald-600";
    if (status === "Delayed") return "text-red-600";
    return "text-[#2563EB]";
  };

  const isInactive = (lastActive) => {
  if (!lastActive) return false;

  const now = new Date("2026-08-19T10:30:00");
  const last = new Date(lastActive);

  const differenceInMinutes =
    (now - last) / (1000 * 60);

  return differenceInMinutes >= 90;
};

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-end justify-between gap-4">

        <div>

          {/* <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#2563EB] dark:text-blue-300">
            Operations control room
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mt-1">
            Live Operations
          </h1> */}

          <div className="text-xs font-extrabold uppercase tracking-[0.5em] text-[#000000] dark:text-black-300">
            Track today's route progress, collections and exceptions
            in real time.
          </div>

        </div>


        <div className="flex items-center gap-2">

  {/* LIVE STATUS */}
  <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#2563EB] bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300 px-3 py-2 rounded-full">

    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

    Live updates

  </div>


  {/* NEEDS ATTENTION TOGGLE */}
  <div className="relative">

    <button
      onClick={() => setAttentionOpen(!attentionOpen)}
      className={`relative p-2.5 rounded-xl border transition ${
        attentionOpen
          ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-900"
          : "bg-white border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 dark:bg-slate-900 dark:border-slate-800"
      }`}
      title="Needs Attention"
    >

      <AlertTriangle size={18} />

      {/* COUNT */}
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[9px] font-bold grid place-items-center">
        2
      </span>

    </button>


    {/* ATTENTION PANEL */}
    {attentionOpen && (
      <div className="absolute right-0 top-12 w-80 glass rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">

        {/* PANEL HEADER */}
        <div className="px-4 py-3 bg-red-50/80 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/40 flex items-center justify-between">

          <div>

            <div className="font-bold text-sm text-red-700 dark:text-red-300">
              Needs Attention
            </div>

            <div className="text-[10px] text-slate-500 mt-1">
              Items requiring immediate attention
            </div>

          </div>

          <button
            onClick={() => setAttentionOpen(false)}
            className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <X size={16} />
          </button>

        </div>


        {/* ITEM 1 */}
        <Attention
          initials="V"
          name="Vikram"
          detail="Cash discrepancy"
          value="₹1,600"
          danger
          onClick={() => {
            setAttentionOpen(false);
            setSelectedBoy(3);
            setSelectedStore(null);
            navigate("/ledger");
          }}
        />


        {/* ITEM 2 */}
        <Attention
          initials="G"
          name="Ganesh Stores"
          detail="High outstanding"
          value="₹14,800"
          onClick={() => {
            setAttentionOpen(false);
            setSelectedBoy(1);
            setSelectedStore("STR-001");
            navigate("/ledger");
          }}
        />

      </div>
    )}

  </div>

</div>

      </div>

            

      {/* METRICS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

        <Metric
          label="TOTAL STORES"
          value="47"
          icon={<CheckCircle2 size={16} />}
        />

        <Metric
          label="COMPLETED"
          value="34"
          suffix="72%"
          icon={<CheckCircle2 size={16} />}
          positive
        />

        <Metric
          label="CASH COLLECTED"
          value="₹32,400"
          icon={<Banknote size={16} />}
          positive
        />

        <Metric
          label="RETURNS"
          value="₹5,230"
          icon={<PackageX size={16} />}
          danger
        />

      </div>


      {/* MAIN OPERATION GRID */}
      <div className="space-y-4">


        {/* DELIVERY BOYS */}
        <section className="glass rounded-[22px] overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">

            <h2 className="font-bold">
              Delivery Boys
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Tap a delivery boy to see their stores.
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-xs">

              <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-[10px] uppercase tracking-wide text-slate-500">

                <tr>

                  <th className="text-left px-4 py-3">
                    Boy
                  </th>

                  <th className="text-left px-4 py-3">
                    Progress
                  </th>

                  <th className="text-left px-4 py-3">
                    Cash Collected
                  </th>

                  <th className="text-left px-4 py-3">
                    Returns
                  </th>

                  <th className="text-left px-4 py-3">
                    Discrepancy
                  </th>

                  <th className="text-left px-4 py-3">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left">
                     Activity
                  </th>

                  <th></th>

                </tr>

              </thead>


              <tbody>

                {deliveryBoys.map((boy) => {

                  const percentage = Math.round(
                    (boy.completed / boy.total) * 100
                  );

                  return (

                    <tr
                      key={boy.id}
                      onClick={() =>
                        openBoy(boy.id)
                      }
                      className="border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition"
                    >

                      {/* BOY */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2.5">

                          <div
                            className={`w-8 h-8 rounded-full grid place-items-center font-bold text-xs ${
                              boy.status === "Delayed"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-[#2563EB]"
                            }`}
                          >
                            {boy.name.charAt(0).toUpperCase()}
                          </div>

                          <div>

                            <div className="font-bold">
                              {boy.name}
                            </div>

                            <div className="text-[10px] text-slate-500">
                              {boy.area}
                            </div>

                          </div>

                        </div>

                      </td>


                      {/* PROGRESS */}
                      <td className="px-4 py-4 min-w-[150px]">

                        <div className="flex items-center gap-2">

                          <div className="w-20 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">

                            <div
                              className={`h-full rounded-full ${
                                boy.status === "Delayed"
                                  ? "bg-red-500"
                                  : "bg-[#2563EB]"
                              }`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          <span className="font-semibold">
                            {boy.completed}/{boy.total}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {percentage}%
                          </span>

                        </div>

                      </td>


                      {/* CASH */}
                      <td className="px-4 py-4 font-bold">
                        ₹{boy.cash.toLocaleString("en-IN")}
                      </td>


                      {/* RETURNS */}
                      <td className="px-4 py-4 font-semibold">
                        ₹{boy.returns.toLocaleString("en-IN")}
                      </td>


                      {/* DISCREPANCY */}
                      <td className="px-4 py-4">

                        <span
                          className={
                            boy.discrepancy > 0
                              ? "font-bold text-red-600"
                              : "font-medium text-slate-500"
                          }
                        >
                          ₹
                          {boy.discrepancy.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </td>


                      {/* STATUS */}
                      <td className="px-4 py-4">
                        <StatusBadge status={boy.status} />
                      </td>


                        {/* ACTIVITY / INACTIVITY */}
                        <td className="px-4 py-4">
                          {isInactive(boy.lastActive) ? (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />

                              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                                Inactive
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />

                              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                Active
                              </span>
                            </div>
                          )}
                        </td>


                        {/* ARROW */}
                        <td className="px-4 py-4">
                          <ChevronRight
                            size={16}
                            className="text-[#2563EB]"
                          />
                        </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        </section>


        {/* RIGHT SIDE */}
        <div className="space-y-4">



          

        </div>

      </div>

    </div>
  );
}

function Metric({
  label,
  value,
  suffix,
  positive,
  danger,
  icon,
}) {
  return (
    <div className="glass rounded-[18px] p-4">

      <div className="flex items-center justify-between">

        <div
          className={`text-[9px] font-bold tracking-wide ${
            positive
              ? "text-emerald-700"
              : danger
              ? "text-red-600"
              : "text-slate-500"
          }`}
        >
          {label}
        </div>

        <div
          className={`${
            danger
              ? "text-red-500"
              : "text-[#2563EB]"
          }`}
        >
          {icon}
        </div>

      </div>

      <div className="text-xl font-extrabold mt-3">
        {value}
      </div>

      {suffix && (
        <div className="text-[10px] text-emerald-600 font-semibold mt-1">
          {suffix}
        </div>
      )}

    </div>
  );
}

function Attention({
  initials,
  name,
  detail,
  value,
  danger,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
    >

      <div
        className={`w-9 h-9 rounded-full grid place-items-center font-bold text-xs ${
          danger
            ? "bg-red-100 text-red-600"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {initials}
      </div>

      <div className="flex-1">

        <div className="font-bold text-xs">
          {name}
        </div>

        <div className="text-[10px] text-slate-500 mt-1">
          {detail}
        </div>

      </div>

      <div
        className={`text-xs font-bold ${
          danger
            ? "text-red-600"
            : "text-amber-700"
        }`}
      >
        {value}
      </div>

      <ChevronRight
        size={15}
        className="text-slate-400"
      />

    </button>
  );
}


