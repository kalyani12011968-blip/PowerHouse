import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useApp } from "../../context/AppContext";

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { demoMode } = useApp();
  return <div className="min-h-screen bg-[#050b14] text-slate-200">
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className="min-w-0 flex-1">
        <Topbar onMenu={() => setMobileOpen(true)} />
        {demoMode && <div className="border-b border-yellow-500/10 bg-yellow-400/[0.04] px-4 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-300 lg:px-6">DEMO MODE — simulated values, not live sensor data</div>}
        <main className="mx-auto max-w-[1800px] p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  </div>;
}
