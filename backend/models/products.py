from datetime import datetime

class Product:
    collection_name = 'products'
    
    def __init__(self, db):
        self.collection = db[self.collection_name]
    
    def seed_products(self):
        products = [
            # Dry Snacks
            {'id': 1, 'name': 'Matri', 'category': 'Dry Snacks', 'prices': {'1KG': 250, '1/2KG': 130, '250GM': 65}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 2, 'name': 'Methi Matri', 'category': 'Dry Snacks', 'prices': {'1KG': 250, '1/2KG': 130, '250GM': 65}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 3, 'name': 'Namkeen Para', 'category': 'Dry Snacks', 'prices': {'1KG': 250, '1/2KG': 130, '250GM': 65}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 4, 'name': 'Kaju Masala Para', 'category': 'Dry Snacks', 'prices': {'1KG': 300, '1/2KG': 150, '250GM': 75}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 5, 'name': 'Dry Samosa', 'category': 'Dry Snacks', 'prices': {'1KG': 280, '1/2KG': 145, '250GM': 150}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 6, 'name': 'Murmura/Bhel', 'category': 'Dry Snacks', 'prices': {'1KG': 300, '1/2KG': 150, '250GM': 75}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 7, 'name': 'Nagpuri Poha', 'category': 'Dry Snacks', 'prices': {'1KG': 320, '1/2KG': 165, '250GM': 85}, 'in_stock': True, 'created_at': datetime.utcnow()},
            # Namkeen
            {'id': 8, 'name': 'Chakli', 'category': 'Namkeen', 'prices': {'1KG': 300, '1/2KG': 150, '250GM': 80}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 9, 'name': 'Sev/Namkeen', 'category': 'Namkeen', 'prices': {'1KG': 300, '1/2KG': 150, '250GM': 75}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 10, 'name': 'Palak/Tamater Sev', 'category': 'Namkeen', 'prices': {'1KG': 300, '1/2KG': 150, '250GM': 75}, 'in_stock': True, 'created_at': datetime.utcnow()},
            # Sweets (Longer Shelf Life)
            {'id': 11, 'name': 'Mitha Para', 'category': 'Sweets', 'prices': {'1KG': 300, '1/2KG': 150, '250GM': 80}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 12, 'name': 'Mitha Para Ghee', 'category': 'Sweets', 'prices': {'1KG': 450, '1/2KG': 230, '250GM': 120}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 13, 'name': 'Mitha Sugarkoted', 'category': 'Sweets', 'prices': {'1KG': 320, '1/2KG': 165, '250GM': 85}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 14, 'name': 'Mitha Goudkoted', 'category': 'Sweets', 'prices': {'1KG': 400, '1/2KG': 210, '250GM': 110}, 'in_stock': True, 'created_at': datetime.utcnow()},
            # Wet/Fresh Sweets
            {'id': 15, 'name': 'Modak Mawa', 'category': 'Wet Sweets', 'prices': {'1KG': 550, '1/2KG': 280, '250GM': 140}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 16, 'name': 'Khoprapak (Naril Barfi)', 'category': 'Wet Sweets', 'prices': {'1KG': 520, '1/2KG': 265, '250GM': 130}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 17, 'name': 'Gujiya Mawa Dryfruits', 'category': 'Wet Sweets', 'prices': {'1KG': 650, '1/2KG': 330, '250GM': 170}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 18, 'name': 'Laddu Besan', 'category': 'Wet Sweets', 'prices': {'1KG': 520, '1/2KG': 260, '250GM': 130}, 'in_stock': True, 'created_at': datetime.utcnow()},
            {'id': 19, 'name': 'Laddu Rava', 'category': 'Wet Sweets', 'prices': {'1KG': 500, '1/2KG': 260, '250GM': 130}, 'in_stock': True, 'created_at': datetime.utcnow()},
        ]
        
        if self.collection.count_documents({}) == 0:
            self.collection.insert_many(products)
            return True
        return False
    
    def get_all_products(self):
        products = list(self.collection.find({}))
        for p in products:
            p['_id'] = str(p['_id'])
        return products
    
    def get_products_by_category(self, category):
        products = list(self.collection.find({'category': category}))
        for p in products:
            p['_id'] = str(p['_id'])
        return products
    
    def get_product_by_id(self, product_id):
        try:
            from bson.objectid import ObjectId
            query_value = ObjectId(product_id)
        except Exception:
            query_value = product_id

        product = self.collection.find_one({'_id': query_value})
        if product:
            product['_id'] = str(product['_id'])
        return product

