import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, CloudRain, Database, Gauge, MapPin, Radio, ShieldCheck, Waves, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";
import RiskGauge from "../components/common/RiskGauge";

export default function Landing() {
  const { prediction, reading } = useApp();
  return <div className="min-h-screen bg-[#050b14] text-slate-200">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
      <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center border border-cyan-400/30 bg-cyan-400/10">💧</div><div><div className="font-bold text-white">JAL-RAKSHAK</div><div className="text-[10px] text-slate-500">Water-Risk Intelligence</div></div></div>
      <div className="hidden gap-6 text-sm text-slate-400 md:flex"><a href="#platform">Platform</a><a href="#how">How It Works</a><a href="#intelligence">Intelligence</a><a href="#technology">Technology</a><a href="#alerts">Alerts</a></div>
      <Link className="btn btn-primary" to="/dashboard">Open Command Center <ArrowRight size={15} /></Link>
    </nav>

    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-2 lg:px-8 lg:pt-24">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 border border-cyan-500/20 bg-cyan-400/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300"><Waves size={13}/> Water-behavior intelligence</div>
        <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-7xl">UNDERSTAND<br/>THE WATER.<br/><span className="text-cyan-300">BEFORE IT BECOMES A DISASTER.</span></h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">JAL-RAKSHAK transforms water monitoring from simple threshold detection into water-behavior intelligence — observe, analyze, predict, assess, alert, explain and record.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link className="btn btn-primary px-5 py-3" to="/dashboard">Open Live Dashboard <ArrowRight size={16}/></Link><a className="btn px-5 py-3" href="#how">Explore the System</a></div>
        <div className="mt-8 flex flex-wrap gap-6 text-xs text-slate-500"><span>ESP32 edge sensing</span><span>AI/ML classification</span><span>Neon PostgreSQL</span><span>GSM + GPS ready</span></div>
      </div>
      <div className="panel relative overflow-hidden p-5 lg:p-7">
        <div className="absolute right-0 top-0 h-48 w-48 bg-cyan-400/5 blur-3xl"/>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4"><div><div className="eyebrow">Command Center Preview</div><div className="mt-1 font-semibold text-white">Current Water Risk</div></div><span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">● System online</span></div>
        <div className="grid gap-5 py-6 sm:grid-cols-[220px_1fr]"><div className="flex justify-center"><RiskGauge score={prediction.riskScore}/></div><div className="grid grid-cols-2 gap-3">
          <Mini label="Water Level" value={`${reading.waterLevel} cm`} icon={Waves}/><Mini label="Rise Rate" value={`${reading.riseRate} cm/min`} icon={Zap}/><Mini label="Rainfall" value={`${reading.rainfall} mm`} icon={CloudRain}/><Mini label="AI Confidence" value={`${prediction.confidence}%`} icon={BrainCircuit}/>
        </div></div>
        <div className="border-t border-slate-800 pt-4 text-xs text-slate-400">Why? <span className="text-slate-200">Rapid water-level rise · elevated rainfall · above historical baseline</span></div>
      </div>
    </section>

    <section id="platform" className="border-y border-slate-800 bg-[#07111f]"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="max-w-2xl"><div className="eyebrow">The Problem</div><h2 className="mt-2 text-3xl font-semibold text-white">Traditional monitoring asks: “What is the water level?”</h2><p className="mt-4 text-slate-400">JAL-RAKSHAK asks: “What is the water doing?”</p></div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2"><Compare title="TRADITIONAL" items={["Water Level","Threshold","Warning"]}/><Compare title="JAL-RAKSHAK" accent items={["Water Level + Rate of Change + Acceleration","Rainfall + Historical Behavior + Weather","Sensor Quality + Behavior Analysis","AI/ML → Risk → Alert"]}/></div>
    </div></section>

    <section id="how" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="eyebrow">How It Works</div><h2 className="mt-2 text-3xl font-semibold text-white">From sensing to explanation.</h2><div className="mt-10 grid gap-3 md:grid-cols-4 lg:grid-cols-7">{["OBSERVE","ANALYZE","PREDICT","ASSESS","ACT","EXPLAIN","RECORD"].map((x,i)=><div key={x} className="panel p-4"><div className="text-xs font-bold text-cyan-300">0{i+1}</div><div className="mt-8 text-sm font-semibold text-white">{x}</div><div className="mt-2 text-xs leading-5 text-slate-500">{["Sensor data","Water behavior","AI/ML classification","Risk score","Alerts","AI explanation","Database history"][i]}</div></div>)}</div></section>

    <section id="technology" className="border-y border-slate-800 bg-[#07111f]"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="eyebrow">System Architecture</div><h2 className="mt-2 text-3xl font-semibold text-white">A connected operational intelligence loop.</h2><div className="mt-10 grid gap-3 md:grid-cols-3 lg:grid-cols-6">{["Sensors","ESP32","Gateway","Node.js Backend","Water Behavior","AI/ML + Weather","Risk Engine","Events + Alerts","LLM Explanation","Neon PostgreSQL","Dashboard"].map((x,i)=><div key={x} className="panel relative p-4 text-center text-sm font-semibold text-slate-200"><div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center border border-cyan-500/20 bg-cyan-400/5 text-xs text-cyan-300">{i+1}</div>{x}</div>)}</div></div></section>

    <section id="intelligence" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="eyebrow">Capabilities</div><h2 className="mt-2 text-3xl font-semibold text-white">Water-risk intelligence, not just sensor readings.</h2><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[["Real-Time Water Intelligence",Waves],["Flood Escalation Detection",Gauge],["Abnormal Water-Loss Detection",Zap],["Sensor Anomaly Detection",ShieldCheck],["AI Risk Prediction",BrainCircuit],["Weather Context",CloudRain],["GPS Location",MapPin],["GSM Alerts",Radio],["Explainable AI",BrainCircuit],["Historical Analytics",Database]].map(([x,Icon])=><div key={x} className="panel panel-hover p-5"><Icon size={19} className="text-cyan-300"/><div className="mt-4 text-sm font-semibold text-slate-200">{x}</div></div>)}</div></section>

    <section id="alerts" className="border-t border-slate-800 bg-[#07111f]"><div className="mx-auto max-w-7xl px-5 py-16 text-center lg:px-8"><div className="eyebrow">Operational Outcome</div><h2 className="mx-auto mt-2 max-w-3xl text-3xl font-semibold text-white">Sense → Understand → Predict → Assess → Alert → Explain → Record</h2><p className="mx-auto mt-4 max-w-2xl text-slate-400">Designed for municipal authorities, water management teams, disaster response teams and environmental monitoring teams.</p><Link className="btn btn-primary mt-7" to="/dashboard">Open Command Center <ArrowRight size={15}/></Link></div></section>

    <footer className="border-t border-slate-800"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><div className="font-semibold text-slate-300">JAL-RAKSHAK</div><div>Water-Risk Intelligence & Early Warning System</div></div><div>ESP32 · Node.js · Python · XGBoost · Neon PostgreSQL · Socket.IO · GPS · GSM · LLM</div><div>Hackathon Prototype</div></div></footer>
  </div>;
}
function Mini({label,value,icon:Icon}){return <div className="border border-slate-800 bg-[#07111f] p-3"><Icon size={14} className="text-cyan-300"/><div className="mt-3 text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className="mt-1 text-lg font-semibold text-white">{value}</div></div>}
function Compare({title,items,accent}){return <div className={`panel p-6 ${accent ? "border-cyan-500/20" : ""}`}><div className="eyebrow">{title}</div><div className="mt-5 space-y-3">{items.map((x,i)=><div key={x} className="flex items-center gap-3 border border-slate-800 bg-[#07111f] p-4 text-sm text-slate-300"><span className="text-cyan-300">{accent ? "+" : i === items.length-1 ? "↓" : "→"}</span>{x}</div>)}</div></div>}
