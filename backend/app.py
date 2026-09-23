import copy
import uuid

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from config import Config

# MongoDB database object (set during create_app)
mongo = None


class LocalInsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class LocalCursor:
    def __init__(self, rows):
        self._rows = list(rows)

    def sort(self, field, direction=-1):
        self._rows.sort(key=lambda doc: doc.get(field, 0) if doc.get(field) is not None else '', reverse=direction == -1)
        return self

    def __iter__(self):
        return iter(self._rows)

    def __len__(self):
        return len(self._rows)

    def __getitem__(self, index):
        return self._rows[index]


class LocalCollection:
    def __init__(self, name):
        self.name = name
        self._documents = []

    def _matches(self, query):
        def matcher(doc):
            if not query:
                return True
            for key, value in query.items():
                if key == '_id':
                    if isinstance(value, str):
                        if str(doc.get(key)) != value:
                            return False
                    elif isinstance(value, int):
                        if doc.get(key) != value:
                            return False
                    else:
                        if doc.get(key) != value:
                            return False
                elif doc.get(key) != value:
                    return False
            return True
        return matcher

    def insert_one(self, document):
        doc = copy.deepcopy(document)
        if '_id' not in doc:
            doc['_id'] = str(uuid.uuid4())
        self._documents.append(doc)
        return LocalInsertResult(doc['_id'])

    def insert_many(self, documents):
        inserted_ids = []
        for document in documents:
            doc = copy.deepcopy(document)
            if '_id' not in doc:
                doc['_id'] = str(uuid.uuid4())
            self._documents.append(doc)
            inserted_ids.append(doc['_id'])
        return type('InsertManyResult', (), {'inserted_ids': inserted_ids})()

    def find_one(self, query=None):
        query = query or {}
        for document in self._documents:
            if self._matches(query)(document):
                return copy.deepcopy(document)
        return None

    def find(self, query=None):
        query = query or {}
        matches = [copy.deepcopy(doc) for doc in self._documents if self._matches(query)(doc)]
        return LocalCursor(matches)

    def count_documents(self, query=None):
        query = query or {}
        return sum(1 for doc in self._documents if self._matches(query)(doc))

    def update_one(self, query, update):
        for document in self._documents:
            if self._matches(query)(document):
                if '$set' in update:
                    for key, value in update['$set'].items():
                        document[key] = value
                if '$push' in update:
                    for key, value in update['$push'].items():
                        existing = document.setdefault(key, [])
                        if not isinstance(existing, list):
                            existing = [existing]
                        existing.append(value)
                        document[key] = existing
                return True
        return False


class LocalMongoDatabase:
    def __init__(self):
        self._collections = {}

    def __getitem__(self, name):
        if name not in self._collections:
            self._collections[name] = LocalCollection(name)
        return self._collections[name]


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    JWTManager(app)

    # MongoDB connection with local fallback for offline development
    try:
        client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=15000)
        db = client.get_default_database(Config.MONGO_DB_NAME)
        db.command('ping')
        print('✅ Connected to MongoDB Atlas')
    except Exception as exc:  # pragma: no cover - runtime fallback
        print(f'⚠️ MongoDB unavailable ({exc}). Falling back to local in-memory database.')
        db = LocalMongoDatabase()

    app.db = db

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
            print('✅ Database seeded with menu items!')

    return app


if __name__ == '__main__':
    app = create_app()
    print(f"🚀 {Config.SHOP_NAME} API is running!")
    print(f"📍 {Config.SHOP_ADDRESS}")
    print(f"📞 {Config.SHOP_PHONE}")
    app.run(debug=True, port=5000)

