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
  useBeatSyncStore,
} from "../store/useBeatSyncStore";

import StatusBadge from "../components/StatusBadge";
import { translate } from "../i18n";


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
  const dashboardData = useBeatSyncStore((state) => state.dashboardData);
  const language = useBeatSyncStore((state) => state.language);
  const t = (key) => translate(language, key);

  // Extract from dashboardData if available
  const deliveryBoys = dashboardData?.deliveryBoys?.map(db => ({
    ...db.deliveryBoy,
    initials: db.deliveryBoy.name.substring(0,2).toUpperCase(),
    expectedCash: 0,
    submittedCash: 0,
    returns: 0,
    outstanding: 0,
    discrepancy: 0,
    dayClosed: false,
  })) || [];

  const stores = dashboardData?.stores?.map(s => ({
    ...s,
    outstanding: Number(s.outstandingBalance),
    overdue: s.overdueDays,
    lastPayment: "—",
    activity: "—",
    status: s.outstandingBalance > 15000 ? "Critical" : "Healthy",
    boyId: -1, // Stores are not strictly bound to one boy globally without assignments
  })) || [];

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

  const totalOutstandingSum = filteredStores.reduce((sum, s) => sum + s.outstanding, 0);
  const totalCollectedSum = dashboardData?.summary?.totalPayments || 0;
  const totalReturnsSum = dashboardData?.summary?.totalReturns || 0;
  const discrepancySum = deliveryBoys.reduce((sum, boy) => sum + (boy.discrepancy || 0), 0);


  return (
    <div className="space-y-5">

    {/* BOY RECONCILIATION */}
{selectedBoy !== "all" && selectedBoyData && (
  <section className="glass rounded-[22px] overflow-hidden mb-5">

    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-[#2563EB]">
          {t("todayReconciliation")}
        </div>

        <h2 className="text-xl font-extrabold mt-1">
          {selectedBoyData.name}
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          {t("reconciliationSubtitle")}
        </p>
      </div>

      <div className="flex items-center gap-2">

        {isDayClosed ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
            <CheckCircle2 size={14} />
            {t("dayClosed")}
          </span>
        ) : (
          <button
            onClick={() => setCloseDayOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition"
          >
            {t("closeDay")}
          </button>
        )}

      </div>

    </div>


    {/* RECONCILIATION METRICS */}
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">

      <Recon
        label={t("expectedCash")}
        value={selectedBoyData.expectedCash}
      />

      <Recon
        label={t("submittedCash")}
        value={selectedBoyData.submittedCash}
      />

      <Recon
        label={t("difference")}
        value={selectedBoyData.expectedCash - selectedBoyData.submittedCash}
        danger={
          selectedBoyData.expectedCash !==
          selectedBoyData.submittedCash
        }
      />

      <Recon
        label={t("returns")}
        value={selectedBoyData.returns}
      />

      <Recon
        label={t("outstanding")}
        value={selectedBoyData.outstanding}
      />

      <Recon
        label={t("discrepancy")}
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
                {t("allBoys")}
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
              {t("allStores")}
            </option>

            <option value="critical">
              {t("critical")}
            </option>

            <option value="watch">
              {t("watch")}
            </option>

            <option value="healthy">
              {t("healthy")}
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
              {t("highestOutstanding")}
            </option>

            <option value="overdue">
              {t("mostOverdue")}
            </option>

            <option value="name">
              {t("storeName")}
            </option>

            <option value="recent">
              {t("mostActive")}
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
              placeholder={t("searchStore")}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-xs outline-none focus:ring-2 focus:ring-blue-200"
            />

          </div>

        </div>


        {/* ACTIVE BOY FILTER */}
        {selectedBoy !== "all" && (

          <div className="flex items-center gap-2 mt-3 px-1">

            <span className="text-[11px] text-slate-500">
              {t("showingStoresFor")}
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
                  {t("stores")}
                </th>

                <th className="text-left px-4 py-3">
                  {t("boy")}
                </th>

                <th className="text-left px-4 py-3">
                  {t("outstanding")}
                </th>

                <th className="text-left px-4 py-3">
                  {t("lastPayment")}
                </th>

                <th className="text-left px-4 py-3">
                  {t("currentStatus")}
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
            {t("noStoresFound")}
          </div>

        )}

      </section>


      {/* TOTALS */}
      <section className="glass rounded-[20px] overflow-hidden">

        <div className="grid grid-cols-2 xl:grid-cols-4">

          <Total
            label={t("totalOutstanding")}
            value={`₹${totalOutstandingSum.toLocaleString("en-IN")}`}
          />

          <Total
            label={t("totalCollected")}
            value={`₹${totalCollectedSum.toLocaleString("en-IN")}`}
          />

          <Total
            label={t("totalReturns")}
            value={`₹${totalReturnsSum.toLocaleString("en-IN")}`}
          />

          <Total
            label={t("discrepancy")}
            value={`₹${discrepancySum.toLocaleString("en-IN")}`}
            danger={discrepancySum > 0}
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
            {t("tapStoreDetails")}
          </div>

          <div className="text-xs text-slate-500 mt-1">
            {t("storeDetailsSubtitle")}
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
            t={t}
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

function CloseDayModal({ boy, onClose, onConfirm, t }) {
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
              {t("closeDayFor")} {boy.name}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {t("closeDayMessage")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={t("closeConfirmation")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <ReconSummary label={t("expectedCashLabel")} value={boy.expectedCash} />
          <ReconSummary label={t("submittedCashLabel")} value={boy.submittedCash} />
          <ReconSummary label={t("differenceLabel")} value={boy.expectedCash - boy.submittedCash} />
          <ReconSummary label={t("returns")} value={boy.returns} />
          <ReconSummary label={t("outstanding")} value={boy.outstanding} />
          <ReconSummary label={t("discrepancy")} value={boy.discrepancy} />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            {t("confirmClose")}
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