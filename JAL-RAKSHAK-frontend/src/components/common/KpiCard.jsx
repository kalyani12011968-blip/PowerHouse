export default function KpiCard({ icon: Icon, label, value, unit = "", trend, tone = "cyan" }) {
  return <div className="panel panel-hover p-4">
    <div className="flex items-center justify-between">
      <div className="eyebrow">{label}</div>
      {Icon && <Icon size={16} className={tone === "red" ? "text-red-300" : "text-cyan-300"} />}
    </div>
    <div className="mt-3 flex items-end gap-1.5">
      <span className="text-2xl font-semibold tracking-tight text-slate-100">{value}</span>
      {unit && <span className="mb-0.5 text-xs text-slate-500">{unit}</span>}
    </div>
    {trend && <div className="mt-2 text-xs text-slate-500">{trend}</div>}
  </div>;
}
