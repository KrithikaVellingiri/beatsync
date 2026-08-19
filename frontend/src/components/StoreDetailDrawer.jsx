import {
  CheckCircle2,
  MapPin,
  X,
} from "lucide-react";

import {
  deliveryBoys,
  stores,
} from "../data/mockData";

import StatusBadge from "./StatusBadge";

export default function StoreDetailDrawer({
  storeId,
  onClose,
}) {
  const store = stores.find(
    (item) => item.id === storeId
  );

  if (!store) return null;

  const deliveryBoy =
    deliveryBoys.find(
      (boy) => boy.id === store.boyId
    );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[2px]"
      onClick={onClose}
    >

      <section
        onClick={(event) =>
          event.stopPropagation()
        }
        className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto soft-scroll bg-[#f7fbfb] dark:bg-[#0b1d2b] shadow-2xl"
      >

        {/* HEADER */}
        <div className="sticky top-0 z-10 px-6 py-5 bg-[#f7fbfb]/95 dark:bg-[#0b1d2b]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">

          <div className="flex items-start justify-between">

            <div>

              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#2563EB] dark:text-blue-300">
                Store Details
              </div>

              <h2 className="text-xl font-extrabold mt-1">
                {store.name}
              </h2>

              <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">

                <MapPin size={12} />

                {store.locality}

                <span>·</span>

                ID {store.id.toUpperCase()}

              </div>

            </div>


            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={19} />
            </button>

          </div>

        </div>


        <div className="p-6 space-y-4">


          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-3">

            <Info
              label="Assigned Boy"
              value={
                deliveryBoy?.name ||
                "Unassigned"
              }
            />

            <Info
              label="Contact"
              value={store.contact || "Not available"}
            />

            <Info
              label="Outstanding"
              value={`₹${store.outstanding.toLocaleString(
                "en-IN"
              )}`}
            />

            <Info
              label="Outstanding Age"
              value={`${store.overdue} days`}
            />

            <Info
              label="Last Visited"
              value={store.lastVisited || "Not available"}
            />

            <Info
              label="Last Payment"
              value={`₹${store.lastPayment.toLocaleString(
                "en-IN"
              )}`}
            />

          </div>


          {/* STATUS */}
          <section className="glass rounded-[18px] p-5">

            <div className="flex items-center justify-between">

              <div>

                <div className="text-[10px] uppercase tracking-wide text-slate-500">
                  Current Status
                </div>

                <div className="font-bold mt-1">
                  {store.status}
                </div>

              </div>

              <StatusBadge
                status={store.status}
              />

            </div>


            <div className="flex items-center gap-2 mt-4 text-[11px] text-emerald-700 dark:text-emerald-300">

              <CheckCircle2 size={14} />

              Integrity verified · tamper-evident ledger

            </div>

          </section>


          {/* INTELLIGENCE */}
          <section className="glass rounded-[18px] p-5">

            <h3 className="font-bold">
              Store Intelligence
            </h3>

            <div className="mt-3 space-y-2">

              {store.intelligence.map(
                (item, index) => (

                  <div
                    key={index}
                    className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"
                  >

                    <span className="text-[#2563EB]">
                      •
                    </span>

                    {item}

                  </div>

                )
              )}

            </div>

          </section>


          {/* TRANSACTIONS */}
          <section className="glass rounded-[18px] overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">

              <h3 className="font-bold">
                Transaction History
              </h3>

            </div>


            {store.transactions.map(
              (transaction, index) => (

                <div
                  key={index}
                  className="grid grid-cols-[65px_75px_80px_1fr] gap-2 px-5 py-4 border-b last:border-0 border-slate-100 dark:border-slate-800 text-xs"
                >

                  <span className="text-slate-500">
                    {transaction[0]}
                  </span>

                  <span className="font-semibold">
                    {transaction[1]}
                  </span>

                  <span className="font-bold">
                    {transaction[2]}
                  </span>

                  <span className="text-slate-500">
                    {transaction[3]}
                  </span>

                </div>

              )
            )}

          </section>

        </div>

      </section>

    </div>
  );
}


function Info({ label, value }) {
  return (
    <div className="glass rounded-[16px] p-4">

      <div className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="font-bold text-sm mt-2">
        {value}
      </div>

    </div>
  );
}