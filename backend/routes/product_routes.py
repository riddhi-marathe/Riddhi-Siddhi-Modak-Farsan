from flask import jsonify, request
from . import product_bp
from models.products import Product

@product_bp.route('/', methods=['GET'])
def get_products():
    """Get all products or filter by category"""
    from app import mongo
    
    category = request.args.get('category')
    product_model = Product(mongo)
    
    if category and category in ['Dry Snacks', 'Namkeen', 'Sweets', 'Wet Sweets', 'dry', 'sweet', 'wet']:
        products = product_model.get_products_by_category(category)
    else:
        products = product_model.get_all_products()
    
    return jsonify({'products': products}), 200

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get product categories with metadata"""
    from app import mongo
    
    product_model = Product(mongo)
    all_products = product_model.get_all_products()
    
    # Group products by category
    categories = {
        'dry': {
            'name': 'Dry Items (Namkeen & Farsan)',
            'description': 'Crispy, crunchy savory snacks perfect for any time of the day',
            'count': 0,
            'icon': '🥨'
        },
        'sweet': {
            'name': 'Sweet Items (Longer Shelf Life)',
            'description': 'Traditional Maharashtrian sweets that stay fresh longer',
            'count': 0,
            'icon': '🍬'
        },
        'wet': {
            'name': 'Wet/Fresh Sweets (Shorter Shelf Life)',
            'description': 'Freshly made premium sweets, best consumed within days',
            'count': 0,
            'icon': '🍮'
        }
    }
    
    for product in all_products:
        cat = product.get('category')
        if cat in categories:
            categories[cat]['count'] += 1
    
    return jsonify({'categories': categories}), 200

@product_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product details"""
    from app import mongo
    
    product_model = Product(mongo)
    product = product_model.get_product_by_id(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify({'product': product}), 200

