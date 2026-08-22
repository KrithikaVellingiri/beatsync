import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ChevronRight,
  PackageX,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useBeatSyncStore } from "../store/useBeatSyncStore";
import { api } from "../api/client";

import StatusBadge from "../components/StatusBadge";
import { translate } from "../i18n";

export default function Dashboard() {
  const navigate = useNavigate();

  const [attentionOpen, setAttentionOpen] = useState(false);
  const fetchDashboardData = useBeatSyncStore((state) => state.fetchDashboardData);
  const dashboardData = useBeatSyncStore((state) => state.dashboardData);
  const [isLoading, setIsLoading] = useState(true);

  const setSelectedBoy = useBeatSyncStore((state) => state.setSelectedBoy);
  const setSelectedStore = useBeatSyncStore((state) => state.setSelectedStore);
  const language = useBeatSyncStore((state) => state.language);
  const t = (key) => translate(language, key);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        await fetchDashboardData();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

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

  if (isLoading && !dashboardData) {
    return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="p-8 text-center text-red-500">No data available. Generate a beat first.</div>;
  }

  const { summary, deliveryBoys, stores, beat } = dashboardData;

  // Let's create some dummy attention items if there's high discrepancy or high outstanding
  // In a real app this would come from a dedicated endpoint.
  const highRiskStores = stores.filter(s => Number(s.outstandingBalance) > 15000);

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-end justify-between gap-4">
        <div />
        <div className="flex items-center gap-2">
          {/* LIVE STATUS */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#2563EB] bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300 px-3 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t("liveUpdates")}
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
              title={t("needsAttention")}
            >
              <AlertTriangle size={18} />
              {highRiskStores.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[9px] font-bold grid place-items-center">
                  {highRiskStores.length}
                </span>
              )}
            </button>

            {/* ATTENTION PANEL */}
            {attentionOpen && (
              <div className="absolute right-0 top-12 w-80 glass rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                <div className="px-4 py-3 bg-red-50/80 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-red-700 dark:text-red-300">
                      {t("needsAttention")}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {t("immediateAttention")}
                    </div>
                  </div>
                  <button
                    onClick={() => setAttentionOpen(false)}
                    className="p-1 rounded-lg hover:bg-red-100 dark:bg-red-900/30"
                  >
                    <X size={16} />
                  </button>
                </div>

                {highRiskStores.slice(0, 5).map(store => (
                   <Attention
                    key={store.id}
                    initials={store.name.substring(0,2).toUpperCase()}
                    name={store.name}
                    detail={t("highOutstanding")}
                    value={`₹${Number(store.outstandingBalance).toLocaleString("en-IN")}`}
                    danger
                    onClick={() => {
                      setAttentionOpen(false);
                      setSelectedStore(store.id);
                      navigate("/ledger");
                    }}
                  />
                ))}
                {highRiskStores.length === 0 && (
                   <div className="p-4 text-center text-sm text-slate-500">No issues found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Metric
          label={t("totalStores")}
          value={summary.totalStores}
          icon={<CheckCircle2 size={16} />}
        />
        <Metric
          label={t("completed")}
          value={summary.completedStores}
          suffix={`${summary.progressPercentage}%`}
          icon={<CheckCircle2 size={16} />}
          positive
        />
        <Metric
          label={t("cashCollected")}
          value={`₹${summary.totalPayments.toLocaleString("en-IN")}`}
          icon={<Banknote size={16} />}
          positive
        />
        <Metric
          label={t("returns")}
          value={`₹${summary.totalReturns.toLocaleString("en-IN")}`}
          icon={<PackageX size={16} />}
          danger
        />
      </div>

      {/* MAIN OPERATION GRID */}
      <div className="space-y-4">
        {/* DELIVERY BOYS */}
        <section className="glass rounded-[22px] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-bold">{t("deliveryBoys")}</h2>
            <p className="text-xs text-slate-500 mt-1">{t("tapDeliveryBoy")}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3">{t("boy")}</th>
                  <th className="text-left px-4 py-3">{t("progress")}</th>
                  <th className="text-left px-4 py-3">Stores</th>
                  <th className="text-left px-4 py-3">{t("currentStatus")}</th>
                  <th className="px-4 py-3 text-left">{t("activity")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {deliveryBoys.map((boy) => {
                  const percentage = boy.progressPercentage;
                  const boyStatus = boy.pendingStores === 0 ? "Completed" : "In Progress";
                  
                  return (
                    <tr
                      key={boy.deliveryBoy.id}
                      onClick={() => openBoy(boy.deliveryBoy.id)}
                      className="border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition"
                    >
                      {/* BOY */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full grid place-items-center font-bold text-xs bg-blue-100 text-[#2563EB]`}
                          >
                            {boy.deliveryBoy.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold">{boy.deliveryBoy.name}</div>
                            <div className="text-[10px] text-slate-500">{boy.deliveryBoy.phone}</div>
                          </div>
                        </div>
                      </td>

                      {/* PROGRESS */}
                      <td className="px-4 py-4 min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-[#2563EB]`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="font-semibold">
                            {boy.completedStores}/{boy.totalStores}
                          </span>
                          <span className="text-[10px] text-slate-400">{percentage}%</span>
                        </div>
                      </td>

                      {/* Stores */}
                      <td className="px-4 py-4 font-bold">
                        {boy.totalStores}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">
                        <StatusBadge status={boyStatus} />
                      </td>

                      {/* ACTIVITY */}
                      <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                              {t("active")}
                            </span>
                          </div>
                      </td>

                      {/* ARROW */}
                      <td className="px-4 py-4">
                        <ChevronRight size={16} className="text-[#2563EB]" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, suffix, positive, danger, icon }) {
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
        <div className={`${danger ? "text-red-500" : "text-[#2563EB]"}`}>
          {icon}
        </div>
      </div>
      <div className="text-xl font-extrabold mt-3">{value}</div>
      {suffix && (
        <div className="text-[10px] text-emerald-600 font-semibold mt-1">
          {suffix}
        </div>
      )}
    </div>
  );
}

function Attention({ initials, name, detail, value, danger, onClick }) {
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
        <div className="font-bold text-xs">{name}</div>
        <div className="text-[10px] text-slate-500 mt-1">{detail}</div>
      </div>
      <div className={`text-xs font-bold ${danger ? "text-red-600" : "text-amber-700"}`}>
        {value}
      </div>
      <ChevronRight size={15} className="text-slate-400" />
    </button>
  );
}
