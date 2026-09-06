import PageHeader from "../components/common/PageHeader";
import MetricChart from "../components/common/MetricChart";
import { useApp } from "../context/AppContext";

export default function Analytics(){
 const {history,devices}=useApp();
 return <div><PageHeader title="Analytics" description="Historical behavior, risk trends and device comparison." actions={<><button className="btn">Date</button><button className="btn">Device</button><button className="btn">Event</button><button className="btn">Risk</button></>}/>
 <div className="grid gap-5 lg:grid-cols-2"><Chart title="Water Level vs Time" metrics={["waterLevel"]} data={history}/><Chart title="Rise Rate vs Time" metrics={["riseRate"]} data={history}/><Chart title="Rainfall vs Time" metrics={["rainfall"]} data={history}/><Chart title="Risk Score vs Time" metrics={["risk"]} data={history}/></div>
 <section className="panel mt-5 p-5"><div className="eyebrow">Device Comparison</div><div className="mt-4 grid gap-3 md:grid-cols-3">{devices.slice(0,3).map(d=><div key={d.deviceId} className="border border-slate-800 p-4"><div className="font-semibold text-white">{d.deviceId}</div><div className="mt-3 grid grid-cols-2 gap-3 text-xs"><span className="text-slate-500">Risk</span><b>{d.riskScore}</b><span className="text-slate-500">Water</span><b>{d.waterLevel} cm</b><span className="text-slate-500">Quality</span><b>{d.sensorQuality}%</b><span className="text-slate-500">Trend</span><b>{d.waterTrend.replaceAll("_"," ")}</b></div></div>)}</div></section>
 </div>
}
function Chart({title,metrics,data}){return <section className="panel p-5"><div className="eyebrow">{title}</div><div className="mt-4"><MetricChart data={data} metrics={metrics}/></div></section>}
