import pymysql
from config import Config

def get_db_connection():
    """Create and return a MySQL database connection"""
    try:
        connection = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except pymysql.Error as e:
        print(f"Error connecting to MySQL: {e}")
        raise

def test_connection():
    """Test the database connection"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        conn.close()
        return True
    except Exception as e:
        print(f"Connection test failed: {e}")
        return False

def init_database():
    """Initialize the database with schema"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Read and execute schema.sql
            with open('db/schema.sql', 'r') as file:
                schema = file.read()
                # Split by semicolon and execute each statement
                statements = schema.split(';')
                for statement in statements:
                    if statement.strip():
                        cursor.execute(statement)
        conn.commit()
        conn.close()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization failed: {e}")
        raise 