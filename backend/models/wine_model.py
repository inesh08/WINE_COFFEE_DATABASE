from db.connection import get_db_connection

class WineModel:
    @staticmethod
    def get_all_wines():
        """Get all wines from the database"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM wines ORDER BY name")
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_wine_by_id(wine_id):
        """Get a specific wine by ID"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM wines WHERE id = %s", (wine_id,))
                return cursor.fetchone()
        finally:
            conn.close()
    
    @staticmethod
    def create_wine(wine_data):
        """Create a new wine"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """INSERT INTO wines (name, type, region, country, vintage, 
                         price, alcohol_content, acidity_level, sweetness_level) 
                         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
                cursor.execute(sql, (
                    wine_data['name'], wine_data['type'], wine_data.get('region'),
                    wine_data.get('country'), wine_data.get('vintage'),
                    wine_data.get('price'), wine_data.get('alcohol_content'), 
                    wine_data.get('acidity_level'), wine_data.get('sweetness_level')
                ))
                conn.commit()
                return cursor.lastrowid
        finally:
            conn.close()
    
    @staticmethod
    def update_wine(wine_id, wine_data):
        """Update an existing wine"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """UPDATE wines SET name=%s, type=%s, region=%s, country=%s,
                         vintage=%s, price=%s, alcohol_content=%s,
                         acidity_level=%s, sweetness_level=%s WHERE id=%s"""
                cursor.execute(sql, (
                    wine_data['name'], wine_data['type'], wine_data.get('region'),
                    wine_data.get('country'), wine_data.get('vintage'),
                    wine_data.get('price'), wine_data.get('alcohol_content'), 
                    wine_data.get('acidity_level'), wine_data.get('sweetness_level'), wine_id
                ))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def delete_wine(wine_id):
        """Delete a wine"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM wines WHERE id = %s", (wine_id,))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def search_wines(filters):
        """Search wines with filters"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = "SELECT * FROM wines WHERE 1=1"
                params = []
                
                if filters.get('type'):
                    sql += " AND type = %s"
                    params.append(filters['type'])
                
                if filters.get('region'):
                    sql += " AND region LIKE %s"
                    params.append(f"%{filters['region']}%")
                
                if filters.get('country'):
                    sql += " AND country = %s"
                    params.append(filters['country'])
                
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
    def get_wine_types():
        """Get all unique wine types"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT DISTINCT type FROM wines ORDER BY type")
                return [row['type'] for row in cursor.fetchall()]
        finally:
            conn.close()
    
    @staticmethod
    def get_wine_regions():
        """Get all unique wine regions"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT DISTINCT region FROM wines WHERE region IS NOT NULL ORDER BY region")
                return [row['region'] for row in cursor.fetchall()]
        finally:
            conn.close() 