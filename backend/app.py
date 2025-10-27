from flask import Flask
from flask_cors import CORS
from config import Config

# Import blueprints
from routes.wine_routes import wine_bp
from routes.coffee_routes import coffee_bp
from routes.user_routes import user_bp
from routes.review_routes import review_bp
from routes.pairing_routes import pairing_bp
from routes.demo_routes import demo_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(wine_bp, url_prefix='/api/wines')
    app.register_blueprint(coffee_bp, url_prefix='/api/coffees')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    app.register_blueprint(pairing_bp, url_prefix='/api/pairings')
    app.register_blueprint(demo_bp, url_prefix='/api')
    
    @app.route('/')
    def home():
        return {'message': 'Wine & Coffee Backend API'}
    
    @app.route('/health')
    def health():
        return {'status': 'healthy'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000) 