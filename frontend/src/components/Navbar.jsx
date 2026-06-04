import { Bell, Search, UserCircle2, Menu } from 'lucide-react';

export default function Navbar({ searchQuery, onSearch, onSearchSubmit, onMenuToggle }) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/95 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-3xl bg-white p-2 text-slate-600 shadow-sm shadow-slate-200/40 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="rounded-3xl bg-white p-2 shadow-sm shadow-slate-200/40">
            <Bell className="h-5 w-5 text-slate-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Dashboard</p>
            <h2 className="text-lg font-semibold text-slate-900">Store intelligence</h2>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && onSearchSubmit()}
              placeholder="Search medicines"
              className="w-full rounded-3xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <button
            type="button"
            onClick={onSearchSubmit}
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-200/50 transition hover:bg-slate-800 sm:px-4"
          >
            <Search className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </button>

          <button type="button" className="hidden items-center gap-3 rounded-3xl bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm shadow-slate-200/50 transition hover:bg-slate-100 sm:inline-flex">
            <UserCircle2 className="h-5 w-5 text-slate-600" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
