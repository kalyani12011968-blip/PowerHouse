import { CloudRain, Droplets, Thermometer } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import MetricChart from "../components/common/MetricChart";
import { useApp } from "../context/AppContext";

export default function Weather(){
 const {weather}=useApp();
 return <div><PageHeader title="Weather Context" description="Weather conditions used as context for water-risk assessment."/>
 <div className="grid gap-3 sm:grid-cols-3"><Card label="Temperature" value={`${weather.temperature}°C`} icon={Thermometer}/><Card label="Rainfall Forecast" value={`${weather.rainfallForecast} mm`} icon={CloudRain}/><Card label="Precipitation Probability" value={`${weather.precipitationProbability}%`} icon={Droplets}/></div>
 <section className="panel mt-5 p-5"><div className="eyebrow">Weather Risk Context</div><div className="mt-2 text-lg font-semibold text-orange-200">{weather.context}</div><div className="mt-5"><MetricChart data={weather.forecast.map(x=>({...x,risk:x.probability,waterLevel:x.rainfall}))} metrics={["waterLevel","risk"]}/></div></section>
 <div className="mt-5 grid gap-3 md:grid-cols-5">{weather.forecast.map(x=><div key={x.time} className="panel p-4"><div className="eyebrow">{x.time}</div><div className="mt-3 text-xl font-semibold text-white">{x.rainfall} mm</div><div className="mt-1 text-xs text-slate-500">{x.probability}% probability</div></div>)}</div>
 </div>
}
function Card({label,value,icon:Icon}){return <div className="panel p-5"><Icon size={17} className="text-cyan-300"/><div className="mt-4 eyebrow">{label}</div><div className="mt-1 text-2xl font-semibold text-white">{value}</div></div>}
