import pymysql
from config import Config

def get_db_connection():
    """Create and return a MySQL database connection"""
    try:
        # Debug: Print connection details (without password)
        print(f"Connecting to MySQL: {Config.MYSQL_USER}@{Config.MYSQL_HOST}:{Config.MYSQL_PORT}/{Config.MYSQL_DATABASE}")
        connection = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False
        )
        # Set timezone to IST (Indian Standard Time)
        with connection.cursor() as cursor:
            cursor.execute("SET time_zone = '+05:30'")
        print(f"✅ MySQL connection successful!")
        return connection
    except pymysql.Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        print(f"   Config values - Host: {Config.MYSQL_HOST}, User: {Config.MYSQL_USER}, DB: {Config.MYSQL_DATABASE}")
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
                    stmt = statement.strip()
                    if not stmt:
                        continue
                    try:
                        cursor.execute(stmt)
                    except pymysql.err.OperationalError as op_err:
                        # Ignore duplicate index / key errors so we can re-run schema safely
                        if op_err.args and op_err.args[0] in (1061, 1091):
                            continue
                        raise
        conn.commit()
        conn.close()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization failed: {e}")
        raise 