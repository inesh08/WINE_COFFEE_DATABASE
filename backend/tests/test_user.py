import pytest
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.user_model import UserModel
from db.connection import get_db_connection

class TestUserModel:
    def setup_method(self):
        """Setup test data"""
        self.test_user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
    
    def test_create_user(self):
        """Test creating a new user"""
        user_id = UserModel.create_user(self.test_user_data)
        assert user_id is not None
        assert isinstance(user_id, int)
        
        # Clean up
        UserModel.delete_user(user_id)
    
    def test_create_duplicate_user(self):
        """Test creating a user with duplicate username/email"""
        # Create first user
        user_id1 = UserModel.create_user(self.test_user_data)
        assert user_id1 is not None
        
        # Try to create duplicate user
        user_id2 = UserModel.create_user(self.test_user_data)
        assert user_id2 is None  # Should return None for duplicate
        
        # Clean up
        UserModel.delete_user(user_id1)
    
    def test_get_user_by_id(self):
        """Test retrieving a user by ID"""
        # Create a user first
        user_id = UserModel.create_user(self.test_user_data)
        
        # Retrieve the user
        user = UserModel.get_user_by_id(user_id)
        assert user is not None
        assert user['username'] == self.test_user_data['username']
        assert user['email'] == self.test_user_data['email']
        assert 'password_hash' not in user  # Password should not be returned
        
        # Clean up
        UserModel.delete_user(user_id)
    
    def test_get_user_by_username(self):
        """Test retrieving a user by username"""
        # Create a user first
        user_id = UserModel.create_user(self.test_user_data)
        
        # Retrieve the user
        user = UserModel.get_user_by_username(self.test_user_data['username'])
        assert user is not None
        assert user['username'] == self.test_user_data['username']
        assert user['email'] == self.test_user_data['email']
        
        # Clean up
        UserModel.delete_user(user_id)
    
    def test_authenticate_user(self):
        """Test user authentication"""
        # Create a user first
        user_id = UserModel.create_user(self.test_user_data)
        
        # Test correct credentials
        user = UserModel.authenticate_user(self.test_user_data['username'], self.test_user_data['password'])
        assert user is not None
        assert user['username'] == self.test_user_data['username']
        
        # Test incorrect password
        user = UserModel.authenticate_user(self.test_user_data['username'], 'wrongpassword')
        assert user is None
        
        # Test non-existent user
        user = UserModel.authenticate_user('nonexistent', 'password')
        assert user is None
        
        # Clean up
        UserModel.delete_user(user_id)
    
    def test_update_user(self):
        """Test updating a user"""
        # Create a user first
        user_id = UserModel.create_user(self.test_user_data)
        
        # Update the user
        update_data = {
            'email': 'updated@example.com',
            'password': 'newpassword123'
        }
        success = UserModel.update_user(user_id, update_data)
        assert success is True
        
        # Verify the update
        updated_user = UserModel.get_user_by_id(user_id)
        assert updated_user['email'] == 'updated@example.com'
        
        # Test authentication with new password
        user = UserModel.authenticate_user(self.test_user_data['username'], 'newpassword123')
        assert user is not None
        
        # Clean up
        UserModel.delete_user(user_id)
    
    def test_delete_user(self):
        """Test deleting a user"""
        # Create a user first
        user_id = UserModel.create_user(self.test_user_data)
        
        # Delete the user
        success = UserModel.delete_user(user_id)
        assert success is True
        
        # Verify deletion
        user = UserModel.get_user_by_id(user_id)
        assert user is None
    
    def test_user_preferences(self):
        """Test user preferences functionality"""
        # Create a user first
        user_id = UserModel.create_user(self.test_user_data)
        
        # Set preferences
        success = UserModel.set_user_preference(user_id, 'wine', 'type', 'red')
        assert success is True
        
        success = UserModel.set_user_preference(user_id, 'coffee', 'roast_level', 'dark')
        assert success is True
        
        # Get preferences
        preferences = UserModel.get_user_preferences(user_id)
        assert len(preferences) == 2
        
        # Update preference
        success = UserModel.set_user_preference(user_id, 'wine', 'type', 'white')
        assert success is True
        
        # Verify update
        preferences = UserModel.get_user_preferences(user_id)
        wine_pref = next((p for p in preferences if p['preference_key'] == 'type' and p['preference_type'] == 'wine'), None)
        assert wine_pref['preference_value'] == 'white'
        
        # Delete preference
        success = UserModel.delete_user_preference(user_id, 'wine', 'type')
        assert success is True
        
        # Verify deletion
        preferences = UserModel.get_user_preferences(user_id)
        assert len(preferences) == 1
        
        # Clean up
        UserModel.delete_user(user_id)
    
    def test_password_hashing(self):
        """Test password hashing functionality"""
        password = 'testpassword123'
        hash1 = UserModel.hash_password(password)
        hash2 = UserModel.hash_password(password)
        
        # Same password should produce same hash
        assert hash1 == hash2
        
        # Different password should produce different hash
        hash3 = UserModel.hash_password('differentpassword')
        assert hash1 != hash3
        
        # Hash should be a string
        assert isinstance(hash1, str)
        assert len(hash1) > 0

if __name__ == '__main__':
    pytest.main([__file__]) 