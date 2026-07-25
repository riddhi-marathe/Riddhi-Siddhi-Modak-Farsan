import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'riddhi-siddhi-secret-key-2024'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/riddhi_siddhi_farsan'
    JWT_EXPIRATION_HOURS = 24
    
    # Delivery configuration
    DELIVERY_TIERS = [
        {'max_distance_km': 1, 'min_order': 300, 'fee': 30},
        {'max_distance_km': 2, 'min_order': 500, 'fee': 50},
        {'max_distance_km': 3, 'min_order': 800, 'fee': 80},
    ]
    MAX_DELIVERY_DISTANCE_KM = 3
    
    # Shop location (Bhopal)
    SHOP_LATITUDE = 23.2321  # Near AIIMS Bhopal
    SHOP_LONGITUDE = 77.4300
    
    # Contact info
    SHOP_NAME = "Riddhi Siddhi Modak Farsan"
    SHOP_TAGLINE = "Shuddh Swad, Hamari Pehchaan"
    SHOP_ADDRESS = "165/2A, Saket Nagar, Bhopal (Near AIIMS, In Front of Bhopal Public School)"
    SHOP_PHONE = "7974613110 / 9893378872"
    SHOP_FSSAI = "Pending Registration"

