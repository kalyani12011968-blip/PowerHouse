import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import { useApp } from "../context/AppContext";
import { USE_MOCK_DATA } from "../services/api";
import { aiApi } from "../services/aiApi";

const prompts=["Why is the current risk high?","What caused the flood escalation?","Is the water level rising unusually fast?","Why was this event classified as abnormal water loss?","Which device currently has the highest risk?","What changed in the last hour?","What should the operator investigate?","Explain this event in simple terms."];

export default function AIAssistant(){
 const {reading,prediction,weather,devices,events}=useApp();
 const [question,setQuestion]=useState(""); const [messages,setMessages]=useState([{role:"assistant",text:"Water-risk intelligence assistant ready. Ask about the current event, behavior, risk drivers, devices or operator response."}]); const [busy,setBusy]=useState(false);
 async function send(q=question){ if(!q.trim())return; setMessages(m=>[...m,{role:"user",text:q}]);setQuestion("");setBusy(true);
  try{
   let text;
   if(USE_MOCK_DATA) text=mockAnswer(q,reading,prediction);
   else {const r=await aiApi.chat(q,{reading,prediction,weather,devices,events}); text=r?.data?.answer||r?.data?.message||JSON.stringify(r?.data||r);}
   setMessages(m=>[...m,{role:"assistant",text}]);
  }catch(e){setMessages(m=>[...m,{role:"assistant",text:`AI service unavailable: ${e.message}`}]);}finally{setBusy(false);}
 }
 return <div><PageHeader title="Water-Risk Intelligence Assistant" description="Context-aware operational explanation — not a generic chatbot."/>
 <div className="grid gap-5 lg:grid-cols-[.7fr_1.3fr]"><section className="panel p-5"><div className="flex items-center gap-3"><Sparkles size={18} className="text-cyan-300"/><div><div className="eyebrow">Current Context</div><div className="font-semibold text-white">{prediction.event.replaceAll("_"," ")}</div></div></div><div className="mt-5 grid grid-cols-2 gap-3">{[["Water",`${reading.waterLevel} cm`],["Rain",`${reading.rainfall} mm`],["Rise",`${reading.riseRate} cm/min`],["Risk",`${prediction.riskScore}`],["Device",reading.deviceId],["Weather",weather.context],["Historical","91 vs 70 cm"]].map(([k,v])=><div key={k} className="border border-slate-800 p-3"><div className="eyebrow">{k}</div><div className="mt-1 text-xs text-slate-200">{v}</div></div>)}</div><div className="mt-5"><div className="eyebrow">Suggested questions</div><div className="mt-3 space-y-2">{prompts.map(p=><button key={p} onClick={()=>send(p)} className="w-full border border-slate-800 p-3 text-left text-xs text-slate-300 hover:bg-slate-900">{p}</button>)}</div></div></section>
 <section className="panel flex min-h-[620px] flex-col"><div className="border-b border-slate-800 p-4"><div className="flex items-center gap-2"><Bot size={17} className="text-cyan-300"/><div className="font-semibold text-white">Operational Analysis</div></div></div><div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((m,i)=><div key={i} className={`max-w-3xl border p-4 text-sm leading-6 ${m.role==="user"?"ml-auto border-cyan-500/20 bg-cyan-400/5 text-cyan-100":"border-slate-800 bg-slate-950/20 text-slate-300"}`}><div className="eyebrow">{m.role==="user"?"Operator":"JAL-RAKSHAK"}</div><div className="mt-1">{m.text}</div></div>)}{busy&&<div className="text-xs text-slate-500">Analyzing current context…</div>}</div><div className="border-t border-slate-800 p-4"><div className="flex gap-2"><input className="input" value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about the current water-risk situation…"/><button className="btn btn-primary" onClick={()=>send()}><Send size={15}/></button></div></div></section></div>
 </div>
}
function mockAnswer(q,r,p){const x=q.toLowerCase();if(x.includes("why")&&x.includes("risk"))return `The current risk is ${p.riskScore} (${p.status}) because the water level is ${r.waterLevel} cm, the rise rate is ${r.riseRate} cm/min, rainfall is ${r.rainfall} mm, and the level is above the 70 cm historical average. The strongest behavior signal is rapid rise.`;if(x.includes("water loss"))return "The system classifies this as abnormal water-loss behavior when the level falls unusually quickly. Possible explanations include leakage, diversion, structural failure, unusual discharge, or a sensor anomaly. Field investigation is required.";if(x.includes("investigate"))return "Prioritize the monitoring point, verify sensor installation/calibration, compare the current level with recent history, inspect physical flow conditions, and confirm the alert channel reached the operator.";return "The current monitoring context indicates an elevated water-risk state. I can explain the event, its main drivers, device status, historical deviation, or recommended operator checks."; }
