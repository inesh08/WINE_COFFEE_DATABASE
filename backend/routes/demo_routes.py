from flask import Blueprint, jsonify, request
from db.connection import get_db_connection
import pymysql

demo_bp = Blueprint('demo', __name__)

@demo_bp.route('/test/triggers/order-total', methods=['GET'])
def test_order_total_trigger():
    """Demonstrate the order total calculation trigger"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create a test order
        cursor.execute("INSERT INTO orders (customer_id, total_amount) VALUES (1, 0)")
        order_id = cursor.lastrowid
        
        # Add wine to order - trigger should calculate total
        cursor.execute("""
            INSERT INTO order_wines (order_id, wine_id, quantity, subtotal) 
            VALUES (%s, 1, 2, 14938.34)
        """, (order_id,))
        
        # Add coffee to order - trigger should update total
        cursor.execute("""
            INSERT INTO order_coffees (order_id, coffee_id, quantity, subtotal) 
            VALUES (%s, 1, 1, 2074.17)
        """, (order_id,))
        
        # Get the updated order with calculated total
        cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'message': 'Trigger test successful',
            'order': order,
            'expected_total': 14938.34 + 2074.17,
            'actual_total': float(order['total_amount'])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@demo_bp.route('/test/triggers/rating-validation', methods=['GET'])
def test_rating_validation_trigger():
    """Demonstrate rating validation trigger"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        results = []
        
        # Test valid rating
        try:
            cursor.execute("""
                INSERT INTO reviews (wine_id, rating, comment) 
                VALUES (1, 4, 'Great wine!')
            """)
            results.append({'test': 'Valid rating (4)', 'status': 'PASSED'})
        except Exception as e:
            results.append({'test': 'Valid rating (4)', 'status': f'FAILED: {str(e)}'})
        
        # Test invalid rating - should fail
        try:
            cursor.execute("""
                INSERT INTO reviews (wine_id, rating, comment) 
                VALUES (1, 6, 'Invalid high rating')
            """)
            results.append({'test': 'Invalid rating (6)', 'status': 'FAILED - Should have been blocked'})
        except Exception as e:
            results.append({'test': 'Invalid rating (6)', 'status': f'PASSED - Correctly blocked: {str(e)}'})
        
        # Test another invalid rating - should fail
        try:
            cursor.execute("""
                INSERT INTO reviews (coffee_id, rating, comment) 
                VALUES (1, 0, 'Invalid low rating')
            """)
            results.append({'test': 'Invalid rating (0)', 'status': 'FAILED - Should have been blocked'})
        except Exception as e:
            results.append({'test': 'Invalid rating (0)', 'status': f'PASSED - Correctly blocked: {str(e)}'})
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'message': 'Rating validation trigger test',
            'results': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@demo_bp.route('/procedures/<procedure_type>', methods=['GET'])
def call_procedure(procedure_type):
    """Call stored procedures"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if procedure_type == 'wines':
            cursor.execute("CALL GetWinesByType('red')")
            result = cursor.fetchall()
        elif procedure_type == 'coffees':
            cursor.execute("CALL GetCoffeesByRoastLevel('light')")
            result = cursor.fetchall()
        elif procedure_type == 'top-wines':
            cursor.execute("CALL GetTopRatedWines(5)")
            result = cursor.fetchall()
        elif procedure_type == 'top-coffees':
            cursor.execute("CALL GetTopRatedCoffees(5)")
            result = cursor.fetchall()
        elif procedure_type == 'pairings':
            cursor.execute("CALL GetPairings()")
            result = cursor.fetchall()
        else:
            return jsonify({'error': 'Invalid procedure'}), 400
        
        cursor.close()
        conn.close()
        
        return jsonify({'procedure': procedure_type, 'data': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@demo_bp.route('/queries/<query_type>', methods=['GET'])
def run_query(query_type):
    """Run SQL queries"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if query_type == 'all-wines':
            cursor.execute("SELECT * FROM wines")
        elif query_type == 'all-coffees':
            cursor.execute("SELECT * FROM coffees")
        elif query_type == 'orders':
            cursor.execute("SELECT * FROM orders LIMIT 10")
        elif query_type == 'customers':
            cursor.execute("SELECT * FROM customers LIMIT 10")
        elif query_type == 'reviews':
            cursor.execute("SELECT * FROM reviews LIMIT 10")
        else:
            return jsonify({'error': 'Invalid query'}), 400
        
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'query': query_type, 'data': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@demo_bp.route('/operations/add-customer', methods=['POST'])
def add_customer():
    """Add customer using stored procedure"""
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Call stored procedure
        cursor.callproc('AddCustomer', (
            data.get('name'),
            data.get('email'),
            data.get('phone'),
            data.get('address')
        ))
        
        # Get the result
        result = cursor.fetchall()
        customer_id = result[0]['customer_id']
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'message': 'Customer added successfully',
            'customer_id': customer_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

