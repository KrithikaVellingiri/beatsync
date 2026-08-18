import { Bot, Send, X } from "lucide-react";
import { useState } from "react";

export default function AskBeatSyncAI({ onClose }) {
  const [question,setQuestion] = useState("");
  const [answer,setAnswer] = useState("");
  const ask = () => {
    const q = question.toLowerCase();
    setAnswer(q.includes("overdue") ? "There are 2 stores with more than 30 days overdue: Ganesh Stores (46 days) and Selvam Mini Mart (39 days)." : q.includes("collection") ? "Today's collection is ₹32,600. That is about 6% lower than the recent 7-day high of ₹34,600." : "Vikram currently has the highest pending workload at 22 stores remaining.");
  };
  return <div className="fixed inset-0 z-50 grid place-items-end md:place-items-center bg-slate-950/25 p-4" onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} className="w-full max-w-lg glass rounded-3xl p-5 shadow-2xl">
      <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-blue-600 text-white grid place-items-center"><Bot size={20}/></div><div><h3 className="font-bold">Ask BeatSync AI</h3><p className="text-xs text-slate-500">Prototype · mock responses</p></div></div><button onClick={onClose}><X size={20}/></button></div>
      <div className="mt-5 space-y-2 text-sm"><button onClick={()=>setQuestion("Which stores are overdue by more than 30 days?")} className="w-full text-left p-3 rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">Which stores are overdue by more than 30 days?</button><button onClick={()=>setQuestion("Why is today's collection lower than yesterday?")} className="w-full text-left p-3 rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">Why is today's collection lower than yesterday?</button><button onClick={()=>setQuestion("Which delivery boy has the highest pending workload?")} className="w-full text-left p-3 rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">Which delivery boy has the highest pending workload?</button></div>
      <div className="mt-4 flex gap-2"><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask an operational question..." className="flex-1 rounded-2xl border border-blue-100 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 dark:bg-slate-900/50 dark:border-blue-900"/><button onClick={ask} className="w-12 rounded-2xl bg-blue-600 text-white grid place-items-center"><Send size={18}/></button></div>
      {answer && <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-sm leading-6">{answer}</div>}
    </div>
  </div>;
}
