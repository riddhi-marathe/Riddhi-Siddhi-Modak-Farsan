import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

const weightLabel = { "1KG": "1 KG", "1/2KG": "½ KG", "250GM": "250 GM" };

function CartDrawer({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, cartTotal }) {
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-red-800">🛒 Your Cart ({cartItems.length})</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <span className="text-5xl opacity-50">🛒</span>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add some delicious items from our menu!</p>
              <button className="px-6 py-2.5 bg-red-700 text-white rounded-full font-semibold hover:bg-red-800 transition" onClick={() => { onClose(); navigate('/'); }}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cartItems.map(item => (
                <div key={item.cartKey} className="bg-orange-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">{weightLabel[item.weight]}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.cartKey)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.cartKey, -1)} className="px-3 py-1.5 bg-white hover:bg-red-100 font-bold text-red-700 transition" disabled={item.quantity <= 1}>−</button>
                      <span className="px-3 py-1.5 bg-white font-semibold text-sm min-w-[30px] text-center border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartKey, 1)} className="px-3 py-1.5 bg-white hover:bg-red-100 font-bold text-red-700 transition">+</button>
                    </div>
                    <span className="font-bold text-red-700">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-5 space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-red-800 border-t pt-2">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <button onClick={handleCheckout} className="w-full py-3 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all">
              🚀 Proceed to Checkout
            </button>
            <button onClick={() => { onClose(); }} className="w-full py-2.5 border-2 border-red-700 text-red-700 rounded-xl font-semibold hover:bg-red-700 hover:text-white transition-all">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;

