from datetime import datetime
import hashlib
import uuid

class User:
    collection_name = 'users'
    
    def __init__(self, db):
        self.collection = db[self.collection_name]
    
    def create_user(self, name, email, phone, password):
        user = {
            'name': name,
            'email': email.lower(),
            'phone': phone,
            'password_hash': self._hash_password(password),
            'created_at': datetime.utcnow(),
            'addresses': [],
            'is_admin': False
        }
        # Check if user exists
        if self.collection.find_one({'email': user['email']}):
            return None, 'User already exists'
        
        result = self.collection.insert_one(user)
        user['_id'] = str(result.inserted_id)
        del user['password_hash']
        return user, 'User created successfully'
    
    def authenticate(self, email, password):
        user = self.collection.find_one({'email': email.lower()})
        if not user:
            return None, 'Invalid credentials'
        
        if user['password_hash'] != self._hash_password(password):
            return None, 'Invalid credentials'
        
        user['_id'] = str(user['_id'])
        del user['password_hash']
        return user, 'Login successful'
    
    def get_user_by_id(self, user_id):
        from bson.objectid import ObjectId
        user = self.collection.find_one({'_id': ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
            if 'password_hash' in user:
                del user['password_hash']
        return user
    
    def add_address(self, user_id, address_data):
        from bson.objectid import ObjectId
        address = {
            'id': str(uuid.uuid4()),
            'label': address_data.get('label', 'Home'),
            'full_address': address_data['full_address'],
            'latitude': address_data.get('latitude'),
            'longitude': address_data.get('longitude'),
            'is_default': address_data.get('is_default', False)
        }
        self.collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'addresses': address}}
        )
        return address
    
    def _hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

