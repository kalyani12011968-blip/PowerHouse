export function riskStatus(score = 0) {
  if (score >= 76) return "CRITICAL";
  if (score >= 51) return "WARNING";
  if (score >= 26) return "WATCH";
  return "SAFE";
}

export function riskTone(status) {
  return {
    SAFE: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    WATCH: "text-yellow-300 bg-yellow-400/10 border-yellow-400/20",
    WARNING: "text-orange-300 bg-orange-400/10 border-orange-400/20",
    CRITICAL: "text-red-300 bg-red-400/10 border-red-400/20",
    OFFLINE: "text-slate-300 bg-slate-400/10 border-slate-400/20"
  }[status] || "text-slate-300 bg-slate-400/10 border-slate-400/20";
}

export function eventLabel(event) {
  return (event || "NORMAL").replaceAll("_", " ");
}
