#!/bin/bash

echo "=========================================================="
echo "   VIEW ALL QUERIES - TERMINAL COMMANDS"
echo "=========================================================="
echo ""

DB_USER="root"
DB_PASS="MyNewPass123!"
DB_NAME="wine_coffee_db"

echo "1. VIEW ALL TRIGGERS:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT TRIGGER_NAME as 'Triggers' FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = '$DB_NAME';"

echo ""
echo "2. VIEW ALL PROCEDURES:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT ROUTINE_NAME as 'Procedures' FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = '$DB_NAME' AND ROUTINE_TYPE = 'PROCEDURE';"

echo ""
echo "3. VIEW ALL FUNCTIONS:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT ROUTINE_NAME as 'Functions' FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = '$DB_NAME' AND ROUTINE_TYPE = 'FUNCTION';"

echo ""
echo "4. QUERY - ALL WINES (first 5):"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT id, name, type, price FROM wines LIMIT 5;"

echo ""
echo "5. QUERY - ALL COFFEES (first 5):"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT id, name, type, price FROM coffees LIMIT 5;"

echo ""
echo "6. QUERY - ALL ORDERS:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT * FROM orders;"

echo ""
echo "7. QUERY - ALL CUSTOMERS:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT * FROM customers;"

echo ""
echo "8. QUERY - ALL REVIEWS:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT * FROM reviews;"

echo ""
echo "9. PROCEDURE - Get Red Wines:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetWinesByType('red');" | head -10

echo ""
echo "10. PROCEDURE - Get Light Roast Coffees:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetCoffeesByRoastLevel('light');" | head -10

echo ""
echo "11. PROCEDURE - Get Top Rated Wines (top 5):"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetTopRatedWines(5);"

echo ""
echo "12. PROCEDURE - Get Top Rated Coffees (top 5):"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetTopRatedCoffees(5);"

echo ""
echo "13. PROCEDURE - Get Total Sales:"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "CALL GetTotalSales();"

echo ""
echo "14. FUNCTION - Calculate Order Total (order_id=1):"
echo "----------------------------------------------------------"
mysql -u$DB_USER -p$DB_PASS $DB_NAME -e "SELECT CalculateOrderTotal(1) as 'Order Total';"

echo ""
echo "=========================================================="
echo "   COMPLETE!"
echo "=========================================================="



