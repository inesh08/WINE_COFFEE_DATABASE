# Backend-Frontend Connection Status ✅

## Backend Server
- **Status:** ✅ Running
- **URL:** http://localhost:5000
- **Health Check:** http://localhost:5000/health → `{"status":"healthy"}`
- **Python Version:** 3.11.0
- **Flask Version:** 2.3.3
- **CORS:** Enabled (Flask-Cors 4.0.0)

## Frontend Server
- **Status:** ✅ Running
- **URL:** http://localhost:3000 (default React port)
- **API Base:** http://localhost:5000 (configured in frontend/src/config/api.js)

## Available Backend Endpoints

### Wine Management (`/api/wines`)
- `GET /api/wines/` - Get all wines ✅ (1002 wines available)
- `GET /api/wines/:id` - Get wine by ID
- `POST /api/wines/` - Create new wine (Admin only)
- `PUT /api/wines/:id` - Update wine (Admin only)
- `DELETE /api/wines/:id` - Delete wine (Admin only)

### Coffee Management (`/api/coffees`)
- `GET /api/coffees/` - Get all coffees
- `GET /api/coffees/:id` - Get coffee by ID
- `POST /api/coffees/` - Create new coffee (Admin only)
- `PUT /api/coffees/:id` - Update coffee (Admin only)
- `DELETE /api/coffees/:id` - Delete coffee (Admin only)

### User Management (`/api/users`)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/preferences` - Get user preferences

### Order Management (`/api/orders`)
- `POST /api/orders/` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/customer/:userId` - Get orders by customer
- `GET /api/orders/all` - Get all orders (Admin only) ✅
- `GET /api/orders/payment-profile/:userId` - Get payment profile

### Reviews (`/api/reviews`)
- `POST /api/reviews/` - Create review
- `GET /api/wines/:id/reviews` - Get wine reviews
- `GET /api/coffees/:id/reviews` - Get coffee reviews

### Pairings (`/api/pairings`)
- `GET /api/pairings` - Get all pairings
- `GET /api/pairings/recommendations` - Get pairing recommendations

### Demo/Queries (`/api`)
- `GET /api/queries/:type` - Execute demo queries
- `GET /api/procedures/:type` - Execute stored procedures
- `GET /api/test/triggers/:type` - Test database triggers
- `POST /api/operations/add-customer` - Add demo customer

## Admin Credentials
- **Username:** `admin`
- **Password:** `1234`
- **Access:** Full CRUD operations on wines, coffees, and view all orders

## Customer Features
- Browse wines and coffees
- Search and filter products
- Add to cart and checkout
- View order history
- Rate and review products
- View personalized recommendations

## How to Use

### Start Backend
```bash
cd backend
source venv/bin/activate
python app.py
```

### Start Frontend
```bash
cd frontend
npm start
```

### Access the Application
1. Open browser to http://localhost:3000
2. Press Enter on welcome page
3. Choose:
   - **Member Login** - For customers
   - **Create Account** - For new customers
   - **Admin Portal** - For admin access (username: admin, password: 1234)

## Connection Configuration

The frontend automatically connects to the backend at `http://localhost:5000` (configured in `frontend/src/config/api.js`).

You can override this by setting the environment variable:
```bash
REACT_APP_API_URL=http://your-backend-url:port npm start
```

## Troubleshooting

If you see connection errors:
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check backend logs in terminal
3. Verify CORS is enabled in backend (already configured)
4. Check browser console for specific errors
5. Ensure both servers are running on correct ports

## Status: ✅ FULLY CONNECTED AND OPERATIONAL

