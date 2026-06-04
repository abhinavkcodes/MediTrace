-- ============================================
-- Generic Medicine Transparency System
-- MySQL Database Schema + Real Medicine Data
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS medicine_db;
USE medicine_db;

-- Clean up existing tables for full reinitialize
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS medicines;
SET FOREIGN_KEY_CHECKS = 1;

-- Create medicines table
CREATE TABLE medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brandName VARCHAR(120) NOT NULL,
  genericName VARCHAR(120) NOT NULL,
  category VARCHAR(60) NOT NULL,
  composition VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(120) NOT NULL,
  form VARCHAR(60) NOT NULL,
  strength VARCHAR(60) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_brandName (brandName),
  INDEX idx_genericName (genericName),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create stores table
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zipCode VARCHAR(20) DEFAULT NULL,
  latitude DECIMAL(10,7) DEFAULT NULL,
  longitude DECIMAL(10,7) DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inventory stock at each store
CREATE TABLE inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  medicine_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  last_stocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  UNIQUE KEY uq_store_medicine (store_id, medicine_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users table for order placement
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'placed',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  medicine_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert real medicines data
INSERT INTO medicines (brandName, genericName, category, composition, manufacturer, form, strength, price) VALUES
-- Paracetamol (Fever & Pain)
('Crocin Advance', 'Paracetamol', 'Fever & Pain', 'Paracetamol 500mg', 'GlaxoSmithKline', 'Tablet', '500mg', 30.00),
('Dolo 650', 'Paracetamol', 'Fever & Pain', 'Paracetamol 650mg', 'Micro Labs', 'Tablet', '650mg', 32.00),
('Calpol 650', 'Paracetamol', 'Fever & Pain', 'Paracetamol 650mg', 'GlaxoSmithKline', 'Tablet', '650mg', 35.00),
('Paracip 500', 'Paracetamol', 'Fever & Pain', 'Paracetamol 500mg', 'Cipla', 'Tablet', '500mg', 25.00),
('Pyrigesic', 'Paracetamol', 'Fever & Pain', 'Paracetamol 500mg', 'Zydus Cadila', 'Tablet', '500mg', 28.00),

-- Ibuprofen (Pain Relief)
('Brufen 400', 'Ibuprofen', 'Pain Relief', 'Ibuprofen 400mg', 'Abbott', 'Tablet', '400mg', 45.00),
('Ibugesic', 'Ibuprofen', 'Pain Relief', 'Ibuprofen 400mg', 'Cipla', 'Tablet', '400mg', 38.00),
('Combiflam', 'Ibuprofen + Paracetamol', 'Pain Relief', 'Ibuprofen 400mg + Paracetamol 325mg', 'Sanofi', 'Tablet', '400mg+325mg', 52.00),

-- Amoxicillin (Antibiotic)
('Amoxil', 'Amoxicillin', 'Antibiotic', 'Amoxicillin 500mg', 'GlaxoSmithKline', 'Capsule', '500mg', 85.00),
('Mox 500', 'Amoxicillin', 'Antibiotic', 'Amoxicillin 500mg', 'Sun Pharma', 'Capsule', '500mg', 75.00),
('Novamox', 'Amoxicillin', 'Antibiotic', 'Amoxicillin 500mg', 'Cipla', 'Tablet', '500mg', 70.00),

-- Azithromycin (Antibiotic)
('Azithral', 'Azithromycin', 'Antibiotic', 'Azithromycin 500mg', 'Alembic', 'Tablet', '500mg', 120.00),
('Zithrox', 'Azithromycin', 'Antibiotic', 'Azithromycin 500mg', 'FDC', 'Tablet', '500mg', 95.00),
('Azee', 'Azithromycin', 'Antibiotic', 'Azithromycin 500mg', 'Cipla', 'Tablet', '500mg', 110.00),

-- Metformin (Diabetes)
('Glycomet', 'Metformin', 'Diabetes', 'Metformin 500mg', 'USV', 'Tablet', '500mg', 65.00),
('Gluconorm', 'Metformin', 'Diabetes', 'Metformin 500mg', 'Lupin', 'Tablet', '500mg', 55.00),
('Metfor', 'Metformin', 'Diabetes', 'Metformin 500mg', 'Sun Pharma', 'Tablet', '500mg', 60.00),

-- Amlodipine (Blood Pressure)
('Amlong', 'Amlodipine', 'Blood Pressure', 'Amlodipine 5mg', 'Micro Labs', 'Tablet', '5mg', 35.00),
('Amlovas', 'Amlodipine', 'Blood Pressure', 'Amlodipine 5mg', 'Macleods', 'Tablet', '5mg', 40.00),
('Telma AM', 'Telmisartan + Amlodipine', 'Blood Pressure', 'Telmisartan 40mg + Amlodipine 5mg', 'Glenmark', 'Tablet', '40mg+5mg', 95.00),

-- Atorvastatin (Cholesterol)
('Atorva', 'Atorvastatin', 'Cholesterol', 'Atorvastatin 10mg', 'Zydus Cadila', 'Tablet', '10mg', 85.00),
('Lipitor', 'Atorvastatin', 'Cholesterol', 'Atorvastatin 10mg', 'Pfizer', 'Tablet', '10mg', 120.00),
('Storvas', 'Atorvastatin', 'Cholesterol', 'Atorvastatin 10mg', 'Sun Pharma', 'Tablet', '10mg', 75.00),

-- Cetirizine (Allergy Relief)
('Zyrtec', 'Cetirizine', 'Allergy Relief', 'Cetirizine 10mg', 'Dr. Reddy\'s', 'Tablet', '10mg', 45.00),
('Cetzine', 'Cetirizine', 'Allergy Relief', 'Cetirizine 10mg', 'Dr. Reddy\'s', 'Tablet', '10mg', 35.00),
('Okacet', 'Cetirizine', 'Allergy Relief', 'Cetirizine 10mg', 'Cipla', 'Tablet', '10mg', 30.00),

-- Pantoprazole (Antacid)
('Pantocid', 'Pantoprazole', 'Antacid', 'Pantoprazole 40mg', 'Sun Pharma', 'Tablet', '40mg', 75.00),
('Panpure', 'Pantoprazole', 'Antacid', 'Pantoprazole 40mg', 'Macleods', 'Tablet', '40mg', 65.00),
('Pantakind', 'Pantoprazole', 'Antacid', 'Pantoprazole 40mg', 'Mankind', 'Tablet', '40mg', 55.00),

-- Escitalopram (Antidepressant)
('Nexito', 'Escitalopram', 'Antidepressant', 'Escitalopram 10mg', 'Sun Pharma', 'Tablet', '10mg', 85.00),
('S Citadep', 'Escitalopram', 'Antidepressant', 'Escitalopram 10mg', 'Cipla', 'Tablet', '10mg', 75.00),
('Citol', 'Escitalopram', 'Antidepressant', 'Escitalopram 10mg', 'Psycorem', 'Tablet', '10mg', 65.00),

-- Fluconazole (Antifungal)
('Fluka', 'Fluconazole', 'Antifungal', 'Fluconazole 150mg', 'Cipla', 'Tablet', '150mg', 45.00),
('Forcan', 'Fluconazole', 'Antifungal', 'Fluconazole 150mg', 'Pfizer', 'Tablet', '150mg', 85.00),
('Zocon', 'Fluconazole', 'Antifungal', 'Fluconazole 150mg', 'FDC', 'Tablet', '150mg', 55.00),

-- Levocetirizine (Allergy Relief)
('Xyzal', 'Levocetirizine', 'Allergy Relief', 'Levocetirizine 5mg', 'Dr. Reddy\'s', 'Tablet', '5mg', 65.00),
('Levosiz', 'Levocetirizine', 'Allergy Relief', 'Levocetirizine 5mg', 'Sun Pharma', 'Tablet', '5mg', 45.00),
('Lecope', 'Levocetirizine', 'Allergy Relief', 'Levocetirizine 5mg', 'Mankind', 'Tablet', '5mg', 35.00),

-- Clopidogrel (Cardiac)
('Clopilet', 'Clopidogrel', 'Cardiac', 'Clopidogrel 75mg', 'Sun Pharma', 'Tablet', '75mg', 95.00),
('Plavix', 'Clopidogrel', 'Cardiac', 'Clopidogrel 75mg', 'Sanofi', 'Tablet', '75mg', 150.00),
('Clopi', 'Clopidogrel', 'Cardiac', 'Clopidogrel 75mg', 'Cipla', 'Tablet', '75mg', 75.00),

-- Omeprazole (Digestive)
('Omez', 'Omeprazole', 'Digestive', 'Omeprazole 20mg', 'Dr. Reddy\'s', 'Capsule', '20mg', 55.00),
('Razo', 'Omeprazole', 'Digestive', 'Omeprazole 20mg', 'Dr. Reddy\'s', 'Tablet', '20mg', 45.00),
('Ocid', 'Omeprazole', 'Digestive', 'Omeprazole 20mg', 'Zydus Cadila', 'Tablet', '20mg', 40.00),

-- Cefixime (Antibiotic)
('Suprax', 'Cefixime', 'Antibiotic', 'Cefixime 200mg', 'Lupin', 'Tablet', '200mg', 125.00),
('Taxim O', 'Cefixime', 'Antibiotic', 'Cefixime 200mg', 'Alkem', 'Tablet', '200mg', 95.00),
('Zifi', 'Cefixime', 'Antibiotic', 'Cefixime 200mg', 'FDC', 'Tablet', '200mg', 85.00),

-- Rosuvastatin (Cholesterol)
('Crestor', 'Rosuvastatin', 'Cholesterol', 'Rosuvastatin 10mg', 'AstraZeneca', 'Tablet', '10mg', 180.00),
('Rozavel', 'Rosuvastatin', 'Cholesterol', 'Rosuvastatin 10mg', 'Sun Pharma', 'Tablet', '10mg', 95.00),
('Rosuvas', 'Rosuvastatin', 'Cholesterol', 'Rosuvastatin 10mg', 'Cadila', 'Tablet', '10mg', 85.00),

-- Doxycycline (Antibiotic)
('Doxy', 'Doxycycline', 'Antibiotic', 'Doxycycline 100mg', 'Cipla', 'Capsule', '100mg', 65.00),
('Microdox', 'Doxycycline', 'Antibiotic', 'Doxycycline 100mg', 'Micro Labs', 'Capsule', '100mg', 55.00),
('Doxicip', 'Doxycycline', 'Antibiotic', 'Doxycycline 100mg', 'Cipla', 'Tablet', '100mg', 60.00),

-- Sildenafil (Cardiac)
('Penegra', 'Sildenafil', 'Cardiac', 'Sildenafil 50mg', 'Zydus Cadila', 'Tablet', '50mg', 85.00),
('Manforce', 'Sildenafil', 'Cardiac', 'Sildenafil 50mg', 'Mankind', 'Tablet', '50mg', 75.00),
('Caverta', 'Sildenafil', 'Cardiac', 'Sildenafil 50mg', 'Sun Pharma', 'Tablet', '50mg', 95.00),

-- Loratadine (Allergy Relief)
('Claritin', 'Loratadine', 'Allergy Relief', 'Loratadine 10mg', 'Bayer', 'Tablet', '10mg', 45.00),
('Lora', 'Loratadine', 'Allergy Relief', 'Loratadine 10mg', 'Sun Pharma', 'Tablet', '10mg', 25.00),
('Alaspan', 'Loratadine', 'Allergy Relief', 'Loratadine 10mg', 'Micro Labs', 'Tablet', '10mg', 30.00),

-- Diclofenac (Pain Relief)
('Voveran', 'Diclofenac', 'Pain Relief', 'Diclofenac 50mg', 'Novartis', 'Tablet', '50mg', 35.00),
('Dynapar', 'Diclofenac', 'Pain Relief', 'Diclofenac 50mg', 'Troikaa', 'Tablet', '50mg', 25.00),
('Voltaren', 'Diclofenac', 'Pain Relief', 'Diclofenac 50mg', 'Novartis', 'Tablet', '50mg', 55.00),

-- Ranitidine (Digestive)
('Zantac', 'Ranitidine', 'Digestive', 'Ranitidine 150mg', 'GlaxoSmithKline', 'Tablet', '150mg', 25.00),
('Rantac', 'Ranitidine', 'Digestive', 'Ranitidine 150mg', 'J.B. Chemicals', 'Tablet', '150mg', 20.00),
('Histac', 'Ranitidine', 'Digestive', 'Ranitidine 150mg', 'Torrent', 'Tablet', '150mg', 18.00),

-- Insulin (Diabetes)
('Huminsulin', 'Insulin', 'Diabetes', 'Insulin Human 100IU/ml', 'Lilly', 'Injection', '100IU/ml', 250.00),
('Mixtard', 'Insulin', 'Diabetes', 'Insulin Human 30/70 100IU/ml', 'Novo Nordisk', 'Injection', '100IU/ml', 320.00),
('Lantus', 'Insulin Glargine', 'Diabetes', 'Insulin Glargine 100IU/ml', 'Sanofi', 'Injection', '100IU/ml', 450.00),

-- Prednisone (Anti-Inflammatory)
('Wysolone', 'Prednisone', 'Anti-Inflammatory', 'Prednisone 5mg', 'Pfizer', 'Tablet', '5mg', 45.00),
('Predone', 'Prednisone', 'Anti-Inflammatory', 'Prednisone 5mg', 'Sun Pharma', 'Tablet', '5mg', 35.00),
('Cortil', 'Prednisone', 'Anti-Inflammatory', 'Prednisone 5mg', 'Micro Labs', 'Tablet', '5mg', 30.00),

-- Tamsulosin (Digestive)
('Contiflo', 'Tamsulosin', 'Digestive', 'Tamsulosin 0.4mg', 'Sun Pharma', 'Capsule', '0.4mg', 85.00),
('Tamflo', 'Tamsulosin', 'Digestive', 'Tamsulosin 0.4mg', 'Alembic', 'Capsule', '0.4mg', 65.00),
('Flomax', 'Tamsulosin', 'Digestive', 'Tamsulosin 0.4mg', 'Boehringer', 'Capsule', '0.4mg', 120.00),

-- Gabapentin (Pain Relief)
('Neurontin', 'Gabapentin', 'Pain Relief', 'Gabapentin 300mg', 'Pfizer', 'Capsule', '300mg', 95.00),
('Gabantin', 'Gabapentin', 'Pain Relief', 'Gabapentin 300mg', 'Sun Pharma', 'Capsule', '300mg', 75.00),
('Gaba', 'Gabapentin', 'Pain Relief', 'Gabapentin 300mg', 'Intas', 'Tablet', '300mg', 65.00),

-- Naproxen (Pain Relief)
('Naprosyn', 'Naproxen', 'Pain Relief', 'Naproxen 250mg', 'Roche', 'Tablet', '250mg', 55.00),
('Naxdom', 'Naproxen', 'Pain Relief', 'Naproxen 250mg', 'Sun Pharma', 'Tablet', '250mg', 45.00),
('Xenobid', 'Naproxen', 'Pain Relief', 'Naproxen 250mg', 'Cadila', 'Tablet', '250mg', 40.00),

-- Budesonide (Respiratory)
('Pulmicort', 'Budesonide', 'Respiratory', 'Budesonide 200mcg', 'AstraZeneca', 'Inhaler', '200mcg', 350.00),
('Budecort', 'Budesonide', 'Respiratory', 'Budesonide 200mcg', 'Cipla', 'Inhaler', '200mcg', 280.00),
('Foracort', 'Budesonide + Formoterol', 'Respiratory', 'Budesonide 200mcg + Formoterol 6mcg', 'Cipla', 'Inhaler', '200mcg+6mcg', 420.00),

-- Tramadol (Pain Relief)
('Tramal', 'Tramadol', 'Pain Relief', 'Tramadol 50mg', 'Grunenthal', 'Tablet', '50mg', 75.00),
('Tramacet', 'Tramadol + Paracetamol', 'Pain Relief', 'Tramadol 37.5mg + Paracetamol 325mg', 'Janssen', 'Tablet', '37.5mg+325mg', 85.00),
('Contramal', 'Tramadol', 'Pain Relief', 'Tramadol 50mg', 'Sun Pharma', 'Tablet', '50mg', 55.00),

-- Famotidine (Digestive)
('Famocid', 'Famotidine', 'Digestive', 'Famotidine 20mg', 'Sun Pharma', 'Tablet', '20mg', 25.00),
('Famatel', 'Famotidine', 'Digestive', 'Famotidine 20mg', 'Dr. Reddy\'s', 'Tablet', '20mg', 20.00),
('Pepcid', 'Famotidine', 'Digestive', 'Famotidine 20mg', 'Johnson & Johnson', 'Tablet', '20mg', 35.00),

-- Methylcobalamin (Supplement)
('Mecobal', 'Methylcobalamin', 'Supplement', 'Methylcobalamin 500mcg', 'Eisai', 'Tablet', '500mcg', 65.00),
('Cobadex', 'Methylcobalamin', 'Supplement', 'Methylcobalamin 1500mcg', 'Zydus Cadila', 'Injection', '1500mcg', 85.00),
('Neurobion Forte', 'Vitamin B Complex', 'Supplement', 'Vitamin B1+B6+B12', 'Merck', 'Tablet', '100mg+200mg+200mcg', 45.00),

-- Multivitamin (Supplement)
('Becadexamin', 'Multivitamin', 'Supplement', 'Multivitamin with Minerals', 'GlaxoSmithKline', 'Tablet', 'Various', 35.00),
('Supradyn', 'Multivitamin', 'Supplement', 'Multivitamin with Minerals', 'Bayer', 'Tablet', 'Various', 55.00),
('Zincovit', 'Multivitamin', 'Supplement', 'Multivitamin with Zinc', 'Apex', 'Tablet', 'Various', 45.00),

-- Calcium Carbonate (Supplement)
('Shelcal', 'Calcium Carbonate', 'Supplement', 'Calcium Carbonate 500mg + Vitamin D3', 'Elder', 'Tablet', '500mg+250IU', 75.00),
('Calcirol', 'Vitamin D3', 'Supplement', 'Vitamin D3 60K', 'Cadila', 'Capsule', '60K IU', 85.00),
('Ostocalcium', 'Calcium Carbonate', 'Supplement', 'Calcium Carbonate 500mg', 'Mankind', 'Tablet', '500mg', 35.00),

-- Vitamin D3 (Supplement)
('D-Rise', 'Vitamin D3', 'Supplement', 'Vitamin D3 60K', 'USV', 'Capsule', '60K IU', 65.00),
('Uprise D3', 'Vitamin D3', 'Supplement', 'Vitamin D3 60K', 'USV', 'Tablet', '60K IU', 70.00),
('Arachitol', 'Vitamin D3', 'Supplement', 'Vitamin D3 6L', 'Abbott', 'Injection', '6L IU', 120.00),

-- Ferrous Sulfate (Supplement)
('Fersolate', 'Ferrous Sulfate', 'Supplement', 'Ferrous Sulfate 100mg', 'Sun Pharma', 'Tablet', '100mg', 25.00),
('Feofol', 'Ferrous Sulfate', 'Supplement', 'Ferrous Sulfate 150mg', 'Mankind', 'Tablet', '150mg', 35.00),
('Feronia', 'Ferrous Sulfate', 'Supplement', 'Ferrous Sulfate 100mg', 'Abbott', 'Tablet', '100mg', 30.00),

-- Salbutamol (Respiratory)
('Asthalin', 'Salbutamol', 'Respiratory', 'Salbutamol 2mg', 'Cipla', 'Tablet', '2mg', 15.00),
('Ventolin', 'Salbutamol', 'Respiratory', 'Salbutamol 100mcg', 'GlaxoSmithKline', 'Inhaler', '100mcg', 180.00),
('Duolin', 'Salbutamol + Ipratropium', 'Respiratory', 'Salbutamol 50mcg + Ipratropium 20mcg', 'Cipla', 'Inhaler', '50mcg+20mcg', 220.00),

-- Baclofen (Pain Relief)
('Lioresal', 'Baclofen', 'Pain Relief', 'Baclofen 10mg', 'Novartis', 'Tablet', '10mg', 45.00),
('Baclof', 'Baclofen', 'Pain Relief', 'Baclofen 10mg', 'Sun Pharma', 'Tablet', '10mg', 35.00),
('Baclon', 'Baclofen', 'Pain Relief', 'Baclofen 10mg', 'Micro Labs', 'Tablet', '10mg', 30.00),

-- Cyclobenzaprine (Pain Relief)
('Flexeril', 'Cyclobenzaprine', 'Pain Relief', 'Cyclobenzaprine 5mg', 'McNeil', 'Tablet', '5mg', 65.00),
('Relaxon', 'Cyclobenzaprine', 'Pain Relief', 'Cyclobenzaprine 5mg', 'Sun Pharma', 'Tablet', '5mg', 45.00),
('Cyclo', 'Cyclobenzaprine', 'Pain Relief', 'Cyclobenzaprine 5mg', 'Mankind', 'Tablet', '5mg', 35.00),

-- Levofloxacin (Antibiotic)
('Tavanic', 'Levofloxacin', 'Antibiotic', 'Levofloxacin 500mg', 'Sanofi', 'Tablet', '500mg', 150.00),
('Levoflox', 'Levofloxacin', 'Antibiotic', 'Levofloxacin 500mg', 'Cipla', 'Tablet', '500mg', 95.00),
('Loxof', 'Levofloxacin', 'Antibiotic', 'Levofloxacin 500mg', 'Sun Pharma', 'Tablet', '500mg', 85.00),

-- Sodium Valproate (Antidepressant)
('Valprol', 'Sodium Valproate', 'Antidepressant', 'Sodium Valproate 200mg', 'Sanofi', 'Tablet', '200mg', 55.00),
('Encorate', 'Sodium Valproate', 'Antidepressant', 'Sodium Valproate 300mg', 'Sun Pharma', 'Tablet', '300mg', 75.00),
('Valance', 'Sodium Valproate', 'Antidepressant', 'Sodium Valproate 200mg', 'Intas', 'Tablet', '200mg', 45.00),

-- Risperidone (Antidepressant)
('Risperdal', 'Risperidone', 'Antidepressant', 'Risperidone 2mg', 'Janssen', 'Tablet', '2mg', 85.00),
('Risnia', 'Risperidone', 'Antidepressant', 'Risperidone 2mg', 'Sun Pharma', 'Tablet', '2mg', 65.00),
('Risdone', 'Risperidone', 'Antidepressant', 'Risperidone 2mg', 'Intas', 'Tablet', '2mg', 55.00),

-- Methotrexate (Anti-Inflammatory)
('Folex', 'Methotrexate', 'Anti-Inflammatory', 'Methotrexate 2.5mg', 'Ipca', 'Tablet', '2.5mg', 45.00),
('Methotrexate', 'Methotrexate', 'Anti-Inflammatory', 'Methotrexate 2.5mg', 'Cadila', 'Tablet', '2.5mg', 35.00),
('Rheumatrex', 'Methotrexate', 'Anti-Inflammatory', 'Methotrexate 7.5mg', 'Pfizer', 'Tablet', '7.5mg', 75.00),

-- Lisinopril (Blood Pressure)
('Lisinopril', 'Lisinopril', 'Blood Pressure', 'Lisinopril 5mg', 'Lupin', 'Tablet', '5mg', 35.00),
('Lisoril', 'Lisinopril', 'Blood Pressure', 'Lisinopril 5mg', 'Torrent', 'Tablet', '5mg', 30.00),
('Zestril', 'Lisinopril', 'Blood Pressure', 'Lisinopril 5mg', 'AstraZeneca', 'Tablet', '5mg', 55.00),

-- Enalapril (Blood Pressure)
('Enam', 'Enalapril', 'Blood Pressure', 'Enalapril 5mg', 'Dr. Reddy\'s', 'Tablet', '5mg', 25.00),
('Enalapril', 'Enalapril', 'Blood Pressure', 'Enalapril 5mg', 'Sun Pharma', 'Tablet', '5mg', 20.00),
('Vasotec', 'Enalapril', 'Blood Pressure', 'Enalapril 5mg', 'BMS', 'Tablet', '5mg', 45.00),

-- Glimepiride (Diabetes)
('Amaryl', 'Glimepiride', 'Diabetes', 'Glimepiride 2mg', 'Sanofi', 'Tablet', '2mg', 65.00),
('Glimy', 'Glimepiride', 'Diabetes', 'Glimepiride 2mg', 'Mankind', 'Tablet', '2mg', 45.00),
('Glimestar', 'Glimepiride', 'Diabetes', 'Glimepiride 2mg', 'Mankind', 'Tablet', '2mg', 40.00),

-- Vildagliptin (Diabetes)
('Galvus', 'Vildagliptin', 'Diabetes', 'Vildagliptin 50mg', 'Novartis', 'Tablet', '50mg', 120.00),
('Vilda', 'Vildagliptin', 'Diabetes', 'Vildagliptin 50mg', 'Mankind', 'Tablet', '50mg', 85.00),
('Zomelis', 'Vildagliptin + Metformin', 'Diabetes', 'Vildagliptin 50mg + Metformin 500mg', 'USV', 'Tablet', '50mg+500mg', 95.00),

-- Telmisartan (Blood Pressure)
('Telma', 'Telmisartan', 'Blood Pressure', 'Telmisartan 40mg', 'Glenmark', 'Tablet', '40mg', 75.00),
('Telmikind', 'Telmisartan', 'Blood Pressure', 'Telmisartan 40mg', 'Mankind', 'Tablet', '40mg', 65.00),
('Micardis', 'Telmisartan', 'Blood Pressure', 'Telmisartan 40mg', 'Boehringer', 'Tablet', '40mg', 95.00),

-- Spironolactone (Blood Pressure)
('Aldactone', 'Spironolactone', 'Blood Pressure', 'Spironolactone 25mg', 'RPG Life', 'Tablet', '25mg', 35.00),
('Spironolactone', 'Spironolactone', 'Blood Pressure', 'Spironolactone 25mg', 'Sun Pharma', 'Tablet', '25mg', 25.00),
('Spiractin', 'Spironolactone', 'Blood Pressure', 'Spironolactone 25mg', 'Micro Labs', 'Tablet', '25mg', 30.00),

-- Nebivolol (Blood Pressure)
('Nebistar', 'Nebivolol', 'Blood Pressure', 'Nebivolol 5mg', 'Lupin', 'Tablet', '5mg', 85.00),
('Nebivolol', 'Nebivolol', 'Blood Pressure', 'Nebivolol 5mg', 'Sun Pharma', 'Tablet', '5mg', 65.00),
('Bystolic', 'Nebivolol', 'Blood Pressure', 'Nebivolol 5mg', 'Forest Labs', 'Tablet', '5mg', 120.00);

-- Insert stores data
INSERT INTO stores (name, address, city, state, zipCode, latitude, longitude) VALUES
('Apollo Pharmacy', '123 MG Road, Near Central Mall', 'Mumbai', 'Maharashtra', '400001', 19.0760, 72.8777),
('MedPlus Pharmacy', '456 Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', 19.0600, 72.8295),
('Wellness Forever', '789 SV Road, Kandivali West', 'Mumbai', 'Maharashtra', '400067', 19.2183, 72.8567),
('1mg Pharmacy', '321 Thane-Belapur Road, Navi Mumbai', 'Mumbai', 'Maharashtra', '400709', 19.0728, 73.0150),
('Pharmeasy Store', '654 MG Road, Camp Area', 'Pune', 'Maharashtra', '411001', 18.5204, 73.8567),
('HealthBuddy Pharmacy', '987 FC Road, Shivaji Nagar', 'Pune', 'Maharashtra', '411004', 18.5167, 73.8567),
('Care Pharmacy', '147 Residency Road, Sadar', 'Nagpur', 'Maharashtra', '440001', 21.1458, 79.0882),
('LifeCare Pharmacy', '258 Juhu Tara Road, Juhu', 'Mumbai', 'Maharashtra', '400049', 19.0850, 72.8320),
('MediSave Pharmacy', '369 Hinjewadi Road, Phase 1', 'Pune', 'Maharashtra', '411057', 18.5905, 73.7514),
('CityMed Pharmacy', '741 Sitabuldi Main Road', 'Nagpur', 'Maharashtra', '440012', 21.1530, 79.0880),
('GreenCross Pharmacy', '852 Viman Nagar Road', 'Pune', 'Maharashtra', '411014', 18.5600, 73.9140),
('QuickMeds Pharmacy', '963 Andheri West, Near Metro', 'Mumbai', 'Maharashtra', '400058', 19.1197, 72.8464),
('Reliable Pharmacy', '159 Bhandup West, LBS Road', 'Mumbai', 'Maharashtra', '400078', 19.1439, 72.9384),
('HealthFirst Pharmacy', '357 Dharavi Main Road', 'Mumbai', 'Maharashtra', '400017', 19.0380, 72.8536),
('MediCare Pharmacy', '486 Ghatkopar East, 90 Feet Road', 'Mumbai', 'Maharashtra', '400077', 19.0856, 72.9094);

-- Insert users data
INSERT INTO users (name, email, phone) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', '+919876543210'),
('Priya Patel', 'priya.patel@example.com', '+919812345678'),
('Amit Kumar', 'amit.kumar@example.com', '+919745612389');

-- Insert inventory data (random stock for medicines across stores)
INSERT INTO inventory (store_id, medicine_id, quantity) VALUES
-- Apollo Pharmacy (Store 1) - Good stock of common medicines
(1, 1, 50), (1, 2, 45), (1, 3, 40), (1, 4, 35), (1, 5, 30),
(1, 6, 25), (1, 7, 20), (1, 8, 15), (1, 9, 10), (1, 10, 5),
(1, 11, 40), (1, 12, 35), (1, 13, 30), (1, 14, 25), (1, 15, 20),

-- MedPlus Pharmacy (Store 2) - Focus on antibiotics and pain relief
(2, 1, 60), (2, 2, 55), (2, 3, 50), (2, 4, 45), (2, 5, 40),
(2, 16, 35), (2, 17, 30), (2, 18, 25), (2, 19, 20), (2, 20, 15),
(2, 21, 10), (2, 22, 5), (2, 23, 40), (2, 24, 35), (2, 25, 30),

-- Wellness Forever (Store 3) - Diabetes and cardiac medicines
(3, 26, 45), (3, 27, 40), (3, 28, 35), (3, 29, 30), (3, 30, 25),
(3, 31, 20), (3, 32, 15), (3, 33, 10), (3, 34, 5), (3, 35, 40),
(3, 36, 35), (3, 37, 30), (3, 38, 25), (3, 39, 20), (3, 40, 15),

-- 1mg Pharmacy (Store 4) - Allergy and digestive medicines
(4, 41, 50), (4, 42, 45), (4, 43, 40), (4, 44, 35), (4, 45, 30),
(4, 46, 25), (4, 47, 20), (4, 48, 15), (4, 49, 10), (4, 50, 5),
(4, 51, 40), (4, 52, 35), (4, 53, 30), (4, 54, 25), (4, 55, 20),

-- Pharmeasy Store (Store 5) - Supplements and vitamins
(5, 56, 45), (5, 57, 40), (5, 58, 35), (5, 59, 30), (5, 60, 25),
(5, 61, 20), (5, 62, 15), (5, 63, 10), (5, 64, 5), (5, 65, 40),
(5, 66, 35), (5, 67, 30), (5, 68, 25), (5, 69, 20), (5, 70, 15),

-- HealthBuddy Pharmacy (Store 6) - Respiratory and pain relief
(6, 71, 50), (6, 72, 45), (6, 73, 40), (6, 74, 35), (6, 75, 30),
(6, 76, 25), (6, 77, 20), (6, 78, 15), (6, 79, 10), (6, 80, 5),
(6, 81, 40), (6, 82, 35), (6, 83, 30), (6, 84, 25), (6, 85, 20),

-- Care Pharmacy (Store 7) - General medicines
(7, 1, 35), (7, 6, 30), (7, 11, 25), (7, 16, 20), (7, 21, 15),
(7, 26, 10), (7, 31, 5), (7, 36, 40), (7, 41, 35), (7, 46, 30),
(7, 51, 25), (7, 56, 20), (7, 61, 15), (7, 66, 10), (7, 71, 5),

-- LifeCare Pharmacy (Store 8) - Cardiac and blood pressure
(8, 31, 45), (8, 32, 40), (8, 33, 35), (8, 34, 30), (8, 35, 25),
(8, 86, 20), (8, 87, 15), (8, 88, 10), (8, 89, 5), (8, 90, 40),
(8, 91, 35), (8, 92, 30), (8, 93, 25), (8, 94, 20), (8, 95, 15),

-- MediSave Pharmacy (Store 9) - Diabetes and supplements
(9, 26, 50), (9, 27, 45), (9, 28, 40), (9, 29, 35), (9, 30, 30),
(9, 56, 25), (9, 57, 20), (9, 58, 15), (9, 59, 10), (9, 60, 5),
(9, 96, 40), (9, 97, 35), (9, 98, 30), (9, 99, 25), (9, 100, 20),

-- CityMed Pharmacy (Store 10) - Antibiotics and antifungals
(10, 16, 45), (10, 17, 40), (10, 18, 35), (10, 19, 20), (10, 20, 15),
(10, 21, 10), (10, 22, 5), (10, 23, 40), (10, 24, 35), (10, 25, 30),
(10, 46, 25), (10, 47, 20), (10, 48, 15), (10, 49, 10), (10, 50, 5),

-- GreenCross Pharmacy (Store 11) - Pain relief and anti-inflammatory
(11, 1, 40), (11, 2, 35), (11, 3, 30), (11, 4, 25), (11, 5, 20),
(11, 6, 15), (11, 7, 10), (11, 8, 5), (11, 76, 40), (11, 77, 35),
(11, 78, 30), (11, 79, 25), (11, 80, 20), (11, 81, 15), (11, 82, 10),

-- QuickMeds Pharmacy (Store 12) - General stock
(12, 1, 30), (12, 11, 25), (12, 21, 20), (12, 31, 15), (12, 41, 10),
(12, 51, 5), (12, 61, 40), (12, 71, 35), (12, 81, 30), (12, 91, 25),
(12, 101, 20), (12, 111, 15), (12, 121, 10), (12, 131, 5), (12, 141, 40),

-- Reliable Pharmacy (Store 13) - Supplements and vitamins
(13, 56, 35), (13, 57, 30), (13, 58, 25), (13, 59, 20), (13, 60, 15),
(13, 61, 10), (13, 62, 5), (13, 63, 40), (13, 64, 35), (13, 65, 30),
(13, 66, 25), (13, 67, 20), (13, 68, 15), (13, 69, 10), (13, 70, 5),

-- HealthFirst Pharmacy (Store 14) - Digestive and allergy
(14, 41, 40), (14, 42, 35), (14, 43, 30), (14, 44, 25), (14, 45, 20),
(14, 46, 15), (14, 47, 10), (14, 48, 5), (14, 49, 40), (14, 50, 35),
(14, 51, 30), (14, 52, 25), (14, 53, 20), (14, 54, 15), (14, 55, 10),

-- MediCare Pharmacy (Store 15) - Cardiac and blood pressure
(15, 31, 45), (15, 32, 40), (15, 33, 35), (15, 34, 30), (15, 35, 25),
(15, 86, 20), (15, 87, 15), (15, 88, 10), (15, 89, 5), (15, 90, 40),
(15, 91, 35), (15, 92, 30), (15, 93, 25), (15, 94, 20), (15, 95, 15);

-- Insert sample orders
INSERT INTO orders (user_id, store_id, total_amount, status) VALUES
(1, 1, 125.00, 'completed'),
(2, 2, 85.00, 'completed'),
(3, 3, 165.00, 'completed'),
(1, 4, 95.00, 'completed'),
(2, 5, 75.00, 'completed');

-- Insert order items
INSERT INTO order_items (order_id, medicine_id, quantity, unit_price) VALUES
(1, 1, 2, 30.00),
(1, 6, 1, 45.00),
(1, 11, 1, 50.00),
(2, 2, 1, 32.00),
(2, 16, 1, 53.00),
(3, 26, 1, 65.00),
(3, 31, 1, 100.00),
(4, 41, 2, 47.50),
(5, 56, 1, 35.00),
(5, 61, 1, 40.00);