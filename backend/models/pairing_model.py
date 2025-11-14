from db.connection import get_db_connection

class PairingModel:
    @staticmethod
    def create_pairing(pairing_data):
        """Create a new wine-coffee pairing"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """INSERT INTO pairings (wine_id, coffee_id, pairing_score, description)
                         VALUES (%s, %s, %s, %s)"""
                cursor.execute(sql, (
                    pairing_data['wine_id'], pairing_data['coffee_id'],
                    pairing_data.get('pairing_score', 5.0), pairing_data.get('description')
                ))
                conn.commit()
                return cursor.lastrowid
        finally:
            conn.close()
    
    @staticmethod
    def get_pairing_by_id(pairing_id):
        """Get a specific pairing by ID"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT p.*, w.name as wine_name, w.type as wine_type,
                         c.name as coffee_name, c.type as coffee_type
                         FROM pairings p
                         LEFT JOIN wines w ON p.wine_id = w.id
                         LEFT JOIN coffees c ON p.coffee_id = c.id
                         WHERE p.id = %s"""
                cursor.execute(sql, (pairing_id,))
                return cursor.fetchone()
        finally:
            conn.close()
    
    @staticmethod
    def get_pairings_by_wine(wine_id):
        """Get all pairings for a specific wine"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT p.*, c.name as coffee_name, c.type as coffee_type,
                         c.origin as coffee_origin, c.roast_level
                         FROM pairings p
                         LEFT JOIN coffees c ON p.coffee_id = c.id
                         WHERE p.wine_id = %s
                         ORDER BY p.pairing_score DESC"""
                cursor.execute(sql, (wine_id,))
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_pairings_by_coffee(coffee_id):
        """Get all pairings for a specific coffee"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT p.*, w.name as wine_name, w.type as wine_type,
                         w.region as wine_region, w.vintage
                         FROM pairings p
                         LEFT JOIN wines w ON p.wine_id = w.id
                         WHERE p.coffee_id = %s
                         ORDER BY p.pairing_score DESC"""
                cursor.execute(sql, (coffee_id,))
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_all_pairings(limit=None):
        """Get all pairings"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT p.*, w.name as wine_name, w.type as wine_type,
                         c.name as coffee_name, c.type as coffee_type
                         FROM pairings p
                         LEFT JOIN wines w ON p.wine_id = w.id
                         LEFT JOIN coffees c ON p.coffee_id = c.id
                         ORDER BY p.pairing_score DESC"""
                if limit:
                    sql += f" LIMIT {limit}"
                cursor.execute(sql)
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def update_pairing(pairing_id, pairing_data):
        """Update an existing pairing"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = "UPDATE pairings SET pairing_score = %s, description = %s WHERE id = %s"
                cursor.execute(sql, (
                    pairing_data.get('pairing_score', 5.0),
                    pairing_data.get('description'), pairing_id
                ))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def delete_pairing(pairing_id):
        """Delete a pairing"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM pairings WHERE id = %s", (pairing_id,))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def get_best_pairings(limit=10):
        """Get the best rated pairings"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT p.*, w.name as wine_name, w.type as wine_type,
                         c.name as coffee_name, c.type as coffee_type
                         FROM pairings p
                         LEFT JOIN wines w ON p.wine_id = w.id
                         LEFT JOIN coffees c ON p.coffee_id = c.id
                         WHERE p.pairing_score >= 7.0
                         ORDER BY p.pairing_score DESC
                         LIMIT %s"""
                cursor.execute(sql, (limit,))
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def search_pairings(filters):
        """Search pairings with filters"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT p.*, w.name as wine_name, w.type as wine_type,
                         c.name as coffee_name, c.type as coffee_type
                         FROM pairings p
                         LEFT JOIN wines w ON p.wine_id = w.id
                         LEFT JOIN coffees c ON p.coffee_id = c.id
                         WHERE 1=1"""
                params = []
                
                if filters.get('wine_type'):
                    sql += " AND w.type = %s"
                    params.append(filters['wine_type'])
                
                if filters.get('coffee_type'):
                    sql += " AND c.type = %s"
                    params.append(filters['coffee_type'])
                
                if filters.get('min_score'):
                    sql += " AND p.pairing_score >= %s"
                    params.append(filters['min_score'])
                
                if filters.get('max_score'):
                    sql += " AND p.pairing_score <= %s"
                    params.append(filters['max_score'])
                
                sql += " ORDER BY p.pairing_score DESC"
                cursor.execute(sql, params)
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_pairing_statistics():
        """Get pairing statistics"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Total pairings
                cursor.execute("SELECT COUNT(*) as total_pairings FROM pairings")
                total_pairings = cursor.fetchone()['total_pairings']
                
                # Average pairing score
                cursor.execute("SELECT AVG(pairing_score) as avg_score FROM pairings")
                avg_score = cursor.fetchone()['avg_score']
                
                # Top wine types in pairings
                cursor.execute("""SELECT w.type, COUNT(*) as count
                                 FROM pairings p
                                 LEFT JOIN wines w ON p.wine_id = w.id
                                 GROUP BY w.type
                                 ORDER BY count DESC
                                 LIMIT 5""")
                top_wine_types = cursor.fetchall()
                
                # Top coffee types in pairings
                cursor.execute("""SELECT c.type, COUNT(*) as count
                                 FROM pairings p
                                 LEFT JOIN coffees c ON p.coffee_id = c.id
                                 GROUP BY c.type
                                 ORDER BY count DESC
                                 LIMIT 5""")
                top_coffee_types = cursor.fetchall()
                
                return {
                    'total_pairings': total_pairings,
                    'average_score': float(avg_score) if avg_score else 0,
                    'top_wine_types': top_wine_types,
                    'top_coffee_types': top_coffee_types
                }
        finally:
            conn.close() 