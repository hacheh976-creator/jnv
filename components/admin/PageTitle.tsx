export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-extrabold">{title}</h1>
        {sub && <p className="text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
