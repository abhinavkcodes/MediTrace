import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';

export default function StoreLocator({ stores, selectedStore, onSelectStore, loading }) {
  const initialPosition = stores.length ? [stores[0].latitude, stores[0].longitude] : [19.076, 72.8777]; // Center on Mumbai

  return (
    <div className="rounded-[1.5rem] border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Store Locator</p>
          <h3 className="text-xl font-semibold text-slate-900">Find stock nearby</h3>
        </div>
      </div>

      <div className="h-[520px] rounded-[1.25rem] overflow-hidden border border-slate-200/70">
        <MapContainer center={initialPosition} zoom={10} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {stores.map((store) => {
            const color = store.quantity > 0 ? '#16a34a' : '#dc2626';
            return (
              <CircleMarker
                key={store.id}
                center={[store.latitude, store.longitude]}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }}
                radius={12}
                eventHandlers={{ click: () => onSelectStore(store) }}
              >
                <Tooltip direction="top" offset={[0, -8]}>{store.name}</Tooltip>
                <Popup>
                  <div className="space-y-2 text-sm text-slate-900">
                    <p className="font-semibold text-slate-900">{store.name}</p>
                    <p>{store.address}</p>
                    <p>{store.city}</p>
                    <p>Available medicines: {store.medicines.length}</p>
                    <p>Stock: {store.quantity}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {loading && (
        <div className="mt-4 rounded-3xl bg-slate-100/80 p-4 text-slate-600">Loading store data…</div>
      )}

      {selectedStore && (
        <div className="mt-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
          <p className="font-semibold text-slate-900">Selected Store</p>
          <p className="mt-2">{selectedStore.name}</p>
          <p className="text-slate-500">{selectedStore.address}, {selectedStore.city}</p>
          <p className="mt-2">Inventory count: {selectedStore.quantity}</p>
        </div>
      )}
    </div>
  );
}
