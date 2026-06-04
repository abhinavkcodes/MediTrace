import { Home, Box, MapPin, Search } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'categories', label: 'Categories', icon: Box },
  { id: 'store-locator', label: 'Store Locator', icon: MapPin }
];

export default function Sidebar({ active, onSelect, isOpen, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed left-0 top-0 z-50 h-full w-[280px] border-r border-slate-200/80 bg-slate-50 px-6 py-8 shadow-sm shadow-slate-200/40 transition-transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm shadow-slate-200/50">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">M</div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">MediTrack</p>
              <h2 className="text-lg font-semibold text-slate-900">Transparency</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-3xl bg-white p-3 text-slate-600 shadow-sm shadow-slate-200/50 transition hover:bg-slate-100 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`flex w-full items-center gap-3 rounded-3xl px-4 py-4 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200/10'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
