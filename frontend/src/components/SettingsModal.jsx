import { useEffect, useState } from "react";
import {
  ChevronDown,
  Hash,
  Languages,
  MapPin,
  Package,
  Phone,
  Plus,
  Store,
  Users,
  X,
} from "lucide-react";
import { deliveryBoys } from "../data/mockData";
import { useBeatSyncStore } from "../store/useBeatSyncStore";
import { translate } from "../i18n";

export default function SettingsModal({ onClose }) {
  const language = useBeatSyncStore((state) => state.language);
  const setLanguage = useBeatSyncStore((state) => state.setLanguage);
  const managedStores = useBeatSyncStore((state) => state.managedStores);
  const managedProducts = useBeatSyncStore((state) => state.managedProducts);
  const addStore = useBeatSyncStore((state) => state.addStore);
  const addProduct = useBeatSyncStore((state) => state.addProduct);
  const saveSettings = useBeatSyncStore((state) => state.saveSettings);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSections, setOpenSections] = useState({
    delivery: true,
    stores: true,
    products: true,
  });
  const [storeDetails, setStoreDetails] = useState({
    name: "",
    location: "",
    phone: "",
  });
  const [productDetails, setProductDetails] = useState({
    id: "",
    name: "",
    price: "",
  });
  const t = (key) => translate(language, key);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleStoreSubmit = (event) => {
    event.preventDefault();
    addStore(storeDetails);
    setStoreDetails({ name: "", location: "", phone: "" });
    setAddStoreOpen(false);
  };

  const handleProductSubmit = (event) => {
    event.preventDefault();
    addProduct(productDetails);
    setProductDetails({ id: "", name: "", price: "" });
    setAddProductOpen(false);
  };

  const toggleSection = (section) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const handleSaveChanges = () => {
    saveSettings();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

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
            <h2 id="settings-title" className="text-xl font-bold">{t("settings")}</h2>
            <p className="mt-1 text-xs text-slate-500">{t("settingsSubtitle")}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/45 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Languages size={16} className="text-[#2563EB]" />
            {t("language")}
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${language === "en" ? "bg-white text-[#2563EB] shadow-sm dark:bg-slate-700" : "text-slate-500"}`}
              aria-pressed={language === "en"}
            >
              {t("english")}
            </button>
            <button
              onClick={() => setLanguage("ta")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${language === "ta" ? "bg-white text-[#2563EB] shadow-sm dark:bg-slate-700" : "text-slate-500"}`}
              aria-pressed={language === "ta"}
            >
              {t("tamil")}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-950 dark:bg-blue-950/25">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB] text-white">
              <Hash size={17} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">{t("teamCode")}</div>
              <div className="mt-1 font-bold tracking-[0.18em] text-[#2563EB]">SHARMA24</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => toggleSection("delivery")}
            className="mb-3 flex w-full items-center gap-2 text-left"
            aria-expanded={openSections.delivery}
          >
            <Users size={17} className="text-[#2563EB]" />
            <h3 className="font-bold">{t("deliveryTeam")}</h3>
            <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {deliveryBoys.length} {t("assigned")}
            </span>
            <ChevronDown size={17} className={`transition-transform ${openSections.delivery ? "rotate-180" : ""}`} />
          </button>

          {openSections.delivery && <div className="space-y-2">
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
                    {boy.phone || t("notAvailable")}
                  </div>
                  {boy.status && (
                    <span className="rounded-full bg-white px-2.5 py-1 font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                      {boy.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            onClick={() => toggleSection("stores")}
            className="flex w-full items-center gap-2 text-left"
            aria-expanded={openSections.stores}
          >
            <Store size={17} className="text-[#2563EB]" />
            <h3 className="font-bold">{t("stores")}</h3>
            <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {managedStores.length} {t("managed")}
            </span>
            <ChevronDown size={17} className={`transition-transform ${openSections.stores ? "rotate-180" : ""}`} />
          </button>

          {openSections.stores && <>
            <div className="mt-3 space-y-2">
              {managedStores.map((store) => (
                <div key={store.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/50">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{store.name}</div>
                    <div className="text-xs text-slate-500">{store.locality || store.area}</div>
                  </div>
                  <div className="shrink-0 text-xs text-slate-500">{store.contact || "Not available"}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setAddStoreOpen(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={15} />
              {t("addStore")}
            </button>
          </>}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            onClick={() => toggleSection("products")}
            className="flex w-full items-center gap-2 text-left"
            aria-expanded={openSections.products}
          >
            <Package size={17} className="text-[#2563EB]" />
            <h3 className="font-bold">{t("productCatalogue")}</h3>
            <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {managedProducts.length} {t("products")}
            </span>
            <ChevronDown size={17} className={`transition-transform ${openSections.products ? "rotate-180" : ""}`} />
          </button>

          {openSections.products && <>
            <div className="mt-3 space-y-2">
              {managedProducts.length === 0 ? (
                <div className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-500 dark:bg-slate-900/50">
                  {t("noProducts")}
                </div>
              ) : managedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/50">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.id}</div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-[#2563EB]">₹{product.price}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setAddProductOpen(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={15} />
              {t("addProduct")}
            </button>
          </>}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          {saved && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t("changesSaved")}</span>}
          <button
            onClick={handleSaveChanges}
            className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            {t("saveChanges")}
          </button>
        </div>
      </section>

      {addStoreOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/35 p-4"
          onClick={() => setAddStoreOpen(false)}
          role="presentation"
        >
          <form
            onSubmit={handleStoreSubmit}
            onClick={(event) => event.stopPropagation()}
            className="glass w-full max-w-md rounded-2xl border border-slate-200 p-5 text-slate-900 shadow-2xl dark:border-slate-800 dark:text-white sm:p-6"
            aria-labelledby="add-store-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="add-store-title" className="text-lg font-bold">{t("addStore")}</h3>
                <p className="mt-1 text-xs text-slate-500">{t("addStoreSubtitle")}</p>
              </div>
              <button
                type="button"
                onClick={() => setAddStoreOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close add store form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">
                {t("storeName")}
                <input
                  required
                  value={storeDetails.name}
                  onChange={(event) => setStoreDetails({ ...storeDetails, name: event.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900/50"
                  placeholder="e.g. Lakshmi Stores"
                />
              </label>

              <label className="block text-sm font-semibold">
                {t("location")}
                <span className="relative mt-1.5 block">
                  <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    required
                    value={storeDetails.location}
                    onChange={(event) => setStoreDetails({ ...storeDetails, location: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900/50"
                    placeholder="e.g. Anna Nagar"
                  />
                </span>
              </label>

              <label className="block text-sm font-semibold">
                {t("storeOwnerPhone")}
                <span className="relative mt-1.5 block">
                  <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    required
                    type="tel"
                    value={storeDetails.phone}
                    onChange={(event) => setStoreDetails({ ...storeDetails, phone: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900/50"
                    placeholder="e.g. 9876543210"
                  />
                </span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddStoreOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {t("addStore")}
              </button>
            </div>
          </form>
        </div>
      )}

      {addProductOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/35 p-4"
          onClick={() => setAddProductOpen(false)}
          role="presentation"
        >
          <form
            onSubmit={handleProductSubmit}
            onClick={(event) => event.stopPropagation()}
            className="glass w-full max-w-md rounded-2xl border border-slate-200 p-5 text-slate-900 shadow-2xl dark:border-slate-800 dark:text-white sm:p-6"
            aria-labelledby="add-product-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="add-product-title" className="text-lg font-bold">{t("addProduct")}</h3>
                <p className="mt-1 text-xs text-slate-500">{t("addProductSubtitle")}</p>
              </div>
              <button
                type="button"
                onClick={() => setAddProductOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close add product form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">
                {t("productId")}
                <input
                  required
                  value={productDetails.id}
                  onChange={(event) => setProductDetails({ ...productDetails, id: event.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900/50"
                  placeholder="e.g. PROD-001"
                />
              </label>

              <label className="block text-sm font-semibold">
                {t("productName")}
                <input
                  required
                  value={productDetails.name}
                  onChange={(event) => setProductDetails({ ...productDetails, name: event.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900/50"
                  placeholder="e.g. Classic Soda"
                />
              </label>

              <label className="block text-sm font-semibold">
                {t("price")}
                <input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  value={productDetails.price}
                  onChange={(event) => setProductDetails({ ...productDetails, price: event.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900/50"
                  placeholder="e.g. 45"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddProductOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {t("addProduct")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}