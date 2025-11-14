-- ==========================================
-- DATABASE TRIGGERS, PROCEDURES, AND FUNCTIONS
-- Wine & Coffee Database - DBMS Mini Project
-- ==========================================

USE wine_coffee_db;

-- ==========================================
-- PART 1: TRIGGERS
-- ==========================================

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS wines_update_timestamp;
DROP TRIGGER IF EXISTS coffees_update_timestamp;
DROP TRIGGER IF EXISTS calculate_order_total_wines;
DROP TRIGGER IF EXISTS calculate_order_total_coffees;
DROP TRIGGER IF EXISTS calculate_order_total_wines_update;
DROP TRIGGER IF EXISTS calculate_order_total_coffees_update;
DROP TRIGGER IF EXISTS calculate_order_total_wines_delete;
DROP TRIGGER IF EXISTS calculate_order_total_coffees_delete;
DROP TRIGGER IF EXISTS validate_wine_rating;
DROP TRIGGER IF EXISTS validate_coffee_rating;
DROP TRIGGER IF EXISTS validate_pairing_score;

-- 1. Trigger to preserve created_at timestamp when updating wines
DELIMITER //
CREATE TRIGGER wines_update_timestamp
BEFORE UPDATE ON wines
FOR EACH ROW
BEGIN
    IF NEW.created_at IS NULL THEN
        SET NEW.created_at = OLD.created_at;
    ELSE
        SET NEW.created_at = OLD.created_at;
    END IF;
END//
DELIMITER ;

-- 2. Trigger to preserve created_at timestamp when updating coffees
DELIMITER //
CREATE TRIGGER coffees_update_timestamp
BEFORE UPDATE ON coffees
FOR EACH ROW
BEGIN
    IF NEW.created_at IS NULL THEN
        SET NEW.created_at = OLD.created_at;
    ELSE
        SET NEW.created_at = OLD.created_at;
    END IF;
END//
DELIMITER ;

-- 3. Trigger to automatically calculate order total when wines are added
DELIMITER //
CREATE TRIGGER calculate_order_total_wines
AFTER INSERT ON order_wines
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_wines 
        WHERE order_id = NEW.order_id
    ) + (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_coffees 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END//
DELIMITER ;

-- 4. Trigger to recalculate order total when wines are updated
DELIMITER //
CREATE TRIGGER calculate_order_total_wines_update
AFTER UPDATE ON order_wines
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_wines 
        WHERE order_id = NEW.order_id
    ) + (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_coffees 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END//
DELIMITER ;

-- 5. Trigger to recalculate order total when wines are deleted
DELIMITER //
CREATE TRIGGER calculate_order_total_wines_delete
AFTER DELETE ON order_wines
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_wines 
        WHERE order_id = OLD.order_id
    ) + (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_coffees 
        WHERE order_id = OLD.order_id
    )
    WHERE id = OLD.order_id;
END//
DELIMITER ;

-- 6. Trigger to automatically calculate order total when coffees are added
DELIMITER //
CREATE TRIGGER calculate_order_total_coffees
AFTER INSERT ON order_coffees
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_wines 
        WHERE order_id = NEW.order_id
    ) + (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_coffees 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END//
DELIMITER ;

-- 7. Trigger to recalculate order total when coffees are updated
DELIMITER //
CREATE TRIGGER calculate_order_total_coffees_update
AFTER UPDATE ON order_coffees
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_wines 
        WHERE order_id = NEW.order_id
    ) + (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_coffees 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END//
DELIMITER ;

-- 8. Trigger to recalculate order total when coffees are deleted
DELIMITER //
CREATE TRIGGER calculate_order_total_coffees_delete
AFTER DELETE ON order_coffees
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_wines 
        WHERE order_id = OLD.order_id
    ) + (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM order_coffees 
        WHERE order_id = OLD.order_id
    )
    WHERE id = OLD.order_id;
END//
DELIMITER ;

-- 9. Trigger to validate wine rating is between 1 and 5
DELIMITER //
CREATE TRIGGER validate_wine_rating
BEFORE INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.wine_id IS NOT NULL AND (NEW.rating < 1 OR NEW.rating > 5) THEN 
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Wine rating must be between 1 and 5';
    END IF;
END//
DELIMITER ;

-- 10. Trigger to validate coffee rating is between 1 and 5
DELIMITER //
CREATE TRIGGER validate_coffee_rating
BEFORE INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.coffee_id IS NOT NULL AND (NEW.rating < 1 OR NEW.rating > 5) THEN 
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Coffee rating must be between 1 and 5';
    END IF;
END//
DELIMITER ;

-- 11. Trigger to validate pairing score is between 0 and 10
DELIMITER //
CREATE TRIGGER validate_pairing_score
BEFORE INSERT ON pairings
FOR EACH ROW
BEGIN
    IF NEW.pairing_score < 0 OR NEW.pairing_score > 10 THEN 
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Pairing score must be between 0 and 10';
    END IF;
END//
DELIMITER ;

-- ==========================================
-- PART 2: STORED PROCEDURES
-- ==========================================

-- Drop existing procedures if any
DROP PROCEDURE IF EXISTS GetWinesByType;
DROP PROCEDURE IF EXISTS GetCoffeesByRoastLevel;
DROP PROCEDURE IF EXISTS GetTopRatedWines;
DROP PROCEDURE IF EXISTS GetTopRatedCoffees;
DROP PROCEDURE IF EXISTS GetPairings;
DROP PROCEDURE IF EXISTS AddCustomer;
DROP PROCEDURE IF EXISTS GetCustomerOrders;
DROP PROCEDURE IF EXISTS GetTotalSales;
DROP PROCEDURE IF EXISTS AddWine;
DROP PROCEDURE IF EXISTS AddCoffee;
DROP PROCEDURE IF EXISTS CreateOrder;
DROP PROCEDURE IF EXISTS AddWineToOrder;
DROP PROCEDURE IF EXISTS AddCoffeeToOrder;

-- 1. Procedure to get wines by type
DELIMITER //
CREATE PROCEDURE GetWinesByType(IN wine_type VARCHAR(50))
BEGIN
    SELECT * FROM wines WHERE type = wine_type;
END//
DELIMITER ;

-- 2. Procedure to get coffees by roast level
DELIMITER //
CREATE PROCEDURE GetCoffeesByRoastLevel(IN roast_level VARCHAR(20))
BEGIN
    SELECT * FROM coffees WHERE roast_level = roast_level;
END//
DELIMITER ;

-- 3. Procedure to get top rated wines
DELIMITER //
CREATE PROCEDURE GetTopRatedWines(IN top_count INT)
BEGIN
    SELECT w.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
    FROM wines w
    LEFT JOIN reviews r ON w.id = r.wine_id
    GROUP BY w.id
    ORDER BY avg_rating DESC, review_count DESC
    LIMIT top_count;
END//
DELIMITER ;

-- 4. Procedure to get top rated coffees
DELIMITER //
CREATE PROCEDURE GetTopRatedCoffees(IN top_count INT)
BEGIN
    SELECT c.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
    FROM coffees c
    LEFT JOIN reviews r ON c.id = r.coffee_id
    GROUP BY c.id
    ORDER BY avg_rating DESC, review_count DESC
    LIMIT top_count;
END//
DELIMITER ;

-- 5. Procedure to get wine-coffee pairings
DELIMITER //
CREATE PROCEDURE GetPairings()
BEGIN
    SELECT 
        p.id,
        p.pairing_score,
        p.description,
        w.name as wine_name,
        w.type as wine_type,
        c.name as coffee_name,
        c.origin as coffee_origin
    FROM pairings p
    JOIN wines w ON p.wine_id = w.id
    JOIN coffees c ON p.coffee_id = c.id
    ORDER BY p.pairing_score DESC;
END//
DELIMITER ;

-- 6. Procedure to add a customer
DELIMITER //
CREATE PROCEDURE AddCustomer(
    IN cust_name VARCHAR(100),
    IN cust_email VARCHAR(100),
    IN cust_phone VARCHAR(20),
    IN cust_address VARCHAR(255)
)
BEGIN
    INSERT INTO customers (name, email, phone, address)
    VALUES (cust_name, cust_email, cust_phone, cust_address);
    SELECT LAST_INSERT_ID() as customer_id;
END//
DELIMITER ;

-- 7. Procedure to get customer orders
DELIMITER //
CREATE PROCEDURE GetCustomerOrders(IN cust_id INT)
BEGIN
    SELECT o.*, 
           c.name as customer_name,
           c.email as customer_email,
           c.phone as customer_phone
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.customer_id = cust_id
    ORDER BY o.order_date DESC;
END//
DELIMITER ;

-- 8. Procedure to get total sales
DELIMITER //
CREATE PROCEDURE GetTotalSales()
BEGIN
    SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COUNT(DISTINCT ow.wine_id) + COUNT(DISTINCT oc.coffee_id) as total_items_sold,
        COALESCE(SUM(o.total_amount), 0) as total_revenue
    FROM orders o
    LEFT JOIN order_wines ow ON o.id = ow.order_id
    LEFT JOIN order_coffees oc ON o.id = oc.order_id;
END//
DELIMITER ;

-- 9. Procedure to add wine
DELIMITER //
CREATE PROCEDURE AddWine(
    IN wine_name VARCHAR(100),
    IN wine_type VARCHAR(50),
    IN wine_region VARCHAR(100),
    IN wine_country VARCHAR(50),
    IN wine_vintage INT,
    IN wine_price DECIMAL(10,2),
    IN wine_alcohol DECIMAL(4,2),
    IN wine_acidity VARCHAR(20),
    IN wine_sweetness VARCHAR(20)
)
BEGIN
    INSERT INTO wines (name, type, region, country, vintage, price, alcohol_content, acidity_level, sweetness_level)
    VALUES (wine_name, wine_type, wine_region, wine_country, wine_vintage, wine_price, wine_alcohol, wine_acidity, wine_sweetness);
    SELECT LAST_INSERT_ID() as wine_id;
END//
DELIMITER ;

-- 10. Procedure to add coffee
DELIMITER //
CREATE PROCEDURE AddCoffee(
    IN coffee_name VARCHAR(100),
    IN coffee_type VARCHAR(50),
    IN coffee_origin VARCHAR(100),
    IN coffee_country VARCHAR(50),
    IN coffee_roast VARCHAR(20),
    IN coffee_price DECIMAL(10,2),
    IN coffee_description TEXT,
    IN coffee_acidity VARCHAR(20)
)
BEGIN
    INSERT INTO coffees (name, type, origin, country, roast_level, price, description, acidity_level)
    VALUES (coffee_name, coffee_type, coffee_origin, coffee_country, coffee_roast, coffee_price, coffee_description, coffee_acidity);
    SELECT LAST_INSERT_ID() as coffee_id;
END//
DELIMITER ;

-- 11. Procedure to create an order
DELIMITER //
CREATE PROCEDURE CreateOrder(IN cust_id INT)
BEGIN
    INSERT INTO orders (customer_id, order_date, total_amount)
    VALUES (cust_id, NOW(), 0);
    SELECT LAST_INSERT_ID() as order_id;
END//
DELIMITER ;

-- 12. Procedure to add wine to order
DELIMITER //
CREATE PROCEDURE AddWineToOrder(
    IN ord_id INT,
    IN wine_id INT,
    IN qty INT,
    IN subtot DECIMAL(12,2)
)
BEGIN
    INSERT INTO order_wines (order_id, wine_id, quantity, subtotal)
    VALUES (ord_id, wine_id, qty, subtot)
    ON DUPLICATE KEY UPDATE 
        quantity = quantity + qty,
        subtotal = subtotal + subtot;
END//
DELIMITER ;

-- 13. Procedure to add coffee to order
DELIMITER //
CREATE PROCEDURE AddCoffeeToOrder(
    IN ord_id INT,
    IN coffee_id INT,
    IN qty INT,
    IN subtot DECIMAL(12,2)
)
BEGIN
    INSERT INTO order_coffees (order_id, coffee_id, quantity, subtotal)
    VALUES (ord_id, coffee_id, qty, subtot)
    ON DUPLICATE KEY UPDATE 
        quantity = quantity + qty,
        subtotal = subtotal + subtot;
END//
DELIMITER ;

-- ==========================================
-- PART 3: FUNCTIONS
-- ==========================================

-- Drop existing functions if any
DROP FUNCTION IF EXISTS CalculateOrderTotal;
DROP FUNCTION IF EXISTS GetAverageRating;
DROP FUNCTION IF EXISTS GetWineTotalSales;
DROP FUNCTION IF EXISTS GetCoffeeTotalSales;
DROP FUNCTION IF EXISTS CheckInventoryStatus;

-- 1. Function to calculate order total
DELIMITER //
CREATE FUNCTION CalculateOrderTotal(order_id INT)
RETURNS DECIMAL(12,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(12,2);
    SELECT COALESCE(SUM(subtotal), 0) INTO total
    FROM (
        SELECT subtotal FROM order_wines WHERE order_id = order_id
        UNION ALL
        SELECT subtotal FROM order_coffees WHERE order_id = order_id
    ) AS combined;
    RETURN total;
END//
DELIMITER ;

-- 2. Function to get average rating for a product
DELIMITER //
CREATE FUNCTION GetAverageRating(product_id INT, product_type VARCHAR(10))
RETURNS DECIMAL(3,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    
    IF product_type = 'wine' THEN
        SELECT COALESCE(AVG(rating), 0) INTO avg_rating
        FROM reviews
        WHERE wine_id = product_id;
    ELSEIF product_type = 'coffee' THEN
        SELECT COALESCE(AVG(rating), 0) INTO avg_rating
        FROM reviews
        WHERE coffee_id = product_id;
    END IF;
    
    RETURN avg_rating;
END//
DELIMITER ;

-- 3. Function to get total user sales for a wine
DELIMITER //
CREATE FUNCTION GetWineTotalSales(wine_id INT)
RETURNS DECIMAL(12,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_sales DECIMAL(12,2);
    SELECT COALESCE(SUM(subtotal), 0) INTO total_sales
    FROM order_wines
    WHERE wine_id = wine_id;
    RETURN total_sales;
END//
DELIMITER ;

-- 4. Function to get total sales for a coffee
DELIMITER //
CREATE FUNCTION GetCoffeeTotalSales(coffee_id INT)
RETURNS DECIMAL(12,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_sales DECIMAL(12,2);
    SELECT COALESCE(SUM(subtotal), 0) INTO total_sales
    FROM order_coffees
    WHERE coffee_id = coffee_id;
    RETURN total_sales;
END//
DELIMITER ;

-- 5. Function to check inventory status (if you have inventory data)
DELIMITER //
CREATE FUNCTION CheckInventoryStatus(product_id INT)
RETURNS VARCHAR(20)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE item_count INT;
    SELECT COUNT(*) INTO item_count FROM wines WHERE id = product_id;
    
    IF item_count > 0 THEN
        RETURN 'IN_STOCK';
    ELSE
        RETURN 'OUT_OF_STOCK';
    END IF;
END//
DELIMITER ;

-- ==========================================
-- FREQUENTLY BOUGHT TOGETHER TRACKING
-- ==========================================

-- 6. Trigger to track when wines and coffees are bought together in orders
DELIMITER //
CREATE TRIGGER TrackFrequentlyBoughtTogether
AFTER INSERT ON order_wines
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE coffee_id_var INT;
    DECLARE cur CURSOR FOR 
        SELECT DISTINCT coffee_id 
        FROM order_coffees 
        WHERE order_id = NEW.order_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- For each wine in the order, track pairings with coffees in the same order
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO coffee_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Insert or update frequently_bought_together
        INSERT INTO frequently_bought_together (wine_id, paired_coffee_id, purchase_count, last_purchased)
        VALUES (NEW.wine_id, coffee_id_var, 1, NOW())
        ON DUPLICATE KEY UPDATE 
            purchase_count = purchase_count + 1,
            last_purchased = NOW();
    END LOOP;
    CLOSE cur;
END//
DELIMITER ;

-- 7. Trigger to track when coffees and wines are bought together in orders
DELIMITER //
CREATE TRIGGER TrackFrequentlyBoughtTogetherCoffee
AFTER INSERT ON order_coffees
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE wine_id_var INT;
    DECLARE cur CURSOR FOR 
        SELECT DISTINCT wine_id 
        FROM order_wines 
        WHERE order_id = NEW.order_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- For each coffee in the order, track pairings with wines in the same order
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO wine_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Insert or update frequently_bought_together
        INSERT INTO frequently_bought_together (wine_id, paired_coffee_id, purchase_count, last_purchased)
        VALUES (wine_id_var, NEW.coffee_id, 1, NOW())
        ON DUPLICATE KEY UPDATE 
            purchase_count = purchase_count + 1,
            last_purchased = NOW();
    END LOOP;
    CLOSE cur;
END//
DELIMITER ;

-- 8. Stored Procedure: Get recommendations based on frequently bought together
DELIMITER //
CREATE PROCEDURE GetFrequentlyBoughtTogether(
    IN p_wine_id INT,
    IN p_coffee_id INT,
    IN p_limit INT
)
BEGIN
    IF p_wine_id IS NOT NULL THEN
        -- Get coffees frequently bought with this wine
        SELECT 
            fbt.paired_coffee_id as coffee_id,
            c.name as coffee_name,
            c.type as coffee_type,
            c.origin as coffee_origin,
            c.roast_level,
            c.price,
            fbt.purchase_count,
            fbt.last_purchased,
            (fbt.purchase_count * 1.0) as recommendation_score
        FROM frequently_bought_together fbt
        JOIN coffees c ON fbt.paired_coffee_id = c.id
        WHERE fbt.wine_id = p_wine_id
        ORDER BY fbt.purchase_count DESC, fbt.last_purchased DESC
        LIMIT p_limit;
    ELSEIF p_coffee_id IS NOT NULL THEN
        -- Get wines frequently bought with this coffee
        SELECT 
            fbt.wine_id as wine_id,
            w.name as wine_name,
            w.type as wine_type,
            w.region as wine_region,
            w.vintage,
            w.price,
            fbt.purchase_count,
            fbt.last_purchased,
            (fbt.purchase_count * 1.0) as recommendation_score
        FROM frequently_bought_together fbt
        JOIN wines w ON fbt.wine_id = w.id
        WHERE fbt.paired_coffee_id = p_coffee_id
        ORDER BY fbt.purchase_count DESC, fbt.last_purchased DESC
        LIMIT p_limit;
    END IF;
END//
DELIMITER ;

-- 9. Stored Procedure: Get top pairings based on purchase frequency
DELIMITER //
CREATE PROCEDURE GetTopFrequentlyBoughtTogether(IN p_limit INT)
BEGIN
    SELECT 
        fbt.wine_id,
        w.name as wine_name,
        fbt.paired_coffee_id as coffee_id,
        c.name as coffee_name,
        fbt.purchase_count,
        fbt.last_purchased,
        CONCAT(w.name, ' + ', c.name) as pairing_name
    FROM frequently_bought_together fbt
    LEFT JOIN wines w ON fbt.wine_id = w.id
    LEFT JOIN coffees c ON fbt.paired_coffee_id = c.id
    ORDER BY fbt.purchase_count DESC, fbt.last_purchased DESC
    LIMIT p_limit;
END//
DELIMITER ;

-- ==========================================
-- VERIFICATION COMMANDS
-- ==========================================

-- Show all triggers
-- SHOW TRIGGERS;

-- Show all procedures
-- SHOW PROCEDURE STATUS WHERE db = 'wine_coffee_db';

-- Show all functions
-- SHOW FUNCTION STATUS WHERE db = 'wine_coffee_db';

-- ==========================================
-- TEST COMMANDS
-- ==========================================

-- Test a trigger: Try to insert invalid rating
-- INSERT INTO reviews (wine_id, rating) VALUES (1, 10); -- Should fail

-- Test a procedure: Get red wines
-- CALL GetWinesByType('red');

-- Test a function: Calculate order total
-- SELECT CalculateOrderTotal(1);

