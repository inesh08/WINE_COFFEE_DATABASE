# Wine & Coffee Database - Demo Application

## Overview
This application demonstrates Database Triggers, Stored Procedures, Functions, and SQL Queries through a React-based web interface.

## Features Demonstrated

### 1. Database Triggers (7 triggers)
- **wines_update_timestamp**: Preserves created_at timestamp on wine updates
- **coffees_update_timestamp**: Preserves created_at timestamp on coffee updates
- **calculate_order_total_wines**: Auto-calculates order total when wines are added
- **calculate_order_total_coffees**: Auto-calculates order total when coffees are added
- **validate_wine_rating**: Validates wine ratings are between 1-5
- **validate_coffee_rating**: Validates coffee ratings are between 1-5
- **validate_pairing_score**: Validates pairing scores are between 0-10

### 2. Stored Procedures (13 procedures)
- GetWinesByType
- GetCoffeesByRoastLevel
- GetTopRatedWines
- GetTopRatedCoffees
- GetPairings
- AddCustomer
- GetCustomerOrders
- GetTotalSales
- AddWine
- AddCoffee
- CreateOrder
- AddWineToOrder
- AddCoffeeToOrder

### 3. SQL Queries
- Get all wines
- Get all coffees
- Get all orders
- Get all customers
- Get all reviews

### 4. Database Operations
- Add customers
- Create orders
- Insert reviews
- Manage inventory

## Setup Instructions

### 1. Start Backend Server
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Server will run on http://localhost:5000

### 2. Start Frontend React App
```bash
cd frontend
npm install
npm start
```
App will run on http://localhost:3000

## How to Use

### Testing Triggers
1. Click on "Triggers" tab
2. Click "Test Order Total Trigger" to see automatic calculation
3. Click "Test Rating Validation Trigger" to see validation in action

### Using Procedures
1. Click on "Procedures" tab
2. Select a procedure from dropdown
3. Click "Execute Procedure"
4. View results

### Running Queries
1. Click on "Queries" tab
2. Click any query button (All Wines, All Coffees, etc.)
3. View the data returned

### Database Operations
1. Click on "Operations" tab
2. Fill in customer form
3. Click "Add Customer" to use stored procedure

## Database Schema
- Currency: INR (Indian Rupees)
- Tables: 17 tables (wines, coffees, orders, customers, reviews, pairings, etc.)
- All foreign key constraints active
- Indexes for performance optimization

## API Endpoints

### Triggers Testing
- GET `/api/test/triggers/order-total` - Test order total calculation
- GET `/api/test/triggers/rating-validation` - Test rating validation

### Procedures
- GET `/api/procedures/wines` - Get wines by type
- GET `/api/procedures/coffees` - Get coffees by roast level
- GET `/api/procedures/top-wines` - Get top rated wines
- GET `/api/procedures/top-coffees` - Get top rated coffees
- GET `/api/procedures/pairings` - Get wine-coffee pairings

### Queries
- GET `/api/queries/all-wines` - Get all wines
- GET `/api/queries/all-coffees` - Get all coffees
- GET `/api/queries/orders` - Get all orders
- GET `/api/queries/customers` - Get all customers
- GET `/api/queries/reviews` - Get all reviews

### Operations
- POST `/api/operations/add-customer` - Add new customer

## Technology Stack
- **Backend**: Python Flask
- **Frontend**: React.js
- **Database**: MySQL
- **ORM**: PyMySQL

## Demo Scenarios

### Scenario 1: Automatic Order Total (Trigger)
1. Create an order
2. Add wines to order
3. See total automatically calculated by trigger

### Scenario 2: Rating Validation (Trigger)
1. Try to add review with rating > 5
2. See validation trigger block the insert
3. Add valid rating (1-5)
4. See successful insert

### Scenario 3: Stored Procedure Call
1. Call `GetWinesByType('red')`
2. See filtered wine results
3. Call `GetTopRatedWines(5)`
4. See top 5 rated wines

### Scenario 4: Complex Query
1. Query orders with customer details
2. Query reviews with ratings
3. See join operations in action

## Screenshots
The UI demonstrates all operations with:
- Clean, modern design
- Real-time results
- JSON formatted output
- Interactive buttons
- Tab-based navigation

## Notes
- All prices in INR
- Database configured for production use
- Error handling implemented
- CORS enabled for React integration

