export default function StoreList({ stores, loading, onView, selectedStore }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Store list</p>
          <h3 className="text-xl font-semibold text-slate-900">Store availability</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
          {stores.length} stores
        </span>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] border border-slate-200">
        <table className="min-w-full border-collapse bg-white text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-4 font-medium">Store Name</th>
              <th className="px-4 py-4 font-medium">Location</th>
              <th className="px-4 py-4 font-medium">Medicines</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-slate-500">Loading stores…</td>
              </tr>
            ) : stores.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-slate-500">No stores match your search.</td>
              </tr>
            ) : (
              stores.map((store) => {
                const isSelected = selectedStore?.id === store.id;
                return (
                  <tr key={store.id} className={isSelected ? 'bg-slate-50' : ''}>
                    <td className="border-t border-slate-100 px-4 py-4 font-medium text-slate-900">{store.name}</td>
                    <td className="border-t border-slate-100 px-4 py-4 text-slate-600">{store.city}</td>
                    <td className="border-t border-slate-100 px-4 py-4 text-slate-600">
                      <select data-store-id={store.id} className="rounded border border-slate-200 px-2 py-1 text-xs">
                        {store.medicines.map((medicine, idx) => (
                          <option key={idx} value={medicine}>{medicine}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border-t border-slate-100 px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${store.quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {store.quantity > 0 ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="border-t border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onView(store)}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
