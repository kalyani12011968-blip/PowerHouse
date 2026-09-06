import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { NAV_ITEMS } from "../../utils/constants";
import { useApp } from "../../context/AppContext";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { demoMode, connected } = useApp();
  return <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-[#07111f] transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-cyan-400/30 bg-cyan-400/10 text-xl">💧</div>
          <div><div className="font-bold tracking-tight text-white">JAL-RAKSHAK</div><div className="text-[10px] text-slate-500">Water-Risk Intelligence</div></div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="eyebrow px-3 pb-2">Command Center</div>
        {NAV_ITEMS.map(([label, to, icon]) => {
          const Icon = Icons[icon] || Icons.Circle;
          return <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `mb-1 flex items-center gap-3 border px-3 py-2.5 text-sm transition ${isActive ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-200" : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}>
            <Icon size={16} />{label}
          </NavLink>;
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <div className="eyebrow mb-2">System Status</div>
        <div className="space-y-2 text-xs">
          <StatusLine label="Backend" ok />
          <StatusLine label="Gateway" ok={connected || demoMode} />
          <StatusLine label="Database" ok={demoMode || true} />
          <StatusLine label="AI" ok />
        </div>
      </div>
    </div>
  </aside>;
}
function StatusLine({ label, ok }) {
  return <div className="flex items-center justify-between"><span className="text-slate-500">{label}</span><span className={ok ? "text-emerald-300" : "text-slate-500"}>● {ok ? "Online" : "Offline"}</span></div>;
}
