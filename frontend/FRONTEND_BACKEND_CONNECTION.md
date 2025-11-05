# Frontend-Backend Connection Guide

This document explains how the frontend is connected to the backend API.

## Configuration

The frontend is configured to connect to the backend through:

1. **API Configuration** (`src/config/api.js`): Centralized API endpoint configuration
2. **API Service** (`src/services/api.js`): Centralized API call functions
3. **Proxy Configuration** (`package.json`): Development proxy to backend

## API Base URL

The API base URL is configured in `src/config/api.js` and can be set via environment variable:

```bash
REACT_APP_API_URL=http://localhost:5000
```

Default: `http://localhost:5000`

## Running the Application

### Backend (Flask)
```bash
cd backend
python app.py
```
Backend runs on: `http://localhost:5000`

### Frontend (React)
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

## API Endpoints

### Wines
- `GET /api/wines` - Get all wines
- `GET /api/wines/:id` - Get wine by ID
- `POST /api/wines` - Create new wine
- `PUT /api/wines/:id` - Update wine
- `DELETE /api/wines/:id` - Delete wine

### Coffees
- `GET /api/coffees` - Get all coffees
- `GET /api/coffees/:id` - Get coffee by ID
- `POST /api/coffees` - Create new coffee
- `PUT /api/coffees/:id` - Update coffee
- `DELETE /api/coffees/:id` - Delete coffee

### Demo/Queries
- `GET /api/queries/:type` - Run demo queries (all-wines, all-coffees, orders, customers, reviews)
- `GET /api/procedures/:type` - Call stored procedures
- `GET /api/test/triggers/:type` - Test database triggers
- `POST /api/operations/add-customer` - Add customer via stored procedure

## Usage in Components

Import the API services:
```javascript
import { wineAPI, coffeeAPI, demoAPI } from './services/api';
```

Example usage:
```javascript
// Get all wines
const wines = await wineAPI.getAll();

// Create a wine
const newWine = await wineAPI.create({ name: 'Wine Name', type: 'Red' });

// Get query results
const data = await demoAPI.query('all-wines');
```

## CORS Configuration

The backend has CORS enabled in `backend/app.py`:
```python
CORS(app)
```

This allows the frontend (running on port 3000) to make requests to the backend (running on port 5000).

## Development Proxy

The `package.json` includes a proxy configuration:
```json
"proxy": "http://localhost:5000"
```

This allows you to make API calls using relative paths in development (e.g., `/api/wines` instead of `http://localhost:5000/api/wines`), though the current implementation uses the full URL for flexibility.

