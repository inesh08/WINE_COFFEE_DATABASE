from flask import Blueprint, request, jsonify
from models.wine_model import WineModel
from models.review_model import ReviewModel

wine_bp = Blueprint('wines', __name__)

@wine_bp.route('/', methods=['GET'])
def get_wines():
    """Get all wines or search wines with filters"""
    try:
        # Fallback to direct query if model fails
        try:
            filters = {}
            
            # Get query parameters for filtering
            if request.args.get('type'):
                filters['type'] = request.args.get('type')
            if request.args.get('region'):
                filters['region'] = request.args.get('region')
            if request.args.get('country'):
                filters['country'] = request.args.get('country')
            if request.args.get('min_price'):
                filters['min_price'] = float(request.args.get('min_price'))
            if request.args.get('max_price'):
                filters['max_price'] = float(request.args.get('max_price'))
            
            if filters:
                wines = WineModel.search_wines(filters)
            else:
                wines = WineModel.get_all_wines()
            
            return jsonify({'wines': wines, 'count': len(wines)}), 200
        except Exception as model_error:
            # Fallback to direct database query
            from db.connection import get_db_connection
            conn = get_db_connection()
            try:
                with conn.cursor() as cursor:
                    cursor.execute("SELECT * FROM wines ORDER BY name")
                    wines = cursor.fetchall()
                return jsonify({'wines': wines, 'count': len(wines)}), 200
            finally:
                conn.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wine_bp.route('/<int:wine_id>', methods=['GET'])
def get_wine(wine_id):
    """Get a specific wine by ID"""
    try:
        wine = WineModel.get_wine_by_id(wine_id)
        if not wine:
            return jsonify({'error': 'Wine not found'}), 404
        
        # Get average rating for the wine
        rating_info = ReviewModel.get_average_rating_wine(wine_id)
        wine['rating_info'] = rating_info
        
        return jsonify(wine), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wine_bp.route('/', methods=['POST'])
def create_wine():
    """Create a new wine"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        wine_id = WineModel.create_wine(data)
        if wine_id:
            wine = WineModel.get_wine_by_id(wine_id)
            return jsonify(wine), 201
        else:
            return jsonify({'error': 'Failed to create wine'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wine_bp.route('/<int:wine_id>', methods=['PUT'])
def update_wine(wine_id):
    """Update an existing wine"""
    try:
        data = request.get_json()
        
        # Check if wine exists
        existing_wine = WineModel.get_wine_by_id(wine_id)
        if not existing_wine:
            return jsonify({'error': 'Wine not found'}), 404
        
        success = WineModel.update_wine(wine_id, data)
        if success:
            updated_wine = WineModel.get_wine_by_id(wine_id)
            return jsonify(updated_wine), 200
        else:
            return jsonify({'error': 'Failed to update wine'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wine_bp.route('/<int:wine_id>', methods=['DELETE'])
def delete_wine(wine_id):
    """Delete a wine"""
    try:
        # Check if wine exists
        existing_wine = WineModel.get_wine_by_id(wine_id)
        if not existing_wine:
            return jsonify({'error': 'Wine not found'}), 404
        
        success = WineModel.delete_wine(wine_id)
        if success:
            return jsonify({'message': 'Wine deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete wine'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wine_bp.route('/<int:wine_id>/reviews', methods=['GET'])
def get_wine_reviews(wine_id):
    """Get all reviews for a specific wine"""
    try:
        # Check if wine exists
        wine = WineModel.get_wine_by_id(wine_id)
        if not wine:
            return jsonify({'error': 'Wine not found'}), 404
        
        limit = request.args.get('limit', type=int)
        reviews = ReviewModel.get_reviews_by_wine(wine_id, limit)
        return jsonify({'reviews': reviews, 'count': len(reviews)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wine_bp.route('/types', methods=['GET'])
def get_wine_types():
    """Get all unique wine types"""
    try:
        types = WineModel.get_wine_types()
        return jsonify({'types': types}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wine_bp.route('/regions', methods=['GET'])
def get_wine_regions():
    """Get all unique wine regions"""
    try:
        regions = WineModel.get_wine_regions()
        return jsonify({'regions': regions}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wine_bp.route('/top-rated', methods=['GET'])
def get_top_rated_wines():
    """Get top rated wines"""
    try:
        limit = request.args.get('limit', 10, type=int)
        wines = ReviewModel.get_top_rated_wines(limit)
        return jsonify({'wines': wines, 'count': len(wines)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 