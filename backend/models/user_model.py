import hashlib
import secrets
from db.connection import get_db_connection

class UserModel:
    @staticmethod
    def hash_password(password):
        """Hash a password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    @staticmethod
    def create_user(user_data):
        """Create a new user"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Check if username or email already exists
                cursor.execute(
                    "SELECT id FROM users WHERE username = %s OR email = %s",
                    (user_data['username'], user_data.get('email'))
                )
                if cursor.fetchone():
                    return None  # User already exists
                
                # Hash the password
                password_hash = UserModel.hash_password(user_data['password'])
                
                sql = "INSERT INTO users (username, email, password_hash, role) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql, (
                    user_data['username'],
                    user_data.get('email'),
                    password_hash,
                    user_data.get('role', 'customer')
                ))
                conn.commit()
                return cursor.lastrowid
        finally:
            conn.close()
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get a user by ID"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT id, username, email, role, created_at FROM users WHERE id = %s",
                    (user_id,)
                )
                return cursor.fetchone()
        finally:
            conn.close()
    
    @staticmethod
    def get_user_by_username(username):
        """Get a user by username"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
                return cursor.fetchone()
        finally:
            conn.close()
    
    @staticmethod
    def authenticate_user(username, password):
        """Authenticate a user with username and password"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
                user = cursor.fetchone()
                
                if user and user['password_hash'] == UserModel.hash_password(password):
                    return user
                return None
        finally:
            conn.close()
    
    @staticmethod
    def update_user(user_id, user_data):
        """Update user information"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Check if new username or email conflicts with existing users
                if 'username' in user_data or 'email' in user_data:
                    cursor.execute("SELECT id FROM users WHERE (username = %s OR email = %s) AND id != %s",
                                 (user_data.get('username'), user_data.get('email'), user_id))
                    if cursor.fetchone():
                        return False  # Conflict with existing user
                
                # Build update query dynamically
                update_fields = []
                params = []
                
                if 'username' in user_data:
                    update_fields.append("username = %s")
                    params.append(user_data['username'])
                
                if 'email' in user_data:
                    update_fields.append("email = %s")
                    params.append(user_data['email'])
                
                if 'password' in user_data:
                    update_fields.append("password_hash = %s")
                    params.append(UserModel.hash_password(user_data['password']))

                if 'role' in user_data:
                    update_fields.append("role = %s")
                    params.append(user_data['role'])
                
                if not update_fields:
                    return False
                
                params.append(user_id)
                sql = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s"
                cursor.execute(sql, params)
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def delete_user(user_id):
        """Delete a user"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    @staticmethod
    def get_user_preferences(user_id):
        """Get user preferences"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM user_preferences WHERE user_id = %s", (user_id,))
                return cursor.fetchall()
        finally:
            conn.close()
    
    @staticmethod
    def set_user_preference(user_id, preference_type, preference_key, preference_value):
        """Set a user preference"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                sql = """INSERT INTO user_preferences (user_id, preference_type, preference_key, preference_value)
                         VALUES (%s, %s, %s, %s)
                         ON DUPLICATE KEY UPDATE preference_value = VALUES(preference_value)"""
                cursor.execute(sql, (user_id, preference_type, preference_key, preference_value))
                conn.commit()
                return True
        finally:
            conn.close()
    
    @staticmethod
    def delete_user_preference(user_id, preference_type, preference_key):
        """Delete a user preference"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM user_preferences WHERE user_id = %s AND preference_type = %s AND preference_key = %s",
                             (user_id, preference_type, preference_key))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close() 