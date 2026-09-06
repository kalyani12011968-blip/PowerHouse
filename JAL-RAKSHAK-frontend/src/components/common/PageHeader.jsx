export default function PageHeader({ eyebrow = "JAL-RAKSHAK", title, description, actions }) {
  return <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{title}</h1>
      {description && <p className="mt-1 max-w-3xl text-sm text-slate-400">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>;
}
