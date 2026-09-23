import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapTracker from '../components/MapTracker';
import './Checkout.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Checkout({ cartItems, cartTotal, user, token, onLogin, clearCart }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(!user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    notes: '',
    payment_method: 'cod'
  });
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [deliveryError, setDeliveryError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [showExchangePolicy, setShowExchangePolicy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowLoginForm(true);
    }
  }, [user]);

  useEffect(() => {
    if (deliveryLocation) {
      calculateDelivery();
    }
  }, [deliveryLocation]);

  // Set active step based on progress
  useEffect(() => {
    if (orderSuccess) {
      setActiveStep(4);
    } else if (user && deliveryInfo) {
      setActiveStep(3);
    } else if (user) {
      setActiveStep(2);
    } else {
      setActiveStep(1);
    }
  }, [user, deliveryInfo, orderSuccess]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password };

      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      onLogin(res.data.user, res.data.token);
      setShowLoginForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  const calculateDelivery = async () => {
    if (!deliveryLocation) return;
    setDeliveryError('');

    try {
      const res = await axios.post(`${API_URL}/api/orders/calculate-delivery`, {
        latitude: deliveryLocation.lat,
        longitude: deliveryLocation.lng
      });
      setDeliveryInfo(res.data);
      setDeliveryError('');
    } catch (err) {
      setDeliveryError(err.response?.data?.error || 'Delivery not available');
      setDeliveryInfo(null);
    }
  };

  const handleLocationChange = (lat, lng) => {
    setDeliveryLocation({ lat, lng });
  };

  const handlePlaceOrder = async () => {
    if (!user || !token) {
      setError('Please login to place an order');
      return;
    }

    if (!deliveryLocation) {
      setError('Please select a delivery location on the map');
      return;
    }

    if (!formData.address.trim()) {
      setError('Please enter your delivery address');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!agreedToPolicies) {
      setError('Please agree to the Exchange & Privacy Policies to proceed');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const items = cartItems.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        weight: item.weight
      }));

      const res = await axios.post(
        `${API_URL}/api/orders/checkout`,
        {
          items,
          delivery_address: formData.address,
          latitude: deliveryLocation.lat,
          longitude: deliveryLocation.lng,
          payment_method: formData.payment_method,
          notes: formData.notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderSuccess(res.data.order);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success animate-scale-in">
            <div className="success-icon">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-id">Order ID: <strong>{orderSuccess.order_id}</strong></p>
            
            <div className="steps-indicator">
              <div className="step completed">1</div>
              <div className="step-line completed"></div>
              <div className="step completed">2</div>
              <div className="step-line completed"></div>
              <div className="step completed">3</div>
              <div className="step-line completed"></div>
              <div className="step completed active">4</div>
            </div>

            <div className="success-details">
              <div className="success-detail">
                <span>📦 Status</span>
                <span className="badge badge-primary">{orderSuccess.order_status}</span>
              </div>
              <div className="success-detail">
                <span>💰 Total</span>
                <span>₹{orderSuccess.total}</span>
              </div>
              <div className="success-detail">
                <span>🚚 Delivery Fee</span>
                <span>₹{orderSuccess.delivery_fee}</span>
              </div>
              <div className="success-detail">
                <span>📍 Distance</span>
                <span>{orderSuccess.distance_km} km</span>
              </div>
              <div className="success-detail">
                <span>📅 Est. Delivery</span>
                <span>{new Date(orderSuccess.estimated_delivery).toLocaleDateString()}</span>
              </div>
              <div className="success-detail">
                <span>💳 Payment</span>
                <span>{orderSuccess.payment_method.toUpperCase()}</span>
              </div>
            </div>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                📋 View Orders
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/')}>
                🏠 Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Complete your order in a few simple steps</p>

        {/* Steps Indicator */}
        <div className="steps-indicator">
          <div className={`step ${activeStep >= 1 ? 'completed' : ''} ${activeStep === 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${activeStep >= 2 ? 'completed' : ''}`}></div>
          <div className={`step ${activeStep >= 2 ? 'completed' : ''} ${activeStep === 2 ? 'active' : ''}`}>2</div>
          <div className={`step-line ${activeStep >= 3 ? 'completed' : ''}`}></div>
          <div className={`step ${activeStep >= 3 ? 'completed' : ''} ${activeStep === 3 ? 'active' : ''}`}>3</div>
          <div className={`step-line ${activeStep >= 4 ? 'completed' : ''}`}></div>
          <div className={`step ${activeStep >= 4 ? 'completed' : ''} ${activeStep === 4 ? 'active' : ''}`}>4</div>
          <div className="step-labels">
            <span>Login</span>
            <span>Delivery</span>
            <span>Review</span>
            <span>Confirm</span>
          </div>
        </div>

        {error && <div className="alert alert-error animate-slide-up">{error}</div>}

        <div className="checkout-grid">
          {/* Left Column - Login & Delivery Details */}
          <div className="checkout-left">
            {/* Auth Section */}
            {showLoginForm && (
              <div className="checkout-section card animate-fade-in-up">
                <h2>{isLogin ? '🔐 Login' : '📝 Create Account'}</h2>
                <p className="section-desc">
                  {isLogin ? 'Login to place your order' : 'Create an account to track your orders'}
                </p>
                <form onSubmit={handleAuth}>
                  {!isLogin && (
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your name"
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  {!isLogin && (
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="10 digit mobile number"
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Your password"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary auth-submit">
                    {isLogin ? 'Login & Continue' : 'Register & Continue'}
                  </button>
                </form>
                <p className="auth-toggle">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button className="link-btn" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Register' : 'Login'}
                  </button>
                </p>
              </div>
            )}

            {/* User Info (when logged in) */}
            {user && !showLoginForm && (
              <div className="checkout-section card user-info-section animate-fade-in-up">
                <div className="user-info-header">
                  <span className="user-avatar">👤</span>
                  <div>
                    <h3>{user.name}</h3>
                    <p>{user.email} | {user.phone}</p>
                  </div>
                  <span className="verified-badge">✓ Verified</span>
                </div>
                <button className="btn btn-outline" onClick={() => setShowLoginForm(true)}>
                  Switch Account
                </button>
              </div>
            )}

            {/* Delivery Address */}
            <div className="checkout-section card">
              <h2>📍 Delivery Details</h2>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter your full delivery address"
                  required
                ></textarea>
              </div>

              {user && (
                <>
                  <h2>🗺️ Select Delivery Location</h2>
                  <p className="section-desc">Click on the map to mark your delivery location</p>
                  <MapTracker onLocationChange={handleLocationChange} />
                  
                  {deliveryInfo && (
                    <div className="delivery-calculated animate-slide-up">
                      <div className="delivery-info-row">
                        <span>📏 Distance</span>
                        <span><strong>{deliveryInfo.distance_km} km</strong></span>
                      </div>
                      <div className="delivery-info-row">
                        <span>🚚 Delivery Fee</span>
                        <span><strong>₹{deliveryInfo.delivery_fee}</strong></span>
                      </div>
                      <div className="delivery-info-row">
                        <span>💰 Min. Order</span>
                        <span><strong>₹{deliveryInfo.min_order_amount}</strong></span>
                      </div>
                    </div>
                  )}

                  {deliveryError && (
                    <div className="alert alert-error animate-slide-up">{deliveryError}</div>
                  )}

                  <div className="form-group">
                    <label>Order Notes (Optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Any special instructions?"
                    ></textarea>
                  </div>

                  {/* Exchange & Replacement Policy */}
                  <div className="policy-section">
                    <button 
                      className="policy-toggle"
                      onClick={() => setShowExchangePolicy(!showExchangePolicy)}
                    >
                      <span>🔄 Exchange & Replacement Policy</span>
                      <span className={`policy-arrow ${showExchangePolicy ? 'open' : ''}`}>▼</span>
                    </button>
                    {showExchangePolicy && (
                      <div className="policy-content animate-slide-up">
                        <div className="policy-badge">Valid Only with Satisfactory Reasons</div>
                        <ul>
                          <li><strong>✅ Quality Issue:</strong> If the product is damaged, stale, or has quality issues, we will replace it free of cost within 24 hours of delivery.</li>
                          <li><strong>✅ Incorrect Item:</strong> If you received a different item than ordered, a full replacement or refund will be provided.</li>
                          <li><strong>✅ Packaging Damage:</strong> If the packaging is torn or tampered with during delivery, we offer a no-questions-asked replacement.</li>
                          <li><strong>✅ Weight Discrepancy:</strong> If the product weight is less than ordered, we will compensate with an equivalent replacement.</li>
                          <li><strong>✅ Missing Items:</strong> If any item from your order is missing, we will deliver it free of cost.</li>
                          <li className="policy-note"><strong>❌ Not Applicable For:</strong> Change of mind,不喜欢 the taste, or ordered by mistake — please choose carefully before ordering.</li>
                        </ul>
                        <p className="policy-footer">📞 For any issues, contact us at <a href="tel:7974613110">7974613110</a> within 24 hours of delivery.</p>
                      </div>
                    )}
                  </div>

                  {/* Privacy Policy */}
                  <div className="policy-section">
                    <button 
                      className="policy-toggle"
                      onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                    >
                      <span>🔒 Privacy Policy</span>
                      <span className={`policy-arrow ${showPrivacyPolicy ? 'open' : ''}`}>▼</span>
                    </button>
                    {showPrivacyPolicy && (
                      <div className="policy-content animate-slide-up">
                        <ul>
                          <li><strong>🔐 Data Protection:</strong> Your personal information (name, phone, address) is used only for order processing and delivery.</li>
                          <li><strong>📱 No Spam:</strong> We do not share your data with third parties. Your phone number is used solely for delivery coordination.</li>
                          <li><strong>📍 Location Privacy:</strong> Your delivery location is used only for calculating delivery distance and is not stored permanently.</li>
                          <li><strong>💳 Payment Security:</strong> Payment details are processed securely. We do not store any payment card information.</li>
                          <li><strong>📧 Communication:</strong> We may send order-related updates via email/phone. You can opt out of promotional messages anytime.</li>
                          <li><strong>🗑️ Data Retention:</strong> Your data is retained only as long as necessary for order history and legal compliance.</li>
                        </ul>
                        <p className="policy-footer">✅ By placing an order, you consent to our privacy practices as described above.</p>
                      </div>
                    )}
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="policy-agreement">
                    <label className="agreement-checkbox">
                      <input
                        type="checkbox"
                        checked={agreedToPolicies}
                        onChange={(e) => setAgreedToPolicies(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <span>I agree to the Exchange & Replacement Policy and Privacy Policy</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-right">
            <div className="checkout-section card order-summary-card">
              <h2>🛒 Order Summary</h2>
              
              {/* Live Cart Count Badge */}
              {cartItems.length > 0 && (
                <div className="cart-count-badge">
                  <span>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</span>
                </div>
              )}

              <div className="order-items">
                {cartItems.length === 0 ? (
                  <div className="empty-cart-msg">
                    <span className="empty-cart-icon">🛒</span>
                    <p>Your cart is empty</p>
                    <button className="btn btn-outline" onClick={() => navigate('/')}>
                      Browse Items
                    </button>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={item.productId || index} className="order-item">
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">x{item.quantity}</span>
                        <span className="order-item-weight">{item.weight}</span>
                      </div>
                      <span className="order-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="order-totals">
                  <div className="order-total-row">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="order-total-row">
                    <span>🚚 Delivery Fee</span>
                    <span>{deliveryInfo ? `₹${deliveryInfo.delivery_fee}` : <span className="text-pending">To be calculated</span>}</span>
                  </div>
                  <div className="order-total-row">
                    <span>💰 Min. Order Required</span>
                    <span>{deliveryInfo ? `₹${deliveryInfo.min_order_amount}` : <span className="text-pending">Select location</span>}</span>
                  </div>
                  <div className="order-total-row">
                    <span>💳 Payment</span>
                    <span className="payment-badge">{formData.payment_method === 'cod' ? 'COD' : 'UPI'}</span>
                  </div>
                  <div className="order-total-row order-total-final">
                    <span>Total</span>
                    <span className="total-amount">₹{deliveryInfo ? cartTotal + deliveryInfo.delivery_fee : cartTotal}</span>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="payment-section">
                <h3>💳 Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-option ${formData.payment_method === 'cod' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">💵</span>
                      <div>
                        <strong>Cash on Delivery</strong>
                        <small>Pay when you receive</small>
                      </div>
                    </div>
                  </label>
                  <label className={`payment-option ${formData.payment_method === 'upi' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      checked={formData.payment_method === 'upi'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">📱</span>
                      <div>
                        <strong>UPI / Online</strong>
                        <small>Pay via Google Pay, PhonePe, etc.</small>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              {user && cartItems.length > 0 && (
                <div className="place-order-section">
                  {deliveryInfo && cartTotal < deliveryInfo.min_order_amount && (
                    <div className="alert alert-error">
                      Minimum order amount for this distance is ₹{deliveryInfo.min_order_amount}.
                      Add ₹{deliveryInfo.min_order_amount - cartTotal} more to your cart.
                    </div>
                  )}
                  
                  <div className="order-summary-notes">
                    <div className="note-item">
                      <span>⚡</span>
                      <span>Next-day delivery for regular items</span>
                    </div>
                    <div className="note-item">
                      <span>🔄</span>
                      <span>Exchange within 24h if unsatisfied</span>
                    </div>
                    <div className="note-item">
                      <span>🔒</span>
                      <span>Your data is secure with us</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={processing || (deliveryInfo && cartTotal < deliveryInfo.min_order_amount) || !agreedToPolicies}
                  >
                    {processing ? (
                      <span className="processing-btn">
                        <span className="btn-spinner"></span>
                        Processing...
                      </span>
                    ) : (
                      <span>🚀 Place Order</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

