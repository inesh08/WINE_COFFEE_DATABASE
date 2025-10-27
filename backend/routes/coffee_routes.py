from flask import Blueprint, request, jsonify
from models.coffee_model import CoffeeModel
from models.review_model import ReviewModel

coffee_bp = Blueprint('coffees', __name__)

@coffee_bp.route('/', methods=['GET'])
def get_coffees():
    """Get all coffees or search coffees with filters"""
    try:
        filters = {}
        
        # Get query parameters for filtering
        if request.args.get('type'):
            filters['type'] = request.args.get('type')
        if request.args.get('origin'):
            filters['origin'] = request.args.get('origin')
        if request.args.get('country'):
            filters['country'] = request.args.get('country')
        if request.args.get('roast_level'):
            filters['roast_level'] = request.args.get('roast_level')
        if request.args.get('min_price'):
            filters['min_price'] = float(request.args.get('min_price'))
        if request.args.get('max_price'):
            filters['max_price'] = float(request.args.get('max_price'))
        
        if filters:
            coffees = CoffeeModel.search_coffees(filters)
        else:
            coffees = CoffeeModel.get_all_coffees()
        
        return jsonify({'coffees': coffees, 'count': len(coffees)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/<int:coffee_id>', methods=['GET'])
def get_coffee(coffee_id):
    """Get a specific coffee by ID"""
    try:
        coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        if not coffee:
            return jsonify({'error': 'Coffee not found'}), 404
        
        # Get average rating for the coffee
        rating_info = ReviewModel.get_average_rating_coffee(coffee_id)
        coffee['rating_info'] = rating_info
        
        return jsonify(coffee), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/', methods=['POST'])
def create_coffee():
    """Create a new coffee"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        coffee_id = CoffeeModel.create_coffee(data)
        if coffee_id:
            coffee = CoffeeModel.get_coffee_by_id(coffee_id)
            return jsonify(coffee), 201
        else:
            return jsonify({'error': 'Failed to create coffee'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/<int:coffee_id>', methods=['PUT'])
def update_coffee(coffee_id):
    """Update an existing coffee"""
    try:
        data = request.get_json()
        
        # Check if coffee exists
        existing_coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        if not existing_coffee:
            return jsonify({'error': 'Coffee not found'}), 404
        
        success = CoffeeModel.update_coffee(coffee_id, data)
        if success:
            updated_coffee = CoffeeModel.get_coffee_by_id(coffee_id)
            return jsonify(updated_coffee), 200
        else:
            return jsonify({'error': 'Failed to update coffee'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/<int:coffee_id>', methods=['DELETE'])
def delete_coffee(coffee_id):
    """Delete a coffee"""
    try:
        # Check if coffee exists
        existing_coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        if not existing_coffee:
            return jsonify({'error': 'Coffee not found'}), 404
        
        success = CoffeeModel.delete_coffee(coffee_id)
        if success:
            return jsonify({'message': 'Coffee deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete coffee'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/<int:coffee_id>/reviews', methods=['GET'])
def get_coffee_reviews(coffee_id):
    """Get all reviews for a specific coffee"""
    try:
        # Check if coffee exists
        coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        if not coffee:
            return jsonify({'error': 'Coffee not found'}), 404
        
        limit = request.args.get('limit', type=int)
        reviews = ReviewModel.get_reviews_by_coffee(coffee_id, limit)
        return jsonify({'reviews': reviews, 'count': len(reviews)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/types', methods=['GET'])
def get_coffee_types():
    """Get all unique coffee types"""
    try:
        types = CoffeeModel.get_coffee_types()
        return jsonify({'types': types}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/origins', methods=['GET'])
def get_coffee_origins():
    """Get all unique coffee origins"""
    try:
        origins = CoffeeModel.get_coffee_origins()
        return jsonify({'origins': origins}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/roast-levels', methods=['GET'])
def get_roast_levels():
    """Get all unique roast levels"""
    try:
        roast_levels = CoffeeModel.get_roast_levels()
        return jsonify({'roast_levels': roast_levels}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coffee_bp.route('/top-rated', methods=['GET'])
def get_top_rated_coffees():
    """Get top rated coffees"""
    try:
        limit = request.args.get('limit', 10, type=int)
        coffees = ReviewModel.get_top_rated_coffees(limit)
        return jsonify({'coffees': coffees, 'count': len(coffees)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 