# Wine & Coffee Backend API

A Flask-based REST API for managing wines, coffees, user reviews, and wine-coffee pairings. This application provides a comprehensive backend for a wine and coffee recommendation platform.

## Features

- **Wine Management**: CRUD operations for wines with detailed attributes
- **Coffee Management**: CRUD operations for coffees with origin and roast information
- **User Management**: User registration, authentication, and preferences
- **Review System**: Rating and review system for wines and coffees
- **Pairing System**: Wine-coffee pairing recommendations and scoring
- **Analytics**: Comprehensive analytics and statistics
- **Recommendation Engine**: Intelligent pairing recommendations based on flavor profiles

## Project Structure

```
wine-coffee-backend/
│── app.py                # Main entry point (runs Flask app)
│── config.py             # Database config (MySQL credentials)
│── requirements.txt      # Dependencies
│
├── db/
│   ├── connection.py     # MySQL connection setup
│   ├── schema.sql        # SQL file for creating tables
│
├── models/               # Database models (queries / CRUD)
│   ├── wine_model.py
│   ├── coffee_model.py
│   ├── user_model.py
│   ├── review_model.py
│   └── pairing_model.py
│
├── routes/               # API routes (blueprints)
│   ├── wine_routes.py
│   ├── coffee_routes.py
│   ├── user_routes.py
│   ├── review_routes.py
│   └── pairing_routes.py
│
├── utils/
│   ├── recommender.py    # Logic for wine/coffee recommendation
│   ├── analytics.py      # Stats & queries for popular flavours
│
└── tests/
    ├── test_wine.py
    ├── test_coffee.py
    └── test_user.py
```

## Database Schema

The application uses MySQL with the following main tables:

- **users**: User accounts and authentication
- **wines**: Wine information with detailed attributes
- **coffees**: Coffee information with origin and processing details
- **reviews**: User reviews and ratings
- **pairings**: Wine-coffee pairing recommendations
- **user_preferences**: User preference settings

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wine-coffee-backend
   ```

2. **Set up virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**
   - Set up MySQL database
   - Update `config.py` with your database credentials
   - Create database: `CREATE DATABASE wine_coffee_db;`

5. **Initialize database**
   ```bash
   python -c "from db.connection import init_database; init_database()"
   ```

6. **Run the application**
   ```bash
   python app.py
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=wine_coffee_db
SECRET_KEY=your_secret_key
FLASK_DEBUG=True
```

## API Endpoints

### Wines
- `GET /api/wines/` - Get all wines or search with filters
- `GET /api/wines/<id>` - Get specific wine
- `POST /api/wines/` - Create new wine
- `PUT /api/wines/<id>` - Update wine
- `DELETE /api/wines/<id>` - Delete wine
- `GET /api/wines/types` - Get wine types
- `GET /api/wines/regions` - Get wine regions
- `GET /api/wines/top-rated` - Get top rated wines

### Coffees
- `GET /api/coffees/` - Get all coffees or search with filters
- `GET /api/coffees/<id>` - Get specific coffee
- `POST /api/coffees/` - Create new coffee
- `PUT /api/coffees/<id>` - Update coffee
- `DELETE /api/coffees/<id>` - Delete coffee
- `GET /api/coffees/types` - Get coffee types
- `GET /api/coffees/origins` - Get coffee origins
- `GET /api/coffees/top-rated` - Get top rated coffees

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/<id>` - Get user info
- `PUT /api/users/<id>` - Update user
- `DELETE /api/users/<id>` - Delete user
- `GET /api/users/<id>/preferences` - Get user preferences
- `POST /api/users/<id>/preferences` - Set user preference

### Reviews
- `POST /api/reviews/` - Create review
- `GET /api/reviews/<id>` - Get specific review
- `PUT /api/reviews/<id>` - Update review
- `DELETE /api/reviews/<id>` - Delete review
- `GET /api/reviews/user/<id>` - Get user reviews
- `GET /api/reviews/wine/<id>` - Get wine reviews
- `GET /api/reviews/coffee/<id>` - Get coffee reviews

### Pairings
- `GET /api/pairings/` - Get all pairings or search
- `GET /api/pairings/<id>` - Get specific pairing
- `POST /api/pairings/` - Create pairing
- `PUT /api/pairings/<id>` - Update pairing
- `DELETE /api/pairings/<id>` - Delete pairing
- `GET /api/pairings/best` - Get best pairings
- `GET /api/pairings/statistics` - Get pairing statistics

## Testing

Run the test suite:

```bash
# Run all tests
pytest tests/

# Run specific test file
pytest tests/test_wine.py

# Run with verbose output
pytest -v tests/
```

## Features in Detail

### Wine Management
- Store detailed wine information including type, region, vintage, price
- Track flavor attributes: acidity, body, tannin, sweetness levels
- Search and filter wines by various criteria

### Coffee Management
- Store coffee information with origin, roast level, processing method
- Track flavor notes and characteristics
- Search by origin, type, roast level, and price range

### User System
- Secure user registration and authentication
- Password hashing for security
- User preference management
- Profile management

### Review System
- 5-star rating system
- Text comments for reviews
- Average rating calculations
- Review history tracking

### Pairing System
- Wine-coffee pairing recommendations
- Scoring system (0-10 scale)
- Flavor-based matching algorithms
- Seasonal and personalized recommendations

### Analytics
- Overall platform statistics
- Popular wine and coffee types
- User activity analysis
- Price analysis and trends
- Pairing analytics and statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 