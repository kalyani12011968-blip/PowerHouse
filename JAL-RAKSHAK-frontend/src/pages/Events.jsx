import { Link } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import { useApp } from "../context/AppContext";
import { eventLabel, riskStatus } from "../utils/risk";
import { formatDateTime } from "../utils/formatters";

export default function Events(){
 const {events}=useApp(); const [filter,setFilter]=useState("ALL");
 const list=events.filter(e=>filter==="ALL"||e.event===filter);
 return <div><PageHeader title="Events" description="Operational history of normal, escalation, abnormal water-loss and sensor events."/>
 <div className="mb-4 flex flex-wrap gap-2">{["ALL","NORMAL","FLOOD_ESCALATION","ABNORMAL_WATER_LOSS","SENSOR_ANOMALY"].map(x=><button key={x} className={`btn ${filter===x?"btn-primary":""}`} onClick={()=>setFilter(x)}>{eventLabel(x)}</button>)}</div>
 <section className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500"><tr>{["Event","Device","Risk","Confidence","Time","Location","Status",""].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{list.map(e=><tr key={e.eventId} className="border-b border-slate-800/70"><td className="px-4 py-4 font-semibold text-slate-200">{eventLabel(e.event)}</td><td className="px-4 py-4">{e.deviceId}</td><td className="px-4 py-4"><StatusBadge status={riskStatus(e.riskScore)} label={`${e.riskScore}`}/></td><td className="px-4 py-4">{e.confidence}%</td><td className="px-4 py-4 text-slate-500">{formatDateTime(e.timestamp)}</td><td className="px-4 py-4 text-slate-400">{e.latitude.toFixed(4)}, {e.longitude.toFixed(4)}</td><td className="px-4 py-4 text-xs uppercase text-slate-400">{e.status}</td><td className="px-4 py-4"><Link className="text-cyan-300" to={`/events/${e.eventId}`}>Open →</Link></td></tr>)}</tbody></table></div></section>
 </div>
}
