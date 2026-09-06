import { useParams } from "react-router-dom";
import { Cpu, Gauge, MapPin, Radio, Satellite, Save, Thermometer, Waves, Wifi } from "lucide-react";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/common/PageHeader";
import KpiCard from "../components/common/KpiCard";
import StatusBadge from "../components/common/StatusBadge";
import OpsMap from "../components/map/OpsMap";
import { riskStatus } from "../utils/risk";

export default function DeviceDetails(){
 const {deviceId}=useParams(); const {devices,reading}=useApp(); const d=devices.find(x=>x.deviceId===deviceId)||devices[0];
 return <div><PageHeader title={`Device ${d.deviceId}`} description="Detailed operational state, sensor health and location."/>
 <div className="grid gap-5 lg:grid-cols-2"><section className="panel p-5"><div className="flex items-center justify-between"><div><div className="eyebrow">Device Status</div><div className="mt-1 text-xl font-semibold text-white">{d.deviceId}</div></div><StatusBadge status={d.status==="OFFLINE"?"OFFLINE":riskStatus(d.riskScore)} label={d.status}/></div><div className="mt-6 grid grid-cols-2 gap-5"><Info label="Location" value={d.location}/><Info label="Latitude" value={d.latitude}/><Info label="Longitude" value={d.longitude}/><Info label="Last Seen" value="10 sec ago"/></div></section><section className="panel p-5"><div className="eyebrow">Sensor Health</div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{[["Ultrasonic",Waves,"ONLINE"],["Rain Sensor",CloudRain,"ONLINE"],["Temperature",Thermometer,"ONLINE"],["GPS",Satellite,"ONLINE"],["GSM",Radio,"ONLINE"],["SD Card",Save,"READY"]].map(([x,I,s])=><div key={x} className="border border-slate-800 p-3"><I size={15} className="text-cyan-300"/><div className="mt-3 text-xs text-slate-400">{x}</div><div className="mt-1 text-[10px] font-bold uppercase text-emerald-300">{s}</div></div>)}</div></section></div>
 <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><KpiCard label="Water Level" value={d.deviceId===reading.deviceId?reading.waterLevel:d.waterLevel} unit="cm" icon={Waves}/><KpiCard label="Rainfall" value={d.deviceId===reading.deviceId?reading.rainfall:"—"} unit="mm" icon={CloudRain}/><KpiCard label="Temperature" value={d.deviceId===reading.deviceId?reading.temperature:"—"} unit="°C" icon={Thermometer}/><KpiCard label="Risk" value={d.riskScore} icon={Gauge}/></div>
 <section className="panel mt-5 overflow-hidden"><div className="border-b border-slate-800 p-4"><div className="eyebrow">Device Location</div></div><OpsMap devices={[d]} height={420}/></section>
 </div>
}
function Info({label,value}){return <div><div className="eyebrow">{label}</div><div className="mt-1 text-sm text-slate-200">{value}</div></div>}
