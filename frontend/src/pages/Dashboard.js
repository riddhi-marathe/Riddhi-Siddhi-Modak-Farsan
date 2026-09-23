import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const statusColors = {
  confirmed: '#17a2b8',
  preparing: '#ffc107',
  out_for_delivery: '#fd7e14',
  delivered: '#28a745',
  cancelled: '#dc3545'
};

const statusIcons = {
  confirmed: '✅',
  preparing: '👨‍🍳',
  out_for_delivery: '🚚',
  delivered: '📦',
  cancelled: '❌'
};

function Dashboard({ user, token }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/checkout');
      return;
    }
    fetchOrders();
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => statusColors[status] || '#666';
  const getStatusIcon = (status) => statusIcons[status] || '📋';

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-empty">
            <span className="dashboard-empty-icon">🔒</span>
            <h2>Please Login</h2>
            <p>Login to view your order history and track deliveries</p>
            <Link to="/checkout" className="btn btn-primary">Login Here</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <span className="dashboard-kicker">Riddhi Siddhi / Your table</span>
            <h1>Your favourites, delivered with care.</h1>
            <p>Track every order, revisit your cravings, and keep the celebration going.</p>
            <Link to="/home" className="dashboard-hero-link">Browse today&apos;s menu <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="dashboard-hero-media">
            <video autoPlay muted loop playsInline poster="/assets/logo-image.jpeg" aria-label="Fresh farsan being prepared">
              <source src="/assets/intro-video-1.mp4" type="video/mp4" />
            </video>
            <div className="dashboard-hero-logo">
              <img src="/assets/logo-image.jpeg" alt="Riddhi Siddhi Modak Farsan" />
            </div>
          </div>
        </section>

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <span className="dashboard-avatar">👤</span>
            <div>
              <h1>Welcome, {user.name}!</h1>
              <p>Manage your orders and deliveries</p>
            </div>
          </div>
          <Link to="/" className="btn btn-outline">
            🏠 Continue Shopping
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Order Stats */}
        {orders.length > 0 && (
          <div className="order-stats">
            <div className="stat-card">
              <span className="stat-card-icon">📋</span>
              <div>
                <strong>{orders.length}</strong>
                <span>Total Orders</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-card-icon">✅</span>
              <div>
                <strong>{orders.filter(o => o.order_status === 'delivered').length}</strong>
                <span>Delivered</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-card-icon">🚚</span>
              <div>
                <strong>{orders.filter(o => o.order_status === 'out_for_delivery' || o.order_status === 'preparing').length}</strong>
                <span>In Progress</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-card-icon">💰</span>
              <div>
                <strong>₹{orders.reduce((sum, o) => sum + o.total, 0)}</strong>
                <span>Total Spent</span>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="dashboard-content">
          <h2 className="dashboard-section-title">
            📋 Your Orders
            {orders.length > 0 && <span className="order-count">({orders.length})</span>}
          </h2>

          {loading ? (
            <div className="spinner"></div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <span className="no-orders-icon">📭</span>
              <h3>No orders yet</h3>
              <p>Looks like you haven't placed any orders. Start exploring our delicious menu!</p>
              <Link to="/" className="btn btn-primary">🍛 Browse Menu</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div
                  key={order._id}
                  className={`order-card card ${selectedOrder === order._id ? 'expanded' : ''}`}
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                >
                  <div className="order-card-header">
                    <div className="order-card-left">
                      <span className="order-status-icon" style={{ color: getStatusColor(order.order_status) }}>
                        {getStatusIcon(order.order_status)}
                      </span>
                      <div>
                        <h3>Order #{order.order_id}</h3>
                        <p className="order-date">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="order-card-right">
                      <span className="order-status" style={{ background: getStatusColor(order.order_status), color: 'white' }}>
                        {order.order_status.replace(/_/g, ' ')}
                      </span>
                      <span className="order-amount">₹{order.total}</span>
                    </div>
                  </div>

                  {selectedOrder === order._id && (
                    <div className="order-card-details">
                      <div className="order-details-grid">
                        <div className="order-detail-section">
                          <h4>📍 Delivery Address</h4>
                          <p>{order.delivery_address}</p>
                        </div>
                        <div className="order-detail-section">
                          <h4>🚚 Delivery Info</h4>
                          <p>Distance: {order.distance_km} km</p>
                          <p>Delivery Fee: ₹{order.delivery_fee}</p>
                          <p>Est. Delivery: {new Date(order.estimated_delivery).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="order-detail-section">
                        <h4>🛒 Items</h4>
                        <div className="order-items-list">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="order-detail-item">
                              <span>{item.name} x{item.quantity}</span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="order-detail-section">
                        <h4>💳 Payment</h4>
                        <p>Method: {order.payment_method.toUpperCase()}</p>
                        <p>Status: <span className="badge badge-primary">{order.payment_status}</span></p>
                      </div>

                      <div className="order-timeline">
                        <h4>📅 Timeline</h4>
                        <div className="timeline-item">
                          <div className="timeline-dot" style={{ background: getStatusColor(order.order_status) }}></div>
                          <div>
                            <strong>Order {order.order_status.replace(/_/g, ' ')}</strong>
                            <p>{new Date(order.updated_at || order.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div>
                            <strong>Order Placed</strong>
                            <p>{new Date(order.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <p className="order-cancel-note">⚠️ Orders are non-cancellable after confirmation</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

