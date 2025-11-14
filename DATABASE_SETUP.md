# Database Setup Guide

This guide provides step-by-step MySQL commands to create all tables for the Wine & Coffee Database.

## Prerequisites

1. MySQL server running
2. Database created (e.g., `wine_coffee_db`)
3. MySQL client access

## Step-by-Step Table Creation

### 1. Connect to MySQL and Select Database

```sql
-- Connect to MySQL (replace with your credentials)
mysql -u root -p

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS wine_coffee_db;

-- Use the database
USE wine_coffee_db;
```

### 2. Create Core Business Entity Tables

#### Customers Table
```sql
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

<!-- Suppliers table removed -->

<!-- Users table removed -->

### 3. Create Product Tables

#### Wines Table
```sql
CREATE TABLE IF NOT EXISTS wines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- red, white, rose, sparkling
    region VARCHAR(100),
    country VARCHAR(50),
    vintage INT,
    price DECIMAL(10,2),
    alcohol_content DECIMAL(4,2),
    acidity_level ENUM('low', 'medium', 'high'),
    sweetness_level ENUM('dry', 'off-dry', 'semi-sweet', 'sweet'),
    product_id INT NULL,
    region_id INT NULL,
    created_at TIMESTAMP NULL
);
```

#### Coffees Table
```sql
CREATE TABLE IF NOT EXISTS coffees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- arabica, robusta, blend
    origin VARCHAR(100),
    country VARCHAR(50),
    roast_level ENUM('light', 'medium', 'medium-dark', 'dark'),
    price DECIMAL(10,2),
    description TEXT,
    acidity_level ENUM('low', 'medium', 'high'),
    -- body_level removed
    -- flavor_notes removed
    -- processing_method removed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Create Review and Preference Tables

#### Reviews Table
```sql
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wine_id INT,
    coffee_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wine_id) REFERENCES wines(id) ON DELETE CASCADE,
    FOREIGN KEY (coffee_id) REFERENCES coffees(id) ON DELETE CASCADE,
    CHECK ((wine_id IS NOT NULL AND coffee_id IS NULL) OR (wine_id IS NULL AND coffee_id IS NOT NULL))
);
```

#### Pairings Table
```sql
CREATE TABLE IF NOT EXISTS pairings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wine_id INT NOT NULL,
    coffee_id INT NOT NULL,
    pairing_score DECIMAL(3,2) CHECK (pairing_score >= 0 AND pairing_score <= 10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wine_id) REFERENCES wines(id) ON DELETE CASCADE,
    FOREIGN KEY (coffee_id) REFERENCES coffees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_pairing (wine_id, coffee_id)
);
```

<!-- User preferences table removed -->

### 5. Create Order and Payment Tables

#### Orders Table
```sql
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2) DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

#### Payments Table
```sql
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_mode ENUM('cash','card','upi','netbanking') NOT NULL,
    payment_status ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### Order-Wines Junction Table
```sql
CREATE TABLE IF NOT EXISTS order_wines (
    order_id INT NOT NULL,
    wine_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, wine_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (wine_id) REFERENCES wines(id) ON DELETE CASCADE
);
```

#### Order-Coffees Junction Table
```sql
CREATE TABLE IF NOT EXISTS order_coffees (
    order_id INT NOT NULL,
    coffee_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, coffee_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (coffee_id) REFERENCES coffees(id) ON DELETE CASCADE
);
```

### 6. Create Performance Indexes

#### Product Indexes
```sql
CREATE INDEX idx_wines_type ON wines(type);
CREATE INDEX idx_wines_region ON wines(region);
CREATE INDEX idx_coffees_type ON coffees(type);
CREATE INDEX idx_coffees_origin ON coffees(origin);
```

#### Review Indexes
```sql
CREATE INDEX idx_reviews_wine ON reviews(wine_id);
CREATE INDEX idx_reviews_coffee ON reviews(coffee_id);
```

#### Pairing Indexes
```sql
CREATE INDEX idx_pairings_wine ON pairings(wine_id);
CREATE INDEX idx_pairings_coffee ON pairings(coffee_id);
```

#### Order Indexes
```sql
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_wines_order ON order_wines(order_id);
CREATE INDEX idx_order_coffees_order ON order_coffees(order_id);
```

### 7. Normalization Additions (Align with ERD)

#### Regions
```sql
CREATE TABLE IF NOT EXISTS regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(80) NOT NULL,
    region_name VARCHAR(120) NOT NULL,
    climate VARCHAR(120),
    UNIQUE KEY uniq_country_region (country, region_name)
);
```

#### Products Supertype and Unified Order Items
```sql
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_type ENUM('wine','coffee') NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    base_price DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
```

#### Grape Varieties and Mapping to Wines
```sql
CREATE TABLE IF NOT EXISTS grape_varieties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) UNIQUE NOT NULL,
    characteristics TEXT
);

CREATE TABLE IF NOT EXISTS wine_grape_varieties (
    wine_id INT NOT NULL,
    grape_variety_id INT NOT NULL,
    percentage DECIMAL(5,2),
    PRIMARY KEY (wine_id, grape_variety_id),
    FOREIGN KEY (wine_id) REFERENCES wines(id) ON DELETE CASCADE,
    FOREIGN KEY (grape_variety_id) REFERENCES grape_varieties(id) ON DELETE RESTRICT
);
```

#### Brands, Blends, and Brand Combinations
```sql
CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(120) UNIQUE NOT NULL,
    headquarters VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS blends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blend_name VARCHAR(120) UNIQUE NOT NULL,
    blend_age INT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS brand_combinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    related_brand_id INT NOT NULL,
    UNIQUE KEY uniq_brand_pair (brand_id, related_brand_id),
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
    FOREIGN KEY (related_brand_id) REFERENCES brands(id) ON DELETE CASCADE
);
```

#### Alter Existing Tables to Link to New Entities
```sql
-- Suppliers link removed

ALTER TABLE wines
    ADD COLUMN IF NOT EXISTS product_id INT NULL,
    ADD COLUMN IF NOT EXISTS region_id INT NULL,
    ADD COLUMN IF NOT EXISTS brand_id INT NULL,
    ADD COLUMN IF NOT EXISTS blend_id INT NULL,
    ADD CONSTRAINT fk_wines_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_wines_region FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_wines_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_wines_blend FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE SET NULL;

ALTER TABLE coffees
    ADD COLUMN IF NOT EXISTS product_id INT NULL,
    ADD COLUMN IF NOT EXISTS region_id INT NULL,
    ADD COLUMN IF NOT EXISTS brand_id INT NULL,
    ADD COLUMN IF NOT EXISTS blend_id INT NULL,
    ADD CONSTRAINT fk_coffees_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_coffees_region FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_coffees_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_coffees_blend FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE SET NULL;

ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS customer_id INT NULL,
    ADD CONSTRAINT fk_reviews_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_regions_country_region ON regions(country, region_name);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wine_grapes_wine ON wine_grape_varieties(wine_id);
CREATE INDEX IF NOT EXISTS idx_wines_product ON wines(product_id);
CREATE INDEX IF NOT EXISTS idx_wines_region_id ON wines(region_id);
```

### 8. Verify Table Creation

```sql
-- Show all tables
SHOW TABLES;

-- Check table structure
DESCRIBE wines;
DESCRIBE coffees;
DESCRIBE reviews;
DESCRIBE orders;
DESCRIBE products;
DESCRIBE order_items;
DESCRIBE regions;
DESCRIBE grape_varieties;
DESCRIBE wine_grape_varieties;
DESCRIBE brands;
DESCRIBE blends;
DESCRIBE brand_combinations;
```

### 9. Insert Sample Data (Optional)

<!-- Sample Suppliers removed -->

<!-- Sample Users removed -->

#### Sample Wines
```sql
INSERT INTO wines (name, type, region, country, vintage, price) VALUES
('Cabernet Sauvignon Reserve', 'red', 'Napa Valley', 'USA', 2020, 89.99),
('Chardonnay Classic', 'white', 'Sonoma County', 'USA', 2021, 45.99);
```

#### Sample Coffees
```sql
INSERT INTO coffees (name, type, origin, country, roast_level, price) VALUES
('Ethiopian Yirgacheffe', 'arabica', 'Yirgacheffe', 'Ethiopia', 'light', 24.99),
('Colombian Supremo', 'arabica', 'Huila', 'Colombia', 'medium', 19.99);
```

## Database Configuration

Update your backend configuration in `backend/config.py`:

```python
MYSQL_HOST = 'localhost'
MYSQL_PORT = 3306
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'your_password'
MYSQL_DATABASE = 'wine_coffee_db'
```

## Troubleshooting

1. **Foreign Key Errors**: Ensure tables are created in the correct order (regions and products before wines/coffees)
2. **Permission Issues**: Make sure your MySQL user has CREATE and ALTER privileges
3. **Character Set**: If you encounter encoding issues, add `DEFAULT CHARSET=utf8mb4` to table creation

## Complete Setup Script

You can also run the entire schema at once by executing the `backend/db/schema.sql` file:

```bash
mysql -u root -p wine_coffee_db < backend/db/schema.sql
```
