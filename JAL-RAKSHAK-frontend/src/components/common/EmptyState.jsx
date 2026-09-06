import { Database } from "lucide-react";
export default function EmptyState({ title = "No data available", description = "No records are currently available." }) {
  return <div className="panel flex min-h-48 flex-col items-center justify-center p-8 text-center">
    <Database className="text-slate-600" size={28} />
    <h3 className="mt-3 font-semibold text-slate-300">{title}</h3>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>;
}
