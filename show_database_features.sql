-- ==========================================
-- SHOW ALL TRIGGERS IN DATABASE
-- ==========================================
SHOW TRIGGERS FROM wine_coffee_db;

-- ==========================================
-- SHOW ALL STORED PROCEDURES
-- ==========================================
SHOW PROCEDURE STATUS WHERE db = 'wine_coffee_db';

-- ==========================================
-- SHOW ALL FUNCTIONS
-- ==========================================
SHOW FUNCTION STATUS WHERE db = 'wine_coffee_db';

-- ==========================================
-- SHOW PROCEDURE DEFINITIONS
-- ==========================================
SELECT ROUTINE_NAME, ROUTINE_DEFINITION 
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'PROCEDURE';

-- ==========================================
-- SHOW FUNCTION DEFINITIONS
-- ==========================================
SELECT ROUTINE_NAME, ROUTINE_DEFINITION 
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'wine_coffee_db' AND ROUTINE_TYPE = 'FUNCTION';

-- ==========================================
-- SHOW TRIGGER DEFINITIONS
-- ==========================================
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_STATEMENT
FROM information_schema.TRIGGERS 
WHERE TRIGGER_SCHEMA = 'wine_coffee_db';

-- ==========================================
-- SHOW TABLES IN DATABASE
-- ==========================================
SHOW TABLES FROM wine_coffee_db;

-- ==========================================
-- SHOW TABLE STRUCTURES
-- ==========================================
DESCRIBE wines;
DESCRIBE coffees;
DESCRIBE orders;
DESCRIBE customers;
DESCRIBE reviews;
DESCRIBE pairings;
