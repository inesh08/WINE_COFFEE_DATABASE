from models.wine_model import WineModel
from models.coffee_model import CoffeeModel
from models.review_model import ReviewModel
from models.pairing_model import PairingModel
from models.user_model import UserModel
from db.connection import get_db_connection

class Analytics:
    @staticmethod
    def get_overall_statistics():
        """Get overall statistics for the platform"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Count total items
                cursor.execute("SELECT COUNT(*) as total_wines FROM wines")
                total_wines = cursor.fetchone()['total_wines']
                
                cursor.execute("SELECT COUNT(*) as total_coffees FROM coffees")
                total_coffees = cursor.fetchone()['total_coffees']
                
                cursor.execute("SELECT COUNT(*) as total_users FROM users")
                total_users = cursor.fetchone()['total_users']
                
                cursor.execute("SELECT COUNT(*) as total_reviews FROM reviews")
                total_reviews = cursor.fetchone()['total_reviews']
                
                cursor.execute("SELECT COUNT(*) as total_pairings FROM pairings")
                total_pairings = cursor.fetchone()['total_pairings']
                
                # Average ratings
                cursor.execute("SELECT AVG(rating) as avg_rating FROM reviews")
                avg_rating = cursor.fetchone()['avg_rating']
                
                # Average pairing score
                cursor.execute("SELECT AVG(pairing_score) as avg_pairing_score FROM pairings")
                avg_pairing_score = cursor.fetchone()['avg_pairing_score']
                
                return {
                    'total_wines': total_wines,
                    'total_coffees': total_coffees,
                    'total_users': total_users,
                    'total_reviews': total_reviews,
                    'total_pairings': total_pairings,
                    'average_rating': float(avg_rating) if avg_rating else 0,
                    'average_pairing_score': float(avg_pairing_score) if avg_pairing_score else 0
                }
        finally:
            conn.close()
    
    @staticmethod
    def get_popular_wine_types():
        """Get most popular wine types based on reviews"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT w.type, COUNT(r.id) as review_count, AVG(r.rating) as avg_rating
                         FROM wines w
                         LEFT JOIN reviews r ON w.id = r.wine_id
                         GROUP BY w.type
                         HAVING review_count > 0
                         ORDER BY review_count DESC, avg_rating DESC"""
                cursor.execute(sql)
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_popular_coffee_types():
        """Get most popular coffee types based on reviews"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT c.type, COUNT(r.id) as review_count, AVG(r.rating) as avg_rating
                         FROM coffees c
                         LEFT JOIN reviews r ON c.id = r.coffee_id
                         GROUP BY c.type
                         HAVING review_count > 0
                         ORDER BY review_count DESC, avg_rating DESC"""
                cursor.execute(sql)
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_popular_wine_regions():
        """Get most popular wine regions"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT w.region, COUNT(r.id) as review_count, AVG(r.rating) as avg_rating
                         FROM wines w
                         LEFT JOIN reviews r ON w.id = r.wine_id
                         WHERE w.region IS NOT NULL
                         GROUP BY w.region
                         HAVING review_count > 0
                         ORDER BY review_count DESC, avg_rating DESC
                         LIMIT 10"""
                cursor.execute(sql)
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_popular_coffee_origins():
        """Get most popular coffee origins"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """SELECT c.origin, COUNT(r.id) as review_count, AVG(r.rating) as avg_rating
                         FROM coffees c
                         LEFT JOIN reviews r ON c.id = r.coffee_id
                         WHERE c.origin IS NOT NULL
                         GROUP BY c.origin
                         HAVING review_count > 0
                         ORDER BY review_count DESC, avg_rating DESC
                         LIMIT 10"""
                cursor.execute(sql)
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def get_flavor_preferences():
        """Get popular flavor preferences"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Wine flavor preferences
                wine_flavors = {}
                
                # Acidity preferences
                cursor.execute("""SELECT acidity_level, COUNT(*) as count, AVG(r.rating) as avg_rating
                                 FROM wines w
                                 LEFT JOIN reviews r ON w.id = r.wine_id
                                 WHERE acidity_level IS NOT NULL
                                 GROUP BY acidity_level
                                 ORDER BY count DESC""")
                wine_flavors['acidity'] = cursor.fetchall()
                
                # Body preferences
                cursor.execute("""SELECT body_level, COUNT(*) as count, AVG(r.rating) as avg_rating
                                 FROM wines w
                                 LEFT JOIN reviews r ON w.id = r.wine_id
                                 WHERE body_level IS NOT NULL
                                 GROUP BY body_level
                                 ORDER BY count DESC""")
                wine_flavors['body'] = cursor.fetchall()
                
                # Coffee flavor preferences
                coffee_flavors = {}
                
                # Roast level preferences
                cursor.execute("""SELECT roast_level, COUNT(*) as count, AVG(r.rating) as avg_rating
                                 FROM coffees c
                                 LEFT JOIN reviews r ON c.id = r.coffee_id
                                 WHERE roast_level IS NOT NULL
                                 GROUP BY roast_level
                                 ORDER BY count DESC""")
                coffee_flavors['roast_level'] = cursor.fetchall()
                
                # Coffee acidity preferences
                cursor.execute("""SELECT acidity_level, COUNT(*) as count, AVG(r.rating) as avg_rating
                                 FROM coffees c
                                 LEFT JOIN reviews r ON c.id = r.coffee_id
                                 WHERE acidity_level IS NOT NULL
                                 GROUP BY acidity_level
                                 ORDER BY count DESC""")
                coffee_flavors['acidity'] = cursor.fetchall()
                
                return {
                    'wine_flavors': wine_flavors,
                    'coffee_flavors': coffee_flavors
                }
        finally:
            conn.close()
    
    @staticmethod
    def get_price_analysis():
        """Get price analysis for wines and coffees"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Wine price analysis
                cursor.execute("""SELECT 
                                    MIN(price) as min_price,
                                    MAX(price) as max_price,
                                    AVG(price) as avg_price,
                                    COUNT(*) as total_count
                                 FROM wines 
                                 WHERE price IS NOT NULL""")
                wine_prices = cursor.fetchone()
                
                # Coffee price analysis
                cursor.execute("""SELECT 
                                    MIN(price) as min_price,
                                    MAX(price) as max_price,
                                    AVG(price) as avg_price,
                                    COUNT(*) as total_count
                                 FROM coffees 
                                 WHERE price IS NOT NULL""")
                coffee_prices = cursor.fetchone()
                
                # Price ranges
                cursor.execute("""SELECT 
                                    CASE 
                                        WHEN price < 20 THEN 'Under $20'
                                        WHEN price < 50 THEN '$20-$50'
                                        WHEN price < 100 THEN '$50-$100'
                                        ELSE 'Over $100'
                                    END as price_range,
                                    COUNT(*) as count
                                 FROM wines 
                                 WHERE price IS NOT NULL
                                 GROUP BY price_range
                                 ORDER BY count DESC""")
                wine_price_ranges = cursor.fetchall()
                
                cursor.execute("""SELECT 
                                    CASE 
                                        WHEN price < 10 THEN 'Under $10'
                                        WHEN price < 25 THEN '$10-$25'
                                        WHEN price < 50 THEN '$25-$50'
                                        ELSE 'Over $50'
                                    END as price_range,
                                    COUNT(*) as count
                                 FROM coffees 
                                 WHERE price IS NOT NULL
                                 GROUP BY price_range
                                 ORDER BY count DESC""")
                coffee_price_ranges = cursor.fetchall()
                
                return {
                    'wine_prices': wine_prices,
                    'coffee_prices': coffee_prices,
                    'wine_price_ranges': wine_price_ranges,
                    'coffee_price_ranges': coffee_price_ranges
                }
        finally:
            conn.close()
    
    @staticmethod
    def get_user_activity_stats():
        """Get user activity statistics"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Most active users
                cursor.execute("""SELECT u.username, COUNT(r.id) as review_count, AVG(r.rating) as avg_rating
                                 FROM users u
                                 LEFT JOIN reviews r ON u.id = r.user_id
                                 GROUP BY u.id, u.username
                                 HAVING review_count > 0
                                 ORDER BY review_count DESC
                                 LIMIT 10""")
                most_active_users = cursor.fetchall()
                
                # Recent activity
                cursor.execute("""SELECT COUNT(*) as recent_reviews
                                 FROM reviews 
                                 WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)""")
                recent_reviews = cursor.fetchone()['recent_reviews']
                
                cursor.execute("""SELECT COUNT(*) as recent_users
                                 FROM users 
                                 WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)""")
                recent_users = cursor.fetchone()['recent_users']
                
                # Rating distribution
                cursor.execute("""SELECT rating, COUNT(*) as count
                                 FROM reviews
                                 GROUP BY rating
                                 ORDER BY rating""")
                rating_distribution = cursor.fetchall()
                
                return {
                    'most_active_users': most_active_users,
                    'recent_reviews': recent_reviews,
                    'recent_users': recent_users,
                    'rating_distribution': rating_distribution
                }
        finally:
            conn.close()
    
    @staticmethod
    def get_pairing_analytics():
        """Get pairing analytics"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Best pairing combinations
                cursor.execute("""SELECT w.type as wine_type, c.type as coffee_type, 
                                    AVG(p.pairing_score) as avg_score, COUNT(p.id) as pairing_count
                                 FROM pairings p
                                 LEFT JOIN wines w ON p.wine_id = w.id
                                 LEFT JOIN coffees c ON p.coffee_id = c.id
                                 GROUP BY w.type, c.type
                                 HAVING pairing_count > 0
                                 ORDER BY avg_score DESC, pairing_count DESC""")
                best_combinations = cursor.fetchall()
                
                # Pairing score distribution
                cursor.execute("""SELECT 
                                    CASE 
                                        WHEN pairing_score >= 8 THEN 'Excellent (8-10)'
                                        WHEN pairing_score >= 6 THEN 'Good (6-7.9)'
                                        WHEN pairing_score >= 4 THEN 'Fair (4-5.9)'
                                        ELSE 'Poor (<4)'
                                    END as score_range,
                                    COUNT(*) as count
                                 FROM pairings
                                 GROUP BY score_range
                                 ORDER BY count DESC""")
                score_distribution = cursor.fetchall()
                
                # Most paired wines
                cursor.execute("""SELECT w.name, w.type, COUNT(p.id) as pairing_count, AVG(p.pairing_score) as avg_score
                                 FROM pairings p
                                 LEFT JOIN wines w ON p.wine_id = w.id
                                 GROUP BY w.id, w.name, w.type
                                 ORDER BY pairing_count DESC
                                 LIMIT 10""")
                most_paired_wines = cursor.fetchall()
                
                # Most paired coffees
                cursor.execute("""SELECT c.name, c.type, COUNT(p.id) as pairing_count, AVG(p.pairing_score) as avg_score
                                 FROM pairings p
                                 LEFT JOIN coffees c ON p.coffee_id = c.id
                                 GROUP BY c.id, c.name, c.type
                                 ORDER BY pairing_count DESC
                                 LIMIT 10""")
                most_paired_coffees = cursor.fetchall()
                
                return {
                    'best_combinations': best_combinations,
                    'score_distribution': score_distribution,
                    'most_paired_wines': most_paired_wines,
                    'most_paired_coffees': most_paired_coffees
                }
        finally:
            conn.close()
    
    @staticmethod
    def get_trending_items():
        """Get trending wines and coffees based on recent reviews"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Trending wines (recent reviews with high ratings)
                cursor.execute("""SELECT w.name, w.type, COUNT(r.id) as recent_reviews, AVG(r.rating) as avg_rating
                                 FROM wines w
                                 LEFT JOIN reviews r ON w.id = r.wine_id
                                 WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                                 GROUP BY w.id, w.name, w.type
                                 HAVING recent_reviews >= 2
                                 ORDER BY avg_rating DESC, recent_reviews DESC
                                 LIMIT 10""")
                trending_wines = cursor.fetchall()
                
                # Trending coffees
                cursor.execute("""SELECT c.name, c.type, COUNT(r.id) as recent_reviews, AVG(r.rating) as avg_rating
                                 FROM coffees c
                                 LEFT JOIN reviews r ON c.id = r.coffee_id
                                 WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                                 GROUP BY c.id, c.name, c.type
                                 HAVING recent_reviews >= 2
                                 ORDER BY avg_rating DESC, recent_reviews DESC
                                 LIMIT 10""")
                trending_coffees = cursor.fetchall()
                
                return {
                    'trending_wines': trending_wines,
                    'trending_coffees': trending_coffees
                }
        finally:
            conn.close() 