// ================= CONFIG =================
const API_BASE_URL = '/api';

// ================= STATE =================
let allMedicines = [];
let allCategories = [];
let currentView = 'overview';
let sortAscending = false;
let dataLoaded = false;

// ================= DOM =================
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('page-title');
const medicinesContainer = document.getElementById('medicines-container');
const categoriesContainer = document.getElementById('categories-container');
const searchResults = document.getElementById('search-results');
const mainSearch = document.getElementById('main-search');
const quickSearch = document.getElementById('quick-search');
const categoryFilter = document.getElementById('category-filter');
const sortBtn = document.getElementById('sort-btn');
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const toast = document.getElementById('toast');
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const logoLink = document.getElementById('logo-link');
const connectionStatus = document.getElementById('connection-status');
const categoryList = document.getElementById('category-list');

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupLogoNavigation();
    setupMobileMenu();
    setupSearchListeners();
    setupFilterListeners();
    setupSortButton();
    setupModalListeners();
    setupAddMedicine();
    switchView(currentView);
    loadAllMedicines();
    loadCategories();
    if (window.lucide) window.lucide.createIcons();
});

// ================= NAVIGATION =================
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });
}

function setupLogoNavigation() {
    logoLink?.addEventListener('click', () => switchView('overview'));
}

function switchView(view) {
    currentView = view;

    navItems.forEach(item => item.classList.remove('active'));

    const activeBtn = document.querySelector(`[data-view="${view}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    viewSections.forEach(s => s.classList.remove('active'));

    const activeView = document.getElementById(view + '-view');
    if (activeView) activeView.classList.add('active');

    const titles = {
        overview: 'Medicine Overview',
        medicines: 'All Medicines',
        search: 'Search Medicines',
        categories: 'Browse Categories',
        add: 'Add Medicine'
    };

    pageTitle.textContent = titles[view] || 'Dashboard';

    if (view === 'medicines') loadMedicinesView();
    if (view === 'overview') loadOverviewData();
    if (view === 'categories') displayCategoriesView();
}

// ================= LOAD DATA =================
async function loadAllMedicines() {
    showMedicinesSkeleton();
    try {
        const res = await fetch(`${API_BASE_URL}/medicines`);
        const data = await res.json();
        allMedicines = data.data || [];
        dataLoaded = true;
        updateConnectionIndicator(true);
        loadOverviewData();
        if (currentView === 'medicines') loadMedicinesView();
    } catch (err) {
        updateConnectionIndicator(false);
        showToast('Server not running!', 'error');
    }
}

async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        allCategories = data.data || [];
        populateCategoryFilter();
        loadOverviewData();
    } catch (err) {
        console.error('Category load failed');
    }
}

// ================= OVERVIEW =================
function loadOverviewData() {
    if (!dataLoaded) return;
    updateStats();
    renderCategorySummary();
}

function updateStats() {
    document.getElementById('stat-total').textContent = allMedicines.length;
    document.getElementById('stat-categories').textContent = allCategories.length;

    const manufacturers = new Set(allMedicines.map(m => m.manufacturer));
    document.getElementById('stat-manufacturers').textContent = manufacturers.size;

    const avg = allMedicines.length
        ? (allMedicines.reduce((s, m) => s + parseFloat(m.price), 0) / allMedicines.length).toFixed(2)
        : 0;

    document.getElementById('stat-avg-price').textContent = `₹${avg}`;
}

// ================= MEDICINES =================
function loadMedicinesView() {
    const val = categoryFilter.value;
    const filtered = val ? allMedicines.filter(m => m.category === val) : allMedicines;
    displayMedicines(filtered);
}

function displayMedicines(meds) {
    if (!meds.length) {
        medicinesContainer.innerHTML = '<div class="loading">No medicines found</div>';
        return;
    }

    medicinesContainer.innerHTML = meds.map(m => `
        <div class="medicine-card">
            <div class="medicine-header">
                <div>
                    <div class="medicine-brand">${m.brandName}</div>
                    <div class="medicine-generic">${m.genericName}</div>
                </div>
                <div class="medicine-category">${m.category || 'General'}</div>
            </div>
            <div class="medicine-info">
                <div class="info-row"><span class="info-label">Manufacturer</span><span>${m.manufacturer || 'N/A'}</span></div>
                <div class="info-row"><span class="info-label">Composition</span><span>${m.composition || 'Details missing'}</span></div>
            </div>
            <div class="medicine-price">₹${parseFloat(m.price || 0).toFixed(2)}</div>
        </div>
    `).join('');
}

// ================= SEARCH =================
function setupSearchListeners() {
    mainSearch.addEventListener('input', () => {
        const query = mainSearch.value.trim();
        if (!query) {
            searchResults.innerHTML = '<p class="search-hint">Enter a medicine name to search...</p>';
            return;
        }

        performSearch(query);
    });

    quickSearch.addEventListener('input', () => {
        const query = quickSearch.value.trim();
        if (!query) return;

        if (currentView !== 'search') switchView('search');
        performSearch(query);
    });
}

function performSearch(q) {
    const ql = q.toLowerCase();

    const res = allMedicines.filter(m =>
        m.brandName.toLowerCase().includes(ql) ||
        m.genericName.toLowerCase().includes(ql) ||
        (m.category || '').toLowerCase().includes(ql)
    );

    if (!res.length) {
        searchResults.innerHTML = '<p class="loading">No results found</p>';
        return;
    }

    searchResults.innerHTML = res.map(m => `
        <div class="medicine-card">
            <div class="medicine-header">
                <div>
                    <div class="medicine-brand">${m.brandName}</div>
                    <div class="medicine-generic">${m.genericName}</div>
                </div>
                <div class="medicine-category">${m.category || 'General'}</div>
            </div>
            <div class="medicine-info">
                <div class="info-row"><span class="info-label">Price</span><span>₹${parseFloat(m.price || 0).toFixed(2)}</span></div>
                <div class="info-row"><span class="info-label">Manufacturer</span><span>${m.manufacturer || 'N/A'}</span></div>
            </div>
        </div>
    `).join('');
}

// ================= FILTER =================
function setupFilterListeners() {
    categoryFilter.addEventListener('change', () => {
        const val = categoryFilter.value;
        const filtered = val ? allMedicines.filter(m => m.category === val) : allMedicines;
        displayMedicines(filtered);
    });
}

function setupSortButton() {
    sortBtn?.addEventListener('click', () => {
        sortAscending = !sortAscending;
        const sorted = [...allMedicines].sort((a, b) => {
            const aPrice = parseFloat(a.price) || 0;
            const bPrice = parseFloat(b.price) || 0;
            return sortAscending ? aPrice - bPrice : bPrice - aPrice;
        });
        sortBtn.textContent = sortAscending ? '↑ Sort by Price' : '↓ Sort by Price';
        displayMedicines(sorted);
    });
}

function setupMobileMenu() {
    mobileMenuBtn?.addEventListener('click', () => {
        sidebar?.classList.toggle('show');
    });
}

function updateConnectionIndicator(isConnected) {
    if (!connectionStatus) return;
    const statusText = connectionStatus.querySelector('.status-text');
    statusText.textContent = isConnected ? 'Connected' : 'Disconnected';
    connectionStatus.classList.toggle('connected', isConnected);
}

function renderCategorySummary() {
    if (!categoryList) return;
    if (!allCategories.length) {
        categoryList.innerHTML = '<p class="empty-text">No categories available.</p>';
        return;
    }

    categoryList.innerHTML = allCategories.slice(0, 5).map(cat => {
        const count = allMedicines.filter(m => m.category === cat).length;
        return `
            <div class="category-pill">
                <span>${cat}</span>
                <strong>${count} items</strong>
            </div>
        `;
    }).join('');
}

function showMedicinesSkeleton() {
    if (!medicinesContainer) return;
    medicinesContainer.innerHTML = Array.from({ length: 5 }).map(() => `
        <div class="medicine-card skeleton-card">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-pill"></div>
        </div>
    `).join('');
}

// ================= MODAL =================
function setupModalListeners() {
    modalClose?.addEventListener('click', () => modal.classList.remove('show'));
}

// ================= ADD MEDICINE =================
function setupAddMedicine() {
    const form = document.getElementById('add-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            brandName: document.getElementById('brand').value,
            genericName: document.getElementById('generic').value,
            category: document.getElementById('category').value,
            composition: document.getElementById('composition').value,
            price: document.getElementById('price').value,
            manufacturer: document.getElementById('manufacturer').value
        };

        try {
            const res = await fetch(`${API_BASE_URL}/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error();

            showToast('Medicine added!', 'success');

            form.reset();
            await loadAllMedicines();
            switchView('medicines');

        } catch (err) {
            showToast('Error adding medicine', 'error');
        }
    });
}

// ================= CATEGORY =================
function populateCategoryFilter() {
    if (!categoryFilter) return;

    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    allCategories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
    });
}

function displayCategoriesView() {
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = allCategories.map(cat => {
        const count = allMedicines.filter(m => m.category === cat).length;

        return `
            <div class="category-card" onclick="filterByCategory('${cat}')">
                <h4>${cat}</h4>
                <p>${count} medicines</p>
            </div>
        `;
    }).join('');
}

function filterByCategory(category) {
    if (categoryFilter) {
        categoryFilter.value = category;
        switchView('medicines');
        loadMedicinesView();
    }
}

// ================= UTILS =================
function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}