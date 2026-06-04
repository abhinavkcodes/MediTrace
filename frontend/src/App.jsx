import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import StoreLocator from './components/StoreLocator';
import StoreList from './components/StoreList';

const USER_ID = 1;

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryMedicines, setCategoryMedicines] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeResults, setStoreResults] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchCategories(), fetchMedicines(), fetchAllStores()]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await fetch('/api/medicines');
      const data = await response.json();
      if (data.success) {
        setMedicines(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    }
  };

  const fetchAllStores = async () => {
    try {
      const response = await fetch('/api/stores');
      const data = await response.json();
      if (data.success) {
        setStores(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
      setAlert({ type: 'error', message: 'Please enter a search term first.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
        setActiveSection('search');
      } else {
        setSearchResults([]);
        setAlert({ type: 'error', message: data.message || 'No results found.' });
      }
    } catch (error) {
      console.error('Search failed:', error);
      setAlert({ type: 'error', message: 'Unable to search medicines right now.' });
    }
    setLoading(false);
  };

  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const response = await fetch(`/api/medicines/category/${encodeURIComponent(category)}`);
      const data = await response.json();
      if (data.success) {
        setCategoryMedicines(data.data);
        setActiveSection('categories');
      }
    } catch (error) {
      console.error('Failed to load category medicines:', error);
    }
    setLoading(false);
  };

  const fetchStoresForMedicine = async (medicine) => {
    setSelectedMedicine(medicine);
    setSelectedStore(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/medicine/id/${medicine.id}/stores`);
      const data = await response.json();
      if (data.success) {
        setStoreResults(data.stores);
        setActiveSection('store-locator');
      } else {
        setStoreResults([]);
        setAlert({ type: 'error', message: data.message || 'No stores found for this medicine.' });
      }
    } catch (error) {
      console.error('Failed to fetch store availability:', error);
      setAlert({ type: 'error', message: 'Unable to load store availability.' });
    }

    setLoading(false);
  };

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    if (activeSection !== 'store-locator') {
      setActiveSection('store-locator');
    }
  };

  const summaryCards = [
    {
      label: 'Total Medicines',
      value: medicines.length.toString(),
      description: 'Medicine SKUs available in the database'
    },
    {
      label: 'Total Stores',
      value: stores.length.toString(),
      description: 'Stores currently connected to inventory'
    },
    {
      label: 'Available Stock',
      value: stores.reduce((sum, store) => sum + (store.quantity || 0), 0).toString(),
      description: 'Total stock ready for purchase'
    },
    {
      label: 'Medicine Categories',
      value: categories.length.toString(),
      description: 'Different categories of medicines'
    }
  ];

  const renderedStores = storeResults.length ? storeResults : stores;

  return (
    <div className="app-shell min-h-screen bg-slate-50 text-slate-900">
      <Sidebar active={activeSection} onSelect={setActiveSection} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="min-h-screen lg:ml-[280px]">
        <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} onSearchSubmit={handleSearchSubmit} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          {alert && (
            <div className={`mb-6 rounded-3xl border px-5 py-4 text-sm ${alert.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
              {alert.message}
            </div>
          )}

          {activeSection === 'overview' && (
            <>
              <div className="mb-6">
                <SummaryCards cards={summaryCards} />
              </div>

              <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <StoreLocator
                  stores={renderedStores}
                  selectedStore={selectedStore}
                  selectedMedicine={selectedMedicine}
                  onSelectStore={handleSelectStore}
                  loading={loading}
                />
                <StoreList
                  stores={renderedStores}
                  loading={loading}
                  selectedStore={selectedStore}
                  selectedMedicine={selectedMedicine}
                  onView={handleSelectStore}
                />
              </section>
            </>
          )}

          {activeSection === 'search' && (
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
                <h2 className="text-2xl font-semibold text-slate-900">Search results</h2>
                <p className="mt-2 text-sm text-slate-600">Browse medicines from the database and view store availability.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.length > 0 ? (
                  searchResults.map((medicine) => (
                    <div key={medicine.id} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:shadow-md">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{medicine.brandName}</p>
                          <p className="text-xs text-slate-600">Generic: {medicine.genericName}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                            {medicine.category}
                          </span>
                          <span className="text-lg font-semibold text-slate-900">₹{medicine.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                            In Stock
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => fetchStoresForMedicine(medicine)}
                          className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          View Stores
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-3xl border border-slate-200/70 bg-slate-50 p-8 text-center text-slate-600">
                    No search results yet. Type a medicine name and click Search.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'medicines' && (
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
                <h2 className="text-2xl font-semibold text-slate-900">Medicine Catalog</h2>
                <p className="mt-2 text-sm text-slate-600">Browse all medicines from the database.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:shadow-md">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{medicine.brandName}</p>
                        <p className="text-xs text-slate-600">Generic: {medicine.genericName}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {medicine.category}
                        </span>
                        <span className="text-lg font-semibold text-slate-900">₹{medicine.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                          In Stock
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => fetchStoresForMedicine(medicine)}
                        className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Find Stores
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'categories' && (
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
                <h2 className="text-2xl font-semibold text-slate-900">Categories</h2>
                <p className="mt-2 text-sm text-slate-600">Select a category to browse medicines from the database.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleSelectCategory(category)}
                    className="rounded-3xl border border-slate-200/70 bg-white p-5 text-left text-slate-900 shadow-sm shadow-slate-200/40 transition hover:border-slate-400 hover:shadow-md"
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">{category}</p>
                      <p className="text-xs text-slate-600">Browse medicines in this category</p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="rounded-[1.5rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
                  <h3 className="text-xl font-semibold text-slate-900">{selectedCategory}</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryMedicines.length > 0 ? (
                      categoryMedicines.map((medicine) => (
                        <div key={medicine.id} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 transition hover:shadow-md">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{medicine.brandName}</p>
                              <p className="text-xs text-slate-600">Generic: {medicine.genericName}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold text-slate-900">₹{medicine.price}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                                In Stock
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => fetchStoresForMedicine(medicine)}
                              className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                              Find Stores
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-center text-sm text-slate-500">No medicines found for this category yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}



          {activeSection === 'store-locator' && (
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
                <h2 className="text-2xl font-semibold text-slate-900">Store Locator</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedMedicine ? `Stores for ${selectedMedicine.brandName}` : 'Browse stores on the map'}</p>
              </div>
              <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <StoreLocator
                  stores={renderedStores}
                  selectedStore={selectedStore}
                  selectedMedicine={selectedMedicine}
                  onSelectStore={handleSelectStore}
                  loading={loading}
                />
                <StoreList
                  stores={renderedStores}
                  loading={loading}
                  selectedStore={selectedStore}
                  selectedMedicine={selectedMedicine}
                  onView={handleSelectStore}
                />
              </section>
            </div>
          )}


        </main>
      </div>
    </div>
  );
}
