// frontend/script.js

const API_BASE_URL = 'http://localhost:5000/api';

// State
let allMedicines = [];
let allCategories = [];
let currentView = 'overview';
let sortAscending = false;

// DOM Elements
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application initialized');
    
    // Fetch initial data
    loadAllMedicines();
    loadCategories();
    
    // Event listeners
    setupNavigation();
    setupSearchListeners();
    setupFilterListeners();
    setupModalListeners();
});

// Navigation Setup
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(view) {
    currentView = view;
    
    // Update active nav item
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === view) {
            item.classList.add('active');
        }
    });
    
    // Update active section
    viewSections.forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${view}-view`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update page title
    const titles = {
        overview: 'Medicine Overview',
        medicines: 'All Medicines',
        search: 'Search Medicines',
        categories: 'Browse Categories'
    };
    
    pageTitle.textContent = titles[view] || 'Dashboard';
    
    // Load specific view data
    if (view === 'medicines') {
        loadMedicinesView();
    } else if (view === 'overview') {
        loadOverviewData();
    }
}

// Load All Medicines
async function loadAllMedicines() {
    try {
        console.log('📡 Fetching all medicines...');
        const response = await fetch(`${API_BASE_URL}/medicines`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        allMedicines = data.data || [];
        
        console.log(`✓ Loaded ${allMedicines.length} medicines`);
    } catch (error) {
        console.error('Error loading medicines:', error);
        showToast('Failed to load medicines', 'error');
    }
}

// Load Categories
async function loadCategories() {
    try {
        console.log('📡 Fetching categories...');
        const response = await fetch(`${API_BASE_URL}/categories`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        allCategories = data.data || [];
        
        console.log(`✓ Loaded ${allCategories.length} categories`);
        
        // Populate category filter
        populateCategoryFilter();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Populate Category Filter
function populateCategoryFilter() {
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Load Overview Data
function loadOverviewData() {
    updateStats();
    displayCategoryList();
    displayPriceDistribution();
}

// Update Statistics
function updateStats() {
    const total = allMedicines.length;
    const categories = allCategories.length;
    const manufacturers = new Set(allMedicines.map(m => m.manufacturer)).size;
    const avgPrice = total > 0 
        ? (allMedicines.reduce((sum, m) => sum + parseFloat(m.price), 0) / total).toFixed(2)
        : 0;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-categories').textContent = categories;
    document.getElementById('stat-manufacturers').textContent = manufacturers;
    document.getElementById('stat-avg-price').textContent = `₹${avgPrice}`;
}

// Display Category List
function displayCategoryList() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    
    allCategories.forEach(category => {
        const count = allMedicines.filter(m => m.category === category).length;
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <span class="category-name">${category}</span>
            <span class="category-count">${count}</span>
        `;
        item.addEventListener('click', () => {
            switchView('medicines');
            categoryFilter.value = category;
            loadMedicinesView();
        });
        categoryList.appendChild(item);
    });
}

// Display Price Distribution
function displayPriceDistribution() {
    const priceDist = document.getElementById('price-dist');
    priceDist.innerHTML = '';
    
    const ranges = [
        { label: '₹0-50', min: 0, max: 50 },
        { label: '₹50-100', min: 50, max: 100 },
        { label: '₹100-200', min: 100, max: 200 },
        { label: '₹200+', min: 200, max: Infinity }
    ];
    
    const maxCount = Math.max(...ranges.map(r => 
        allMedicines.filter(m => m.price >= r.min && m.price < r.max).length
    ));
    
    ranges.forEach(range => {
        const count = allMedicines.filter(m => m.price >= range.min && m.price < range.max).length;
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        const item = document.createElement('div');
        item.className = 'price-range';
        item.innerHTML = `
            <span class="price-label">${range.label}</span>
            <div class="price-bar" style="width: ${percentage}%"></div>
            <span class="price-count">${count}</span>
        `;
        priceDist.appendChild(item);
    });
}

// Load Medicines View
function loadMedicinesView() {
    medicinesContainer.innerHTML = '<div class="loading">Loading medicines...</div>';
    
    setTimeout(() => {
        const selectedCategory = categoryFilter.value;
        let filtered = allMedicines;
        
        if (selectedCategory) {
            filtered = allMedicines.filter(m => m.category === selectedCategory);
        }
        
        displayMedicines(filtered);
    }, 200);
}

// Display Medicines Grid
function displayMedicines(medicines) {
    if (medicines.length === 0) {
        medicinesContainer.innerHTML = '<div class="loading">No medicines found</div>';
        return;
    }
    
    medicinesContainer.innerHTML = medicines.map(medicine => `
        <div class="medicine-card">
            <div class="medicine-header">
                <div class="medicine-titles">
                    <div class="medicine-brand">${escapeHtml(medicine.brandName)}</div>
                    <div class="medicine-generic">${escapeHtml(medicine.genericName)}</div>
                </div>
            </div>
            <div class="medicine-category">${escapeHtml(medicine.category)}</div>
            
            <div class="medicine-info">
                <div class="info-row">
                    <span class="info-label">Composition:</span>
                    <span class="info-value">${escapeHtml(medicine.composition.substring(0, 30))}...</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Manufacturer:</span>
                    <span class="info-value">${escapeHtml(medicine.manufacturer)}</span>
                </div>
            </div>
            
            <div class="medicine-price">₹${parseFloat(medicine.price).toFixed(2)}</div>
            
            <div class="medicine-actions">
                <button class="btn btn-primary" onclick="showMedicineDetails(${medicine.id})">
                    View Details
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('${escapeHtml(medicine.brandName)}')">
                    Copy Name
                </button>
            </div>
        </div>
    `).join('');
}

// Show Medicine Details Modal
function showMedicineDetails(medicineId) {
    const medicine = allMedicines.find(m => m.id === medicineId);
    
    if (!medicine) {
        showToast('Medicine not found', 'error');
        return;
    }
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-brand">${escapeHtml(medicine.brandName)}</div>
            <div class="modal-generic">${escapeHtml(medicine.genericName)}</div>
        </div>
        
        <div class="modal-details">
            <div class="modal-detail-row">
                <span class="modal-detail-label">Category</span>
                <span class="modal-detail-value">${escapeHtml(medicine.category)}</span>
            </div>
            
            <div class="modal-detail-row">
                <span class="modal-detail-label">Composition</span>
                <span class="modal-detail-value">${escapeHtml(medicine.composition)}</span>
            </div>
            
            <div class="modal-detail-row">
                <span class="modal-detail-label">Manufacturer</span>
                <span class="modal-detail-value">${escapeHtml(medicine.manufacturer)}</span>
            </div>
            
            <div class="modal-detail-row">
                <span class="modal-detail-label">Price</span>
                <span class="modal-price">₹${parseFloat(medicine.price).toFixed(2)}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    showToast(`Viewing ${medicine.brandName}`, 'success');
}

// Display Categories Grid
function displayCategoriesView() {
    categoriesContainer.innerHTML = allCategories.map(category => {
        const count = allMedicines.filter(m => m.category === category).length;
        const icons = {
            'Pain Relief': '💊',
            'Fever & Pain': '🌡️',
            'Anti-Inflammatory': '🔥',
            'Cough Suppressant': '🫁',
            'Antibiotic': '⚕️',
            'Diabetes': '🩺',
            'Blood Pressure': '❤️',
            'Supplement': '💪',
            'Allergy Relief': '👃',
            'Antacid': '🫔',
            'Hypertension': '❤️',
            'Cholesterol': '🥗',
            'Antidepressant': '🧠',
            'Cognitive Support': '🧩',
            'Respiratory': '🌬️',
            'Antifungal': '🦠'
        };
        
        const icon = icons[category] || '💊';
        
        return `
            <div class="category-card" onclick="switchToMedicinesByCategory('${category}')">
                <div class="category-card-icon">${icon}</div>
                <div class="category-card-name">${escapeHtml(category)}</div>
                <div class="category-card-count">${count} medicines</div>
            </div>
        `;
    }).join('');
}

function switchToMedicinesByCategory(category) {
    switchView('medicines');
    categoryFilter.value = category;
    loadMedicinesView();
}

// Setup Search Listeners
function setupSearchListeners() {
    mainSearch.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        
        if (query === '') {
            searchResults.innerHTML = '<p class="search-hint">Enter a medicine name to search...</p>';
            return;
        }
        
        performSearch(query);
    }, 300));
    
    quickSearch.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        
        if (query === '') return;
        
        switchView('search');
        mainSearch.value = query;
        performSearch(query);
    }, 300));
}

// Perform Search
function performSearch(query) {
    const filtered = allMedicines.filter(m => 
        m.brandName.toLowerCase().includes(query.toLowerCase()) ||
        m.genericName.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length === 0) {
        searchResults.innerHTML = '<p class="search-hint">No medicines found matching your search</p>';
        return;
    }
    
    searchResults.innerHTML = filtered.map(medicine => `
        <div class="medicine-card">
            <div class="medicine-header">
                <div class="medicine-titles">
                    <div class="medicine-brand">${escapeHtml(medicine.brandName)}</div>
                    <div class="medicine-generic">${escapeHtml(medicine.genericName)}</div>
                </div>
            </div>
            <div class="medicine-category">${escapeHtml(medicine.category)}</div>
            
            <div class="medicine-info">
                <div class="info-row">
                    <span class="info-label">Composition:</span>
                    <span class="info-value">${escapeHtml(medicine.composition.substring(0, 30))}...</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Manufacturer:</span>
                    <span class="info-value">${escapeHtml(medicine.manufacturer)}</span>
                </div>
            </div>
            
            <div class="medicine-price">₹${parseFloat(medicine.price).toFixed(2)}</div>
            
            <div class="medicine-actions">
                <button class="btn btn-primary" onclick="showMedicineDetails(${medicine.id})">
                    View Details
                </button>
                <button class="btn btn-secondary" onclick="copyToClipboard('${escapeHtml(medicine.brandName)}')">
                    Copy Name
                </button>
            </div>
        </div>
    `).join('');
}

// Setup Filter Listeners
function setupFilterListeners() {
    categoryFilter.addEventListener('change', () => {
        loadMedicinesView();
    });
    
    sortBtn.addEventListener('click', () => {
        const filtered = categoryFilter.value 
            ? allMedicines.filter(m => m.category === categoryFilter.value)
            : allMedicines;
        
        const sorted = [...filtered].sort((a, b) => {
            const comparison = parseFloat(a.price) - parseFloat(b.price);
            return sortAscending ? comparison : -comparison;
        });
        
        sortAscending = !sortAscending;
        sortBtn.textContent = sortAscending ? '↓ Sort by Price (Low to High)' : '↑ Sort by Price (High to Low)';
        
        displayMedicines(sorted);
        showToast(`Sorted ${sortAscending ? 'ascending' : 'descending'}`, 'success');
    });
}

// Setup Modal Listeners
function setupModalListeners() {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('show');
        }
    });
}

// Utility Functions
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('Copy failed', 'error');
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Make functions available globally
window.showMedicineDetails = showMedicineDetails;
window.copyToClipboard = copyToClipboard;
window.switchToMedicinesByCategory = switchToMedicinesByCategory;

// Load medicines view when switching to it
const originalLoadMedicinesView = loadMedicinesView;
function enhancedLoadMedicinesView() {
    categoriesContainer.innerHTML = '<div class="loading">Loading categories...</div>';
    setTimeout(() => {
        displayCategoriesView();
    }, 200);
    
    originalLoadMedicinesView();
}

// Override switchView for categories
const originalSwitchView = switchView;
function enhancedSwitchView(view) {
    if (view === 'categories') {
        currentView = view;
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            }
        });
        
        viewSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const activeSection = document.getElementById(`${view}-view`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        
        pageTitle.textContent = 'Browse Categories';
        
        categoriesContainer.innerHTML = '<div class="loading">Loading categories...</div>';
        setTimeout(() => {
            displayCategoriesView();
        }, 200);
    } else {
        originalSwitchView(view);
    }
}

switchView = enhancedSwitchView;

// Load overview data on startup
window.addEventListener('load', () => {
    if (currentView === 'overview' && allMedicines.length > 0) {
        loadOverviewData();
    }
});

console.log('✓ Frontend ready');
