import { BellRing } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import { useApp } from "../context/AppContext";
import { formatDateTime } from "../utils/formatters";
import { riskStatus } from "../utils/risk";

export default function Alerts(){
 const {alerts}=useApp();
 return <div><PageHeader title="Alert Center" description="Emergency notification status across GSM, dashboard and local channels."/>
 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Critical" value={alerts.filter(a=>a.severity==="CRITICAL").length}/><Stat label="Pending" value={alerts.filter(a=>a.status==="PENDING").length}/><Stat label="Acknowledged" value={alerts.filter(a=>a.status==="ACKNOWLEDGED").length}/><Stat label="Delivered" value={alerts.filter(a=>a.status==="SENT").length}/></div>
 <section className="panel mt-5 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500"><tr>{["Severity","Alert","Device","Time","Delivery","Status"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{alerts.map(a=><tr key={a.alertId} className="border-b border-slate-800/70"><td className="px-4 py-4"><StatusBadge status={riskStatus(a.severity==="CRITICAL"?82:a.severity==="WARNING"?68:42)} label={a.severity}/></td><td className="px-4 py-4 font-semibold text-slate-200">{a.message}</td><td className="px-4 py-4">{a.deviceId}</td><td className="px-4 py-4 text-slate-500">{formatDateTime(a.sentAt)}</td><td className="px-4 py-4 text-slate-400">{a.delivery}</td><td className="px-4 py-4 text-xs font-bold uppercase text-emerald-300">{a.status}</td></tr>)}</tbody></table></div></section>
 </div>
}
function Stat({label,value}){return <div className="panel p-4"><div className="eyebrow">{label}</div><div className="mt-2 text-2xl font-semibold text-white">{value}</div></div>}
