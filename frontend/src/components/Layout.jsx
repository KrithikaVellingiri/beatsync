import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AskBeatSyncAI from "./AskBeatSyncAI";
import { useBeatSyncStore } from "../store/useBeatSyncStore";

export default function Layout() {
  const { theme } = useBeatSyncStore();
  const [askOpen,setAskOpen] = useState(false);
  useEffect(()=>{document.documentElement.classList.toggle("dark", theme === "dark")},[theme]);
  return <div className={theme === "dark" ? "dark" : ""}><div className="app-shell min-h-screen flex"><Sidebar/><main className="flex-1 min-w-0"><Topbar onAsk={()=>setAskOpen(true)}/><div className="p-5 md:p-8 max-w-[1600px] mx-auto"><Outlet/></div></main>{askOpen && <AskBeatSyncAI onClose={()=>setAskOpen(false)}/>}</div></div>;
}
