import { Activity, Wifi, WifiOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/common/PageHeader";
import MetricChart from "../components/common/MetricChart";
import StatusBadge from "../components/common/StatusBadge";
import { formatDateTime } from "../utils/formatters";

export default function Monitoring(){
 const {devices,reading,history,connected,demoMode}=useApp();
 return <div><PageHeader title="Live Monitoring" description="Live sensor state, data freshness and device health."/>
 <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Health label="Connection" value={demoMode?"DEMO":connected?"LIVE":"CONNECTION LOST"} ok={demoMode||connected}/><Health label="Last update" value={formatDateTime(reading.timestamp)} ok/><Health label="Device" value={reading.deviceId} ok/><Health label="Sensor quality" value={`${reading.sensorQuality}%`} ok={reading.sensorQuality>70}/></div>
 <section className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-slate-800 bg-slate-950/30 text-[10px] uppercase tracking-wider text-slate-500"><tr>{["Device","Location","Last Seen","Water Level","Rise Rate","Acceleration","Rainfall","Temperature","Trend","Quality"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{devices.map(d=><tr key={d.deviceId} className="border-b border-slate-800/70 hover:bg-slate-900/50"><td className="px-4 py-4 font-semibold text-slate-200">{d.deviceId}</td><td className="px-4 py-4 text-slate-400">{d.location}</td><td className="px-4 py-4 text-slate-400">{formatDateTime(d.lastSeen)}</td><td className="px-4 py-4">{d.waterLevel} cm</td><td className="px-4 py-4">{d.deviceId===reading.deviceId?reading.riseRate:"—"} cm/min</td><td className="px-4 py-4">{d.deviceId===reading.deviceId?reading.acceleration:"—"}</td><td className="px-4 py-4">{d.deviceId===reading.deviceId?reading.rainfall:"—"} mm</td><td className="px-4 py-4">{d.deviceId===reading.deviceId?reading.temperature:"—"}°C</td><td className="px-4 py-4"><StatusBadge status={d.status==="OFFLINE"?"OFFLINE":d.riskScore>=76?"CRITICAL":d.riskScore>=51?"WARNING":d.riskScore>=26?"WATCH":"SAFE"} label={d.waterTrend.replaceAll("_"," ")}/></td><td className="px-4 py-4">{d.sensorQuality}%</td></tr>)}</tbody></table></div></section>
 <section className="panel mt-5 p-5"><div className="flex items-center gap-2"><Activity size={16} className="text-cyan-300"/><div><div className="eyebrow">Live behavior chart</div><div className="font-semibold">Water level and risk</div></div></div><div className="mt-4"><MetricChart data={history} metrics={["waterLevel","riseRate","risk"]}/></div></section>
 </div>
}
function Health({label,value,ok}){return <div className="panel p-4"><div className="eyebrow">{label}</div><div className={`mt-2 flex items-center gap-2 font-semibold ${ok?"text-emerald-300":"text-red-300"}`}>{ok?<Wifi size={15}/>:<WifiOff size={15}/>} {value}</div></div>}
