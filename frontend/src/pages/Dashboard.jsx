import { useMemo } from "react";
import {
  AlertTriangle,
  Banknote,
  BellRing,
  CheckCircle2,
  ChevronRight,
  PackageX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { deliveryBoys, previousDayPending } from "../data/mockData";
import { useBeatSyncStore } from "../store/useBeatSyncStore";

import CollectionChart from "../components/CollectionChart";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const navigate = useNavigate();

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

          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#2563EB] dark:text-blue-300">
            Operations control room
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mt-1">
            Live Operations
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Track today's route progress, collections and exceptions
            in real time.
          </p>

        </div>


        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#2563EB] bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300 px-3 py-2 rounded-full">

          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

          Live updates

        </div>

      </div>

            {/* PREVIOUS DAY PENDING */}
      <section className="glass rounded-[22px] overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

          <div>
            <h2 className="font-bold">
              Previous Day — Pending Items
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Unresolved stores from yesterday that need attention today.
            </p>
          </div>

          <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-full">
            {previousDayPending.length} pending
          </span>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-xs">

            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-[10px] uppercase tracking-wide text-slate-500">

              <tr>

                <th className="text-left px-4 py-3">
                  Store
                </th>

                <th className="text-left px-4 py-3">
                  Locality
                </th>

                <th className="text-right px-4 py-3">
                  Outstanding
                </th>

                <th className="text-right px-4 py-3">
                  Age
                </th>

                <th className="text-center px-4 py-3">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {previousDayPending.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-slate-100 dark:border-slate-800"
                >

                  {/* STORE */}
                  <td className="px-4 py-4">

                    <div className="font-bold">
                      {item.storeName}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1">
                      {item.storeId}
                    </div>

                  </td>


                  {/* LOCALITY */}
                  <td className="px-4 py-4 text-slate-500">
                    {item.locality}
                  </td>


                  {/* OUTSTANDING */}
                  <td className="px-4 py-4 text-right font-bold">

                    ₹{item.outstanding.toLocaleString("en-IN")}

                  </td>


                  {/* AGE */}
                  <td className="px-4 py-4 text-right">

                    <span
                      className={
                        item.age >= 30
                          ? "font-bold text-red-600"
                          : "font-semibold text-amber-600"
                      }
                    >
                      {item.age} days
                    </span>

                  </td>


                  {/* STATUS */}
                  <td className="px-4 py-4 text-center">

                    <StatusBadge
                      status={item.status}
                    />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

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
      <div className="grid xl:grid-cols-[1.35fr_.65fr] gap-4">


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
                            {boy.initials}
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

          {/* NEEDS ATTENTION */}
          <section className="glass rounded-[22px] overflow-hidden">

            <div className="px-5 py-4 bg-red-50/70 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/40">

              <div className="flex items-center gap-2">

                <AlertTriangle
                  size={17}
                  className="text-red-600"
                />

                <h2 className="font-bold text-red-700 dark:text-red-300">
                  Needs Attention
                </h2>

              </div>

            </div>


            <div className="p-3 space-y-2">

              <Attention
                initials="V"
                name="Vikram"
                detail="Cash discrepancy"
                value="₹1,600"
                danger
                onClick={() =>
                  openBoy("vikram")
                }
              />

              <Attention
                initials="G"
                name="Ganesh Stores"
                detail="High outstanding"
                value="₹14,800"
                onClick={() => {
                  setSelectedBoy("raju");
                  setSelectedStore("ganesh");
                  navigate("/ledger");
                }}
              />

            </div>

          </section>


          {/* STATUS LEGEND */}
          <section className="glass rounded-[22px] p-4">

            <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-3">
              Status
            </div>

            <div className="flex flex-wrap gap-4 text-xs">

              <Legend
                color="bg-emerald-500"
                label="On Track"
              />

              <Legend
                color="bg-amber-500"
                label="Needs Attention"
              />

              <Legend
                color="bg-red-500"
                label="Problem / Discrepancy"
              />

            </div>

          </section>


          {/* COLLECTION TREND */}
          <CollectionChart />

        </div>

      </div>


      {/* RECONCILIATION */}
      <section className="glass rounded-[22px] overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">

          <h2 className="font-bold">
            Today's Reconciliation
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Track expected cash, collections, returns and discrepancies.
          </p>

        </div>


        <div className="grid grid-cols-2 xl:grid-cols-4">

          <ReconciliationMetric
            label="TOTAL OUTSTANDING"
            value="₹41,400"
          />

          <ReconciliationMetric
            label="TOTAL COLLECTED"
            value="₹32,400"
            positive
          />

          <ReconciliationMetric
            label="TOTAL RETURNS"
            value="₹5,230"
          />

          <ReconciliationMetric
            label="DISCREPANCY"
            value="₹1,600"
            danger
          />

        </div>

      </section>

    </div>
  );
}


/* ------------------------- */
/* Small reusable components */
/* ------------------------- */

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
      className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
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


function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`w-2.5 h-2.5 rounded-full ${color}`}
      />

      {label}

    </div>
  );
}


function ReconciliationMetric({
  label,
  value,
  positive,
  danger,
}) {
  return (
    <div className="p-5 border-r last:border-r-0 border-slate-100 dark:border-slate-800">

      <div
        className={`text-[9px] font-bold tracking-wide ${
          danger
            ? "text-red-600"
            : positive
            ? "text-[#2563EB]"
            : "text-slate-500"
        }`}
      >
        {label}
      </div>

      <div
        className={`text-lg font-extrabold mt-2 ${
          danger
            ? "text-red-600"
            : ""
        }`}
      >
        {value}
      </div>

    </div>
  );
}