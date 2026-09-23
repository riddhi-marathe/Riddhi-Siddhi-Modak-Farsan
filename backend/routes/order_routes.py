from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import order_bp
from models.orders import Order
from models.products import Product
from config import Config
import math

@order_bp.route('/calculate-delivery', methods=['POST'])
def calculate_delivery():
    """Calculate delivery fee and minimum order based on distance"""
    data = request.get_json()
    
    if 'latitude' not in data or 'longitude' not in data:
        return jsonify({'error': 'Location coordinates required'}), 400
    
    # Calculate distance from shop
    distance = haversine_distance(
        Config.SHOP_LATITUDE, Config.SHOP_LONGITUDE,
        data['latitude'], data['longitude']
    )
    
    if distance > Config.MAX_DELIVERY_DISTANCE_KM:
        return jsonify({
            'error': f'Delivery available only within {Config.MAX_DELIVERY_DISTANCE_KM} km radius',
            'distance_km': round(distance, 2),
            'deliverable': False
        }), 400
    
    # Find applicable tier
    fee = 0
    min_order = 300
    for tier in Config.DELIVERY_TIERS:
        if distance <= tier['max_distance_km']:
            fee = tier['fee']
            min_order = tier['min_order']
            break
    
    return jsonify({
        'distance_km': round(distance, 2),
        'delivery_fee': fee,
        'min_order_amount': min_order,
        'deliverable': True,
        'shop_location': {
            'lat': Config.SHOP_LATITUDE,
            'lng': Config.SHOP_LONGITUDE
        }
    }), 200

@order_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    """Process checkout and create order"""
    from app import mongo
    
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required = ['items', 'delivery_address', 'latitude', 'longitude', 'payment_method']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    items = data['items']
    if not items or len(items) == 0:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Calculate distance
    distance = haversine_distance(
        Config.SHOP_LATITUDE, Config.SHOP_LONGITUDE,
        data['latitude'], data['longitude']
    )
    
    if distance > Config.MAX_DELIVERY_DISTANCE_KM:
        return jsonify({'error': 'Delivery not available for this distance'}), 400
    
    # Validate minimum order amount
    subtotal = sum(item['price'] * item['quantity'] for item in items)
    is_valid, min_amount = Order.validate_order_amount(subtotal, distance)
    if not is_valid:
        return jsonify({
            'error': f'Minimum order amount for this distance is ₹{min_amount}',
            'min_order_amount': min_amount
        }), 400
    
    # Calculate delivery fee
    delivery_fee = Order.calculate_delivery_fee(distance)
    
    # Fetch full product details for items
    product_model = Product(mongo)
    enriched_items = []
    for item in items:
        product = product_model.get_product_by_id(item['product_id'])
        if product:
            # Get the price for the selected weight, default to first available price
            prices = product.get('prices', {})
            weight = item.get('weight', list(prices.keys())[0] if prices else '1KG')
            unit_price = prices.get(weight, list(prices.values())[0] if prices else 0)
            
            enriched_items.append({
                'product_id': item['product_id'],
                'name': product['name'],
                'category': product['category'],
                'quantity': item['quantity'],
                'price': unit_price,
                'weight': weight,
                'unit': 'kg',
                'is_regular': True
            })
    
    # Create order
    order_model = Order(mongo)
    order = order_model.create_order(
        user_id=user_id,
        items=enriched_items,
        total_amount=subtotal,
        delivery_fee=delivery_fee,
        delivery_address=data['delivery_address'],
        delivery_lat=data['latitude'],
        delivery_lng=data['longitude'],
        distance_km=distance,
        payment_method=data['payment_method'],
        notes=data.get('notes', '')
    )
    
    return jsonify({
        'order': order,
        'message': 'Order placed successfully!'
    }), 201

@order_bp.route('/history', methods=['GET'])
@jwt_required()
def get_order_history():
    """Get user's order history"""
    from app import mongo
    
    user_id = get_jwt_identity()
    order_model = Order(mongo)
    orders = order_model.get_user_orders(user_id)
    
    return jsonify({'orders': orders}), 200

@order_bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order_details(order_id):
    """Get specific order details"""
    from app import mongo
    
    user_id = get_jwt_identity()
    order_model = Order(mongo)
    order = order_model.get_order_by_id(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Ensure the order belongs to the user
    if order['user_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({'order': order}), 200

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates in kilometers"""
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    lon1_rad = math.radians(lon1)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

