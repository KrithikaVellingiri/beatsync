export default function MetricCard({ label, value, sub, icon: Icon }) {
  return <div className="glass rounded-3xl p-5">
    <div className="flex items-start justify-between"><div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</div><div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 grid place-items-center"><Icon size={18}/></div></div>
    <div className="mt-4 text-2xl font-extrabold tracking-tight">{value}</div>
    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</div>
  </div>;
}
