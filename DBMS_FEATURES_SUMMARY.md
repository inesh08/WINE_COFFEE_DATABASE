# DBMS Mini Project - Complete Database Features Summary

## Overview
This document provides a complete summary of all database triggers, stored procedures, and functions implemented in the Wine & Coffee Database.

---

## 📊 **TOTAL DATABASE FEATURES**

- **Triggers**: 11 triggers
- **Stored Procedures**: 13 procedures  
- **Functions**: 5 functions
- **Total DBMS Features**: 29 features

---

## 🔔 **TRIGGERS (11 total)**

### 1. **wines_update_timestamp**
- **Purpose**: Preserves `created_at` timestamp when updating wines
- **Trigger**: BEFORE UPDATE
- **Table**: wines

### 2. **coffees_update_timestamp**
- **Purpose**: Preserves `created_at` timestamp when updating coffees
- **Trigger**: BEFORE UPDATE
- **Table**: coffees

### 3. **calculate_order_total_wines**
- **Purpose**: Automatically calculates order total when wines are added
- **Trigger**: AFTER INSERT
- **Table**: order_wines

### 4. **calculate_order_total_wines_update**
- **Purpose**: Recalculates order total when wine quantities are updated
- **Trigger**: AFTER UPDATE
- **Table**: order_wines

### 5. **calculate_order_total_wines_delete**
- **Purpose**: Recalculates order total when wines are removed
- **Trigger**: AFTER DELETE
- **Table**: order_wines

### 6. **calculate_order_total_coffees**
- **Purpose**: Automatically calculates order total when coffees are added
- **Trigger**: AFTER INSERT
- **Table**: order_coffees

### 7. **calculate_order_total_coffees_update**
- **Purpose**: Recalculates order total when coffee quantities are updated
- **Trigger**: AFTER UPDATE
- **Table**: order_coffees

### 8. **calculate_order_total_coffees_delete**
- **Purpose**: Recalculates order total when coffees are removed
- **Trigger**: AFTER DELETE
- **Table**: order_coffees

### 9. **validate_wine_rating**
- **Purpose**: Validates wine ratings are between 1-5
- **Trigger**: BEFORE INSERT
- **Table**: reviews
- **Validation**: Raises error if rating < 1 or > 5 for wines

### 10. **validate_coffee_rating**
- **Purpose**: Validates coffee ratings are between 1-5
- **Trigger**: BEFORE INSERT
- **Table**: reviews
- **Validation**: Raises error if rating < 1 or > 5 for coffees

### 11. **validate_pairing_score**
- **Purpose**: Validates pairing scores are between 0-10
- **Trigger**: BEFORE INSERT
- **Table**: pairings
- **Validation**: Raises error if pairing score < 0 or > 10

---

## ⚙️ **STORED PROCEDURES (13 total)**

### 1. **GetWinesByType**
- **Parameters**: `wine_type` (VARCHAR)
- **Purpose**: Retrieves wines filtered by type (red, white, rose, sparkling)
- **Returns**: All wines matching the specified type

### 2. **GetCoffeesByRoastLevel**
- **Parameters**: `roast_level` (VARCHAR)
- **Purpose**: Retrieves coffees filtered by roast level (light, medium, medium-dark, dark)
- **Returns**: All coffees matching the specified roast level

### 3. **GetTopRatedWines**
- **Parameters**: `top_count` (INT)
- **Purpose**: Retrieves top-rated wines based on average ratings and review count
- **Returns**: Top N wines with average ratings and review counts

### 4. **GetTopRatedCoffees**
- **Parameters**: `top_count` (INT)
- **Purpose**: Retrieves top-rated coffees based on average ratings and review count
- **Returns**: Top N coffees with average ratings and review counts

### 5. **GetPairings**
- **Parameters**: None
- **Purpose**: Retrieves all wine-coffee pairings with details
- **Returns**: All pairings with wine and coffee information, sorted by pairing score

### 6. **AddCustomer**
- **Parameters**: `name`, `email`, `phone`, `address`
- **Purpose**: Adds a new customer to the database
- **Returns**: Customer ID

### 7. **GetCustomerOrders**
- **Parameters**: `cust_id` (INT)
- **Purpose**: Retrieves all orders for a specific customer
- **Returns**: Order details with customer information

### 8. **GetTotalSales**
- **Parameters**: None
- **Purpose**: Calculates total sales statistics
- **Returns**: Total orders, items sold, and revenue

### 9. **AddWine**
- **Parameters**: Wine details (name, type, region, country, vintage, price, alcohol, acidity, sweetness)
- **Purpose**: Adds a new wine to the database
- **Returns**: Wine ID

### 10. **AddCoffee**
- **Parameters**: Coffee details (name, type, origin, country, roast_level, price, description, acidity)
- **Purpose**: Adds a new coffee to the database
- **Returns**: Coffee ID

### 11. **CreateOrder**
- **Parameters**: `cust_id` (INT)
- **Purpose**: Creates a new order for a customer
- **Returns**: Order ID

### 12. **AddWineToOrder**
- **Parameters**: `order_id`, `wine_id`, `quantity`, `subtotal`
- **Purpose**: Adds wine to an existing order
- **Returns**: Updates or inserts into order_wines

### 13. **AddCoffeeToOrder**
- **Parameters**: `order_id`, `coffee_id`, `quantity`, `subtotal`
- **Purpose**: Adds coffee to an existing order
- **Returns**: Updates or inserts into order_coffees

---

## 🔧 **FUNCTIONS (5 total)**

### 1. **CalculateOrderTotal**
- **Parameters**: `order_id` (INT)
- **Purpose**: Calculates the total amount for an order
- **Returns**: DECIMAL(12,2)
- **Use Case**: Calculate total from both wines and coffees in an order

### 2. **GetAverageRating**
- **Parameters**: `product_id` (INT), `product_type` (VARCHAR)
- **Purpose**: Calculates average rating for a wine or coffee
- **Returns**: DECIMAL(3,2)
- **Use Case**: Get average rating for any product

### 3. **GetWineTotalSales**
- **Parameters**: `wine_id` (INT)
- **Purpose**: Calculates total sales amount for a specific wine
- **Returns**: DECIMAL(12,2)
- **Use Case**: Track revenue from individual wines

### 4. **GetCoffeeTotalSales**
- **Parameters**: `coffee_id` (INT)
- **Purpose**: Calculates total sales amount for a specific coffee
- **Returns**: DECIMAL(12,2)
- **Use Case**: Track revenue from individual coffees

### 5. **CheckInventoryStatus**
- **Parameters**: `product_id` (INT)
- **Purpose**: Checks if a product is in stock
- **Returns**: VARCHAR(20) - 'IN_STOCK' or 'OUT_OF_STOCK'
- **Use Case**: Inventory management

---

## 📝 **HOW TO VERIFY ALL FEATURES**

### Show All Triggers:
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW TRIGGERS;"
```

### Show All Procedures:
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW PROCEDURE STATUS WHERE db = 'wine_coffee_db';"
```

### Show All Functions:
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW FUNCTION STATUS WHERE db = 'wine_coffee_db';"
```

### Run All-in-One Demo:
```bash
./show_dbms_features.sh
```

---

## 🎯 **HOW TO USE THROUGH UI**

### Start Backend:
```bash
cd backend
python app.py
```
Backend runs on: `http://localhost:5000`

### Start Frontend:
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

### Navigate to Demo Page:
Visit: `http://localhost:3000/demo`

### Test Features:
1. **Triggers**: Click "Test Order Total Trigger" or "Test Rating Validation Trigger"
2. **Procedures**: Click buttons like "Get Red Wines", "Get Light Roast Coffees"
3. **Queries**: Click query buttons to see data
4. **Operations**: Add customers, wines, or coffees using forms

---

## 📄 **IMPORTANT FILES**

- `backend/db/schema.sql` - Database schema
- `backend/db/triggers_procedures_functions.sql` - All triggers, procedures, functions
- `DBMS_DEMO_COMMANDS.md` - Terminal commands for demonstration
- `show_dbms_features.sh` - Automated demo script
- `backend/routes/demo_routes.py` - API endpoints for testing

---

## ✅ **COMPLETE FEATURE LIST**

### Triggers (11):
✅ Timestamp preservation (2)
✅ Order total calculation (6)
✅ Data validation (3)

### Procedures (13):
✅ Product retrieval (4)
✅ Customer operations (2)
✅ Sales analytics (1)
✅ Product creation (2)
✅ Order management (4)

### Functions (5):
✅ Calculations (4)
✅ Inventory checks (1)

---

**Total Database Features Implemented: 29**

