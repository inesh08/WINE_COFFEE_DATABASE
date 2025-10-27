from flask import Blueprint, request, jsonify
from models.review_model import ReviewModel
from models.wine_model import WineModel
from models.coffee_model import CoffeeModel

review_bp = Blueprint('reviews', __name__)

@review_bp.route('/', methods=['POST'])
def create_review():
    """Create a new review"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'rating']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate that either wine_id or coffee_id is provided, but not both
        if 'wine_id' in data and 'coffee_id' in data:
            return jsonify({'error': 'Cannot review both wine and coffee in the same review'}), 400
        if 'wine_id' not in data and 'coffee_id' not in data:
            return jsonify({'error': 'Must provide either wine_id or coffee_id'}), 400
        
        # Validate rating range
        if not (1 <= data['rating'] <= 5):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        # Check if wine/coffee exists
        if 'wine_id' in data:
            wine = WineModel.get_wine_by_id(data['wine_id'])
            if not wine:
                return jsonify({'error': 'Wine not found'}), 404
        else:
            coffee = CoffeeModel.get_coffee_by_id(data['coffee_id'])
            if not coffee:
                return jsonify({'error': 'Coffee not found'}), 404
        
        review_id = ReviewModel.create_review(data)
        if review_id:
            review = ReviewModel.get_review_by_id(review_id)
            return jsonify(review), 201
        else:
            return jsonify({'error': 'Failed to create review'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@review_bp.route('/<int:review_id>', methods=['GET'])
def get_review(review_id):
    """Get a specific review by ID"""
    try:
        review = ReviewModel.get_review_by_id(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        return jsonify(review), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@review_bp.route('/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    """Update an existing review"""
    try:
        data = request.get_json()
        
        # Check if review exists
        existing_review = ReviewModel.get_review_by_id(review_id)
        if not existing_review:
            return jsonify({'error': 'Review not found'}), 404
        
        # Validate rating range if provided
        if 'rating' in data and not (1 <= data['rating'] <= 5):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        success = ReviewModel.update_review(review_id, data)
        if success:
            updated_review = ReviewModel.get_review_by_id(review_id)
            return jsonify(updated_review), 200
        else:
            return jsonify({'error': 'Failed to update review'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@review_bp.route('/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    """Delete a review"""
    try:
        # Check if review exists
        existing_review = ReviewModel.get_review_by_id(review_id)
        if not existing_review:
            return jsonify({'error': 'Review not found'}), 404
        
        success = ReviewModel.delete_review(review_id)
        if success:
            return jsonify({'message': 'Review deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete review'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@review_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_reviews(user_id):
    """Get all reviews by a specific user"""
    try:
        limit = request.args.get('limit', type=int)
        reviews = ReviewModel.get_reviews_by_user(user_id, limit)
        return jsonify({'reviews': reviews, 'count': len(reviews)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@review_bp.route('/wine/<int:wine_id>', methods=['GET'])
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

@review_bp.route('/coffee/<int:coffee_id>', methods=['GET'])
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

@review_bp.route('/wine/<int:wine_id>/rating', methods=['GET'])
def get_wine_rating(wine_id):
    """Get average rating for a wine"""
    try:
        # Check if wine exists
        wine = WineModel.get_wine_by_id(wine_id)
        if not wine:
            return jsonify({'error': 'Wine not found'}), 404
        
        rating_info = ReviewModel.get_average_rating_wine(wine_id)
        return jsonify(rating_info), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@review_bp.route('/coffee/<int:coffee_id>/rating', methods=['GET'])
def get_coffee_rating(coffee_id):
    """Get average rating for a coffee"""
    try:
        # Check if coffee exists
        coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        if not coffee:
            return jsonify({'error': 'Coffee not found'}), 404
        
        rating_info = ReviewModel.get_average_rating_coffee(coffee_id)
        return jsonify(rating_info), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@review_bp.route('/top-wines', methods=['GET'])
def get_top_rated_wines():
    """Get top rated wines"""
    try:
        limit = request.args.get('limit', 10, type=int)
        wines = ReviewModel.get_top_rated_wines(limit)
        return jsonify({'wines': wines, 'count': len(wines)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@review_bp.route('/top-coffees', methods=['GET'])
def get_top_rated_coffees():
    """Get top rated coffees"""
    try:
        limit = request.args.get('limit', 10, type=int)
        coffees = ReviewModel.get_top_rated_coffees(limit)
        return jsonify({'coffees': coffees, 'count': len(coffees)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 