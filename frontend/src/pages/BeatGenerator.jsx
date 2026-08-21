import { useMemo, useState } from "react";
import {
  CalendarDays,
  GripVertical,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { beatStores, deliveryBoys } from "../data/mockData";
import { useBeatSyncStore } from "../store/useBeatSyncStore";
import StatusBadge from "../components/StatusBadge";

const statusMap = {
  healthy: "Healthy",
  watch: "Watch",
  critical: "Critical",
};

export default function BeatGenerator() {
  const navigate = useNavigate();

  const {
  beatGenerated,
  beatPublished,
  generateBeat,
  publishBeat,

  beatColumns,
  beatUnassigned,

  setBeatColumns,
  setBeatUnassigned,
} = useBeatSyncStore();

  /*
   * We intentionally leave a few stores unassigned after generation.
   * This mirrors the reference image:
   *
   * Unassigned Stores
   *        ↓
   * Raju | Suresh | Vikram | Arun
   */
  

  const [draggedStore, setDraggedStore] = useState(null);

 const generate = () => {
  generateBeat();

  const initialColumns = deliveryBoys.map((boy) => ({
    ...boy,
    assigned: [],
  }));

  beatStores.forEach((store, index) => {
    if (index < beatStores.length - 2) {
      const columnIndex =
        index % deliveryBoys.length;

      initialColumns[columnIndex].assigned.push(store);
    }
  });

  setBeatColumns(initialColumns);
  setBeatUnassigned(beatStores.slice(-2));
};

  const handleDragStart = (store, sourceColumn = null) => {
  setDraggedStore({
    store,
    sourceColumn,
  });
};

const handleDragEnd = () => {
  setDraggedStore(null);
};

const handleDropOnColumn = (targetColumn) => {
  if (!draggedStore) return;

  const { store, sourceColumn } = draggedStore;

  if (sourceColumn === targetColumn) {
    setDraggedStore(null);
    return;
  }

  const nextColumns = beatColumns.map((column) => ({
    ...column,
    assigned: [...column.assigned],
  }));

  if (sourceColumn !== null) {
    const source =
      nextColumns[sourceColumn].assigned;

    const storeIndex = source.findIndex(
      (item) => item.id === store.id
    );

    if (storeIndex === -1) {
      setDraggedStore(null);
      return;
    }

    source.splice(storeIndex, 1);

    nextColumns[targetColumn].assigned.push(store);
  } else {
    setBeatUnassigned(
      beatUnassigned.filter(
        (item) => item.id !== store.id
      )
    );

    nextColumns[targetColumn].assigned.push(store);
  }

  setBeatColumns(nextColumns);
  setDraggedStore(null);
};

const handleDropOnUnassigned = () => {
  if (!draggedStore) return;

  const { store, sourceColumn } = draggedStore;

  if (sourceColumn === null) {
    setDraggedStore(null);
    return;
  }

  const nextColumns = beatColumns.map((column) => ({
    ...column,
    assigned: [...column.assigned],
  }));

  const source =
    nextColumns[sourceColumn].assigned;

  const storeIndex = source.findIndex(
    (item) => item.id === store.id
  );

  if (storeIndex === -1) {
    setDraggedStore(null);
    return;
  }

  source.splice(storeIndex, 1);

  setBeatColumns(nextColumns);

  if (
    !beatUnassigned.some(
      (item) => item.id === store.id
    )
  ) {
    setBeatUnassigned([
      ...beatUnassigned,
      store,
    ]);
  }

  setDraggedStore(null);
};

  const assignStore = (store, columnIndex) => {
  setBeatUnassigned(
    unassigned.filter(
      (item) => item.id !== store.id
    )
  );

  setBeatColumns(
    columns.map((column, index) =>
      index === columnIndex
        ? {
            ...column,
            assigned: [
              ...column.assigned,
              store,
            ],
          }
        : column
    )
  );
};

  const removeStore = (
  columnIndex,
  storeIndex
) => {
  const nextColumns = beatColumns.map(
    (column) => ({
      ...column,
      assigned: [...column.assigned],
    })
  );

  const [store] =
    nextColumns[columnIndex].assigned.splice(
      storeIndex,
      1
    );

  if (!store) return;

  setBeatColumns(nextColumns);

  setBeatUnassigned([
    ...beatUnassigned,
    store,
  ]);
};

  const moveStore = (
  fromColumn,
  storeIndex,
  direction
) => {
  const targetColumn =
    fromColumn + direction;

  if (
    targetColumn < 0 ||
    targetColumn >= beatColumns.length
  ) {
    return;
  }

  const nextColumns = beatColumns.map(
    (column) => ({
      ...column,
      assigned: [...column.assigned],
    })
  );

  const [store] =
    nextColumns[fromColumn].assigned.splice(
      storeIndex,
      1
    );

  if (!store) return;

  nextColumns[targetColumn].assigned.push(
    store
  );

  setBeatColumns(nextColumns);
};

  const totalAssigned = useMemo(
  () =>
    beatColumns.reduce(
      (total, column) =>
        total + column.assigned.length,
      0
    ),
  [beatColumns]
);

  const handlePublish = () => {

    publishBeat();

    setTimeout(() => {
      navigate("/dashboard");
    }, 350);
  };

  return (
    <div className="space-y-5">

      {/* PAGE INTRO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

        <div>
          <div className="text-xs font-bold uppercase tracking-[0.75em] text-black-700 dark:text-blue-300">
            Daily route planning
          </div>

         

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Prioritise overdue collections, keep nearby stores together,
            and balance workload across the delivery team.
          </p>
        </div>

        <button
          onClick={generate}
          className="pill inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] hover:bg-[#005b57] text-white font-semibold shadow-lg shadow-blue-900/10 transition"
        >
          <Sparkles size={17} />

          {beatGenerated
            ? "Regenerate Beat"
            : "Generate Today's Beat"}
        </button>

      </div>


      {/* EMPTY STATE */}
      {!beatGenerated && (
        <div className="glass rounded-[22px] border border-slate-200 dark:border-slate-800 p-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300 grid place-items-center">
            <CalendarDays size={25} />
          </div>

          <h2 className="font-bold text-lg mt-4">
            Ready to create today's beat?
          </h2>

          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Generate a rule-based delivery plan using outstanding dues,
            locality, previous visits and workload balance.
          </p>

        </div>
      )}


      {beatGenerated && (
        <>

          {/* UNASSIGNED STORES */}
          <section
  className={`glass rounded-[22px] overflow-hidden transition ${
    draggedStore && draggedStore.sourceColumn !== null
      ? "ring-2 ring-blue-400 bg-blue-50/30 dark:bg-blue-950/20"
      : ""
  }`}
  onDragOver={(event) => event.preventDefault()}
  onDrop={handleDropOnUnassigned}
>

            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

              <div>
                <h2 className="font-bold">
                  Unassigned Stores ({beatUnassigned.length})
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Add remaining stores to a delivery boy's beat.
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-500">
                {totalAssigned} assigned
              </span>

            </div>


            <div className="p-4">

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="text-[10px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="text-left px-3 py-2">
                        Store
                      </th>

                      <th className="text-left px-3 py-2">
                        Locality
                      </th>

                      <th className="text-right px-3 py-2">
                        Outstanding
                      </th>

                      <th className="text-center px-3 py-2">
                        Last Visit
                      </th>

                      <th className="text-center px-3 py-2">
                        Days
                      </th>

                      <th className="text-center px-3 py-2">
                        Priority
                      </th>

                      <th className="text-right px-3 py-2">
                        Assign
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {beatUnassigned.map((store) => (

                      <tr
  key={store.id}
  draggable
  onDragStart={() =>
    handleDragStart(store, null)
  }
  onDragEnd={handleDragEnd}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >

                        <td className="px-3 py-3 font-semibold">
                          {store.name}
                        </td>

                        <td className="px-3 py-3 text-slate-500">
                          {store.locality}
                        </td>

                        <td className="px-3 py-3 text-right font-bold">
                          ₹{store.outstanding.toLocaleString("en-IN")}
                        </td>

                        <td className="px-3 py-3 text-center text-slate-500">
                          {store.lastVisited || "—"}
                        </td>

                        <td className="px-3 py-3 text-center font-semibold">
                          {store.daysSinceVisit ?? "—"}
                        </td>

                        <td className="px-3 py-3 text-center">
                          <StatusBadge
                            status={statusMap[store.status]}
                          />
                        </td>

                        <td className="px-3 py-3 text-right">

                          <div className="inline-flex gap-1">

                            {beatColumns.map((boy, index) => (

                              <button
                                key={boy.id}
                                title={`Assign to ${boy.name}`}
                                onClick={() =>
                                  assignStore(
                                    store,
                                    index
                                  )
                                }
                                className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] font-bold"
                              >
                                {boy.initials}
                              </button>

                            ))}

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>


              {beatUnassigned.length === 0 && (
                <div className="py-4 text-center text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  ✓ All stores have been assigned
                </div>
              )}

            </div>

          </section>


          {/* ASSIGNMENT COLUMNS */}
          <section>

            <div className="flex items-center justify-between mb-3">

              <div>
                <h2 className="font-bold">
                  Delivery Boy Assignments
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Move stores between routes to balance workload.
                </p>
              </div>

              <div className="text-xs text-slate-500">
                {beatColumns.length} delivery boys
              </div>

            </div>


            <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-3">

             {beatColumns.map((boy, columnIndex) => (

  <div
    key={boy.id}
    onDragOver={(event) => event.preventDefault()}
    onDrop={() =>
      handleDropOnColumn(columnIndex)
    }
    className={`glass rounded-[20px] overflow-hidden transition ${
      draggedStore
        ? "hover:ring-2 hover:ring-blue-400"
        : ""
    }`}
  >

                  {/* BOY HEADER */}
                  <div className="px-4 py-3 bg-[#2563EB] text-white">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-full bg-white/15 grid place-items-center text-xs font-bold">
                        {boy.initials}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="font-bold truncate">
                          {boy.name}
                        </div>

                        <div className="text-[11px] text-white/70">
                          {boy.area}
                        </div>

                      </div>

                      <div className="text-right">

                        <div className="font-bold">
                          {boy.assigned.length}
                        </div>

                        <div className="text-[9px] text-white/70">
                          stores
                        </div>

                      </div>

                    </div>

                  </div>


                  {/* STORE LIST */}
                  <div className="p-3 space-y-2">

                    {boy.assigned.map(
                      (store, storeIndex) => (

                        <div
                        key={store.id}
                        draggable
                        onDragStart={() =>
                          handleDragStart(store, columnIndex)
                        }
                        onDragEnd={handleDragEnd}
                        className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-3 cursor-grab active:cursor-grabbing hover:border-blue-300 dark:hover:border-blue-800 transition"
                      >

                          <div className="flex items-start gap-2">

                            <GripVertical
                              size={14}
                              className="text-slate-300 mt-0.5 shrink-0"
                            />

                            <div className="min-w-0 flex-1">

                              <div className="font-semibold text-xs truncate">
                                {store.name}
                              </div>

                                                          <div className="text-[10px] text-slate-500 mt-1">
                              {store.locality}
                            </div>

                            <div className="mt-2">

                              <div className="text-xs font-bold">
                                ₹{store.outstanding.toLocaleString("en-IN")}
                              </div>

                              <div className="flex items-center justify-between mt-1">

                                <div className="text-[10px] text-slate-500">
                                  Last visit: {store.lastVisited || "—"}
                                </div>

                                <StatusBadge
                                  status={statusMap[store.status]}
                                />

                              </div>

                              {store.daysSinceVisit !== undefined && (
                                <div className="text-[10px] text-slate-500 mt-1">
                                  {store.daysSinceVisit} days since last visit
                                </div>
                              )}

                            </div>

                            </div>

                          </div>


                          {/* STORE CONTROLS */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">

                            <button
                              onClick={() =>
                                removeStore(
                                  columnIndex,
                                  storeIndex
                                )
                              }
                              className="text-[10px] text-slate-400 hover:text-red-600"
                            >
                              <X size={12} className="inline mr-1" />
                              Remove
                            </button>


                            <div className="flex gap-1">

                              {columnIndex > 0 && (
                                <button
                                  onClick={() =>
                                    moveStore(
                                      columnIndex,
                                      storeIndex,
                                      -1
                                    )
                                  }
                                  className="text-[10px] px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                >
                                  ←
                                </button>
                              )}

                              {columnIndex <
                                beatColumns.length - 1 && (
                                <button
                                  onClick={() =>
                                    moveStore(
                                      columnIndex,
                                      storeIndex,
                                      1
                                    )
                                  }
                                  className="text-[10px] px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                >
                                  →
                                </button>
                              )}

                            </div>

                          </div>

                        </div>

                      )
                    )}


                    {/* ADD STORE */}
                    <div className="pt-1">

                      <div className="text-[10px] text-slate-400 text-center mb-2">
                        Add another store
                      </div>

                      <div className="flex gap-1">

                        {beatUnassigned.map((store) => (

                          <button
                            key={store.id}
                            onClick={() =>
                              assignStore(
                                store,
                                columnIndex
                              )
                            }
                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/30 text-[10px] font-semibold"
                          >
                            <Plus size={12} />
                            Add
                          </button>

                        ))}

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* PUBLISH */}
          <section className="glass rounded-[22px] p-4">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

              <div>

                <div className="font-bold">
                  {beatPublished
                    ? "Beat published successfully"
                    : "Ready to publish?"}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                 {beatPublished
                  ? "The delivery team has received today's beat."
                  : beatUnassigned.length > 0
                  ? `${beatUnassigned.length} store(s) remain unassigned. You can still publish the beat.`
                  : "Beat will be sent to all delivery boys."}
                </div>

              </div>


              {!beatPublished ? (

                <button
                  
                  onClick={handlePublish}
                  className="pill min-w-[230px] py-3 flex items-center justify-center gap-2 font-semibold transition bg-[#2563EB] hover:bg-[#005b57] text-white"
                  >
                  <Send size={16} />
                  Publish Beat
                </button>

              ) : (

                <button
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="pill min-w-[230px] py-3 bg-[#2563EB] text-white font-semibold"
                >
                  Go to Live Dashboard
                </button>

              )}

            </div>

          </section>

        </>
      )}

    </div>
  );
}