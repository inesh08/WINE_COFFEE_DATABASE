# DBMS Mini Project - Database Features Demonstration

## Quick Commands to Show Triggers, Procedures, Functions, and Queries

### Prerequisites
- MySQL is running
- Database: `wine_coffee_db`
- MySQL User: `root`
- Password: `MyNewPass123!`

---

## 🚀 **Start Frontend and Backend**

### Start Backend Server
```bash
cd backend
python app.py
```
Backend runs on: `http://localhost:5000`

### Start Frontend React App
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

**Note:** Run both in separate terminal windows/tabs!

### Quick Start (Both Servers in One Command)
```bash
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend  
cd frontend && npm start
```

---

## 📋 **All-in-One Command**

Run the automated script to see everything:
```bash
./show_dbms_features.sh
```

---

## 🔍 **Individual Commands**

### 1. Show All Triggers
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW TRIGGERS;"
```

### 2. Show Triggers with Details
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    TRIGGER_NAME as 'Trigger Name',
    EVENT_MANIPULATION as 'Event',
    EVENT_OBJECT_TABLE as 'Table',
    ACTION_STATEMENT as 'Action'
FROM information_schema.TRIGGERS 
WHERE TRIGGER_SCHEMA = 'wine_coffee_db';"
```

### 3. Show All Stored Procedures
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW PROCEDURE STATUS WHERE db = 'wine_coffee_db';"
```

### 4. Show All Functions
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW FUNCTION STATUS WHERE db = 'wine_coffee_db';"
```

### 5. Show Procedure Definitions
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    ROUTINE_NAME as 'Procedure Name',
    ROUTINE_DEFINITION as 'Definition'
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'PROCEDURE';"
```

### 6. Show Function Definitions
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    ROUTINE_NAME as 'Function Name',
    ROUTINE_DEFINITION as 'Definition'
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'FUNCTION';"
```

---

## ⚙️ **Execute Stored Procedures**

### 7. Get Red Wines
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetWinesByType('red');"
```

### 8. Get White Wines
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetWinesByType('white');"
```

### 9. Get Light Roast Coffees
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetCoffeesByRoastLevel('light');"
```

### 10. Get Medium Roast Coffees
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetCoffeesByRoastLevel('medium');"
```

### 11. Get Top 5 Rated Wines
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetTopRatedWines(5);"
```

### 12. Get Top 5 Rated Coffees
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetTopRatedCoffees(5);"
```

### 13. Get Pairings
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetPairings();"
```

### 14. Get Total Sales
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetTotalSales();"
```

### 15. Get Customer Orders
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetCustomerOrders(1);"
```

---

## 📊 **SQL Queries**

### 16. Query All Wines
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT * FROM wines LIMIT 10;"
```

### 17. Query All Coffees
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT * FROM coffees LIMIT 10;"
```

### 18. Query All Orders
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT * FROM orders LIMIT 10;"
```

### 19. Query All Customers
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT * FROM customers;"
```

### 20. Query All Reviews
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT * FROM reviews LIMIT 10;"
```

### 21. Query Order Details with Customers
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    o.id as order_id,
    o.order_date,
    o.total_amount,
    c.name as customer_name,
    c.email
FROM orders o
JOIN customers c ON o.customer_id = c.id
LIMIT 10;"
```

### 22. Query Reviews with Product Names
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    r.id,
    r.rating,
    r.comment,
    COALESCE(w.name, c.name) as product_name,
    CASE WHEN r.wine_id IS NOT NULL THEN 'Wine' ELSE 'Coffee' END as type
FROM reviews r
LEFT JOIN wines w ON r.wine_id = w.id
LEFT JOIN coffees c ON r.coffee_id = c.id
LIMIT 10;"
```

---

## 🗄️ **Database Operations**

### 23. Count Records in All Tables
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 'Total Wines' as Item, COUNT(*) as Count FROM wines
UNION ALL
SELECT 'Total Coffees', COUNT(*) FROM coffees
UNION ALL
SELECT 'Total Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Total Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Total Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Total Pairings', COUNT(*) FROM pairings;"
```

### 24. Show Table Structures
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "DESCRIBE wines;"
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "DESCRIBE coffees;"
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "DESCRIBE orders;"
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "DESCRIBE reviews;"
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "DESCRIBE pairings;"
```

### 25. Show All Tables
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW TABLES;"
```

---

## 🎯 **Advanced Queries**

### 26. Average Rating by Wine Type
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    w.type,
    COUNT(r.id) as review_count,
    AVG(r.rating) as avg_rating
FROM wines w
LEFT JOIN reviews r ON r.wine_id = w.id
GROUP BY w.type;"
```

### 27. Most Expensive Wines
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT name, type, region, country, price 
FROM wines 
ORDER BY price DESC 
LIMIT 10;"
```

### 28. Most Expensive Coffees
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT name, type, origin, country, price 
FROM coffees 
ORDER BY price DESC 
LIMIT 10;"
```

### 29. Orders with Highest Total
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT o.id, o.order_date, o.total_amount, c.name as customer_name
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.total_amount DESC
LIMIT 10;"
```

### 30. Wine-Coffee Pairings with Scores
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    p.id,
    w.name as wine_name,
    c.name as coffee_name,
    p.pairing_score,
    p.description
FROM pairings p
JOIN wines w ON p.wine_id = w.id
JOIN coffees c ON p.coffee_id = c.id
ORDER BY p.pairing_score DESC
LIMIT 10;"
```

---

## 🧪 **Testing Triggers via UI**

### Using the Demo UI Page

1. **Start the backend server (Terminal 1):**
   ```bash
   cd backend && python app.py
   ```
   Backend runs on: `http://localhost:5000`

2. **Start the frontend (Terminal 2):**
   ```bash
   cd frontend && npm start
   ```
   Frontend runs on: `http://localhost:3000`

3. **Navigate to:**
   - Home Page: `http://localhost:3000`
   - DBMS Demo: `http://localhost:3000/demo`
   - Wine Search: `http://localhost:3000/wines`
   - Coffee Search: `http://localhost:3000/coffees`

4. **Test Triggers:**
   - Click "Test Order Total Trigger" to see automatic calculation
   - Click "Test Rating Validation Trigger" to see validation in action

5. **Execute Procedures:**
   - Click buttons like "Get Red Wines", "Get Top Rated Wines", etc.
   - View results in JSON format

6. **Run Queries:**
   - Click "Query All Wines", "Query All Coffees", etc.
   - View all data returned

7. **Database Operations:**
   - Fill in the "Add Customer" form
   - Click "Add Customer" to use stored procedure

---

## 📝 **Summary of Database Features**

### Triggers
- `calculate_order_total_wines` - Auto-calculates order totals when wines are added
- `calculate_order_total_coffees` - Auto-calculates order totals when coffees are added
- `validate_wine_rating` - Validates wine ratings (1-5)
- `validate_coffee_rating` - Validates coffee ratings (1-5)
- `validate_pairing_score` - Validates pairing scores (0-10)

### Stored Procedures
- `GetWinesByType` - Get wines by type (red, white, etc.)
- `GetCoffeesByRoastLevel` - Get coffees by roast level
- `GetTopRatedWines` - Get top N rated wines
- `GetTopRatedCoffees` - Get top N rated coffees
- `GetPairings` - Get all wine-coffee pairings
- `AddCustomer` - Add a new customer
- `GetCustomerOrders` - Get orders for a customer
- `GetTotalSales` - Calculate total sales

### SQL Queries
- Select all records from wines, coffees, orders, customers, reviews
- Join operations across multiple tables
- Aggregate functions (COUNT, AVG, SUM)
- Ordering and limiting results

### Database Operations
- INSERT operations via stored procedures
- UPDATE operations with triggers
- SELECT queries with various filters
- JOIN operations for complex data retrieval

---

## 🚀 **Quick Start for Demonstration**

For your submission, you can demonstrate:

1. **Via Command Line:**
   ```bash
   ./show_dbms_features.sh
   ```

2. **Via UI (Recommended):**
   - Open `http://localhost:3000/demo`
   - Click buttons to test all features
   - Show the results to evaluators

3. **Via API Calls:**
   ```bash
   # Test Order Total Trigger
   curl http://localhost:5000/api/test/triggers/order-total
   
   # Test Rating Validation Trigger
   curl http://localhost:5000/api/test/triggers/rating-validation
   
   # Get Red Wines via Procedure
   curl http://localhost:5000/api/procedures/wines
   
   # Query All Wines
   curl http://localhost:5000/api/queries/all-wines
   ```

---

## 📸 **Screenshots for Documentation**

Consider taking screenshots of:
1. Trigger test results (order total calculation)
2. Stored procedure results (top-rated wines)
3. Database queries showing all wines/coffees
4. Add customer operation via UI
5. API responses in JSON format

---

## ✅ **Checklist for Submission**

- [ ] Triggers are implemented and testable
- [ ] Stored procedures can be executed
- [ ] Functions work correctly
- [ ] SQL queries return proper results
- [ ] UI demonstrates all features
- [ ] All database operations are functional
- [ ] Documentation is complete
- [ ] Code is clean and commented

---

**Good luck with your submission! 🎉**
