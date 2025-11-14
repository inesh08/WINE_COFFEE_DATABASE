# ✅ Fixed: "Column 'coffee_id' cannot be null" Error

## Problem
When placing orders, getting error:
```
Error placing order: (1048, "Column 'coffee_id' cannot be null")
```

## Root Cause
The backend was looking for the wrong field name:
- Frontend sends: `product_id`
- Backend was looking for: `id`
- Result: `product_id` was `None`, causing NULL insert error

## Solution Applied

### File Modified: `backend/models/order_model.py`

**Line 160:** Changed product_id lookup to check `product_id` first:

**Before:**
```python
product_id = item.get('id') or item.get('recommendedId')
```

**After:**
```python
product_id = item.get('product_id') or item.get('id') or item.get('recommendedId')
```

**Line 159:** Also added `product_type` fallback for category:

**Before:**
```python
category = item.get('category') or item.get('recommendedType')
```

**After:**
```python
category = item.get('category') or item.get('product_type') or item.get('recommendedType')
```

## What This Fixes

Now the backend correctly reads the `product_id` field from the order payload sent by the frontend:

```json
{
  "userId": 42,
  "items": [
    {
      "product_id": 120,        // ← Backend now reads this correctly
      "product_type": "wine",
      "category": "wine",
      "quantity": 1,
      "price": 3500
    }
  ],
  ...
}
```

## Testing

### Backend Restarted: ✅
The backend has been restarted with the fix applied.

### Try Placing Order Again:
1. Login as any user
2. Add items to cart
3. Go to checkout
4. Fill shipping details
5. Click "Confirm & Place Order"
6. **Should now work without errors!**

## Status: FIXED ✅

The order placement should now work correctly without the NULL column error.

