import {
  Banknote,
  ChevronRight,
  Filter,
  Search,
  X,
  AlertTriangle,
  CheckCircle2,

} from "lucide-react";
import { useMemo, useState } from "react";

import CollectionChart from "../components/CollectionChart";
import StoreDetailDrawer from "../components/StoreDetailDrawer";
import {
  deliveryBoys,
  stores,
} from "../data/mockData";

import {
  useBeatSyncStore,
} from "../store/useBeatSyncStore";

import StatusBadge from "../components/StatusBadge";


export default function Ledger() {

  const {
    selectedBoy,
    setSelectedBoy,
    selectedStore,
    setSelectedStore,
    search,
    setSearch,
    sort,
    setSort,
    closedDays,
    closeDay,
  } = useBeatSyncStore();

  const [storeFilter, setStoreFilter] =
    useState("all");
  const [closeDayOpen, setCloseDayOpen] =
    useState(false);


  const filteredStores = useMemo(() => {

    let result = stores.filter((store) => {

      const matchesBoy =
  selectedBoy === "all" ||
  store.boyId === Number(selectedBoy);

      const matchesSearch =
        `${store.name} ${store.locality}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStoreFilter =
        storeFilter === "all" ||
        store.status.toLowerCase() ===
          storeFilter;

      return (
        matchesBoy &&
        matchesSearch &&
        matchesStoreFilter
      );
    });


    return [...result].sort((a, b) => {

      if (sort === "highest") {
        return (
          b.outstanding -
          a.outstanding
        );
      }

      if (sort === "overdue") {
        return b.overdue - a.overdue;
      }

      if (sort === "name") {
        return a.name.localeCompare(
          b.name
        );
      }

      return b.activity.localeCompare(
        a.activity
      );
    });

  }, [
    selectedBoy,
    search,
    sort,
    storeFilter,
  ]);


  const selectedBoyName =
    deliveryBoys.find(
      (boy) =>
        boy.id === selectedBoy
    )?.name;

  const selectedBoyData =
  deliveryBoys.find(
    (boy) => boy.id === selectedBoy
  );

  const isDayClosed =
    selectedBoyData &&
    (selectedBoyData.dayClosed || closedDays[selectedBoy]);


  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-end justify-between gap-4">

        <div>

          {/* <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#2563EB] dark:text-blue-300">
            Store-level operations
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mt-1">
            Store Ledger
          </h1> */}

          <div className="text-xs font-extrabold uppercase tracking-[0.5em] text-[#000000] dark:text-blue-300">
            View deliveries, payments, returns, credit and
            outstanding balances for every store.
          </div>

        </div>

      </div>

    {/* BOY RECONCILIATION */}
{selectedBoy !== "all" && selectedBoyData && (
  <section className="glass rounded-[22px] overflow-hidden mb-5">

    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-[#2563EB]">
          Today's reconciliation
        </div>

        <h2 className="text-xl font-extrabold mt-1">
          {selectedBoyData.name}
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Cash, returns, outstanding and discrepancy for today's beat.
        </p>
      </div>

      <div className="flex items-center gap-2">

        {isDayClosed ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
            <CheckCircle2 size={14} />
            Day Closed
          </span>
        ) : (
          <button
            onClick={() => setCloseDayOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition"
          >
            Close Day
          </button>
        )}

      </div>

    </div>


    {/* RECONCILIATION METRICS */}
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">

      <Recon
        label="EXPECTED CASH"
        value={selectedBoyData.expectedCash}
      />

      <Recon
        label="SUBMITTED CASH"
        value={selectedBoyData.submittedCash}
      />

      <Recon
        label="DIFFERENCE"
        value={selectedBoyData.expectedCash - selectedBoyData.submittedCash}
        danger={
          selectedBoyData.expectedCash !==
          selectedBoyData.submittedCash
        }
      />

      <Recon
        label="RETURNS"
        value={selectedBoyData.returns}
      />

      <Recon
        label="OUTSTANDING"
        value={selectedBoyData.outstanding}
      />

      <Recon
        label="DISCREPANCY"
        value={selectedBoyData.discrepancy}
        danger={selectedBoyData.discrepancy > 0}
      />

    </div>

  </section>
)}

      {/* FILTER BAR */}
      <section className="glass rounded-[20px] p-3">

        <div className="grid md:grid-cols-[auto_auto_auto_1fr] gap-2">

          {/* BOY */}
          <div className="relative">

            <select
              value={selectedBoy}
              onChange={(e) => {
              const value = e.target.value;

              setSelectedBoy(
                value === "all" ? "all" : Number(value)
              );
            }}
              className="appearance-none min-w-[155px] pl-3 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-200"
            >

              <option value="all">
                All Boys
              </option>

              {deliveryBoys.map(
                (boy) => (
                  <option
                    key={boy.id}
                    value={boy.id}
                  >
                    {boy.name}
                  </option>
                )
              )}

            </select>

            <Filter
              size={13}
              className="absolute right-3 top-3 text-slate-400 pointer-events-none"
            />

          </div>


          {/* STORE FILTER */}
          <select
            value={storeFilter}
            onChange={(e) =>
              setStoreFilter(
                e.target.value
              )
            }
            className="min-w-[135px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-xs font-medium outline-none"
          >
            <option value="all">
              All Stores
            </option>

            <option value="critical">
              Critical
            </option>

            <option value="watch">
              Watch
            </option>

            <option value="healthy">
              Healthy
            </option>
          </select>


          {/* SORT */}
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="min-w-[190px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-xs font-medium outline-none"
          >

            <option value="highest">
              Outstanding (High to Low)
            </option>

            <option value="overdue">
              Overdue (High to Low)
            </option>

            <option value="name">
              Store Name
            </option>

            <option value="recent">
              Recent Activity
            </option>

          </select>


          {/* SEARCH */}
          <div className="relative">

            <Search
              size={15}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search store..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-xs outline-none focus:ring-2 focus:ring-blue-200"
            />

          </div>

        </div>


        {/* ACTIVE BOY FILTER */}
        {selectedBoy !== "all" && (

          <div className="flex items-center gap-2 mt-3 px-1">

            <span className="text-[11px] text-slate-500">
              Showing stores for
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300 text-[10px] font-bold">

              {selectedBoyName}

              <button
                onClick={() =>
                  setSelectedBoy(
                    "all"
                  )
                }
              >
                <X size={11} />
              </button>

            </span>

          </div>

        )}

      </section>


      {/* TABLE */}
      <section className="glass rounded-[22px] overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-xs">

            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-[10px] uppercase tracking-wide text-slate-500">

              <tr>

                <th className="text-left px-4 py-3">
                  Store
                </th>

                <th className="text-left px-4 py-3">
                  Boy
                </th>

                <th className="text-left px-4 py-3">
                  Outstanding
                </th>

                <th className="text-left px-4 py-3">
                  Last Payment
                </th>

                <th className="text-left px-4 py-3">
                  Status
                </th>

                <th></th>

              </tr>

            </thead>


            <tbody>

              {filteredStores.map(
                (store) => {

                  const boy =
                    deliveryBoys.find(
                      (item) =>
                        item.id ===
                        store.boyId
                    );

                  return (

                    <tr
                      key={store.id}
                      onClick={() =>
                        setSelectedStore(
                          store.id
                        )
                      }
                      className="border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition"
                    >

                      {/* STORE */}
                      <td className="px-4 py-4">

                        <div className="font-bold">
                          {store.name}
                        </div>

                        <div className="text-[10px] text-slate-500 mt-1">
                          {store.locality}
                        </div>

                      </td>


                      {/* BOY */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] dark:bg-blue-950 dark:text-blue-300 grid place-items-center text-[9px] font-bold">
                            {boy?.initials}
                          </div>

                          <span>
                            {boy?.name}
                          </span>

                        </div>

                      </td>


                      {/* OUTSTANDING */}
                      <td className="px-4 py-4 font-bold">
                        ₹
                        {store.outstanding.toLocaleString(
                          "en-IN"
                        )}
                      </td>


                      {/* LAST PAYMENT */}
                      <td className="px-4 py-4 text-slate-500">
                        {store.lastPayment}
                      </td>


                      {/* STATUS */}
                      <td className="px-4 py-4">

                        <StatusBadge
                          status={store.status}
                        />

                      </td>


                      <td className="px-4 py-4">

                        <ChevronRight
                          size={15}
                          className="text-[#2563EB]"
                        />

                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        </div>


        {filteredStores.length === 0 && (

          <div className="p-12 text-center text-slate-500 text-sm">
            No stores match the selected filters.
          </div>

        )}

      </section>


      {/* TOTALS */}
      <section className="glass rounded-[20px] overflow-hidden">

        <div className="grid grid-cols-2 xl:grid-cols-4">

          <Total
            label="TOTAL OUTSTANDING"
            value="₹41,400"
          />

          <Total
            label="TOTAL COLLECTED"
            value="₹32,400"
          />

          <Total
            label="TOTAL RETURNS"
            value="₹5,230"
          />

          <Total
            label="DISCREPANCY"
            value="₹1,600"
            danger
          />

        </div>

      </section>
              {/* COLLECTIONS CHART */}
      <CollectionChart />

      {/* INFO */}
      <section className="glass rounded-[20px] p-4 flex items-start gap-3">

        <div className="w-8 h-8 rounded-full border border-blue-200 text-[#2563EB] grid place-items-center shrink-0 dark:border-blue-900 dark:text-blue-300">
          i
        </div>

        <div>

          <div className="text-xs font-bold">
            Tap any store to view full details
          </div>

          <div className="text-xs text-slate-500 mt-1">
            Includes deliveries, payments, returns,
            outstanding balance and payment history.
          </div>

        </div>

      </section>


      {/* STORE DETAIL MODAL */}
        {selectedStore && (
        <StoreDetailDrawer
          storeId={selectedStore}
          onClose={() =>
            setSelectedStore(null)
          }
        />
      )}

      {closeDayOpen && selectedBoyData && (
        <CloseDayModal
          boy={selectedBoyData}
          onClose={() => setCloseDayOpen(false)}
          onConfirm={() => {
            closeDay(selectedBoyData.id);
            setCloseDayOpen(false);
          }}
        />
      )}

            </div>
          );
        }


function Total({
  label,
  value,
  danger,
}) {
  return (
    <div className="px-5 py-4 border-r last:border-r-0 border-slate-100 dark:border-slate-800">

      <div
        className={`text-[9px] font-bold tracking-wide ${
          danger
            ? "text-red-600"
            : "text-slate-500"
        }`}
      >
        {label}
      </div>

      <div
        className={`font-extrabold text-base mt-2 ${
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

function Recon({
  label,
  value,
  danger,
}) {
  return (
    <div className="p-4 border-r border-b border-slate-100 dark:border-slate-800">

      <div
        className={`text-[9px] font-bold tracking-wide ${
          danger
            ? "text-red-600"
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
        ₹{value.toLocaleString("en-IN")}
      </div>

      {danger && (
        <div className="flex items-center gap-1 mt-1 text-[10px] text-red-600 font-semibold">
          <AlertTriangle size={11} />
          Attention required
        </div>
      )}

    </div>
  );
}

function CloseDayModal({ boy, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass w-full max-w-lg rounded-2xl border border-slate-200 p-5 text-slate-900 shadow-2xl dark:border-slate-800 dark:text-white sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="close-day-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="close-day-title" className="text-lg font-bold">
              Close day for {boy.name}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Are you sure you want to close today's reconciliation? This will mark today's beat as closed.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close confirmation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <ReconSummary label="Expected Cash" value={boy.expectedCash} />
          <ReconSummary label="Submitted Cash" value={boy.submittedCash} />
          <ReconSummary label="Difference" value={boy.expectedCash - boy.submittedCash} />
          <ReconSummary label="Returns" value={boy.returns} />
          <ReconSummary label="Outstanding" value={boy.outstanding} />
          <ReconSummary label="Discrepancy" value={boy.discrepancy} />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            Confirm &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ReconSummary({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
      <div className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-extrabold">
        ₹{value.toLocaleString("en-IN")}
      </div>
    </div>
  );
}