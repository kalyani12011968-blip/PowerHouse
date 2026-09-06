import { BrainCircuit, ShieldAlert } from "lucide-react";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/common/PageHeader";
import RiskGauge from "../components/common/RiskGauge";
import StatusBadge from "../components/common/StatusBadge";

export default function RiskPrediction(){
 const {prediction,reading}=useApp();
 return <div><PageHeader title="AI Risk Prediction" description="Explainable event classification and risk assessment."/>
 <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
  <section className="panel p-6"><div className="flex items-center gap-3"><BrainCircuit className="text-cyan-300"/><div><div className="eyebrow">Prediction</div><div className="font-semibold text-white">{prediction.event.replaceAll("_"," ")}</div></div></div><div className="mt-7 flex flex-col items-center"><RiskGauge score={prediction.riskScore}/><div className="mt-4"><StatusBadge status={prediction.status}/></div></div></section>
  <section className="panel p-6"><div className="eyebrow">Risk Drivers</div><div className="mt-4 grid gap-3 md:grid-cols-2">{["Rapid water-level rise","High rainfall","Above historical average","Rise-rate anomaly"].map(x=><div key={x} className="border border-slate-800 bg-slate-950/20 p-4 text-sm text-slate-200"><span className="mr-2 text-orange-300">↑</span>{x}</div>)}</div><div className="mt-7 grid gap-4 sm:grid-cols-3"><Metric label="Confidence" value={`${prediction.confidence}%`}/><Metric label="Model" value="XGBoost"/><Metric label="Version" value={prediction.modelVersion}/></div><div className="mt-7 border border-yellow-500/20 bg-yellow-400/5 p-4 text-xs leading-5 text-yellow-200/80">Prototype/model-development results are based on synthetic data. Current evaluation is not a field-validated accuracy guarantee.</div></section>
 </div>
 <section className="panel mt-5 p-5"><div className="eyebrow">Current input context</div><div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">{Object.entries({Water:`${reading.waterLevel} cm`,Rain:`${reading.rainfall} mm`,Temp:`${reading.temperature}°C`,Rise:`${reading.riseRate} cm/min`,Accel:reading.acceleration,Trend:reading.waterTrend,Quality:`${reading.sensorQuality}%`}).map(([k,v])=><div key={k}><div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div><div className="mt-1 text-sm font-semibold text-slate-200">{v}</div></div>)}</div></section>
 </div>
}
function Metric({label,value}){return <div className="border border-slate-800 p-4"><div className="eyebrow">{label}</div><div className="mt-2 text-lg font-semibold text-white">{value}</div></div>}
