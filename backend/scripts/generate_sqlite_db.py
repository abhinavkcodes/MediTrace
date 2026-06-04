import os
import sqlite3
import random
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / 'database' / 'database.db'

CATEGORIES = [
    'Fever & Pain', 'Pain Relief', 'Anti-Inflammatory', 'Cough Suppressant',
    'Antibiotic', 'Diabetes', 'Blood Pressure', 'Supplement', 'Allergy Relief',
    'Antacid', 'Cholesterol', 'Antidepressant', 'Antifungal', 'Digestive',
    'Eye Care', 'Skin Care', 'Respiratory', 'Cardiac', 'Cold & Flu', 'Vitamins'
]

GENERIC_NAMES = [
    'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Azithromycin', 'Metformin',
    'Amlodipine', 'Losartan', 'Atorvastatin', 'Cetirizine', 'Pantoprazole',
    'Escitalopram', 'Fluconazole', 'Levocetirizine', 'Clopidogrel', 'Omeprazole',
    'Cefixime', 'Rosuvastatin', 'Doxycycline', 'Sildenafil', 'Loratadine',
    'Diclofenac', 'Ranitidine', 'Insulin', 'Prednisone', 'Tamsulosin',
    'Gabapentin', 'Naproxen', 'Budesonide', 'Tramadol', 'Famotidine',
    'Methylcobalamin', 'Multivitamin', 'Calcium Carbonate', 'Vitamin D3',
    'Ferrous Sulfate', 'Salbutamol', 'Baclofen', 'Cyclobenzaprine', 'Levofloxacin',
    'Sodium Valproate', 'Risperidone', 'Methotrexate', 'Lisinopril', 'Rosuvastatin',
    'Enalapril', 'Glimepiride', 'Vildagliptin', 'Telmisartan', 'Spironolactone',
    'Nebivolol'
]

MANUFACTURERS = [
    'Cipla', 'Sun Pharma', 'Dr. Reddys', 'Lupin', 'Aurobindo Pharma', 'Torrent Pharma',
    'GlaxoSmithKline', 'Pfizer', 'Abbott', 'Zydus Healthcare', 'Alkem Labs',
    'Macleods', 'Cadila Healthcare', 'Himalaya', 'Bayer', 'Novartis', 'Sanofi',
    'MSD', 'Johnson & Johnson', 'Biocon'
]

FORMS = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Gel', 'Drops']
STRENGTHS = ['5mg', '10mg', '20mg', '40mg', '50mg', '75mg', '100mg', '150mg', '250mg', '500mg', '650mg']

MEDICINE_PRODUCTS = [
    {'brandName': 'Crocin Advance', 'genericName': 'Paracetamol', 'category': 'Fever & Pain', 'composition': 'Paracetamol 500mg', 'manufacturer': 'GlaxoSmithKline', 'form': 'Tablet', 'strength': '500mg', 'price': 30.00},
    {'brandName': 'Dolo 650', 'genericName': 'Paracetamol', 'category': 'Fever & Pain', 'composition': 'Paracetamol 650mg', 'manufacturer': 'Micro Labs', 'form': 'Tablet', 'strength': '650mg', 'price': 32.00},
    {'brandName': 'Calpol 650', 'genericName': 'Paracetamol', 'category': 'Fever & Pain', 'composition': 'Paracetamol 650mg', 'manufacturer': 'GlaxoSmithKline', 'form': 'Tablet', 'strength': '650mg', 'price': 35.00},
    {'brandName': 'Paracip 500', 'genericName': 'Paracetamol', 'category': 'Fever & Pain', 'composition': 'Paracetamol 500mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '500mg', 'price': 25.00},
    {'brandName': 'Pyrigesic', 'genericName': 'Paracetamol', 'category': 'Fever & Pain', 'composition': 'Paracetamol 500mg', 'manufacturer': 'Zydus Cadila', 'form': 'Tablet', 'strength': '500mg', 'price': 28.00},
    {'brandName': 'Brufen 400', 'genericName': 'Ibuprofen', 'category': 'Pain Relief', 'composition': 'Ibuprofen 400mg', 'manufacturer': 'Abbott', 'form': 'Tablet', 'strength': '400mg', 'price': 45.00},
    {'brandName': 'Ibugesic', 'genericName': 'Ibuprofen', 'category': 'Pain Relief', 'composition': 'Ibuprofen 400mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '400mg', 'price': 38.00},
    {'brandName': 'Combiflam', 'genericName': 'Ibuprofen + Paracetamol', 'category': 'Pain Relief', 'composition': 'Ibuprofen 400mg + Paracetamol 325mg', 'manufacturer': 'Sanofi', 'form': 'Tablet', 'strength': '400mg+325mg', 'price': 52.00},
    {'brandName': 'Amoxil', 'genericName': 'Amoxicillin', 'category': 'Antibiotic', 'composition': 'Amoxicillin 500mg', 'manufacturer': 'GlaxoSmithKline', 'form': 'Capsule', 'strength': '500mg', 'price': 85.00},
    {'brandName': 'Mox 500', 'genericName': 'Amoxicillin', 'category': 'Antibiotic', 'composition': 'Amoxicillin 500mg', 'manufacturer': 'Sun Pharma', 'form': 'Capsule', 'strength': '500mg', 'price': 75.00},
    {'brandName': 'Novamox', 'genericName': 'Amoxicillin', 'category': 'Antibiotic', 'composition': 'Amoxicillin 500mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '500mg', 'price': 70.00},
    {'brandName': 'Azithral', 'genericName': 'Azithromycin', 'category': 'Antibiotic', 'composition': 'Azithromycin 500mg', 'manufacturer': 'Alembic', 'form': 'Tablet', 'strength': '500mg', 'price': 120.00},
    {'brandName': 'Zithrox', 'genericName': 'Azithromycin', 'category': 'Antibiotic', 'composition': 'Azithromycin 500mg', 'manufacturer': 'FDC', 'form': 'Tablet', 'strength': '500mg', 'price': 95.00},
    {'brandName': 'Azee', 'genericName': 'Azithromycin', 'category': 'Antibiotic', 'composition': 'Azithromycin 500mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '500mg', 'price': 110.00},
    {'brandName': 'Glycomet', 'genericName': 'Metformin', 'category': 'Diabetes', 'composition': 'Metformin 500mg', 'manufacturer': 'USV', 'form': 'Tablet', 'strength': '500mg', 'price': 65.00},
    {'brandName': 'Gluconorm', 'genericName': 'Metformin', 'category': 'Diabetes', 'composition': 'Metformin 500mg', 'manufacturer': 'Lupin', 'form': 'Tablet', 'strength': '500mg', 'price': 55.00},
    {'brandName': 'Metfor', 'genericName': 'Metformin', 'category': 'Diabetes', 'composition': 'Metformin 500mg', 'manufacturer': 'Sun Pharma', 'form': 'Tablet', 'strength': '500mg', 'price': 60.00},
    {'brandName': 'Amlong', 'genericName': 'Amlodipine', 'category': 'Blood Pressure', 'composition': 'Amlodipine 5mg', 'manufacturer': 'Micro Labs', 'form': 'Tablet', 'strength': '5mg', 'price': 35.00},
    {'brandName': 'Amlovas', 'genericName': 'Amlodipine', 'category': 'Blood Pressure', 'composition': 'Amlodipine 5mg', 'manufacturer': 'Macleods', 'form': 'Tablet', 'strength': '5mg', 'price': 40.00},
    {'brandName': 'Telma AM', 'genericName': 'Telmisartan + Amlodipine', 'category': 'Blood Pressure', 'composition': 'Telmisartan 40mg + Amlodipine 5mg', 'manufacturer': 'Glenmark', 'form': 'Tablet', 'strength': '40mg+5mg', 'price': 95.00},
    {'brandName': 'Atorva', 'genericName': 'Atorvastatin', 'category': 'Cholesterol', 'composition': 'Atorvastatin 10mg', 'manufacturer': 'Zydus Cadila', 'form': 'Tablet', 'strength': '10mg', 'price': 85.00},
    {'brandName': 'Lipitor', 'genericName': 'Atorvastatin', 'category': 'Cholesterol', 'composition': 'Atorvastatin 10mg', 'manufacturer': 'Pfizer', 'form': 'Tablet', 'strength': '10mg', 'price': 120.00},
    {'brandName': 'Storvas', 'genericName': 'Atorvastatin', 'category': 'Cholesterol', 'composition': 'Atorvastatin 10mg', 'manufacturer': 'Sun Pharma', 'form': 'Tablet', 'strength': '10mg', 'price': 75.00},
    {'brandName': 'Zyrtec', 'genericName': 'Cetirizine', 'category': 'Allergy Relief', 'composition': 'Cetirizine 10mg', 'manufacturer': "Dr. Reddy's", 'form': 'Tablet', 'strength': '10mg', 'price': 45.00},
    {'brandName': 'Cetzine', 'genericName': 'Cetirizine', 'category': 'Allergy Relief', 'composition': 'Cetirizine 10mg', 'manufacturer': "Dr. Reddy's", 'form': 'Tablet', 'strength': '10mg', 'price': 35.00},
    {'brandName': 'Okacet', 'genericName': 'Cetirizine', 'category': 'Allergy Relief', 'composition': 'Cetirizine 10mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '10mg', 'price': 30.00},
    {'brandName': 'Pantocid', 'genericName': 'Pantoprazole', 'category': 'Antacid', 'composition': 'Pantoprazole 40mg', 'manufacturer': 'Sun Pharma', 'form': 'Tablet', 'strength': '40mg', 'price': 75.00},
    {'brandName': 'Panpure', 'genericName': 'Pantoprazole', 'category': 'Antacid', 'composition': 'Pantoprazole 40mg', 'manufacturer': 'Macleods', 'form': 'Tablet', 'strength': '40mg', 'price': 65.00},
    {'brandName': 'Pantakind', 'genericName': 'Pantoprazole', 'category': 'Antacid', 'composition': 'Pantoprazole 40mg', 'manufacturer': 'Mankind', 'form': 'Tablet', 'strength': '40mg', 'price': 55.00},
    {'brandName': 'Nexito', 'genericName': 'Escitalopram', 'category': 'Antidepressant', 'composition': 'Escitalopram 10mg', 'manufacturer': 'Sun Pharma', 'form': 'Tablet', 'strength': '10mg', 'price': 85.00},
    {'brandName': 'S Citadep', 'genericName': 'Escitalopram', 'category': 'Antidepressant', 'composition': 'Escitalopram 10mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '10mg', 'price': 75.00},
    {'brandName': 'Citol', 'genericName': 'Escitalopram', 'category': 'Antidepressant', 'composition': 'Escitalopram 10mg', 'manufacturer': 'Psycorem', 'form': 'Tablet', 'strength': '10mg', 'price': 65.00},
    {'brandName': 'Fluka', 'genericName': 'Fluconazole', 'category': 'Antifungal', 'composition': 'Fluconazole 150mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '150mg', 'price': 45.00},
    {'brandName': 'Forcan', 'genericName': 'Fluconazole', 'category': 'Antifungal', 'composition': 'Fluconazole 150mg', 'manufacturer': 'Pfizer', 'form': 'Tablet', 'strength': '150mg', 'price': 85.00},
    {'brandName': 'Zocon', 'genericName': 'Fluconazole', 'category': 'Antifungal', 'composition': 'Fluconazole 150mg', 'manufacturer': 'FDC', 'form': 'Tablet', 'strength': '150mg', 'price': 55.00},
    {'brandName': 'Xyzal', 'genericName': 'Levocetirizine', 'category': 'Allergy Relief', 'composition': 'Levocetirizine 5mg', 'manufacturer': "Dr. Reddy's", 'form': 'Tablet', 'strength': '5mg', 'price': 65.00},
    {'brandName': 'Levosiz', 'genericName': 'Levocetirizine', 'category': 'Allergy Relief', 'composition': 'Levocetirizine 5mg', 'manufacturer': 'Sun Pharma', 'form': 'Tablet', 'strength': '5mg', 'price': 45.00},
    {'brandName': 'Lecope', 'genericName': 'Levocetirizine', 'category': 'Allergy Relief', 'composition': 'Levocetirizine 5mg', 'manufacturer': 'Mankind', 'form': 'Tablet', 'strength': '5mg', 'price': 35.00},
    {'brandName': 'Losar 50', 'genericName': 'Losartan', 'category': 'Blood Pressure', 'composition': 'Losartan 50mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '50mg', 'price': 45.00},
    {'brandName': 'Cefspan', 'genericName': 'Cefixime', 'category': 'Antibiotic', 'composition': 'Cefixime 200mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '200mg', 'price': 110.00},
    {'brandName': 'Rosuzet', 'genericName': 'Rosuvastatin', 'category': 'Cholesterol', 'composition': 'Rosuvastatin 10mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '10mg', 'price': 95.00},
    {'brandName': 'Doxy 100', 'genericName': 'Doxycycline', 'category': 'Antibiotic', 'composition': 'Doxycycline 100mg', 'manufacturer': 'Alembic', 'form': 'Capsule', 'strength': '100mg', 'price': 90.00},
    {'brandName': 'Lopressor', 'genericName': 'Metoprolol', 'category': 'Blood Pressure', 'composition': 'Metoprolol 50mg', 'manufacturer': 'Sun Pharma', 'form': 'Tablet', 'strength': '50mg', 'price': 35.00},
    {'brandName': 'Spiriva', 'genericName': 'Spironolactone', 'category': 'Blood Pressure', 'composition': 'Spironolactone 25mg', 'manufacturer': 'Cipla', 'form': 'Tablet', 'strength': '25mg', 'price': 40.00},
    {'brandName': 'Nebicard', 'genericName': 'Nebivolol', 'category': 'Blood Pressure', 'composition': 'Nebivolol 5mg', 'manufacturer': 'Lupin', 'form': 'Tablet', 'strength': '5mg', 'price': 95.00},
    {'brandName': 'Glimet', 'genericName': 'Glimepiride', 'category': 'Diabetes', 'composition': 'Glimepiride 2mg', 'manufacturer': 'Sun Pharma', 'form': 'Tablet', 'strength': '2mg', 'price': 30.00},
    {'brandName': 'Rantac', 'genericName': 'Ranitidine', 'category': 'Antacid', 'composition': 'Ranitidine 150mg', 'manufacturer': 'Sun Pharma', 'form': 'Tablet', 'strength': '150mg', 'price': 40.00},
    {'brandName': 'Becosules', 'genericName': 'Methylcobalamin', 'category': 'Vitamins', 'composition': 'Methylcobalamin 1500mcg', 'manufacturer': 'Abbott', 'form': 'Tablet', 'strength': '1500mcg', 'price': 70.00},
    {'brandName': 'Shelcal', 'genericName': 'Calcium Carbonate', 'category': 'Supplement', 'composition': 'Calcium Carbonate 500mg + Vitamin D3 250IU', 'manufacturer': 'Zydus Cadila', 'form': 'Tablet', 'strength': '500mg', 'price': 40.00},
    {'brandName': 'Ostocalcium', 'genericName': 'Vitamin D3', 'category': 'Vitamins', 'composition': 'Vitamin D3 60K', 'manufacturer': 'Biocon', 'form': 'Capsule', 'strength': '60K', 'price': 80.00},
]

STORES = [
    ('MetroCare Pharmacy', '14 Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', 19.0600, 72.8295),
    ('City Health Store', '78 SV Road, Kandivali West', 'Mumbai', 'Maharashtra', '400067', 19.2183, 72.8567),
    ('Central Medicals', '102 Thane-Belapur Road, Navi Mumbai', 'Mumbai', 'Maharashtra', '400709', 19.0728, 73.0150),
    ('GreenLife Pharmacy', '25 MG Road, Pune', 'Pune', 'Maharashtra', '411001', 18.5204, 73.8567),
    ('HealWell Chemist', '9 FC Road, Pune', 'Pune', 'Maharashtra', '411004', 18.5167, 73.8567),
    ('CarePlus Pharmacy', '42 Residency Road, Nagpur', 'Nagpur', 'Maharashtra', '440001', 21.1458, 79.0882),
    ('Wellness Medicals', '10 Juhu Tara Road', 'Mumbai', 'Maharashtra', '400049', 19.0850, 72.8320),
    ('Prime Pharmacy', '58 Hinjewadi Road', 'Pune', 'Maharashtra', '411057', 18.5905, 73.7514),
    ('CityCare Pharmacy', '18 Sitabuldi', 'Nagpur', 'Maharashtra', '440012', 21.1530, 79.0880),
    ('Family Pharmacy', '75 Viman Nagar', 'Pune', 'Maharashtra', '411014', 18.5600, 73.9140)
]

USERS = [
    ('Rohan Sharma', 'rohan.sharma@example.com', '+919898989898'),
    ('Sneha Patel', 'sneha.patel@example.com', '+919123456789'),
    ('Amit Rao', 'amit.rao@example.com', '+919876543210')
]

BRAND_PREFIXES = ['Aqua', 'Bio', 'Care', 'Clin', 'Delta', 'Eco', 'Flex', 'Glu', 'Health', 'Medi', 'Neuro', 'Opti', 'Pro', 'Re', 'Ultra', 'Viva', 'Zeni', 'Thera', 'Nova', 'Pure']
BRAND_SUFFIXES = ['cine', 'dol', 'cure', 'max', 'plus', 'care', 'heal', 'fast', 'more', 'ace', 'flex', 'gen', 'med', 'xil', 'vade', 'zon']


def build_brand_name(generic, index):
    prefix = random.choice(BRAND_PREFIXES)
    suffix = random.choice(BRAND_SUFFIXES)
    generic_short = ''.join([word[0] for word in generic.split()])[:3].upper()
    return f"{prefix}{generic_short}{suffix}{index}"


def build_composition(generic, strength):
    return f"{generic} {strength}"


def create_tables(cursor):
    cursor.execute('''
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
    ''')

    cursor.execute('''
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
    ''')

    cursor.execute('''
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
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
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
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            medicine_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(medicine_id) REFERENCES medicines(id)
        )
    ''')


def generate_medicines(cursor):
    medicines = []
    for _ in range(1, 501):
        product = random.choice(MEDICINE_PRODUCTS)
        medicines.append((
            product['brandName'],
            product['genericName'],
            product['category'],
            product['composition'],
            product['manufacturer'],
            product['form'],
            product['strength'],
            product['price']
        ))

    cursor.executemany(
        'INSERT INTO medicines (brandName, genericName, category, composition, manufacturer, form, strength, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        medicines
    )


def generate_stores(cursor):
    cursor.executemany(
        'INSERT INTO stores (name, address, city, state, zipCode, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
        STORES
    )


def generate_users(cursor):
    cursor.executemany(
        'INSERT INTO users (name, email, phone) VALUES (?, ?, ?, ?)',
        USERS
    )


def generate_inventory(cursor):
    cursor.execute('SELECT id FROM stores')
    store_ids = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT id FROM medicines')
    medicine_ids = [row[0] for row in cursor.fetchall()]

    inventory_rows = []
    for store_id in store_ids:
        selected = random.sample(medicine_ids, 120)
        for med_id in selected:
            qty = random.randint(5, 120)
            inventory_rows.append((store_id, med_id, qty))

    cursor.executemany(
        'INSERT OR REPLACE INTO inventory (store_id, medicine_id, quantity) VALUES (?, ?, ?)',
        inventory_rows
    )


def generate_orders(cursor):
    cursor.execute('SELECT id FROM users')
    user_ids = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT id FROM stores')
    store_ids = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT id, price FROM medicines')
    medicines = cursor.fetchall()

    orders = []
    order_items = []

    for order_id in range(1, 31):
        user_id = random.choice(user_ids)
        store_id = random.choice(store_ids)
        item_count = random.randint(1, 4)
        selected_meds = random.sample(medicines, item_count)
        total_amount = 0.0

        orders.append((user_id, store_id, 0.0, 'completed'))
        for med_id, price in selected_meds:
            quantity = random.randint(1, 5)
            total_amount += price * quantity
            order_items.append((order_id, med_id, quantity, round(price, 2)))

        cursor.execute('UPDATE orders SET total_amount = ? WHERE id = ?', (round(total_amount, 2), order_id))

    cursor.executemany(
        'INSERT INTO order_items (order_id, medicine_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        order_items
    )


def main():
    if DB_PATH.exists():
        DB_PATH.unlink()

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    create_tables(cursor)
    generate_medicines(cursor)
    generate_stores(cursor)
    generate_users(cursor)
    generate_inventory(cursor)
    generate_orders(cursor)
    conn.commit()

    cursor.execute('SELECT COUNT(*) FROM medicines')
    print('Medicines:', cursor.fetchone()[0])
    cursor.execute('SELECT COUNT(*) FROM stores')
    print('Stores:', cursor.fetchone()[0])
    cursor.execute('SELECT COUNT(*) FROM inventory')
    print('Inventory rows:', cursor.fetchone()[0])
    cursor.execute('SELECT COUNT(*) FROM orders')
    print('Orders:', cursor.fetchone()[0])
    cursor.execute('SELECT COUNT(*) FROM order_items')
    print('Order items:', cursor.fetchone()[0])

    conn.close()


if __name__ == '__main__':
    main()
