import { Menu, Radio, BellRing } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function Topbar({ onMenu }) {
  const { demoMode, connected, prediction } = useApp();
  const location = useLocation();
  const title = location.pathname === "/dashboard" ? "Operational Overview" : location.pathname.slice(1).replaceAll("-", " ") || "Command Center";
  return <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-slate-800 bg-[#07111f]/95 px-4 backdrop-blur lg:px-6">
    <div className="flex items-center gap-3">
      <button className="btn lg:hidden" onClick={onMenu}><Menu size={17} /></button>
      <div><div className="text-sm font-semibold capitalize text-slate-100">{title}</div><div className="hidden text-[10px] uppercase tracking-widest text-slate-600 sm:block">Sense → Understand → Predict → Assess → Alert</div></div>
    </div>
    <div className="flex items-center gap-2">
      <div className={`hidden items-center gap-2 border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider sm:flex ${demoMode ? "border-yellow-500/20 bg-yellow-400/10 text-yellow-300" : connected ? "border-emerald-500/20 bg-emerald-400/10 text-emerald-300" : "border-slate-700 bg-slate-900 text-slate-400"}`}>
        <Radio size={12} /> {demoMode ? "DEMO MODE" : connected ? "LIVE" : "CONNECTION LOST"}
      </div>
      <div className="hidden border border-slate-800 px-3 py-1.5 text-xs text-slate-500 md:block">Risk <span className="font-semibold text-slate-200">{prediction.riskScore}</span></div>
      <button className="btn"><BellRing size={16} /></button>
    </div>
  </header>;
}
