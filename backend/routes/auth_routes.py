from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from . import auth_bp
from config import Config

@auth_bp.route('/register', methods=['POST'])
def register():
    from app import mongo
    data = request.get_json()
    
    if not all(k in data for k in ('name', 'email', 'phone', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    user_model = __import__('models.users', fromlist=['User']).User
    user = user_model(mongo)
    created_user, message = user.create_user(
        data['name'],
        data['email'],
        data['phone'],
        data['password']
    )
    
    if not created_user:
        return jsonify({'error': message}), 400
    
    token = create_access_token(
        identity=created_user['_id'],
        expires_delta=timedelta(hours=Config.JWT_EXPIRATION_HOURS)
    )
    
    return jsonify({
        'user': created_user,
        'token': token,
        'message': message
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    from app import mongo
    data = request.get_json()
    
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Email and password required'}), 400
    
    user_model = __import__('models.users', fromlist=['User']).User
    user = user_model(mongo)
    authenticated_user, message = user.authenticate(data['email'], data['password'])
    
    if not authenticated_user:
        return jsonify({'error': message}), 401
    
    token = create_access_token(
        identity=authenticated_user['_id'],
        expires_delta=timedelta(hours=Config.JWT_EXPIRATION_HOURS)
    )
    
    return jsonify({
        'user': authenticated_user,
        'token': token,
        'message': message
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    from app import mongo
    user_id = get_jwt_identity()
    
    user_model = __import__('models.users', fromlist=['User']).User
    user = user_model(mongo)
    user_data = user.get_user_by_id(user_id)
    
    if not user_data:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user_data}), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    from app import mongo
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Update allowed fields
    update_data = {}
    if 'name' in data:
        update_data['name'] = data['name']
    if 'phone' in data:
        update_data['phone'] = data['phone']
    if 'address' in data:
        update_data['address'] = data['address']
    
    if update_data:
        from bson.objectid import ObjectId
        mongo.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
    
    user_model = __import__('models.users', fromlist=['User']).User
    user = user_model(mongo)
    return jsonify({'user': user.get_user_by_id(user_id)}), 200

@auth_bp.route('/address', methods=['POST'])
@jwt_required()
def add_address():
    from app import mongo
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if 'full_address' not in data:
        return jsonify({'error': 'Address is required'}), 400
    
    user_model = __import__('models.users', fromlist=['User']).User
    user = user_model(mongo)
    address = user.add_address(user_id, data)
    
    return jsonify({'address': address}), 201

