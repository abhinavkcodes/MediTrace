-- ============================================
-- Generic Medicine Transparency System
-- MySQL Database Schema + Sample Data
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

-- Insert sample medicines
INSERT INTO medicines (brandName, genericName, category, composition, manufacturer, form, strength, price) VALUES
('Crocin Advance', 'Paracetamol', 'Fever & Pain', 'Paracetamol 500mg', 'GlaxoSmithKline', 'Tablet', '500mg', 30.00),
('Dolo 650', 'Paracetamol', 'Fever & Pain', 'Paracetamol 650mg', 'Micro Labs', 'Tablet', '650mg', 32.00),
('Combiflam', 'Ibuprofen + Paracetamol', 'Pain Relief', 'Ibuprofen 400mg + Paracetamol 325mg', 'Sanofi India', 'Tablet', '400mg+325mg', 42.00),
('Brufen', 'Ibuprofen', 'Anti-Inflammatory', 'Ibuprofen 400mg', 'Abbott India', 'Tablet', '400mg', 35.00),
('Vicks Action 500', 'Paracetamol + Caffeine + Phenylephrine', 'Cough Suppressant', 'Paracetamol 500mg + Caffeine 25mg + Phenylephrine 10mg', 'Procter & Gamble', 'Tablet', '500mg', 45.00),
('Augmentin 625', 'Amoxicillin + Clavulanate', 'Antibiotic', 'Amoxicillin 500mg + Clavulanic Acid 125mg', 'GlaxoSmithKline', 'Tablet', '625mg', 180.00),
('Azithral 500', 'Azithromycin', 'Antibiotic', 'Azithromycin 500mg', 'Alembic Pharma', 'Tablet', '500mg', 105.00),
('Metformin GP', 'Metformin', 'Diabetes', 'Metformin Hydrochloride 500mg', 'USV Limited', 'Tablet', '500mg', 55.00),
('Glycomet 850', 'Metformin', 'Diabetes', 'Metformin Hydrochloride 850mg', 'USV Limited', 'Tablet', '850mg', 72.00),
('Amlodipine AT', 'Amlodipine', 'Blood Pressure', 'Amlodipine Besylate 5mg', 'Cipla', 'Tablet', '5mg', 48.00),
('Ecosprin 75', 'Aspirin', 'Blood Pressure', 'Aspirin 75mg (Enteric Coated)', 'USV Limited', 'Tablet', '75mg', 28.00),
('Shelcal 500', 'Calcium + Vitamin D3', 'Supplement', 'Calcium Carbonate 1250mg + Vitamin D3 250 IU', 'Torrent Pharma', 'Tablet', '500mg', 115.00),
('Becosules', 'B-Complex + Vitamin C', 'Supplement', 'Vitamin B Complex + Vitamin C + Folic Acid', 'Pfizer', 'Capsule', '1 dose', 38.00),
('Cetirizine DT', 'Cetirizine', 'Allergy Relief', 'Cetirizine Hydrochloride 10mg', 'Dr. Reddys', 'Tablet', '10mg', 25.00),
('Allegra 120', 'Fexofenadine', 'Allergy Relief', 'Fexofenadine Hydrochloride 120mg', 'Sanofi India', 'Tablet', '120mg', 160.00),
('Pan D', 'Pantoprazole + Domperidone', 'Antacid', 'Pantoprazole 40mg + Domperidone 30mg', 'Alkem Labs', 'Tablet', '40mg+30mg', 95.00),
('Telma 40', 'Telmisartan', 'Hypertension', 'Telmisartan 40mg', 'Glenmark', 'Tablet', '40mg', 88.00),
('Atorva 10', 'Atorvastatin', 'Cholesterol', 'Atorvastatin Calcium 10mg', 'Zydus Healthcare', 'Tablet', '10mg', 62.00),
('Escitalopram', 'Escitalopram', 'Antidepressant', 'Escitalopram Oxalate 10mg', 'Sun Pharma', 'Tablet', '10mg', 78.00),
('Fluconazole', 'Fluconazole', 'Antifungal', 'Fluconazole 150mg', 'Cipla', 'Tablet', '150mg', 45.00);

-- Insert sample stores
INSERT INTO stores (name, address, city, state, zipCode, latitude, longitude) VALUES
('MetroCare Pharmacy', '14 Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', 19.0600, 72.8295),
('City Health Store', '78 SV Road, Kandivali West', 'Mumbai', 'Maharashtra', '400067', 19.2183, 72.8567),
('Central Medicals', '102 Thane-Belapur Road, Navi Mumbai', 'Mumbai', 'Maharashtra', '400709', 19.0728, 73.0150),
('GreenLife Pharmacy', '25 MG Road, Pune', 'Pune', 'Maharashtra', '411001', 18.5204, 73.8567),
('HealWell Chemist', '9 FC Road, Pune', 'Pune', 'Maharashtra', '411004', 18.5167, 73.8567),
('CarePlus Pharmacy', '42 Residency Road, Nagpur', 'Nagpur', 'Maharashtra', '440001', 21.1458, 79.0882);

-- Insert sample inventory for multiple stores in the same city
INSERT INTO inventory (store_id, medicine_id, quantity) VALUES
(1, 1, 50),(1, 2, 30),(1, 5, 20),(1, 10, 15),(1, 14, 40),
(2, 1, 20),(2, 3, 25),(2, 6, 10),(2, 11, 35),(2, 15, 22),
(3, 2, 10),(3, 4, 18),(3, 7, 5),(3, 9, 28),(3, 13, 12),
(4, 8, 40),(4, 9, 30),(4, 12, 18),(4, 16, 22),(4, 18, 14),
(5, 5, 20),(5, 10, 26),(5, 14, 8),(5, 17, 19),(5, 20, 16),
(6, 1, 15),(6, 7, 7),(6, 11, 18),(6, 13, 30),(6, 19, 20);

-- Insert sample users
INSERT INTO users (name, email, phone) VALUES
('Rohan Sharma', 'rohan.sharma@example.com', '+919898989898'),
('Sneha Patel', 'sneha.patel@example.com', '+919123456789');

-- Insert sample orders and order items
INSERT INTO orders (user_id, store_id, total_amount, status) VALUES
(1, 1, 150.00, 'placed'),
(2, 4, 235.00, 'completed');

INSERT INTO order_items (order_id, medicine_id, quantity, unit_price) VALUES
(1, 1, 2, 30.00),
(1, 5, 1, 45.00),
(2, 8, 2, 55.00),
(2, 10, 1, 48.00),
(2, 17, 1, 88.00);

-- Verify data
SELECT COUNT(*) AS total_medicines FROM medicines;
SELECT COUNT(*) AS total_stores FROM stores;
SELECT SUM(quantity) AS total_stock FROM inventory;
SELECT COUNT(*) AS total_orders FROM orders;
SELECT DISTINCT city FROM stores ORDER BY city;
