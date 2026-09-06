export default function LoadingState({ text = "Connecting to monitoring services…" }) {
  return <div className="panel flex min-h-48 items-center justify-center gap-3 p-8 text-sm text-slate-400">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" /> {text}
  </div>;
}
