#!/bin/bash

echo "=========================================="
echo "  DBMS MINI PROJECT - DATABASE FEATURES"
echo "=========================================="
echo ""

DB_NAME="wine_coffee_db"
DB_USER="root"
DB_PASS="MyNewPass123!"

echo "1. SHOWING ALL TRIGGERS IN DATABASE"
echo "====================================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SHOW TRIGGERS;" | cat

echo ""
echo "2. SHOWING ALL STORED PROCEDURES"
echo "================================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SHOW PROCEDURE STATUS WHERE db = '$DB_NAME';" | cat

echo ""
echo "3. SHOWING ALL FUNCTIONS"
echo "========================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SHOW FUNCTION STATUS WHERE db = '$DB_NAME';" | cat

echo ""
echo "4. SHOWING TRIGGER DETAILS"
echo "=========================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "
SELECT 
    TRIGGER_NAME as 'Trigger Name',
    EVENT_MANIPULATION as 'Event',
    EVENT_OBJECT_TABLE as 'Table',
    ACTION_STATEMENT as 'Action'
FROM information_schema.TRIGGERS 
WHERE TRIGGER_SCHEMA = '$DB_NAME';" | cat

echo ""
echo "5. SHOWING PROCEDURE DETAILS"
echo "============================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "
SELECT 
    ROUTINE_NAME as 'Procedure Name',
    ROUTINE_TYPE as 'Type',
    CREATED as 'Created'
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = '$DB_NAME' AND ROUTINE_TYPE = 'PROCEDURE';" | cat

echo ""
echo "6. SHOWING FUNCTION DETAILS"
echo "==========================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "
SELECT 
    ROUTINE_NAME as 'Function Name',
    ROUTINE_TYPE as 'Type',
    CREATED as 'Created'
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = '$DB_NAME' AND ROUTINE_TYPE = 'FUNCTION';" | cat

echo ""
echo "7. EXECUTING STORED PROCEDURE - Get Red Wines"
echo "============================================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetWinesByType('red');" | cat

echo ""
echo "8. EXECUTING STORED PROCEDURE - Get Light Roast Coffees"
echo "======================================================"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetCoffeesByRoastLevel('light');" | cat

echo ""
echo "9. EXECUTING STORED PROCEDURE - Get Top 5 Rated Wines"
echo "====================================================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetTopRatedWines(5);" | cat

echo ""
echo "10. EXECUTING STORED PROCEDURE - Get Top 5 Rated Coffees"
echo "========================================================"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetTopRatedCoffees(5);" | cat

echo ""
echo "11. TESTING DATABASE OPERATIONS - COUNT WINES AND COFFEES"
echo "========================================================="
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "
SELECT 'Total Wines' as Item, COUNT(*) as Count FROM wines
UNION ALL
SELECT 'Total Coffees', COUNT(*) FROM coffees
UNION ALL
SELECT 'Total Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Total Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Total Reviews', COUNT(*) FROM reviews;" | cat

echo ""
echo "=========================================="
echo "  DEMO COMPLETE"
echo "=========================================="
