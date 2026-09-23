import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import menuData from '../data/menuData';
import ProductCard from '../components/ProductCard';
import './Category.css';

const categoryMeta = {
  "Dry Snacks": { icon: '🥨', color: '#FF9933', bgGradient: 'linear-gradient(135deg, #FFF5E6, #FFE8CC)', video: 'https://cdn.coverr.co/videos/coverr-making-sweets-5645/1080p.mp4' },
  "Namkeen": { icon: '🥟', color: '#E67300', bgGradient: 'linear-gradient(135deg, #FFF0E6, #FFE0CC)', video: 'https://cdn.coverr.co/videos/coverr-making-sweets-5645/1080p.mp4' },
  "Sweets": { icon: '🍬', color: '#D4A017', bgGradient: 'linear-gradient(135deg, #FFF8E7, #FFEECC)', video: 'https://cdn.coverr.co/videos/coverr-making-sweets-5645/1080p.mp4' },
  "Wet Sweets": { icon: '🍮', color: '#800020', bgGradient: 'linear-gradient(135deg, #FFF0F0, #FFE4E1)', video: 'https://cdn.coverr.co/videos/coverr-making-sweets-5645/1080p.mp4' }
};

function Category({ addToCart }) {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [addedMsg, setAddedMsg] = useState('');
  const [lottieData, setLottieData] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);

  const meta = categoryMeta[category] || { icon: '🛍️', color: '#800020', bgGradient: 'linear-gradient(135deg, #FFF5E6, #FFE8CC)' };

  useEffect(() => {
    setProducts(menuData.filter(p => p.category === category));
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [category]);

  useEffect(() => {
    fetch('https://assets2.lottiefiles.com/packages/lf20_p1qi4yfh.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(() => {});
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product, weight) => {
    addToCart(product, weight);
    setAddedMsg(`${product.name} (${weight})`);
    setTimeout(() => setAddedMsg(''), 2000);
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, var(--cream), #FFF5E6)' }}>
      {/* ====== HERO WITH VIDEO ====== */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden hero-gradient-animate" style={{ background: meta.bgGradient }}>
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-2 z-10" style={{ background: `linear-gradient(90deg, ${meta.color}, var(--gold), ${meta.color})` }}></div>
        
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-15" style={{ filter: 'blur(2px)', transform: `translateY(${scrollY * 0.1}px)` }}>
          <source src={meta.video} type="video/mp4" />
        </video>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <span className="text-7xl mb-6 block animate-float" style={{ filter: `drop-shadow(0 4px 12px ${meta.color}40)` }}>{meta.icon}</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-scale-in" style={{ color: meta.color, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            {category}
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: '#666' }}>
            {category === "Dry Snacks" && "Crispy, crunchy savory snacks perfect for any time of the day"}
            {category === "Namkeen" && "Spiced and flavored traditional namkeen for that perfect snack"}
            {category === "Sweets" && "Traditional Maharashtrian sweets with longer shelf life"}
            {category === "Wet Sweets" && "Freshly made premium sweets - requires advance booking"}
          </p>
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium hover:underline transition-all hover:scale-105" style={{ color: meta.color }}>
            ← Back to Home
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: `linear-gradient(90deg, ${meta.color}, var(--gold), ${meta.color})` }}></div>
      </div>

      {/* ====== ADVANCE BOOKING NOTICE ====== */}
      {category === "Wet Sweets" && (
        <div className="py-4 animate-slide-up" style={{ background: 'linear-gradient(90deg, var(--maroon), var(--saffron))' }}>
          <div className="container mx-auto px-4 text-center text-white">
            <span className="inline-flex items-center gap-2 font-semibold">
              ⏰ <span className="animate-pulse">Fresh sweets require 1-2 days advance booking for guaranteed freshness!</span>
            </span>
          </div>
        </div>
      )}

      {/* ====== LOTTIE ANIMATION STRIP ====== */}
      <div className="py-6" style={{ background: 'var(--cream-dark)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white rounded-2xl p-6 shadow-lg max-w-4xl mx-auto border card-glow" style={{ borderColor: `${meta.color}20` }}>
            <div className="w-20 h-20 flex-shrink-0">
              {lottieData ? (
                <Lottie animationData={lottieData} loop autoplay style={{ width: '100%', height: '100%' }} />
              ) : (
                <span className="text-4xl flex h-full items-center justify-center">{meta.icon}</span>
              )}
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold" style={{ color: 'var(--maroon)' }}>Freshly Prepared with Love ❤️</h3>
              <p className="text-sm" style={{ color: 'var(--chai)' }}>
                Every item is made fresh using traditional recipes. Regular items delivered next-day!
              </p>
              {category === "Wet Sweets" && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-white animate-glow-pulse" style={{ background: 'var(--saffron)' }}>
                  ⏳ Advance Booking Required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====== PRODUCTS ====== */}
      <div className="py-12 container mx-auto px-4">
        {/* Count */}
        <div className="text-center mb-8">
          <span className="inline-block px-5 py-2 rounded-full text-sm font-semibold shadow-sm animate-scale-in" 
            style={{ background: 'white', color: meta.color, border: `2px solid ${meta.color}20` }}>
            {products.length} {products.length === 1 ? 'item' : 'items'} in {category}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">📭</span>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--maroon)' }}>No products found</h3>
            <p className="mb-6" style={{ color: 'var(--chai)' }}>This category is empty. Check back soon!</p>
            <Link to="/" className="inline-flex px-6 py-3 rounded-full font-bold transition-all hover:scale-105 ripple-effect"
              style={{ background: 'linear-gradient(135deg, var(--maroon), var(--saffron))', color: 'white' }}>
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====== DELIVERY INFO BAR ====== */}
      <div className="py-6" style={{ background: 'linear-gradient(90deg, var(--saffron), var(--gold), var(--saffron))' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-white font-medium">
            <span className="flex items-center gap-2">🚚 <span>Free delivery above ₹300</span></span>
            <span className="flex items-center gap-2">📅 <span>Next-day delivery for regular items</span></span>
            <span className="flex items-center gap-2">💳 <span>COD & UPI payments accepted</span></span>
          </div>
        </div>
      </div>

      {/* ====== TOAST ====== */}
      {addedMsg && (
        <div className="fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl z-50 animate-slide-up flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, var(--emerald), var(--emerald-light))', color: 'white' }}>
          <span>✅</span>
          <span className="font-medium">{addedMsg} added to cart!</span>
        </div>
      )}
    </div>
  );
}

export default Category;

