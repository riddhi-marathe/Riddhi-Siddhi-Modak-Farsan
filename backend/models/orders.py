from datetime import datetime, timedelta
import uuid

class Order:
    collection_name = 'orders'
    
    def __init__(self, db):
        self.collection = db[self.collection_name]
    
    def create_order(self, user_id, items, total_amount, delivery_fee, 
                     delivery_address, delivery_lat, delivery_lng, 
                     distance_km, payment_method, notes=''):
        """Create a new order with delivery details"""
        # Calculate delivery tier info
        from config import Config
        tier = None
        for t in Config.DELIVERY_TIERS:
            if distance_km <= t['max_distance_km']:
                tier = t
                break
        
        # Determine lead times for items
        has_special_items = any(item.get('is_regular') == False for item in items)
        
        order = {
            'order_id': str(uuid.uuid4())[:8].upper(),
            'user_id': user_id,
            'items': items,
            'subtotal': total_amount,
            'delivery_fee': delivery_fee,
            'total': total_amount + delivery_fee,
            'delivery_address': delivery_address,
            'delivery_location': {
                'type': 'Point',
                'coordinates': [delivery_lng, delivery_lat]
            },
            'distance_km': distance_km,
            'payment_method': payment_method,
            'payment_status': 'pending',
            'order_status': 'confirmed',
            'notes': notes,
            'is_cancellable': False,  # Non-cancellable after confirmation
            'requires_advance_booking': has_special_items,
            'estimated_delivery': self._calculate_estimated_delivery(has_special_items),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(order)
        order['_id'] = str(result.inserted_id)
        return order
    
    def get_user_orders(self, user_id):
        orders = list(self.collection.find(
            {'user_id': user_id}
        ).sort('created_at', -1))
        for o in orders:
            o['_id'] = str(o['_id'])
            o['created_at'] = o['created_at'].isoformat()
            if 'estimated_delivery' in o and o['estimated_delivery']:
                o['estimated_delivery'] = o['estimated_delivery'].isoformat()
        return orders
    
    def get_order_by_id(self, order_id):
        try:
            from bson.objectid import ObjectId
            query_value = ObjectId(order_id)
        except Exception:
            query_value = order_id

        order = self.collection.find_one({'_id': query_value})
        if order:
            order['_id'] = str(order['_id'])
            if 'created_at' in order and order['created_at']:
                order['created_at'] = order['created_at'].isoformat()
            if 'estimated_delivery' in order and order['estimated_delivery']:
                order['estimated_delivery'] = order['estimated_delivery'].isoformat()
        return order
    
    def update_order_status(self, order_id, status):
        from bson.objectid import ObjectId
        self.collection.update_one(
            {'_id': ObjectId(order_id)},
            {
                '$set': {
                    'order_status': status,
                    'updated_at': datetime.utcnow()
                }
            }
        )
    
    def _calculate_estimated_delivery(self, has_special_items):
        """Calculate estimated delivery date based on item types"""
        now = datetime.utcnow()
        if has_special_items:
            # Special/fresh items need 1-2 days advance booking
            return now + timedelta(days=2)
        else:
            # Regular items - next day delivery
            return now + timedelta(days=1)
    
    @staticmethod
    def calculate_delivery_fee(distance_km):
        """Calculate delivery fee based on distance"""
        from config import Config
        for tier in Config.DELIVERY_TIERS:
            if distance_km <= tier['max_distance_km']:
                return tier['fee']
        return None  # Beyond delivery range
    
    @staticmethod
    def validate_order_amount(total_amount, distance_km):
        """Validate minimum order amount based on distance"""
        from config import Config
        for tier in Config.DELIVERY_TIERS:
            if distance_km <= tier['max_distance_km']:
                if total_amount < tier['min_order']:
                    return False, tier['min_order']
                return True, 0
        return False, Config.DELIVERY_TIERS[-1]['min_order']

