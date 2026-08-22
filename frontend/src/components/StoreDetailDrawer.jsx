import {
  CheckCircle2,
  MapPin,
  X,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import { useBeatSyncStore } from "../store/useBeatSyncStore";
import { translate } from "../i18n";
import { api } from "../api/client";
import { useState, useEffect } from "react";

export default function StoreDetailDrawer({
  storeId,
  onClose,
}) {
  const language = useBeatSyncStore((state) => state.language);
  const t = (key) => translate(language, key);
  const [storeData, setStoreData] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;
    
    async function fetchLedger() {
      setIsLoading(true);
      try {
        const res = await api.get(`/ledger/stores/${storeId}`);
        if (res.success) {
          setStoreData(res.data.store);
          setLedgerData(res.data.ledger);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLedger();
  }, [storeId]);

  if (!storeId) return null;

  return (
    <div
  className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[3px] flex items-center justify-center p-4"
  onClick={onClose}
>

      <section
        
    onClick={(event) =>
      event.stopPropagation()
    }
    className="relative w-[92%] max-w-2xl max-h-[90vh] overflow-y-auto soft-scroll bg-[#f7fbfb] dark:bg-[#0b1d2b] rounded-[24px] shadow-2xl"
  >

        {/* HEADER */}
        <div className="sticky top-0 z-10 px-6 py-5 bg-[#f7fbfb]/95 dark:bg-[#0b1d2b]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">

          <div className="flex items-start justify-between">

            <div>

              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#2563EB] dark:text-blue-300">
                {t("storeDetails")}
              </div>

              <h2 className="text-xl font-extrabold mt-1">
                {store.name}
              </h2>

              <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">

                <MapPin size={12} />

                {storeData?.locality || "Unassigned"}

                <span>·</span>

                ID {storeId.toString().toUpperCase()}

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

          {isLoading ? (
             <div className="text-center p-8 text-slate-500">Loading details...</div>
          ) : (
            <>
          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-3">

            <Info
              label={t("assignedBoy")}
              value={"Unknown"}
            />

            <Info
              label={t("contact")}
              value={storeData?.phone || storeData?.contact || "Not available"}
            />

            <Info
              label={t("outstanding")}
              value={`₹${(storeData?.outstandingBalance || 0).toLocaleString(
                "en-IN"
              )}`}
            />

            <Info
              label={t("outstandingAge")}
              value={`${storeData?.overdueDays || 0} days`}
            />

            <Info
              label={t("lastVisited")}
              value={"Not available"}
            />

            <Info
              label={t("lastPayment")}
              value={`—`}
            />

          </div>


          {/* STATUS */}
          <section className="glass rounded-[18px] p-5">

            <div className="flex items-center justify-between">

              <div>

                <div className="text-[10px] uppercase tracking-wide text-slate-500">
                  {t("currentStatus")}
                </div>

                <div className="font-bold mt-1">
                  {(storeData?.outstandingBalance || 0) > 15000 ? "Critical" : "Healthy"}
                </div>

              </div>

              <StatusBadge
                status={(storeData?.outstandingBalance || 0) > 15000 ? "Critical" : "Healthy"}
              />

            </div>


            <div className="flex items-center gap-2 mt-4 text-[11px] text-emerald-700 dark:text-emerald-300">

              <CheckCircle2 size={14} />

              {t("integrityVerified")}

            </div>

          </section>


          {/* INTELLIGENCE */}
          <section className="glass rounded-[18px] p-5">

            <h3 className="font-bold">
              {t("storeIntelligence")}
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


            {ledgerData.map(
              (transaction, index) => (

                <div
                  key={index}
                  className="grid grid-cols-[65px_75px_80px_1fr] gap-2 px-5 py-4 border-b last:border-0 border-slate-100 dark:border-slate-800 text-xs"
                >

                  <span className="text-slate-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </span>

                  <span className="font-semibold">
                    {transaction.type}
                  </span>

                  <span className="font-bold">
                    ₹{Number(transaction.amount).toLocaleString("en-IN")}
                  </span>

                  <span className="text-slate-500">
                    {transaction.description || ""}
                  </span>

                </div>

              )
            )}
            
            {ledgerData.length === 0 && (
              <div className="p-4 text-center text-slate-500 text-xs">No transactions found</div>
            )}

          </section>
          </>
          )}

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