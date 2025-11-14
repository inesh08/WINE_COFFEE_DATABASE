# 📊 Stored Procedures & Functions - Usage Status

## Summary

**Total Database Features:** 29
- **Triggers:** 11 (7 active, 4 inactive)
- **Stored Procedures:** 13 (6 used in demo, 7 unused)
- **Functions:** 5 (0 actively used, all available for demo)

---

## 🔔 TRIGGERS (11 Total)

### ✅ Active Triggers (7) - Automatically Fire

| # | Trigger Name | Event | Table | Status | Used In Code |
|---|-------------|-------|-------|--------|--------------|
| 1 | `wines_update_timestamp` | BEFORE UPDATE | wines | ✅ Active | `wine_model.py` - update_wine() |
| 2 | `coffees_update_timestamp` | BEFORE UPDATE | coffees | ✅ Active | `coffee_model.py` - update_coffee() |
| 3 | `calculate_order_total_wines` | AFTER INSERT | order_wines | ✅ Active | `order_model.py` - _insert_items() line 165 |
| 4 | `calculate_order_total_coffees` | AFTER INSERT | order_coffees | ✅ Active | `order_model.py` - _insert_items() line 172 |
| 5 | `validate_wine_rating` | BEFORE INSERT | reviews | ✅ Active | `review_model.py` - create_review() |
| 6 | `validate_coffee_rating` | BEFORE INSERT | reviews | ✅ Active | `review_model.py` - create_review() |
| 7 | `validate_pairing_score` | BEFORE INSERT | pairings | ✅ Active | `pairing_model.py` - create_pairing() |

### ⚠️ Inactive Triggers (4) - Defined but Not Used

| # | Trigger Name | Event | Reason Not Used |
|---|-------------|-------|----------------|
| 8 | `calculate_order_total_wines_update` | AFTER UPDATE | Orders are not editable |
| 9 | `calculate_order_total_coffees_update` | AFTER UPDATE | Orders are not editable |
| 10 | `calculate_order_total_wines_delete` | AFTER DELETE | Order items cannot be deleted |
| 11 | `calculate_order_total_coffees_delete` | AFTER DELETE | Order items cannot be deleted |

---

## 📦 STORED PROCEDURES (13 Total)

### ✅ Used in Demo Routes (6)

| # | Procedure Name | Purpose | Called In | Demo URL |
|---|---------------|---------|-----------|----------|
| 1 | `GetWinesByType` | Get wines by type | `demo_routes.py` line 105 | `/api/demo/procedures/wines` |
| 2 | `GetCoffeesByRoastLevel` | Get coffees by roast | `demo_routes.py` line 108 | `/api/demo/procedures/coffees` |
| 3 | `GetTopRatedWines` | Get top-rated wines | `demo_routes.py` line 111 | `/api/demo/procedures/top-wines` |
| 4 | `GetTopRatedCoffees` | Get top-rated coffees | `demo_routes.py` line 114 | `/api/demo/procedures/top-coffees` |
| 5 | `GetPairings` | Get wine-coffee pairings | `demo_routes.py` line 117 | `/api/demo/procedures/pairings` |
| 6 | `AddCustomer` | Add new customer | `demo_routes.py` line 235 | POST `/api/demo/operations/add-customer` |

**File:** `backend/routes/demo_routes.py`

### ❌ Not Currently Used (7)

| # | Procedure Name | Purpose | Could Be Used For |
|---|---------------|---------|-------------------|
| 7 | `GetCustomerOrders` | Get orders by customer | Alternative to current order fetching |
| 8 | `GetTotalSales` | Get total sales stats | Analytics dashboard |
| 9 | `AddWine` | Add new wine | Alternative to current wine creation |
| 10 | `AddCoffee` | Add new coffee | Alternative to current coffee creation |
| 11 | `CreateOrder` | Create new order | Alternative to current order creation |
| 12 | `AddWineToOrder` | Add wine to order | Order item management |
| 13 | `AddCoffeeToOrder` | Add coffee to order | Order item management |

**Why not used?**
- Python models handle these operations directly
- Procedures would add complexity without benefit
- Current approach is more flexible and maintainable

---

## ⚙️ FUNCTIONS (5 Total)

### ❌ None Actively Used in Application Code

| # | Function Name | Returns | Purpose | Status |
|---|--------------|---------|---------|--------|
| 1 | `CalculateOrderTotal` | DECIMAL(12,2) | Calculate order total | ⚠️ Not used (triggers do this) |
| 2 | `GetAverageRating` | DECIMAL(3,2) | Get avg rating for product | ⚠️ Not used (SQL queries used instead) |
| 3 | `GetWineTotalSales` | DECIMAL(12,2) | Get total wine sales | ⚠️ Not used (could be used for analytics) |
| 4 | `GetCoffeeTotalSales` | DECIMAL(12,2) | Get total coffee sales | ⚠️ Not used (could be used for analytics) |
| 5 | `CheckInventoryStatus` | VARCHAR(20) | Check if product exists | ⚠️ Not used (no inventory tracking) |

**Why not used?**
- **CalculateOrderTotal:** Triggers automatically handle this
- **GetAverageRating:** Direct SQL queries are simpler
- **GetWineTotalSales/GetCoffeeTotalSales:** Could be integrated into analytics
- **CheckInventoryStatus:** No inventory system implemented

**Potential Use Cases:**
```python
# Could be used in analytics
cursor.execute("SELECT GetWineTotalSales(%s)", (wine_id,))
wine_sales = cursor.fetchone()

cursor.execute("SELECT GetAverageRating(%s, 'wine')", (wine_id,))
avg_rating = cursor.fetchone()
```

---

## 📂 Code Locations

### Where Triggers Fire:
```
backend/models/
├── order_model.py (lines 165, 172) → Order total triggers
├── wine_model.py → Timestamp preservation trigger
├── coffee_model.py → Timestamp preservation trigger
├── review_model.py → Rating validation triggers
└── pairing_model.py → Pairing validation trigger
```

### Where Procedures Are Called:
```
backend/routes/
└── demo_routes.py
    ├── call_procedure() (lines 97-127) → 5 procedures
    └── add_customer() (lines 226-255) → AddCustomer procedure
```

### Functions:
```
❌ None currently called in Python code
✅ Defined in database (can be called with SELECT)
```

---

## 🧪 Testing Procedures & Functions

### Demo Endpoints Available:

**Test Procedures:**
```bash
# Get red wines
GET /api/demo/procedures/wines

# Get light roast coffees
GET /api/demo/procedures/coffees

# Get top 5 rated wines
GET /api/demo/procedures/top-wines

# Get top 5 rated coffees
GET /api/demo/procedures/top-coffees

# Get all pairings
GET /api/demo/procedures/pairings

# Add customer
POST /api/demo/operations/add-customer
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

**Test Triggers:**
```bash
# Test order total trigger
GET /api/demo/test/triggers/order-total

# Test rating validation trigger
GET /api/demo/test/triggers/rating-validation
```

**Test Functions (via SQL):**
```sql
-- Calculate order total
SELECT CalculateOrderTotal(1);

-- Get average rating
SELECT GetAverageRating(1, 'wine');

-- Get wine sales
SELECT GetWineTotalSales(1);

-- Get coffee sales
SELECT GetCoffeeTotalSales(1);

-- Check inventory
SELECT CheckInventoryStatus(1);
```

---

## 📈 Usage Statistics

### Active Usage:
```
Triggers:     7/11 (64%) - ✅ Actively firing
Procedures:   6/13 (46%) - ✅ Available via demo endpoints
Functions:    0/5  (0%)  - ⚠️ Defined but not used
```

### Integration Level:
```
✅ High Integration: Triggers (automatic, critical)
⚠️ Medium Integration: Procedures (demo only)
❌ Low Integration: Functions (available but unused)
```

---

## 💡 Recommendations

### 1. Keep Active Triggers
The 7 active triggers are essential and working perfectly:
- Order total calculation (automatic)
- Timestamp preservation (data integrity)
- Validation (data quality)

### 2. Demo Procedures Are Fine
The 6 procedures in demo routes serve their purpose:
- Show DBMS features
- Provide alternative query methods
- Educational value

### 3. Consider Using Functions
The 5 functions could be integrated into:
- `backend/utils/analytics.py` for sales reporting
- Admin dashboard for product statistics
- API endpoints for detailed metrics

**Example Integration:**
```python
# In analytics.py
def get_product_sales(product_id, product_type):
    cursor.execute(
        "SELECT GetWineTotalSales(%s)" if product_type == 'wine' 
        else "SELECT GetCoffeeTotalSales(%s)",
        (product_id,)
    )
    return cursor.fetchone()
```

### 4. Optional: Remove Unused Items
If you want to clean up, consider removing:
- 4 inactive triggers (UPDATE/DELETE for orders)
- 7 unused procedures (if Python models work fine)
- Functions (if not planning to use them)

**But keep them if:**
- Required for DBMS project demonstration
- Want to show database feature diversity
- Plan to use them later

---

## ✅ Conclusion

**Status:** All defined triggers, procedures, and functions exist and are valid.

**Active Features:** 13/29 (45%)
- 7 triggers (actively firing)
- 6 procedures (demo endpoints)
- 0 functions (available but unused)

**Recommendation:** Current setup is good for DBMS project demonstration. All features are defined and working, with the most critical ones (triggers) actively integrated into the application.

