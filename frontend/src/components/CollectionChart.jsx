import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import { useBeatSyncStore } from "../store/useBeatSyncStore";
import { translate } from "../i18n";

const dummyCollectionTrend = [
  { day: "Mon", amount: 0 },
  { day: "Tue", amount: 0 },
  { day: "Wed", amount: 0 },
  { day: "Thu", amount: 0 },
  { day: "Fri", amount: 0 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 0 },
];

export default function CollectionChart({ data = dummyCollectionTrend }) {
  const language = useBeatSyncStore((state) => state.language);
  const t = (key) => translate(language, key);
  return <div className="glass rounded-3xl p-5">
    <div className="flex items-center justify-between mb-5"><div><h3 className="font-bold">{t("collectionTrend")}</h3><p className="text-xs text-slate-500 mt-1">{t("cashRecentDays")}</p></div><span className="pill px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-semibold">7 days</span></div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{left: -15,right: 5,top: 5,bottom: 0}}>
          <defs><linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity=".28"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="#dbeafe" strokeDasharray="4 4"/>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:12,fill:"#64748b"}}/>
          <YAxis axisLine={false} tickLine={false} tick={{fontSize:11,fill:"#64748b"}} tickFormatter={(v)=>`₹${v/1000}k`}/>
          <Tooltip formatter={(v)=>[`₹${Number(v).toLocaleString("en-IN")}`,t("collection")]} contentStyle={{borderRadius:14,border:"1px solid #dbeafe"}}/>
          <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fill="url(#blueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>;
}
