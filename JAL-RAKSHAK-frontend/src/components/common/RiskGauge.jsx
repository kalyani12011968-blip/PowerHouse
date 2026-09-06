import { riskStatus } from "../../utils/risk";
export default function RiskGauge({ score = 0, compact = false }) {
  const status = riskStatus(score);
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;
  const stroke = status === "CRITICAL" ? "#f87171" : status === "WARNING" ? "#fb923c" : status === "WATCH" ? "#facc15" : "#34d399";
  return <div className={`relative ${compact ? "h-28 w-28" : "h-52 w-52"} shrink-0`}>
    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
      <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="8" />
      <circle cx="60" cy="60" r="50" fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className={`${compact ? "text-2xl" : "text-5xl"} font-semibold text-white`}>{score}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: stroke }}>{status}</span>
    </div>
  </div>;
}
