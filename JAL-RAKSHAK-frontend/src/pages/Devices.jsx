import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import { riskStatus } from "../utils/risk";
import { relativeTime } from "../utils/formatters";
import { useState } from "react";

export default function Devices(){
 const {devices}=useApp(); const [q,setQ]=useState("");
 const filtered=devices.filter(d=>(`${d.deviceId} ${d.location}`).toLowerCase().includes(q.toLowerCase()));
 return <div><PageHeader title="Devices" description="Device health, location, water state and risk at a glance."/>
 <div className="mb-4 flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search size={15} className="absolute left-3 top-2.5 text-slate-500"/><input className="input pl-9" placeholder="Search devices…" value={q} onChange={e=>setQ(e.target.value)}/></div><button className="btn"><SlidersHorizontal size={15}/>Filter</button><button className="btn">Sort</button></div>
 <section className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500"><tr>{["Device","Status","Location","Water Level","Risk","Trend","Quality","Last Seen",""].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{filtered.map(d=><tr key={d.deviceId} className="border-b border-slate-800/70 hover:bg-slate-900/50"><td className="px-4 py-4 font-semibold text-slate-200">{d.deviceId}</td><td className="px-4 py-4"><StatusBadge status={d.status==="OFFLINE"?"OFFLINE":riskStatus(d.riskScore)} label={d.status}/></td><td className="px-4 py-4 text-slate-400">{d.location}</td><td className="px-4 py-4">{d.waterLevel} cm</td><td className="px-4 py-4"><StatusBadge status={riskStatus(d.riskScore)} label={`${d.riskScore} ${riskStatus(d.riskScore)}`}/></td><td className="px-4 py-4 text-slate-400">{d.waterTrend.replaceAll("_"," ")}</td><td className="px-4 py-4">{d.sensorQuality}%</td><td className="px-4 py-4 text-slate-500">{relativeTime(d.lastSeen)}</td><td className="px-4 py-4"><Link className="text-xs text-cyan-300" to={`/devices/${d.deviceId}`}>Details →</Link></td></tr>)}</tbody></table></div></section>
 </div>
}
