from db.connection import get_db_connection

class ReviewModel:
    @staticmethod
    def create_review(review_data):
        """Create a new review"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """INSERT INTO reviews (user_id, wine_id, coffee_id, rating, comment)
                         VALUES (%s, %s, %s, %s, %s)"""
                cursor.execute(sql, (
                    review_data['user_id'], review_data.get('wine_id'),
                    review_data.get('coffee_id'), review_data['rating'],
                    review_data.get('comment')
                ))
                conn.commit()
                return cursor.lastrowid
        finally:
            conn.close()
    
    @staticmethod
    def get_review_by_id(review_id):
        """Get a specific review by ID"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT r.*, u.username, w.name as wine_name, c.name as coffee_name
                         FROM reviews r
                         LEFT JOIN users u ON r.user_id = u.id
                         LEFT JOIN wines w ON r.wine_id = w.id
                         LEFT JOIN coffees c ON r.coffee_id = c.id
                         WHERE r.id = %s"""
                cursor.execute(sql, (review_id,))
                return cursor.fetchone()
        finally:
            conn.close()
    
    @staticmethod
    def get_reviews_by_wine(wine_id, limit=None):
        """Get all reviews for a specific wine"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT r.*, u.username
                         FROM reviews r
                         LEFT JOIN users u ON r.user_id = u.id
                         WHERE r.wine_id = %s
                         ORDER BY r.created_at DESC"""
                if limit:
                    sql += f" LIMIT {limit}"
                cursor.execute(sql, (wine_id,))
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_reviews_by_coffee(coffee_id, limit=None):
        """Get all reviews for a specific coffee"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT r.*, u.username
                         FROM reviews r
                         LEFT JOIN users u ON r.user_id = u.id
                         WHERE r.coffee_id = %s
                         ORDER BY r.created_at DESC"""
                if limit:
                    sql += f" LIMIT {limit}"
                cursor.execute(sql, (coffee_id,))
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_reviews_by_user(user_id, limit=None):
        """Get all reviews by a specific user"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT r.*, w.name as wine_name, c.name as coffee_name
                         FROM reviews r
                         LEFT JOIN wines w ON r.wine_id = w.id
                         LEFT JOIN coffees c ON r.coffee_id = c.id
                         WHERE r.user_id = %s
                         ORDER BY r.created_at DESC"""
                if limit:
                    sql += f" LIMIT {limit}"
                cursor.execute(sql, (user_id,))
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def update_review(review_id, review_data):
        """Update an existing review"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = "UPDATE reviews SET rating = %s, comment = %s WHERE id = %s"
                cursor.execute(sql, (
                    review_data['rating'], review_data.get('comment'), review_id
                ))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def delete_review(review_id):
        """Delete a review"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM reviews WHERE id = %s", (review_id,))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def get_average_rating_wine(wine_id):
        """Get average rating for a wine"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE wine_id = %s", (wine_id,))
                result = cursor.fetchone()
                return {
                    'average_rating': float(result['avg_rating']) if result['avg_rating'] else 0,
                    'review_count': result['review_count']
                }
        finally:
            conn.close()
    
    @staticmethod
    def get_average_rating_coffee(coffee_id):
        """Get average rating for a coffee"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE coffee_id = %s", (coffee_id,))
                result = cursor.fetchone()
                return {
                    'average_rating': float(result['avg_rating']) if result['avg_rating'] else 0,
                    'review_count': result['review_count']
                }
        finally:
            conn.close()
    
    @staticmethod
    def get_top_rated_wines(limit=10):
        """Get top rated wines"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT w.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
                         FROM wines w
                         LEFT JOIN reviews r ON w.id = r.wine_id
                         GROUP BY w.id
                         HAVING review_count > 0
                         ORDER BY avg_rating DESC, review_count DESC
                         LIMIT %s"""
                cursor.execute(sql, (limit,))
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_top_rated_coffees(limit=10):
        """Get top rated coffees"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT c.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
                         FROM coffees c
                         LEFT JOIN reviews r ON c.id = r.coffee_id
                         GROUP BY c.id
                         HAVING review_count > 0
                         ORDER BY avg_rating DESC, review_count DESC
                         LIMIT %s"""
                cursor.execute(sql, (limit,))
                return cursor.fetchall()
        finally:
            conn.close() 