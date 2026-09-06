import PageHeader from "../components/common/PageHeader";
import OpsMap from "../components/map/OpsMap";
import { useApp } from "../context/AppContext";
import { riskStatus } from "../utils/risk";
import StatusBadge from "../components/common/StatusBadge";

export default function MapPage(){
 const {devices}=useApp();
 return <div><PageHeader title="Operational Map" description="2D field view of devices, risk levels and monitoring locations." actions={<><button className="btn">All Devices</button><button className="btn">Critical</button><button className="btn">Warning</button><button className="btn">Online</button><button className="btn">Active Events</button></>}/>
 <section className="panel overflow-hidden"><OpsMap devices={devices} height={620}/></section>
 <div className="mt-4 grid gap-3 md:grid-cols-4">{devices.map(d=><div key={d.deviceId} className="panel p-4"><div className="flex items-center justify-between"><div className="font-semibold text-slate-200">{d.deviceId}</div><StatusBadge status={riskStatus(d.riskScore)} label={riskStatus(d.riskScore)}/></div><div className="mt-3 text-xs text-slate-500">{d.location}</div><div className="mt-2 text-xs text-slate-400">{d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}</div></div>)}</div>
 </div>
}
