import { Pause, Play, RotateCcw } from "lucide-react";
import { useApp } from "../../context/AppContext";

const options = [
  ["NORMAL", "Normal"],
  ["FLOOD_ESCALATION", "Flood"],
  ["ABNORMAL_WATER_LOSS", "Water Loss"],
  ["SENSOR_ANOMALY", "Sensor Anomaly"]
];

export default function SimulationControl() {
  const { scenario, setScenario, simulation, setSimulation, reading, prediction } = useApp();
  return <div className="panel p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="eyebrow">Simulation Control</div>
        <div className="mt-1 text-sm font-semibold text-slate-200">Demo event progression</div>
      </div>
      <span className="border border-yellow-500/20 bg-yellow-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-300">DEMO MODE</span>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map(([key, label]) => <button key={key} onClick={() => setScenario(key)}
        className={`btn ${scenario === key ? "btn-primary" : ""}`}>{label}</button>)}
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
      <div><div className="eyebrow">Scenario</div><div className="mt-1 text-sm text-slate-200">{scenario.replaceAll("_", " ")}</div></div>
      <div><div className="eyebrow">Progress</div><div className="mt-1 text-sm text-slate-200">{simulation.progress}%</div></div>
      <div><div className="eyebrow">Water</div><div className="mt-1 text-sm text-slate-200">{reading.waterLevel} cm</div></div>
      <div><div className="eyebrow">Rise rate</div><div className="mt-1 text-sm text-slate-200">{reading.riseRate} cm/min</div></div>
      <div><div className="eyebrow">Risk</div><div className="mt-1 text-sm text-slate-200">{prediction.riskScore} — {prediction.status}</div></div>
    </div>
    <div className="mt-4 h-1.5 overflow-hidden bg-slate-800"><div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${simulation.progress}%` }} /></div>
    <div className="mt-4 flex gap-2">
      <button className="btn btn-primary" onClick={() => setSimulation(s => ({ ...s, running: !s.running }))}>{simulation.running ? <Pause size={15} /> : <Play size={15} />}{simulation.running ? "Pause" : "Start"}</button>
      <button className="btn" onClick={() => setSimulation({ running: false, progress: 0, step: 1 })}><RotateCcw size={15} />Reset</button>
    </div>
  </div>;
}
