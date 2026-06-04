const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const BASE_DIR = path.resolve(__dirname, '..');
const DB_DIR = path.join(BASE_DIR, 'database');
const DB_PATH = path.join(DB_DIR, 'database.db');

const CATEGORIES = [
  'Fever & Pain', 'Pain Relief', 'Anti-Inflammatory', 'Cough Suppressant',
  'Antibiotic', 'Diabetes', 'Blood Pressure', 'Supplement', 'Allergy Relief',
  'Antacid', 'Cholesterol', 'Antidepressant', 'Antifungal', 'Digestive',
  'Eye Care', 'Skin Care', 'Respiratory', 'Cardiac', 'Cold & Flu', 'Vitamins'
];

const GENERIC_NAMES = [
  'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Azithromycin', 'Metformin',
  'Amlodipine', 'Losartan', 'Atorvastatin', 'Cetirizine', 'Pantoprazole',
  'Escitalopram', 'Fluconazole', 'Levocetirizine', 'Clopidogrel', 'Omeprazole',
  'Cefixime', 'Rosuvastatin', 'Doxycycline', 'Sildenafil', 'Loratadine',
  'Diclofenac', 'Ranitidine', 'Insulin', 'Prednisone', 'Tamsulosin',
  'Gabapentin', 'Naproxen', 'Budesonide', 'Tramadol', 'Famotidine',
  'Methylcobalamin', 'Multivitamin', 'Calcium Carbonate', 'Vitamin D3',
  'Ferrous Sulfate', 'Salbutamol', 'Baclofen', 'Cyclobenzaprine', 'Levofloxacin',
  'Sodium Valproate', 'Risperidone', 'Methotrexate', 'Lisinopril', 'Enalapril',
  'Glimepiride', 'Vildagliptin', 'Telmisartan', 'Spironolactone', 'Nebivolol'
];

const MANUFACTURERS = [
  'Cipla', 'Sun Pharma', 'Dr. Reddys', 'Lupin', 'Aurobindo Pharma', 'Torrent Pharma',
  'GlaxoSmithKline', 'Pfizer', 'Abbott', 'Zydus Healthcare', 'Alkem Labs',
  'Macleods', 'Cadila Healthcare', 'Himalaya', 'Bayer', 'Novartis', 'Sanofi',
  'MSD', 'Johnson & Johnson', 'Biocon', 'Mylan'
];

const FORMS = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Gel', 'Drops'];
const STRENGTHS = ['5mg', '10mg', '20mg', '40mg', '50mg', '75mg', '100mg', '150mg', '250mg', '500mg', '650mg'];

const MEDICINE_PRODUCTS = [
  { brandName: 'Crocin Advance', genericName: 'Paracetamol', category: 'Fever & Pain', composition: 'Paracetamol 500mg', manufacturer: 'GlaxoSmithKline', form: 'Tablet', strength: '500mg', price: 30.00 },
  { brandName: 'Dolo 650', genericName: 'Paracetamol', category: 'Fever & Pain', composition: 'Paracetamol 650mg', manufacturer: 'Micro Labs', form: 'Tablet', strength: '650mg', price: 32.00 },
  { brandName: 'Calpol 650', genericName: 'Paracetamol', category: 'Fever & Pain', composition: 'Paracetamol 650mg', manufacturer: 'GlaxoSmithKline', form: 'Tablet', strength: '650mg', price: 35.00 },
  { brandName: 'Paracip 500', genericName: 'Paracetamol', category: 'Fever & Pain', composition: 'Paracetamol 500mg', manufacturer: 'Cipla', form: 'Tablet', strength: '500mg', price: 25.00 },
  { brandName: 'Pyrigesic', genericName: 'Paracetamol', category: 'Fever & Pain', composition: 'Paracetamol 500mg', manufacturer: 'Zydus Cadila', form: 'Tablet', strength: '500mg', price: 28.00 },
  { brandName: 'Brufen 400', genericName: 'Ibuprofen', category: 'Pain Relief', composition: 'Ibuprofen 400mg', manufacturer: 'Abbott', form: 'Tablet', strength: '400mg', price: 45.00 },
  { brandName: 'Ibugesic', genericName: 'Ibuprofen', category: 'Pain Relief', composition: 'Ibuprofen 400mg', manufacturer: 'Cipla', form: 'Tablet', strength: '400mg', price: 38.00 },
  { brandName: 'Combiflam', genericName: 'Ibuprofen + Paracetamol', category: 'Pain Relief', composition: 'Ibuprofen 400mg + Paracetamol 325mg', manufacturer: 'Sanofi', form: 'Tablet', strength: '400mg+325mg', price: 52.00 },
  { brandName: 'Amoxil', genericName: 'Amoxicillin', category: 'Antibiotic', composition: 'Amoxicillin 500mg', manufacturer: 'GlaxoSmithKline', form: 'Capsule', strength: '500mg', price: 85.00 },
  { brandName: 'Mox 500', genericName: 'Amoxicillin', category: 'Antibiotic', composition: 'Amoxicillin 500mg', manufacturer: 'Sun Pharma', form: 'Capsule', strength: '500mg', price: 75.00 },
  { brandName: 'Novamox', genericName: 'Amoxicillin', category: 'Antibiotic', composition: 'Amoxicillin 500mg', manufacturer: 'Cipla', form: 'Tablet', strength: '500mg', price: 70.00 },
  { brandName: 'Azithral', genericName: 'Azithromycin', category: 'Antibiotic', composition: 'Azithromycin 500mg', manufacturer: 'Alembic', form: 'Tablet', strength: '500mg', price: 120.00 },
  { brandName: 'Zithrox', genericName: 'Azithromycin', category: 'Antibiotic', composition: 'Azithromycin 500mg', manufacturer: 'FDC', form: 'Tablet', strength: '500mg', price: 95.00 },
  { brandName: 'Azee', genericName: 'Azithromycin', category: 'Antibiotic', composition: 'Azithromycin 500mg', manufacturer: 'Cipla', form: 'Tablet', strength: '500mg', price: 110.00 },
  { brandName: 'Glycomet', genericName: 'Metformin', category: 'Diabetes', composition: 'Metformin 500mg', manufacturer: 'USV', form: 'Tablet', strength: '500mg', price: 65.00 },
  { brandName: 'Gluconorm', genericName: 'Metformin', category: 'Diabetes', composition: 'Metformin 500mg', manufacturer: 'Lupin', form: 'Tablet', strength: '500mg', price: 55.00 },
  { brandName: 'Metfor', genericName: 'Metformin', category: 'Diabetes', composition: 'Metformin 500mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '500mg', price: 60.00 },
  { brandName: 'Amlong', genericName: 'Amlodipine', category: 'Blood Pressure', composition: 'Amlodipine 5mg', manufacturer: 'Micro Labs', form: 'Tablet', strength: '5mg', price: 35.00 },
  { brandName: 'Amlovas', genericName: 'Amlodipine', category: 'Blood Pressure', composition: 'Amlodipine 5mg', manufacturer: 'Macleods', form: 'Tablet', strength: '5mg', price: 40.00 },
  { brandName: 'Telma AM', genericName: 'Telmisartan + Amlodipine', category: 'Blood Pressure', composition: 'Telmisartan 40mg + Amlodipine 5mg', manufacturer: 'Glenmark', form: 'Tablet', strength: '40mg+5mg', price: 95.00 },
  { brandName: 'Atorva', genericName: 'Atorvastatin', category: 'Cholesterol', composition: 'Atorvastatin 10mg', manufacturer: 'Zydus Cadila', form: 'Tablet', strength: '10mg', price: 85.00 },
  { brandName: 'Lipitor', genericName: 'Atorvastatin', category: 'Cholesterol', composition: 'Atorvastatin 10mg', manufacturer: 'Pfizer', form: 'Tablet', strength: '10mg', price: 120.00 },
  { brandName: 'Storvas', genericName: 'Atorvastatin', category: 'Cholesterol', composition: 'Atorvastatin 10mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '10mg', price: 75.00 },
  { brandName: 'Zyrtec', genericName: 'Cetirizine', category: 'Allergy Relief', composition: 'Cetirizine 10mg', manufacturer: 'Dr. Reddy\'s', form: 'Tablet', strength: '10mg', price: 45.00 },
  { brandName: 'Cetzine', genericName: 'Cetirizine', category: 'Allergy Relief', composition: 'Cetirizine 10mg', manufacturer: 'Dr. Reddy\'s', form: 'Tablet', strength: '10mg', price: 35.00 },
  { brandName: 'Okacet', genericName: 'Cetirizine', category: 'Allergy Relief', composition: 'Cetirizine 10mg', manufacturer: 'Cipla', form: 'Tablet', strength: '10mg', price: 30.00 },
  { brandName: 'Pantocid', genericName: 'Pantoprazole', category: 'Antacid', composition: 'Pantoprazole 40mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '40mg', price: 75.00 },
  { brandName: 'Panpure', genericName: 'Pantoprazole', category: 'Antacid', composition: 'Pantoprazole 40mg', manufacturer: 'Macleods', form: 'Tablet', strength: '40mg', price: 65.00 },
  { brandName: 'Pantakind', genericName: 'Pantoprazole', category: 'Antacid', composition: 'Pantoprazole 40mg', manufacturer: 'Mankind', form: 'Tablet', strength: '40mg', price: 55.00 },
  { brandName: 'Nexito', genericName: 'Escitalopram', category: 'Antidepressant', composition: 'Escitalopram 10mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '10mg', price: 85.00 },
  { brandName: 'S Citadep', genericName: 'Escitalopram', category: 'Antidepressant', composition: 'Escitalopram 10mg', manufacturer: 'Cipla', form: 'Tablet', strength: '10mg', price: 75.00 },
  { brandName: 'Citol', genericName: 'Escitalopram', category: 'Antidepressant', composition: 'Escitalopram 10mg', manufacturer: 'Psycorem', form: 'Tablet', strength: '10mg', price: 65.00 },
  { brandName: 'Fluka', genericName: 'Fluconazole', category: 'Antifungal', composition: 'Fluconazole 150mg', manufacturer: 'Cipla', form: 'Tablet', strength: '150mg', price: 45.00 },
  { brandName: 'Forcan', genericName: 'Fluconazole', category: 'Antifungal', composition: 'Fluconazole 150mg', manufacturer: 'Pfizer', form: 'Tablet', strength: '150mg', price: 85.00 },
  { brandName: 'Zocon', genericName: 'Fluconazole', category: 'Antifungal', composition: 'Fluconazole 150mg', manufacturer: 'FDC', form: 'Tablet', strength: '150mg', price: 55.00 },
  { brandName: 'Xyzal', genericName: 'Levocetirizine', category: 'Allergy Relief', composition: 'Levocetirizine 5mg', manufacturer: 'Dr. Reddy\'s', form: 'Tablet', strength: '5mg', price: 65.00 },
  { brandName: 'Levosiz', genericName: 'Levocetirizine', category: 'Allergy Relief', composition: 'Levocetirizine 5mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '5mg', price: 45.00 },
  { brandName: 'Lecope', genericName: 'Levocetirizine', category: 'Allergy Relief', composition: 'Levocetirizine 5mg', manufacturer: 'Mankind', form: 'Tablet', strength: '5mg', price: 35.00 },
  { brandName: 'Losar 50', genericName: 'Losartan', category: 'Blood Pressure', composition: 'Losartan 50mg', manufacturer: 'Cipla', form: 'Tablet', strength: '50mg', price: 45.00 },
  { brandName: 'Pantocid MD', genericName: 'Pantoprazole', category: 'Antacid', composition: 'Pantoprazole 40mg + Domperidone 30mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '40mg+30mg', price: 85.00 },
  { brandName: 'Cefspan', genericName: 'Cefixime', category: 'Antibiotic', composition: 'Cefixime 200mg', manufacturer: 'Cipla', form: 'Tablet', strength: '200mg', price: 110.00 },
  { brandName: 'Rosuzet', genericName: 'Rosuvastatin', category: 'Cholesterol', composition: 'Rosuvastatin 10mg', manufacturer: 'Cipla', form: 'Tablet', strength: '10mg', price: 95.00 },
  { brandName: 'Doxy 100', genericName: 'Doxycycline', category: 'Antibiotic', composition: 'Doxycycline 100mg', manufacturer: 'Alembic', form: 'Capsule', strength: '100mg', price: 90.00 },
  { brandName: 'Lopressor', genericName: 'Metoprolol', category: 'Blood Pressure', composition: 'Metoprolol 50mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '50mg', price: 35.00 },
  { brandName: 'Spiriva', genericName: 'Spironolactone', category: 'Blood Pressure', composition: 'Spironolactone 25mg', manufacturer: 'Cipla', form: 'Tablet', strength: '25mg', price: 40.00 },
  { brandName: 'Nebicard', genericName: 'Nebivolol', category: 'Blood Pressure', composition: 'Nebivolol 5mg', manufacturer: 'Lupin', form: 'Tablet', strength: '5mg', price: 95.00 },
  { brandName: 'Glimet', genericName: 'Glimepiride', category: 'Diabetes', composition: 'Glimepiride 2mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '2mg', price: 30.00 },
  { brandName: 'Rantac', genericName: 'Ranitidine', category: 'Antacid', composition: 'Ranitidine 150mg', manufacturer: 'Sun Pharma', form: 'Tablet', strength: '150mg', price: 40.00 },
  { brandName: 'Becosules', genericName: 'Methylcobalamin', category: 'Vitamins', composition: 'Methylcobalamin 1500mcg', manufacturer: 'Abbott', form: 'Tablet', strength: '1500mcg', price: 70.00 },
  { brandName: 'Shelcal', genericName: 'Calcium Carbonate', category: 'Supplement', composition: 'Calcium Carbonate 500mg + Vitamin D3 250IU', manufacturer: 'Zydus Cadila', form: 'Tablet', strength: '500mg', price: 40.00 },
  { brandName: 'Ostocalcium', genericName: 'Vitamin D3', category: 'Vitamins', composition: 'Vitamin D3 60K', manufacturer: 'Biocon', form: 'Capsule', strength: '60K', price: 80.00 },
];

const STORES = [
  ['MetroCare Pharmacy', '14 Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', 19.0600, 72.8295],
  ['City Health Store', '78 SV Road, Kandivali West', 'Mumbai', 'Maharashtra', '400067', 19.2183, 72.8567],
  ['Central Medicals', '102 Thane-Belapur Road, Navi Mumbai', 'Mumbai', 'Maharashtra', '400709', 19.0728, 73.0150],
  ['GreenLife Pharmacy', '25 MG Road, Pune', 'Pune', 'Maharashtra', '411001', 18.5204, 73.8567],
  ['HealWell Chemist', '9 FC Road, Pune', 'Pune', 'Maharashtra', '411004', 18.5167, 73.8567],
  ['CarePlus Pharmacy', '42 Residency Road, Nagpur', 'Nagpur', 'Maharashtra', '440001', 21.1458, 79.0882],
  ['Wellness Medicals', '10 Juhu Tara Road', 'Mumbai', 'Maharashtra', '400049', 19.0850, 72.8320],
  ['Prime Pharmacy', '58 Hinjewadi Road', 'Pune', 'Maharashtra', '411057', 18.5905, 73.7514],
  ['CityCare Pharmacy', '18 Sitabuldi', 'Nagpur', 'Maharashtra', '440012', 21.1530, 79.0880],
  ['Family Pharmacy', '75 Viman Nagar', 'Pune', 'Maharashtra', '411014', 18.5600, 73.9140]
];

const USERS = [
  ['Rohan Sharma', 'rohan.sharma@example.com', '+919898989898'],
  ['Sneha Patel', 'sneha.patel@example.com', '+919123456789'],
  ['Amit Rao', 'amit.rao@example.com', '+919876543210']
];

const BRAND_PREFIXES = ['Aqua', 'Bio', 'Care', 'Clin', 'Delta', 'Eco', 'Flex', 'Glu', 'Health', 'Medi', 'Neuro', 'Opti', 'Pro', 'Re', 'Ultra', 'Viva', 'Zeni', 'Thera', 'Nova', 'Pure'];
const BRAND_SUFFIXES = ['cine', 'dol', 'cure', 'max', 'plus', 'care', 'heal', 'fast', 'more', 'ace', 'flex', 'gen', 'med', 'xil', 'vade', 'zon'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildBrandName(generic, index) {
  const prefix = randomChoice(BRAND_PREFIXES);
  const suffix = randomChoice(BRAND_SUFFIXES);
  const genericShort = generic.split(' ').map((w) => w[0]).join('').substring(0, 3).toUpperCase();
  return `${prefix}${genericShort}${suffix}${index}`;
}

function buildComposition(generic, strength) {
  return `${generic} ${strength}`;
}

function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function allQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function createTables(db) {
  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brandName TEXT NOT NULL,
      genericName TEXT NOT NULL,
      category TEXT NOT NULL,
      composition TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      form TEXT NOT NULL,
      strength TEXT NOT NULL,
      price REAL NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zipCode TEXT,
      latitude REAL,
      longitude REAL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL,
      medicine_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      last_stocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(store_id, medicine_id),
      FOREIGN KEY(store_id) REFERENCES stores(id),
      FOREIGN KEY(medicine_id) REFERENCES medicines(id)
    )
  `);

  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      store_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'placed',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(store_id) REFERENCES stores(id)
    )
  `);

  await runQuery(db, `
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      medicine_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(medicine_id) REFERENCES medicines(id)
    )
  `);
}

async function generateMedicines(db) {
  const stmt = db.prepare(`
    INSERT INTO medicines (brandName, genericName, category, composition, manufacturer, form, strength, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 1; i <= 500; i += 1) {
    const product = randomChoice(MEDICINE_PRODUCTS);
    await new Promise((resolve, reject) => stmt.run([
      product.brandName,
      product.genericName,
      product.category,
      product.composition,
      product.manufacturer,
      product.form,
      product.strength,
      product.price
    ], (err) => err ? reject(err) : resolve()));
  }

  stmt.finalize();
}

async function generateStores(db) {
  const stmt = db.prepare(`
    INSERT INTO stores (name, address, city, state, zipCode, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const store of STORES) {
    await new Promise((resolve, reject) => stmt.run(store, (err) => err ? reject(err) : resolve()));
  }

  stmt.finalize();
}

async function generateUsers(db) {
  const stmt = db.prepare(`
    INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`);
  for (const user of USERS) {
    await new Promise((resolve, reject) => stmt.run(user, (err) => err ? reject(err) : resolve()));
  }
  stmt.finalize();
}

async function generateInventory(db) {
  const storeRows = await allQuery(db, 'SELECT id FROM stores');
  const medRows = await allQuery(db, 'SELECT id FROM medicines');

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO inventory (store_id, medicine_id, quantity) VALUES (?, ?, ?)
  `);

  for (const store of storeRows) {
    const selected = medRows.sort(() => 0.5 - Math.random()).slice(0, 120);
    for (const med of selected) {
      const qty = Math.floor(Math.random() * 116) + 5;
      await new Promise((resolve, reject) => stmt.run([store.id, med.id, qty], (err) => err ? reject(err) : resolve()));
    }
  }

  stmt.finalize();
}

async function generateOrders(db) {
  const users = await allQuery(db, 'SELECT id FROM users');
  const stores = await allQuery(db, 'SELECT id FROM stores');
  const medicines = await allQuery(db, 'SELECT id, price FROM medicines');

  for (let i = 0; i < 30; i += 1) {
    const user_id = randomChoice(users).id;
    const store_id = randomChoice(stores).id;
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const selected = medicines.sort(() => 0.5 - Math.random()).slice(0, itemCount);
    let totalAmount = 0;

    const orderResult = await new Promise((resolve, reject) => {
      db.run(`INSERT INTO orders (user_id, store_id, total_amount, status) VALUES (?, ?, ?, ?)`,
        [user_id, store_id, 0.0, 'completed'], function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
    });

    for (const med of selected) {
      const quantity = Math.floor(Math.random() * 5) + 1;
      totalAmount += med.price * quantity;
      await new Promise((resolve, reject) => db.run(
        `INSERT INTO order_items (order_id, medicine_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
        [orderResult, med.id, quantity, Number(med.price.toFixed(2))],
        (err) => err ? reject(err) : resolve()));
    }

    await runQuery(db, 'UPDATE orders SET total_amount = ? WHERE id = ?', [Number(totalAmount.toFixed(2)), orderResult]);
  }
}

async function main() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }

  const db = new sqlite3.Database(DB_PATH);

  try {
    await createTables(db);
    await generateMedicines(db);
    await generateStores(db);
    await generateUsers(db);
    await generateInventory(db);
    await generateOrders(db);

    const medCount = await allQuery(db, 'SELECT COUNT(*) AS count FROM medicines');
    const storeCount = await allQuery(db, 'SELECT COUNT(*) AS count FROM stores');
    const invCount = await allQuery(db, 'SELECT COUNT(*) AS count FROM inventory');
    const ordersCount = await allQuery(db, 'SELECT COUNT(*) AS count FROM orders');
    const orderItemsCount = await allQuery(db, 'SELECT COUNT(*) AS count FROM order_items');

    console.log('Medicines:', medCount[0].count);
    console.log('Stores:', storeCount[0].count);
    console.log('Inventory rows:', invCount[0].count);
    console.log('Orders:', ordersCount[0].count);
    console.log('Order items:', orderItemsCount[0].count);
  } catch (error) {
    console.error('Failed to generate database:', error);
  } finally {
    db.close();
  }
}

main();
