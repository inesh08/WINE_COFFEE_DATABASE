from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Optional

from db.connection import get_db_connection


class OrderModel:
    """Data access helpers for orders, payments and fulfilment details."""

    @staticmethod
    def _decimal(value) -> Decimal:
        if isinstance(value, Decimal):
            return value
        try:
            return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        except Exception:
            return Decimal("0.00")

    @staticmethod
    def _combine_address(shipping: Dict) -> str:
        parts = [
            shipping.get('address_line1'),
            shipping.get('address_line2'),
            shipping.get('city'),
            shipping.get('state'),
            shipping.get('postal_code'),
            shipping.get('country'),
        ]
        return ', '.join(filter(None, (part.strip() if isinstance(part, str) else part for part in parts)))

    @staticmethod
    def _fetch_user(cursor, user_id: int):
        cursor.execute("SELECT id, username, email FROM users WHERE id = %s", (user_id,))
        return cursor.fetchone()

    @staticmethod
    def _ensure_customer(cursor, user_id: int, shipping: Dict) -> int:
        user = OrderModel._fetch_user(cursor, user_id)
        if not user:
            raise ValueError("User not found for order creation")

        email = user.get('email')
        cursor.execute("SELECT id FROM customers WHERE email = %s", (email,))
        row = cursor.fetchone()
        if row:
            customer_id = row['id']
            # Keep customer record up-to-date with the latest fulfilment info
            cursor.execute(
                """
                UPDATE customers
                SET name = COALESCE(%s, name),
                    phone = COALESCE(%s, phone),
                    address = COALESCE(%s, address)
                WHERE id = %s
                """,
                (
                    shipping.get('full_name') or user.get('username'),
                    shipping.get('phone'),
                    OrderModel._combine_address(shipping),
                    customer_id,
                )
            )
            return customer_id

        cursor.execute(
            """
            INSERT INTO customers (name, email, phone, address)
            VALUES (%s, %s, %s, %s)
            """,
            (
                shipping.get('full_name') or user.get('username'),
                email,
                shipping.get('phone'),
                OrderModel._combine_address(shipping)
            )
        )
        return cursor.lastrowid

    @staticmethod
    def save_payment_profile(user_id: int, profile: Dict):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO customer_payment_profiles
                    (user_id, full_name, phone, address_line1, address_line2, city, state,
                     postal_code, country, payment_method, upi_id, delivery_instructions)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        user_id,
                        profile.get('full_name'),
                        profile.get('phone'),
                        profile.get('address_line1'),
                        profile.get('address_line2'),
                        profile.get('city'),
                        profile.get('state'),
                        profile.get('postal_code'),
                        profile.get('country'),
                        profile.get('payment_method', 'cod'),
                        profile.get('upi_id'),
                        profile.get('delivery_instructions'),
                    )
                )
            conn.commit()
        finally:
            conn.close()

    @staticmethod
    def get_latest_payment_profile(user_id: int) -> Optional[Dict]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT full_name, phone, address_line1, address_line2, city, state,
                           postal_code, country, payment_method, upi_id, delivery_instructions
                    FROM customer_payment_profiles
                    WHERE user_id = %s
                    ORDER BY last_used DESC
                    LIMIT 1
                    """,
                    (user_id,)
                )
                return cursor.fetchone()
        finally:
            conn.close()

    @staticmethod
    def _insert_shipping_details(cursor, order_id: int, shipping: Dict):
        cursor.execute(
            """
            INSERT INTO order_shipping_details
            (order_id, full_name, phone, address_line1, address_line2,
             city, state, postal_code, country, delivery_instructions)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                order_id,
                shipping.get('full_name'),
                shipping.get('phone'),
                shipping.get('address_line1'),
                shipping.get('address_line2'),
                shipping.get('city'),
                shipping.get('state'),
                shipping.get('postal_code'),
                shipping.get('country'),
                shipping.get('delivery_instructions'),
            )
        )

    @staticmethod
    def _insert_items(cursor, order_id: int, items: List[Dict]):
        for item in items:
            quantity = int(item.get('quantity') or 1)
            price = OrderModel._decimal(item.get('price') or 0)
            subtotal = price * quantity
            category = item.get('category') or item.get('product_type') or item.get('recommendedType')
            product_id = item.get('product_id') or item.get('id') or item.get('recommendedId')

            if category == 'wine':
                cursor.execute(
                    """
                    INSERT INTO order_wines (order_id, wine_id, quantity, subtotal)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (order_id, product_id, quantity, subtotal)
                )
            elif category == 'coffee':
                cursor.execute(
                    """
                    INSERT INTO order_coffees (order_id, coffee_id, quantity, subtotal)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (order_id, product_id, quantity, subtotal)
                )

    @staticmethod
    def _insert_payment(cursor, order_id: int, payment: Dict):
        # Skip payment insertion - not required
        pass

    @staticmethod
    def create_order(order_data: Dict) -> Dict:
        user_id = order_data.get('user_id') or order_data.get('userId')
        if not user_id:
            raise ValueError("user_id is required to create an order")

        items = order_data.get('items') or []
        if not items:
            raise ValueError("At least one item is required to create an order")

        shipping = order_data.get('shipping') or {}
        payment = order_data.get('payment') or {}
        total = OrderModel._decimal(order_data.get('total') or 0)
        save_details = bool(order_data.get('saveDetails'))
        profile_payload = None

        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                customer_id = OrderModel._ensure_customer(cursor, user_id, shipping)
                cursor.execute(
                    "INSERT INTO orders (customer_id, total_amount) VALUES (%s, %s)",
                    (customer_id, total)
                )
                order_id = cursor.lastrowid

                OrderModel._insert_shipping_details(cursor, order_id, shipping)
                OrderModel._insert_items(cursor, order_id, items)
                OrderModel._insert_payment(cursor, order_id, payment)

                if save_details:
                    profile_payload = {
                        **shipping,
                        'payment_method': payment.get('payment_method') or payment.get('method'),
                        'upi_id': payment.get('upi_id') or payment.get('upiId'),
                        'delivery_instructions': shipping.get('delivery_instructions'),
                    }

            conn.commit()
            if profile_payload:
                OrderModel.save_payment_profile(user_id, profile_payload)
            return OrderModel.get_order_by_id(order_id)
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    @staticmethod
    def _fetch_order_items(cursor, order_id: int) -> List[Dict]:
        items = []

        cursor.execute(
            """
            SELECT ow.wine_id AS product_id, ow.quantity, ow.subtotal, w.name, w.type,
                   w.region, w.country, w.vintage, w.price
            FROM order_wines ow
            JOIN wines w ON w.id = ow.wine_id
            WHERE ow.order_id = %s
            """,
            (order_id,)
        )
        for row in cursor.fetchall():
            items.append({
                'id': row['product_id'],
                'category': 'wine',
                'name': row['name'],
                'type': row['type'],
                'region': row['region'],
                'country': row['country'],
                'vintage': row['vintage'],
                'quantity': row['quantity'],
                'price': float(row['price'] or 0),
                'subtotal': float(row['subtotal'] or 0),
            })

        cursor.execute(
            """
            SELECT oc.coffee_id AS product_id, oc.quantity, oc.subtotal, c.name, c.type,
                   c.origin, c.country, c.roast_level, c.price
            FROM order_coffees oc
            JOIN coffees c ON c.id = oc.coffee_id
            WHERE oc.order_id = %s
            """,
            (order_id,)
        )
        for row in cursor.fetchall():
            items.append({
                'id': row['product_id'],
                'category': 'coffee',
                'name': row['name'],
                'type': row['type'],
                'origin': row['origin'],
                'country': row['country'],
                'roast_level': row['roast_level'],
                'quantity': row['quantity'],
                'price': float(row['price'] or 0),
                'subtotal': float(row['subtotal'] or 0),
            })

        return items

    @staticmethod
    def get_order_by_id(order_id: int) -> Optional[Dict]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT o.id, o.customer_id, o.total_amount, o.order_date,
                           p.payment_mode, p.payment_status,
                           s.full_name, s.phone, s.address_line1, s.address_line2,
                           s.city, s.state, s.postal_code, s.country, s.delivery_instructions,
                           cust.name AS customer_name, cust.email AS customer_email, cust.phone AS customer_phone
                    FROM orders o
                    LEFT JOIN payments p ON p.order_id = o.id
                    LEFT JOIN order_shipping_details s ON s.order_id = o.id
                    LEFT JOIN customers cust ON cust.id = o.customer_id
                    WHERE o.id = %s
                    """,
                    (order_id,)
                )
                order = cursor.fetchone()
                if not order:
                    return None
                order['total_amount'] = float(order['total_amount'] or 0)
                order['total'] = order['total_amount']
                # Format order_date with timezone info for proper frontend display
                if order.get('order_date'):
                    order['order_date'] = order['order_date'].isoformat() + '+05:30'
                order['payment'] = {
                    'method': order.get('payment_mode'),
                    'status': order.get('payment_status'),
                }
                order['shipping'] = {
                    'full_name': order.get('full_name'),
                    'phone': order.get('phone'),
                    'address_line1': order.get('address_line1'),
                    'address_line2': order.get('address_line2'),
                    'city': order.get('city'),
                    'state': order.get('state'),
                    'postal_code': order.get('postal_code'),
                    'country': order.get('country'),
                    'delivery_instructions': order.get('delivery_instructions'),
                }
                order['customer'] = {
                    'id': order.get('customer_id'),
                    'name': order.get('customer_name'),
                    'email': order.get('customer_email'),
                    'phone': order.get('customer_phone'),
                }
                order['items'] = OrderModel._fetch_order_items(cursor, order_id)
                return order
        finally:
            conn.close()

    @staticmethod
    def get_orders_for_user(user_id: int) -> List[Dict]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                user = OrderModel._fetch_user(cursor, user_id)
                if not user:
                    return []
                cursor.execute(
                    """
                    SELECT o.id
                    FROM orders o
                    JOIN customers c ON c.id = o.customer_id
                    WHERE c.email = %s
                    ORDER BY o.order_date DESC
                    """,
                    (user.get('email'),)
                )
                order_ids = [row['id'] for row in cursor.fetchall()]

                orders = []
                for order_id in order_ids:
                    order = OrderModel.get_order_by_id(order_id)
                    if order:
                        orders.append(order)
                return orders
        finally:
            conn.close()

    @staticmethod
    def get_all_orders() -> List[Dict]:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT o.id, o.customer_id, o.total_amount, o.order_date,
                           p.payment_mode, p.payment_status,
                           s.full_name, s.phone, s.address_line1, s.address_line2,
                           s.city, s.state, s.postal_code, s.country, s.delivery_instructions,
                           cust.name AS customer_name, cust.email AS customer_email, cust.phone AS customer_phone
                    FROM orders o
                    LEFT JOIN payments p ON p.order_id = o.id
                    LEFT JOIN order_shipping_details s ON s.order_id = o.id
                    LEFT JOIN customers cust ON cust.id = o.customer_id
                    ORDER BY o.order_date DESC
                    """
                )
                rows = cursor.fetchall()
                orders = []
                for row in rows:
                    order = {
                        'id': row['id'],
                        'customer_id': row['customer_id'],
                        'total_amount': float(row['total_amount'] or 0),
                        'order_date': (row['order_date'].isoformat() + '+05:30') if row.get('order_date') else None,
                        'payment': {
                            'method': row.get('payment_mode'),
                            'status': row.get('payment_status')
                        },
                        'shipping': {
                            'full_name': row.get('full_name'),
                            'phone': row.get('phone'),
                            'address_line1': row.get('address_line1'),
                            'address_line2': row.get('address_line2'),
                            'city': row.get('city'),
                            'state': row.get('state'),
                            'postal_code': row.get('postal_code'),
                            'country': row.get('country'),
                            'delivery_instructions': row.get('delivery_instructions'),
                        },
                        'customer': {
                            'id': row.get('customer_id'),
                            'name': row.get('customer_name'),
                            'email': row.get('customer_email'),
                            'phone': row.get('customer_phone'),
                        }
                    }
                    order['items'] = OrderModel._fetch_order_items(cursor, row['id'])
                    orders.append(order)
                return orders
        finally:
            conn.close()

