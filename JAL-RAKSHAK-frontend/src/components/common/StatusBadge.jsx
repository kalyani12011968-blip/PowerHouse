import { riskTone } from "../../utils/risk";
export default function StatusBadge({ status, label = status }) {
  return <span className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${riskTone(status)}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{label}
  </span>;
}
