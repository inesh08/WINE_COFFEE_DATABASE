from flask import Blueprint, request, jsonify
from models.pairing_model import PairingModel
from models.wine_model import WineModel
from models.coffee_model import CoffeeModel

pairing_bp = Blueprint('pairings', __name__)

@pairing_bp.route('/', methods=['GET'])
def get_pairings():
    """Get all pairings or search pairings with filters"""
    try:
        filters = {}
        
        # Get query parameters for filtering
        if request.args.get('wine_type'):
            filters['wine_type'] = request.args.get('wine_type')
        if request.args.get('coffee_type'):
            filters['coffee_type'] = request.args.get('coffee_type')
        if request.args.get('min_score'):
            filters['min_score'] = float(request.args.get('min_score'))
        if request.args.get('max_score'):
            filters['max_score'] = float(request.args.get('max_score'))
        
        if filters:
            pairings = PairingModel.search_pairings(filters)
        else:
            limit = request.args.get('limit', type=int)
            pairings = PairingModel.get_all_pairings(limit)
        
        return jsonify({'pairings': pairings, 'count': len(pairings)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/<int:pairing_id>', methods=['GET'])
def get_pairing(pairing_id):
    """Get a specific pairing by ID"""
    try:
        pairing = PairingModel.get_pairing_by_id(pairing_id)
        if not pairing:
            return jsonify({'error': 'Pairing not found'}), 404
        
        return jsonify(pairing), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/', methods=['POST'])
def create_pairing():
    """Create a new wine-coffee pairing"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['wine_id', 'coffee_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate pairing score if provided
        if 'pairing_score' in data and not (0 <= data['pairing_score'] <= 10):
            return jsonify({'error': 'Pairing score must be between 0 and 10'}), 400
        
        # Check if wine exists
        wine = WineModel.get_wine_by_id(data['wine_id'])
        if not wine:
            return jsonify({'error': 'Wine not found'}), 404
        
        # Check if coffee exists
        coffee = CoffeeModel.get_coffee_by_id(data['coffee_id'])
        if not coffee:
            return jsonify({'error': 'Coffee not found'}), 404
        
        pairing_id = PairingModel.create_pairing(data)
        if pairing_id:
            pairing = PairingModel.get_pairing_by_id(pairing_id)
            return jsonify(pairing), 201
        else:
            return jsonify({'error': 'Failed to create pairing'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/<int:pairing_id>', methods=['PUT'])
def update_pairing(pairing_id):
    """Update an existing pairing"""
    try:
        data = request.get_json()
        
        # Check if pairing exists
        existing_pairing = PairingModel.get_pairing_by_id(pairing_id)
        if not existing_pairing:
            return jsonify({'error': 'Pairing not found'}), 404
        
        # Validate pairing score if provided
        if 'pairing_score' in data and not (0 <= data['pairing_score'] <= 10):
            return jsonify({'error': 'Pairing score must be between 0 and 10'}), 400
        
        success = PairingModel.update_pairing(pairing_id, data)
        if success:
            updated_pairing = PairingModel.get_pairing_by_id(pairing_id)
            return jsonify(updated_pairing), 200
        else:
            return jsonify({'error': 'Failed to update pairing'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/<int:pairing_id>', methods=['DELETE'])
def delete_pairing(pairing_id):
    """Delete a pairing"""
    try:
        # Check if pairing exists
        existing_pairing = PairingModel.get_pairing_by_id(pairing_id)
        if not existing_pairing:
            return jsonify({'error': 'Pairing not found'}), 404
        
        success = PairingModel.delete_pairing(pairing_id)
        if success:
            return jsonify({'message': 'Pairing deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete pairing'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/wine/<int:wine_id>', methods=['GET'])
def get_pairings_by_wine(wine_id):
    """Get all pairings for a specific wine"""
    try:
        # Check if wine exists
        wine = WineModel.get_wine_by_id(wine_id)
        if not wine:
            return jsonify({'error': 'Wine not found'}), 404
        
        pairings = PairingModel.get_pairings_by_wine(wine_id)
        return jsonify({'pairings': pairings, 'count': len(pairings)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/coffee/<int:coffee_id>', methods=['GET'])
def get_pairings_by_coffee(coffee_id):
    """Get all pairings for a specific coffee"""
    try:
        # Check if coffee exists
        coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        if not coffee:
            return jsonify({'error': 'Coffee not found'}), 404
        
        pairings = PairingModel.get_pairings_by_coffee(coffee_id)
        return jsonify({'pairings': pairings, 'count': len(pairings)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/best', methods=['GET'])
def get_best_pairings():
    """Get the best rated pairings"""
    try:
        limit = request.args.get('limit', 10, type=int)
        pairings = PairingModel.get_best_pairings(limit)
        return jsonify({'pairings': pairings, 'count': len(pairings)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/statistics', methods=['GET'])
def get_pairing_statistics():
    """Get pairing statistics"""
    try:
        stats = PairingModel.get_pairing_statistics()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pairing_bp.route('/recommendations', methods=['GET'])
def get_pairing_recommendations():
    """Get pairing recommendations based on wine or coffee"""
    try:
        wine_id = request.args.get('wine_id', type=int)
        coffee_id = request.args.get('coffee_id', type=int)
        
        if wine_id and coffee_id:
            return jsonify({'error': 'Provide either wine_id or coffee_id, not both'}), 400
        elif wine_id:
            # Get coffee recommendations for a wine
            pairings = PairingModel.get_pairings_by_wine(wine_id)
            recommendations = [p for p in pairings if p['pairing_score'] >= 7.0]
            return jsonify({'recommendations': recommendations, 'count': len(recommendations)}), 200
        elif coffee_id:
            # Get wine recommendations for a coffee
            pairings = PairingModel.get_pairings_by_coffee(coffee_id)
            recommendations = [p for p in pairings if p['pairing_score'] >= 7.0]
            return jsonify({'recommendations': recommendations, 'count': len(recommendations)}), 200
        else:
            return jsonify({'error': 'Provide either wine_id or coffee_id'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500 