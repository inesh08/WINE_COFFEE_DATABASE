-- Wine & Coffee Database Schema

-- ==========================================
-- Core Business Entities (Customers/Suppliers)
-- ==========================================

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table removed

-- Users table removed

-- Wines table
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
    -- created_at removed
    -- supplier_id removed
    -- description removed
    -- body_level removed
    -- tannin_level removed
    created_at TIMESTAMP NULL
);

-- Coffees table
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
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

-- Pairings table
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

-- User preferences table removed

-- ===========================
-- Orders and Payments
-- ===========================

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2) DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_mode ENUM('cash','card','upi','netbanking') NOT NULL,
    payment_status ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Order_Wines associative table (M:N)
CREATE TABLE IF NOT EXISTS order_wines (
    order_id INT NOT NULL,
    wine_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, wine_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (wine_id) REFERENCES wines(id) ON DELETE CASCADE
);

-- Order_Coffees associative table (M:N)
CREATE TABLE IF NOT EXISTS order_coffees (
    order_id INT NOT NULL,
    coffee_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, coffee_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (coffee_id) REFERENCES coffees(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_wines_type ON wines(type);
CREATE INDEX idx_wines_region ON wines(region);
CREATE INDEX idx_coffees_type ON coffees(type);
CREATE INDEX idx_coffees_origin ON coffees(origin);
CREATE INDEX idx_reviews_wine ON reviews(wine_id);
CREATE INDEX idx_reviews_coffee ON reviews(coffee_id);
CREATE INDEX idx_pairings_wine ON pairings(wine_id);
CREATE INDEX idx_pairings_coffee ON pairings(coffee_id); 

-- Additional indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_wines_order ON order_wines(order_id);
CREATE INDEX idx_order_coffees_order ON order_coffees(order_id);

-- ===========================
-- Normalization Additions (to align with ERD)
-- ===========================

-- Regions (country/region/climate etc.)
CREATE TABLE IF NOT EXISTS regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(80) NOT NULL,
    region_name VARCHAR(120) NOT NULL,
    climate VARCHAR(120),
    UNIQUE KEY uniq_country_region (country, region_name)
);

-- Products supertype
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_type ENUM('wine','coffee') NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    base_price DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unified order items referencing products
CREATE TABLE IF NOT EXISTS order_items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Grape varieties and mapping to wines
CREATE TABLE IF NOT EXISTS grape_varieties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) UNIQUE NOT NULL,
    characteristics TEXT
);

CREATE TABLE IF NOT EXISTS wine_grape_varieties (
    wine_id INT NOT NULL,
    grape_variety_id INT NOT NULL,
    percentage DECIMAL(5,2), -- optional composition percentage
    PRIMARY KEY (wine_id, grape_variety_id),
    FOREIGN KEY (wine_id) REFERENCES wines(id) ON DELETE CASCADE,
    FOREIGN KEY (grape_variety_id) REFERENCES grape_varieties(id) ON DELETE RESTRICT
);

-- Brands, Blends and Brand Combinations
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

-- ===========================
-- Alter existing tables to link to new entities (non-breaking)
-- ===========================

-- Suppliers link removed

-- Wines link to product, region, brand, blend
ALTER TABLE wines
    ADD COLUMN IF NOT EXISTS product_id INT NULL,
    ADD COLUMN IF NOT EXISTS region_id INT NULL,
    ADD COLUMN IF NOT EXISTS brand_id INT NULL,
    ADD COLUMN IF NOT EXISTS blend_id INT NULL,
    ADD CONSTRAINT fk_wines_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_wines_region FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_wines_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_wines_blend FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE SET NULL;

-- Coffees link to product, region, brand, blend
ALTER TABLE coffees
    ADD COLUMN IF NOT EXISTS product_id INT NULL,
    ADD COLUMN IF NOT EXISTS region_id INT NULL,
    ADD COLUMN IF NOT EXISTS brand_id INT NULL,
    ADD COLUMN IF NOT EXISTS blend_id INT NULL,
    ADD CONSTRAINT fk_coffees_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_coffees_region FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_coffees_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_coffees_blend FOREIGN KEY (blend_id) REFERENCES blends(id) ON DELETE SET NULL;

-- Reviews optionally tied to customers (besides users)
ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS customer_id INT NULL,
    ADD CONSTRAINT fk_reviews_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Helpful indexes for new structures
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_regions_country_region ON regions(country, region_name);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wine_grapes_wine ON wine_grape_varieties(wine_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_region ON suppliers(region_id);
CREATE INDEX IF NOT EXISTS idx_wines_product ON wines(product_id);
CREATE INDEX IF NOT EXISTS idx_wines_region_id ON wines(region_id);