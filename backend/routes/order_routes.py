from flask import Blueprint, jsonify, request

from models.order_model import OrderModel

order_bp = Blueprint('orders', __name__)


def _validate_order_payload(data):
    required_root = ['userId', 'items', 'shipping', 'total']
    missing = [field for field in required_root if field not in data]
    if missing:
        raise ValueError(f"Missing required field(s): {', '.join(missing)}")

    if not isinstance(data.get('items'), list) or len(data['items']) == 0:
        raise ValueError("Order must contain at least one item")

    shipping_required = ['full_name', 'phone', 'address_line1', 'city', 'state', 'postal_code', 'country']
    missing_shipping = [field for field in shipping_required if not data['shipping'].get(field)]
    if missing_shipping:
        raise ValueError(f"Shipping details incomplete: {', '.join(missing_shipping)}")


def _ensure_admin(payload):
    if not payload or payload.get('role') != 'admin':
        raise PermissionError('Admin privileges required')


@order_bp.route('/', methods=['POST'])
def create_order():
    """Persist a completed checkout for an authenticated user."""
    try:
        payload = request.get_json() or {}
        _validate_order_payload(payload)

        order = OrderModel.create_order({
            'user_id': payload.get('userId'),
            'items': payload.get('items', []),
            'shipping': payload.get('shipping', {}),
            'payment': payload.get('payment', {}),
            'total': payload.get('total'),
            'saveDetails': payload.get('saveDetails', True),
        })
        return jsonify({'message': 'Order recorded successfully', 'order': order}), 201
    except ValueError as validation_error:
        return jsonify({'error': str(validation_error)}), 400
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@order_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Fetch a specific order with items and fulfilment detail."""
    try:
        order = OrderModel.get_order_by_id(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        return jsonify(order), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@order_bp.route('/customer/<int:user_id>', methods=['GET'])
def get_orders_for_user(user_id):
    """Retrieve all orders placed by a given authenticated user."""
    try:
        orders = OrderModel.get_orders_for_user(user_id)
        return jsonify({'orders': orders, 'count': len(orders)}), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@order_bp.route('/payment-profile/<int:user_id>', methods=['GET'])
def get_payment_profile(user_id):
    """Return the last used payment/shipping profile for a user."""
    try:
        profile = OrderModel.get_latest_payment_profile(user_id)
        if not profile:
            return jsonify({'profile': None}), 200
        return jsonify({'profile': profile}), 200
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@order_bp.route('/all', methods=['GET'])
def get_all_orders():
    """Return all recorded orders with customer and shipping details."""
    try:
        # Expect admin identity in headers (e.g., set by frontend from session storage)
        admin_payload = request.headers.get('X-Admin-Identity')
        payload = None
        if admin_payload:
            try:
                import json
                payload = json.loads(admin_payload)
            except Exception:
                payload = None
        _ensure_admin(payload)

        orders = OrderModel.get_all_orders()
        return jsonify({'orders': orders, 'count': len(orders)}), 200
    except PermissionError as exc:
        return jsonify({'error': str(exc)}), 403
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500

