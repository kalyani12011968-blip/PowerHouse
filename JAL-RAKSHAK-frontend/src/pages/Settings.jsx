import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import { API_BASE_URL, GATEWAY_URL, USE_MOCK_DATA } from "../services/api";

export default function Settings(){
 const [saved,setSaved]=useState(false);
 return <div><PageHeader title="Settings" description="System, device, risk, alert, weather and AI configuration."/>
 <div className="grid gap-5 lg:grid-cols-2"><section className="panel p-5"><div className="eyebrow">System</div><div className="mt-4 space-y-4"><Row label="Frontend mode" value={USE_MOCK_DATA?"DEMO / SIMULATION":"LIVE BACKEND"}/><Row label="API base" value={API_BASE_URL}/><Row label="Realtime gateway" value={GATEWAY_URL}/></div></section><section className="panel p-5"><div className="eyebrow">Risk Thresholds</div><div className="mt-4 grid gap-2">{[["0–25","SAFE"],["26–50","WATCH"],["51–75","WARNING"],["76–100","CRITICAL"]].map(([r,s])=><div key={s} className="flex justify-between border border-slate-800 p-3 text-sm"><span className="text-slate-400">{r}</span><b>{s}</b></div>)}</div><div className="mt-4 text-xs leading-5 text-yellow-200/70">Prototype/demo thresholds — not universal scientifically validated thresholds.</div></section><section className="panel p-5"><div className="eyebrow">Alerts</div><div className="mt-4 space-y-3"><Toggle label="GSM SMS alerts" on/><Toggle label="Local alarm" on/><Toggle label="Dashboard notifications" on/></div></section><section className="panel p-5"><div className="eyebrow">AI Model</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Row label="Model" value="XGBoost"/><Row label="Version" value="v1.0"/><Row label="Event classes" value="4"/><Row label="Evaluation" value="Synthetic prototype"/></div></section></div>
 <button className="btn btn-primary mt-5" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),1500)}}>{saved?"Saved":"Save Preferences"}</button>
 </div>
}
function Row({label,value}){return <div><div className="eyebrow">{label}</div><div className="mt-1 break-all text-sm text-slate-200">{value}</div></div>}
function Toggle({label,on}){return <div className="flex items-center justify-between border border-slate-800 p-3 text-sm"><span>{label}</span><span className={`h-5 w-9 rounded-full p-0.5 ${on?"bg-cyan-500":"bg-slate-700"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${on?"translate-x-4":""}`}/></span></div>}
