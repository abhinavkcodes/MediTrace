export default function SummaryCards({ cards }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[1.5rem] border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{card.label}</p>
          <p className="mt-5 text-3xl font-semibold text-slate-900">{card.value}</p>
          <p className="mt-2 text-sm text-slate-500">{card.description}</p>
        </div>
      ))}
    </section>
  );
}
