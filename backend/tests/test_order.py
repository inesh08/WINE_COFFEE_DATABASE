import os
import sys
import time

import pytest

# Ensure backend modules are discoverable
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.order_model import OrderModel  # noqa: E402
from models.wine_model import WineModel  # noqa: E402
from models.coffee_model import CoffeeModel  # noqa: E402
from models.user_model import UserModel  # noqa: E402
from db.connection import get_db_connection  # noqa: E402


class TestOrderModel:
    def setup_method(self):
        unique_suffix = str(int(time.time() * 1000))
        self.user_payload = {
            'username': f'testuser_{unique_suffix}',
            'email': f'testuser_{unique_suffix}@example.com',
            'password': 'securePass!1',
            'role': 'customer',
        }
        self.user_id = UserModel.create_user(self.user_payload)
        assert self.user_id is not None

        self.test_wine = {
            'name': f'Unit Test Wine {unique_suffix}',
            'type': 'red',
            'region': 'Test Valley',
            'country': 'Testland',
            'vintage': 2020,
            'price': 1200.00,
            'description': 'Test description',
            'alcohol_content': 13.5,
            'acidity_level': 'medium',
            'body_level': 'full',
            'tannin_level': 'medium',
            'sweetness_level': 'dry'
        }
        self.wine_id = WineModel.create_wine(self.test_wine)

        self.test_coffee = {
            'name': f'Unit Test Coffee {unique_suffix}',
            'type': 'arabica',
            'origin': 'Test Origin',
            'country': 'Testland',
            'roast_level': 'medium',
            'price': 800.00,
            'description': 'Test coffee description',
            'acidity_level': 'medium'
        }
        self.coffee_id = CoffeeModel.create_coffee(self.test_coffee)

        self.created_order_ids = []

    def teardown_method(self):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                for order_id in self.created_order_ids:
                    cursor.execute("DELETE FROM payments WHERE order_id = %s", (order_id,))
                    cursor.execute("DELETE FROM order_shipping_details WHERE order_id = %s", (order_id,))
                    cursor.execute("DELETE FROM order_wines WHERE order_id = %s", (order_id,))
                    cursor.execute("DELETE FROM order_coffees WHERE order_id = %s", (order_id,))
                    cursor.execute("DELETE FROM orders WHERE id = %s", (order_id,))
                cursor.execute("DELETE FROM customer_payment_profiles WHERE user_id = %s", (self.user_id,))
                cursor.execute("DELETE FROM customers WHERE email = %s", (self.user_payload['email'],))
            conn.commit()
        finally:
            conn.close()

        if self.wine_id:
            WineModel.delete_wine(self.wine_id)
        if self.coffee_id:
            CoffeeModel.delete_coffee(self.coffee_id)
        if self.user_id:
            UserModel.delete_user(self.user_id)

    def test_create_and_fetch_order(self):
        shipping = {
            'full_name': 'Test User',
            'phone': '9998887776',
            'address_line1': '123 Test Street',
            'address_line2': 'Apt 4',
            'city': 'Test City',
            'state': 'Test State',
            'postal_code': '560001',
            'country': 'Test Country',
            'delivery_instructions': 'Leave at the door',
        }
        payment = {
            'payment_method': 'upi',
            'upi_id': 'testupi@upi',
        }
        items = [
            {'id': self.wine_id, 'category': 'wine', 'quantity': 1, 'price': 1200},
            {'id': self.coffee_id, 'category': 'coffee', 'quantity': 2, 'price': 800},
        ]

        order = OrderModel.create_order({
            'user_id': self.user_id,
            'items': items,
            'shipping': shipping,
            'payment': payment,
            'total': 1200 + 1600,
            'saveDetails': True,
        })

        assert order is not None
        assert 'id' in order
        assert len(order.get('items', [])) == 2
        assert order['payment']['method'] == 'upi'
        assert order['shipping']['full_name'] == shipping['full_name']

        self.created_order_ids.append(order['id'])

        orders = OrderModel.get_orders_for_user(self.user_id)
        assert isinstance(orders, list)
        assert any(o['id'] == order['id'] for o in orders)

