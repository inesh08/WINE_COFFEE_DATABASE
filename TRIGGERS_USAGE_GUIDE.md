# 🔔 Database Triggers - Where They're Called in the Code

## Overview
Triggers in MySQL are **automatically executed** by the database when certain events occur (INSERT, UPDATE, DELETE). You don't need to explicitly call them in your Python code - they fire automatically when the triggering SQL statement is executed.

---

## How Triggers Work

### Traditional Function Call (Manual):
```python
# You explicitly call a function
result = calculate_total(order_id)
```

### Database Trigger (Automatic):
```python
# You just insert data
cursor.execute("INSERT INTO order_wines ...")
# ↓ Trigger automatically fires!
# calculate_order_total_wines trigger runs
# Updates order.total_amount automatically
```

---

## 🎯 All 11 Triggers and Where They're Triggered

### 1. Timestamp Preservation Triggers

#### **wines_update_timestamp**
- **Trigger Type**: BEFORE UPDATE on `wines`
- **Auto-fires when**: Any wine is updated

**Called in code:**
```python
# backend/models/wine_model.py
def update_wine(wine_id, wine_data):
    cursor.execute("""
        UPDATE wines 
        SET name = %s, type = %s, region = %s, ...
        WHERE id = %s
    """, (..., wine_id))
    # ↑ Trigger automatically preserves created_at!
```

**File:** `backend/models/wine_model.py` → `update_wine()` method

---

#### **coffees_update_timestamp**
- **Trigger Type**: BEFORE UPDATE on `coffees`
- **Auto-fires when**: Any coffee is updated

**Called in code:**
```python
# backend/models/coffee_model.py
def update_coffee(coffee_id, coffee_data):
    cursor.execute("""
        UPDATE coffees 
        SET name = %s, type = %s, origin = %s, ...
        WHERE id = %s
    """, (..., coffee_id))
    # ↑ Trigger automatically preserves created_at!
```

**File:** `backend/models/coffee_model.py` → `update_coffee()` method

---

### 2. Order Total Calculation Triggers

#### **calculate_order_total_wines** (INSERT)
- **Trigger Type**: AFTER INSERT on `order_wines`
- **Auto-fires when**: Wine is added to an order

**Called in code:**
```python
# backend/models/order_model.py (line 165)
def _insert_items(cursor, order_id, items):
    if category == 'wine':
        cursor.execute("""
            INSERT INTO order_wines (order_id, wine_id, quantity, subtotal)
            VALUES (%s, %s, %s, %s)
        """, (order_id, product_id, quantity, subtotal))
        # ↑ Trigger automatically calculates order total!
```

**File:** `backend/models/order_model.py` → `_insert_items()` method (line 165)

---

#### **calculate_order_total_coffees** (INSERT)
- **Trigger Type**: AFTER INSERT on `order_coffees`
- **Auto-fires when**: Coffee is added to an order

**Called in code:**
```python
# backend/models/order_model.py (line 172)
def _insert_items(cursor, order_id, items):
    elif category == 'coffee':
        cursor.execute("""
            INSERT INTO order_coffees (order_id, coffee_id, quantity, subtotal)
            VALUES (%s, %s, %s, %s)
        """, (order_id, product_id, quantity, subtotal))
        # ↑ Trigger automatically calculates order total!
```

**File:** `backend/models/order_model.py` → `_insert_items()` method (line 172)

---

#### **calculate_order_total_wines_update** (UPDATE)
- **Trigger Type**: AFTER UPDATE on `order_wines`
- **Auto-fires when**: Wine quantity/subtotal is updated

**Would be called in code if implemented:**
```python
# Future implementation
cursor.execute("""
    UPDATE order_wines 
    SET quantity = %s, subtotal = %s 
    WHERE order_id = %s AND wine_id = %s
""", (new_qty, new_subtotal, order_id, wine_id))
# ↑ Trigger would automatically recalculate order total!
```

**Status:** ⚠️ Not currently used (orders are not editable)

---

#### **calculate_order_total_coffees_update** (UPDATE)
- **Trigger Type**: AFTER UPDATE on `order_coffees`
- **Auto-fires when**: Coffee quantity/subtotal is updated

**Would be called in code if implemented:**
```python
# Future implementation
cursor.execute("""
    UPDATE order_coffees 
    SET quantity = %s, subtotal = %s 
    WHERE order_id = %s AND coffee_id = %s
""", (new_qty, new_subtotal, order_id, coffee_id))
# ↑ Trigger would automatically recalculate order total!
```

**Status:** ⚠️ Not currently used (orders are not editable)

---

#### **calculate_order_total_wines_delete** (DELETE)
- **Trigger Type**: AFTER DELETE on `order_wines`
- **Auto-fires when**: Wine is removed from an order

**Would be called in code if implemented:**
```python
# Future implementation
cursor.execute("""
    DELETE FROM order_wines 
    WHERE order_id = %s AND wine_id = %s
""", (order_id, wine_id))
# ↑ Trigger would automatically recalculate order total!
```

**Status:** ⚠️ Not currently used (order items are not deletable)

---

#### **calculate_order_total_coffees_delete** (DELETE)
- **Trigger Type**: AFTER DELETE on `order_coffees`
- **Auto-fires when**: Coffee is removed from an order

**Would be called in code if implemented:**
```python
# Future implementation
cursor.execute("""
    DELETE FROM order_coffees 
    WHERE order_id = %s AND coffee_id = %s
""", (order_id, coffee_id))
# ↑ Trigger would automatically recalculate order total!
```

**Status:** ⚠️ Not currently used (order items are not deletable)

---

### 3. Validation Triggers

#### **validate_wine_rating**
- **Trigger Type**: BEFORE INSERT on `reviews`
- **Auto-fires when**: Wine review is created
- **Validates**: Rating must be 1-5

**Called in code:**
```python
# backend/models/review_model.py
def create_review(review_data):
    cursor.execute("""
        INSERT INTO reviews (wine_id, coffee_id, rating, comment)
        VALUES (%s, %s, %s, %s)
    """, (wine_id, None, rating, comment))
    # ↑ Trigger automatically validates rating is 1-5!
    # If rating < 1 or > 5, trigger raises error
```

**File:** `backend/models/review_model.py` → `create_review()` method

---

#### **validate_coffee_rating**
- **Trigger Type**: BEFORE INSERT on `reviews`
- **Auto-fires when**: Coffee review is created
- **Validates**: Rating must be 1-5

**Called in code:**
```python
# backend/models/review_model.py
def create_review(review_data):
    cursor.execute("""
        INSERT INTO reviews (wine_id, coffee_id, rating, comment)
        VALUES (%s, %s, %s, %s)
    """, (None, coffee_id, rating, comment))
    # ↑ Trigger automatically validates rating is 1-5!
    # If rating < 1 or > 5, trigger raises error
```

**File:** `backend/models/review_model.py` → `create_review()` method

---

#### **validate_pairing_score**
- **Trigger Type**: BEFORE INSERT on `pairings`
- **Auto-fires when**: Wine-coffee pairing is created
- **Validates**: Score must be 0-10

**Called in code:**
```python
# backend/models/pairing_model.py
def create_pairing(pairing_data):
    cursor.execute("""
        INSERT INTO pairings (wine_id, coffee_id, pairing_score, description)
        VALUES (%s, %s, %s, %s)
    """, (wine_id, coffee_id, score, description))
    # ↑ Trigger automatically validates score is 0-10!
    # If score < 0 or > 10, trigger raises error
```

**File:** `backend/models/pairing_model.py` → `create_pairing()` method

---

## 📍 Code Locations Summary

### Active Triggers (Currently Being Used):

| Trigger Name | File | Function | Line |
|-------------|------|----------|------|
| `wines_update_timestamp` | `backend/models/wine_model.py` | `update_wine()` | ~50 |
| `coffees_update_timestamp` | `backend/models/coffee_model.py` | `update_coffee()` | ~50 |
| `calculate_order_total_wines` | `backend/models/order_model.py` | `_insert_items()` | 165 |
| `calculate_order_total_coffees` | `backend/models/order_model.py` | `_insert_items()` | 172 |
| `validate_wine_rating` | `backend/models/review_model.py` | `create_review()` | ~10 |
| `validate_coffee_rating` | `backend/models/review_model.py` | `create_review()` | ~10 |
| `validate_pairing_score` | `backend/models/pairing_model.py` | `create_pairing()` | ~10 |

### Inactive Triggers (Defined but not used):

| Trigger Name | Reason |
|-------------|--------|
| `calculate_order_total_wines_update` | Orders are not editable |
| `calculate_order_total_coffees_update` | Orders are not editable |
| `calculate_order_total_wines_delete` | Order items cannot be deleted |
| `calculate_order_total_coffees_delete` | Order items cannot be deleted |

---

## 🧪 Testing Triggers

### Demo Route for Trigger Testing:

**File:** `backend/routes/demo_routes.py`

```python
@demo_bp.route('/test/triggers/order-total', methods=['GET'])
def test_order_total_trigger():
    """Demonstrate the order total calculation trigger"""
    # Creates order
    # Inserts wines → trigger calculates total
    # Inserts coffees → trigger updates total
    # Returns result
```

**Test URL:** `http://localhost:5000/api/demo/test/triggers/order-total`

---

## 💡 Key Points

1. **Triggers are automatic** - You don't call them explicitly
2. **They fire on SQL operations** - INSERT, UPDATE, DELETE
3. **Transparent to Python code** - Python just does INSERT/UPDATE/DELETE
4. **Database enforces logic** - Triggers ensure data integrity
5. **No manual total calculation needed** - Triggers do it automatically

### Example Flow:

```
User places order
     ↓
Frontend sends order to backend
     ↓
Backend: create_order() in order_model.py
     ↓
Python: INSERT INTO orders (customer_id, total_amount) VALUES (10, 3500)
     ↓
Python: INSERT INTO order_wines (order_id, wine_id, ...)
     ↓↓↓ TRIGGER FIRES AUTOMATICALLY ↓↓↓
MySQL: calculate_order_total_wines trigger runs
     ↓
MySQL: UPDATE orders SET total_amount = (calculated_total)
     ↓
Order total automatically updated!
```

---

## Status: ✅ Triggers are Working

All active triggers are properly integrated and fire automatically when their corresponding SQL operations execute!

