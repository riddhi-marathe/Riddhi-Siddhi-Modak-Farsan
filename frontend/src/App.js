import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch(e) {}
    }
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedWeight) => {
    const cartKey = `${product.id}-${selectedWeight}`;
    setCartItems(prev => {
      const existing = prev.find(item => item.cartKey === cartKey);
      if (existing) {
        return prev.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        cartKey,
        productId: product.id,
        name: product.name,
        weight: selectedWeight,
        price: product.prices[selectedWeight],
        quantity: 1,
        category: product.category
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartKey, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.cartKey === cartKey
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (cartKey) => {
    setCartItems(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="app min-h-screen flex flex-col">
        <Routes>
          {/* Welcome Page Route - No Navbar/Footer */}
          <Route path="/" element={<Welcome />} />
          
          {/* Main App Routes with Navbar & Footer */}
          <Route path="/*" element={
            <>
              <Navbar
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
                user={user}
                onLogout={handleLogout}
              />
              <main className="flex-1 pt-16">
                <Routes>
                  <Route path="/home" element={<Home addToCart={addToCart} />} />
                  <Route path="/category/:category" element={<Category addToCart={addToCart} />} />
                  <Route
                    path="/checkout"
                    element={
                      <Checkout
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        user={user}
                        token={token}
                        onLogin={handleLogin}
                        clearCart={clearCart}
                      />
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={<Dashboard user={user} token={token} />}
                  />
                </Routes>
              </main>
              <Footer />
              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                cartTotal={cartTotal}
              />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

