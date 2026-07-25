from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from config import Config

# MongoDB database object (set during create_app)
mongo = None

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    jwt = JWTManager(app)
    
    # MongoDB connection
    client = MongoClient(Config.MONGO_URI)
    db = client.get_default_database()
    app.db = db
    
    # Make db available globally for routes
    global mongo
    mongo = db
    
    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.product_routes import product_bp
    from routes.order_routes import order_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(order_bp)
    
    # Health check
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'shop': Config.SHOP_NAME}
    
    # Seed products on first run
    with app.app_context():
        from models.products import Product
        product_model = Product(db)
        if product_model.seed_products():
            print("✅ Database seeded with menu items!")
    
    return app

if __name__ == '__main__':
    app = create_app()
    print(f"🚀 {Config.SHOP_NAME} API is running!")
    print(f"📍 {Config.SHOP_ADDRESS}")
    print(f"📞 {Config.SHOP_PHONE}")
    app.run(debug=True, port=5000)

