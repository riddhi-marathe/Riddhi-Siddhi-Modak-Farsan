# Routes package
from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
product_bp = Blueprint('products', __name__, url_prefix='/api/products')
order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

