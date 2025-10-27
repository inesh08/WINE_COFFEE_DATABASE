from db.connection import get_db_connection

class CoffeeModel:
    @staticmethod
    def get_all_coffees():
        """Get all coffees from the database"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM coffees ORDER BY name")
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_coffee_by_id(coffee_id):
        """Get a specific coffee by ID"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM coffees WHERE id = %s", (coffee_id,))
                return cursor.fetchone()
        finally:
            conn.close()
    
    @staticmethod
    def create_coffee(coffee_data):
        """Create a new coffee"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """INSERT INTO coffees (name, type, origin, country, roast_level,
                         price, description, acidity_level) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
                cursor.execute(sql, (
                    coffee_data['name'], coffee_data['type'], coffee_data.get('origin'),
                    coffee_data.get('country'), coffee_data.get('roast_level'),
                    coffee_data.get('price'), coffee_data.get('description'),
                    coffee_data.get('acidity_level')
                ))
                conn.commit()
                return cursor.lastrowid
        finally:
            conn.close()
    
    @staticmethod
    def update_coffee(coffee_id, coffee_data):
        """Update an existing coffee"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """UPDATE coffees SET name=%s, type=%s, origin=%s, country=%s,
                         roast_level=%s, price=%s, description=%s, acidity_level=%s WHERE id=%s"""
                cursor.execute(sql, (
                    coffee_data['name'], coffee_data['type'], coffee_data.get('origin'),
                    coffee_data.get('country'), coffee_data.get('roast_level'),
                    coffee_data.get('price'), coffee_data.get('description'),
                    coffee_data.get('acidity_level'), coffee_id
                ))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def delete_coffee(coffee_id):
        """Delete a coffee"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM coffees WHERE id = %s", (coffee_id,))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def search_coffees(filters):
        """Search coffees with filters"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = "SELECT * FROM coffees WHERE 1=1"
                params = []
                
                if filters.get('type'):
                    sql += " AND type = %s"
                    params.append(filters['type'])
                
                if filters.get('origin'):
                    sql += " AND origin LIKE %s"
                    params.append(f"%{filters['origin']}%")
                
                if filters.get('country'):
                    sql += " AND country = %s"
                    params.append(filters['country'])
                
                if filters.get('roast_level'):
                    sql += " AND roast_level = %s"
                    params.append(filters['roast_level'])
                
                if filters.get('min_price'):
                    sql += " AND price >= %s"
                    params.append(filters['min_price'])
                
                if filters.get('max_price'):
                    sql += " AND price <= %s"
                    params.append(filters['max_price'])
                
                sql += " ORDER BY name"
                cursor.execute(sql, params)
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_coffee_types():
        """Get all unique coffee types"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT DISTINCT type FROM coffees ORDER BY type")
                return [row['type'] for row in cursor.fetchall()]
        finally:
            conn.close()
    
    @staticmethod
    def get_coffee_origins():
        """Get all unique coffee origins"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT DISTINCT origin FROM coffees WHERE origin IS NOT NULL ORDER BY origin")
                return [row['origin'] for row in cursor.fetchall()]
        finally:
            conn.close()
    
    @staticmethod
    def get_roast_levels():
        """Get all unique roast levels"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT DISTINCT roast_level FROM coffees WHERE roast_level IS NOT NULL ORDER BY roast_level")
                return [row['roast_level'] for row in cursor.fetchall()]
        finally:
            conn.close() 