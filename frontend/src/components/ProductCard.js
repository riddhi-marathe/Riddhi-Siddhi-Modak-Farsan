import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../data/menuData';

const weightLabels = { "1KG": "1 KG", "1/2KG": "½ KG", "250GM": "250 GM" };

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState("1KG");
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cartBtnRef = useRef(null);

  const handleAdd = () => {
    setQuantity(1);
    onAddToCart(product, selectedWeight);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    onAddToCart(product, selectedWeight);
  };

  const handleDecrement = () => {
    setQuantity(prev => {
      const newQty = prev - 1;
      if (newQty <= 0) return 0;
      return newQty;
    });
  };

  const handleBuyNow = () => {
    // Add to cart first if not already
    if (quantity === 0) {
      onAddToCart(product, selectedWeight);
    }
    // Navigate to checkout
    navigate('/checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: (product.id % 10) * 0.03 }}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(45,35,35,0.15)' }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg"
      style={{ boxShadow: '0 4px 15px rgba(45,35,35,0.06)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with gradient overlay and shimmer */}
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${product.bgColor || 'from-orange-100 to-amber-100'}`}>
        {!imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 image-shimmer z-10"></div>
            )}
            <img
              src={getProductImage(product)}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
            />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${product.bgColor || 'from-orange-100 to-amber-100'} flex items-center justify-center`}>
            <span className="text-6xl opacity-40 animate-float">{product.emoji || '🍽️'}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-50'}`}></div>
        
        {/* 100% Veg Badge - Top Right */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md shadow-lg"
          style={{ background: '#2A9D8F', color: 'white' }}
        >
          <span className="text-xs font-bold">🟢 100% Veg</span>
        </motion.div>
        
        {/* Category badge - Top Left */}
        <motion.span 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm"
          style={{ background: 'rgba(250,250,247,0.9)', color: '#2D2323' }}
        >
          {product.category}
        </motion.span>
        
        {/* FSSAI/Hygiene tag */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-sm"
          style={{ background: 'rgba(250,250,247,0.85)' }}>
          <span className="text-xs font-medium" style={{ color: '#2A9D8F' }}>✓ Fresh & Hygienic</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 relative">
        <h3 className="text-lg font-bold mb-1 transition-colors" style={{ color: isHovered ? '#F9A826' : '#2D2323' }}>
          {product.name}
          {isHovered && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block ml-1">✨</motion.span>}
        </h3>
        
        {/* FSSAI Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#2A9D8F' }}>
            ✅ FSSAI Approved
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FFF8E7', color: '#F9A826' }}>
            Fresh Made
          </span>
        </div>

        {/* Weight Selector - All 3 tiers */}
        <div className="flex gap-1.5 mb-3">
          {Object.entries(product.prices).map(([weight, price]) => (
            <motion.button
              key={weight}
              onClick={() => setSelectedWeight(weight)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-200`}
              style={{
                background: selectedWeight === weight ? '#F9A826' : '#FAFAF7',
                color: selectedWeight === weight ? 'white' : '#2D2323',
                border: selectedWeight === weight ? '2px solid #F9A826' : '2px solid #E8E0D8',
              }}
            >
              <div>{weightLabels[weight]}</div>
              <div className="mt-0.5">₹{price}</div>
            </motion.button>
          ))}
        </div>

        {/* Price Display */}
        <div className="flex items-center justify-between mb-3 rounded-lg px-3 py-2 border transition-all duration-300" 
          style={{ 
            background: '#FAFAF7',
            borderColor: isHovered ? '#F9A826' : '#E8E0D8'
          }}>
          <span className="text-sm font-medium" style={{ color: '#2D2323' }}>{weightLabels[selectedWeight]}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs line-through" style={{ color: '#B8B0A8' }}>₹{product.prices[selectedWeight] + Math.round(product.prices[selectedWeight] * 0.1)}</span>
            <span className="text-xl font-bold" style={{ color: '#F9A826' }}>₹{product.prices[selectedWeight]}</span>
          </div>
        </div>

        {/* Add to Cart & Buy Now - Side by Side */}
        <div className="flex gap-2">
          {/* Add to Cart - Interactive Counter */}
          <div className="flex-1">
            {quantity === 0 ? (
              <motion.button
                ref={cartBtnRef}
                onClick={handleAdd}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden ripple-effect"
                style={{ 
                  background: '#F9A826', 
                  color: 'white',
                  boxShadow: isHovered ? '0 4px 15px rgba(249,168,38,0.4)' : '0 4px 10px rgba(249,168,38,0.2)'
                }}
              >
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <span>🛒</span>
                  <span>Add +</span>
                </span>
              </motion.button>
            ) : (
              <AnimatePresence>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-between w-full py-2 px-1 rounded-xl transition-all duration-300"
                  style={{ 
                    background: '#F9A826',
                    boxShadow: '0 4px 15px rgba(249,168,38,0.3)'
                  }}
                >
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDecrement}
                    className="w-10 h-9 flex items-center justify-center text-white font-bold text-xl rounded-l-xl hover:bg-white/20 transition-all"
                  >
                    −
                  </motion.button>
                  <motion.span 
                    key={quantity}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex-1 text-center text-white font-bold text-lg"
                  >
                    {quantity}
                  </motion.span>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleIncrement}
                    className="w-10 h-9 flex items-center justify-center text-white font-bold text-xl rounded-r-xl hover:bg-white/20 transition-all"
                  >
                    +
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Buy Now Button */}
          <motion.button
            onClick={handleBuyNow}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-3 rounded-xl font-bold text-xs transition-all duration-300"
            style={{ 
              background: '#800020', 
              color: 'white',
              boxShadow: '0 4px 12px rgba(128,0,32,0.3)'
            }}
          >
            <span className="flex flex-col items-center leading-tight">
              <span>Buy</span>
              <span>Now</span>
            </span>
          </motion.button>
        </div>
      </div>

      {/* Cart fly animation overlay */}
      {quantity > 0 && (
        <motion.div 
          className="fixed pointer-events-none z-50 text-2xl"
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ 
            opacity: 0, 
            x: window.innerWidth - 80, 
            y: -window.scrollY + 40,
            scale: 0.3,
            transition: { duration: 0.6, ease: 'easeIn' }
          }}
          style={{ 
            left: '50%',
            top: '50%',
          }}
        >
          🛒
        </motion.div>
      )}
    </motion.div>
  );
}

export default ProductCard;

