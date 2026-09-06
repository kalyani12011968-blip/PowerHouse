import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const colors = { waterLevel: "#22d3ee", riseRate: "#60a5fa", acceleration: "#a78bfa", rainfall: "#34d399", temperature: "#fbbf24", risk: "#f87171" };

export default function MetricChart({ data, metrics = ["waterLevel", "risk"], height = 300 }) {
  return <div style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
        <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ background: "#0a1422", border: "1px solid #334155", color: "#e2e8f0" }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {metrics.map(key => <Line key={key} type="monotone" dataKey={key} name={key.replace(/([A-Z])/g, " $1")} stroke={colors[key] || "#94a3b8"} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />)}
      </LineChart>
    </ResponsiveContainer>
  </div>;
}
