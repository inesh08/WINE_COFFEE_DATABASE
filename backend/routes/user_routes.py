from flask import Blueprint, request, jsonify
from models.user_model import UserModel

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate email format (basic validation)
        if '@' not in data['email']:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password length
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Enforce lowercase username for consistency
        data['username'] = data['username'].strip()
        data['email'] = data['email'].strip()
        data['role'] = 'customer'
        
        user_id = UserModel.create_user(data)
        if user_id:
            user = UserModel.get_user_by_id(user_id)
            return jsonify({
                'message': 'User registered successfully',
                'user': user
            }), 201
        else:
            return jsonify({'error': 'Username or email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/login', methods=['POST'])
def login():
    """Authenticate a user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        user = UserModel.authenticate_user(data['username'], data['password'])
        if user:
            # Remove password hash from response
            user_data = {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role'],
                'created_at': user['created_at']
            }
            return jsonify({
                'message': 'Login successful',
                'user': user_data
            }), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user information"""
    try:
        user = UserModel.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user information"""
    try:
        data = request.get_json()
        
        # Check if user exists
        existing_user = UserModel.get_user_by_id(user_id)
        if not existing_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Validate email format if provided
        if 'email' in data and '@' not in data['email']:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password length if provided
        if 'password' in data and len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        success = UserModel.update_user(user_id, data)
        if success:
            updated_user = UserModel.get_user_by_id(user_id)
            return jsonify({
                'message': 'User updated successfully',
                'user': updated_user
            }), 200
        else:
            return jsonify({'error': 'Username or email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user"""
    try:
        # Check if user exists
        existing_user = UserModel.get_user_by_id(user_id)
        if not existing_user:
            return jsonify({'error': 'User not found'}), 404
        
        success = UserModel.delete_user(user_id)
        if success:
            return jsonify({'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete user'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>/preferences', methods=['GET'])
def get_user_preferences(user_id):
    """Get user preferences"""
    try:
        # Check if user exists
        user = UserModel.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        preferences = UserModel.get_user_preferences(user_id)
        return jsonify({'preferences': preferences}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>/preferences', methods=['POST'])
def set_user_preference(user_id):
    """Set a user preference"""
    try:
        data = request.get_json()
        
        # Check if user exists
        user = UserModel.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Validate required fields
        required_fields = ['preference_type', 'preference_key', 'preference_value']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate preference type
        if data['preference_type'] not in ['wine', 'coffee']:
            return jsonify({'error': 'Preference type must be either "wine" or "coffee"'}), 400
        
        success = UserModel.set_user_preference(
            user_id, data['preference_type'], data['preference_key'], data['preference_value']
        )
        if success:
            return jsonify({'message': 'Preference set successfully'}), 200
        else:
            return jsonify({'error': 'Failed to set preference'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>/preferences/<preference_type>/<preference_key>', methods=['DELETE'])
def delete_user_preference(user_id, preference_type, preference_key):
    """Delete a user preference"""
    try:
        # Check if user exists
        user = UserModel.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        success = UserModel.delete_user_preference(user_id, preference_type, preference_key)
        if success:
            return jsonify({'message': 'Preference deleted successfully'}), 200
        else:
            return jsonify({'error': 'Preference not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500 