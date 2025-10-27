# 🚀 Terminal Commands to View All DBMS Features

## Quick Start Commands

### 1. View All Triggers
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW TRIGGERS;"
```

### 2. View All Procedures
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW PROCEDURE STATUS WHERE db = 'wine_coffee_db';"
```

### 3. View All Functions
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SHOW FUNCTION STATUS WHERE db = 'wine_coffee_db';"
```

---

## Detailed View Commands

### View All Triggers with Details
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

### View All Procedures with Details
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    ROUTINE_NAME as 'Procedure Name',
    ROUTINE_DEFINITION as 'Definition'
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'PROCEDURE';"
```

### View All Functions with Details
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "
SELECT 
    ROUTINE_NAME as 'Function Name',
    ROUTINE_DEFINITION as 'Definition'
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'FUNCTION';"
```

---

## Quick Count Commands

### Count All Triggers
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT COUNT(*) as 'Total Triggers' FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'wine_coffee_db';"
```

### Count All Procedures
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT COUNT(*) as 'Total Procedures' FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'PROCEDURE';"
```

### Count All Functions
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT COUNT(*) as 'Total Functions' FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'FUNCTION';"
```

---

## All-in-One Command

### View Everything at Once
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db << 'EOF'
SELECT 'TRIGGERS' as 'Feature Type', COUNT(*) as 'Count' FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'wine_coffee_db'
UNION ALL
SELECT 'PROCEDURES', COUNT(*) FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'PROCEDURE'
UNION ALL
SELECT 'FUNCTIONS', COUNT(*) FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'FUNCTION';
EOF
```

---

## Run Automated Demo Script

```bash
./show_dbms_features.sh
```

---

## Test Specific Procedures

### Test Get Red Wines
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetWinesByType('red');" | cat
```

### Test Get Light Roast Coffees
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetCoffeesByRoastLevel('light');" | cat
```

### Test Get Top Rated Wines
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetTopRatedWines(5);" | cat
```

### Test Get Top Rated Coffees
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetTopRatedCoffees(5);" | cat
```

### Test Get Pairings
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetPairings();" | cat
```

### Test Get Total Sales
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "CALL GetTotalSales();" | cat
```

---

## Test Functions

### Test Calculate Order Total
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT CalculateOrderTotal(1) as 'Order Total';" | cat
```

### Test Get Average Rating
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT GetAverageRating(1, 'wine') as 'Avg Rating';" | cat
```

### Test Get Wine Total Sales
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT GetWineTotalSales(1) as 'Total Sales';" | cat
```

---

## Interactive MySQL Session

Start an interactive session to explore:
```bash
mysql -u root -p'MyNewPass123!' wine_coffee_db
```

Then run:
```sql
-- List all triggers
SHOW TRIGGERS\G

-- List all procedures
SHOW PROCEDURE STATUS WHERE db = 'wine_coffee_db'\G

-- List all functions
SHOW FUNCTION STATUS WHERE db = 'wine_coffee_db'\G

-- Exit
exit;
```

---

## Summary View (Simple)

```bash
echo "=== TRIGGERS ===" && mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'wine_coffee_db';" && echo "" && echo "=== PROCEDURES ===" && mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT ROUTINE_NAME FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'PROCEDURE';" && echo "" && echo "=== FUNCTIONS ===" && mysql -u root -p'MyNewPass123!' wine_coffee_db -e "SELECT ROUTINE_NAME FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'FUNCTION';"
```



