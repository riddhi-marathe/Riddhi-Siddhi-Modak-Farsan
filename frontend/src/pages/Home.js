import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import menuData from '../data/menuData';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import './Home.css';

function Home({ addToCart }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(menuData);
  const [addedMsg, setAddedMsg] = useState('');
  const [lottieData, setLottieData] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [animateCounts, setAnimateCounts] = useState(false);
  const [counts, setCounts] = useState({ products: 0, radius: 0, delivery: 0 });
  const videoRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(menuData);
    } else {
      setFilteredProducts(menuData.filter(p => p.category === activeCategory));
    }
  }, [activeCategory]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    fetch('https://assets10.lottiefiles.com/packages/lf20_w98qte06.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(() => {});
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setAnimateCounts(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated counter
  useEffect(() => {
    if (!animateCounts) return;
    const targetProducts = 19;
    const targetRadius = 3;
    const targetDelivery = 300;
    const duration = 2000;
    const step = 50;
    const steps = duration / step;
    let current = 0;
    
    const interval = setInterval(() => {
      current++;
      setCounts({
        products: Math.min(Math.round((current / steps) * targetProducts), targetProducts),
        radius: Math.min(Math.round((current / steps) * targetRadius), targetRadius),
        delivery: Math.min(Math.round((current / steps) * targetDelivery), targetDelivery)
      });
      if (current >= steps) clearInterval(interval);
    }, step);
    
    return () => clearInterval(interval);
  }, [animateCounts]);

  const handleAddToCart = (product, weight) => {
    addToCart(product, weight);
    setAddedMsg(`${product.name} (${weight})`);
    setTimeout(() => setAddedMsg(''), 2000);
  };

  return (
    <div className="overflow-hidden" style={{ background: 'linear-gradient(180deg, #FAFAF7 0%, #F5F0EB 50%, #FAFAF7 100%)' }}>
      {/* ====== HERO SECTION WITH VIDEO ====== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" 
        style={{ background: 'linear-gradient(135deg, #4A0012 0%, #800020 40%, #2D2323 100%)' }}>
        {/* Video Background - Parallax */}
        <div className="absolute inset-0 overflow-hidden" style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-40" style={{ filter: 'blur(2px)' }}>
            <source src="/assets/intro-video-1.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Animated floating food particles - Enhanced */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🥨', '🍬', '🍮', '🥟', '🍪', '🧁', '🍯', '🌰', '🍛', '🍚'].map((emoji, i) => (
            <div 
              key={i} 
              className="absolute text-4xl"
              style={{ 
                left: `${5 + i * 9}%`, 
                top: `${10 + (i % 5) * 18}%`, 
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${5 + i * 0.6}s`,
                opacity: 0.12,
                transform: `rotate(${i * 45}deg)`,
                animation: `particleFloat ${5 + i * 0.6}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            >{emoji}</div>
          ))}
        </div>

        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #F9A826, #D4A017, #2A9D8F)' }}></div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
          <div className="inline-block px-6 py-2 rounded-full text-sm font-medium mb-6 border-2 animate-glow-pulse"
            style={{ background: 'rgba(255,255,255,0.1)', borderColor: '#F9A826', color: '#FFC145' }}>
            🏆 Authentic Maharashtrian Taste Since Years
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif leading-tight animate-fade-in-up">
            Riddhi Siddhi
            <br />
            <span className="gradient-text-saffron" style={{ textShadow: '0 2px 10px rgba(212,160,23,0.5)' }}>Modak Farsan</span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: '#F9A826' }}>
            ✨ Shuddh Swad, Hamari Pehchaan ✨
          </p>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Authentic Maharashtrian namkeen, farsan & sweets made with love,
            tradition, and the finest ingredients, delivered fresh to your doorstep
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a href="#catalog" className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ripple-effect"
              style={{ background: '#F9A826', color: '#2D2323' }}>
              🥨 Explore Our Menu
            </a>
            <Link to="/checkout" className="px-8 py-4 rounded-full font-bold text-lg border-2 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              🛵 Order Now
            </Link>
          </div>

          {/* Stats with animated counters */}
          <div ref={statsRef} className="flex justify-center gap-8 md:gap-16">
            {[
              { num: animateCounts ? counts.products : 0, suffix: '+', label: 'Traditional Products', color: '#FFC145' },
              { num: animateCounts ? counts.radius : 0, suffix: 'km', label: 'Delivery Radius', color: '#2A9D8F' },
              { num: '🚚', label: 'Free Delivery*', color: '#F9A826', isIcon: true }
            ].map((s, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
                {s.isIcon ? (
                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: s.color, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{s.num}</div>
                ) : (
                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: s.color, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    {s.num}{s.suffix}
                  </div>
                )}
                <div className="text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #2A9D8F, #D4A017, #F9A826)' }}></div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full flex justify-center border-2" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
            <div className="w-1.5 h-3 rounded-full mt-2 animate-pulse" style={{ background: '#F9A826' }}></div>
          </div>
        </div>
      </section>

      {/* ====== LOTTIE DELIVERY ANIMATION SECTION ====== */}
      <section className="py-12" style={{ background: 'linear-gradient(90deg, #FFC145, #F0C040, #FFC145)' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-xl card-glow">
            <div className="w-28 h-28 flex-shrink-0">
              {lottieData ? (
                <Lottie animationData={lottieData} loop autoplay style={{ width: '100%', height: '100%' }} />
              ) : (
                <span className="text-5xl flex items-center justify-center h-full animate-bounce">🚚</span>
              )}
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 gradient-text">Free Delivery on Orders Above ₹300</h3>
              <p className="text-gray-600">Freshly prepared snacks delivered to your doorstep within 1-3 km radius</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: '#2A9D8F', color: 'white' }}>✓ Next-day delivery</span>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: '#F9A826', color: '#2D2323' }}>✓ COD & UPI</span>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: '#800020', color: 'white' }}>✓ Fresh Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CATALOG SECTION ====== */}
      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 animate-fade-in-up">
            <span className="text-6xl mb-4 block animate-float">🍛</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2" style={{ color: '#800020' }}>Our Delicious Menu</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#8B7D6B' }}>
              Browse our wide range of traditional Maharashtrian delicacies, 
              all made with love and the finest ingredients
            </p>
            <div className="w-24 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg, #F9A826, #D4A017, #F9A826)' }}></div>
          </div>

          {/* Category Filters */}
          <div className="mb-10 mt-8">
            <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          </div>

          {/* Product Count */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold" 
              style={{ background: '#F5F0EB', color: '#800020' }}>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Products Grid */}
          <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
        </div>
      </section>

      {/* ====== WHY CHOOSE US ====== */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4A0012 0%, #800020 50%, #2D2323 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #D4A017, #F9A826, #D4A017)' }}></div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #F9A826 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4" style={{ color: '#FFC145' }}>Why Choose Us?</h2>
          <p className="text-center text-white/70 text-lg mb-16 max-w-2xl mx-auto">
            We prioritize quality, taste, and your satisfaction above everything else
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: '🥇', title: 'Premium Quality', desc: 'Only the finest ingredients for every bite of authentic taste' },
              { icon: '👩‍🍳', title: 'Traditional Recipes', desc: 'Generations-old recipes preserving authentic Maharashtrian flavors' },
              { icon: '🧹', title: 'Hygiene First', desc: 'Highest cleanliness standards in kitchen and packaging' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Next-day delivery for regular items, straight to your door' }
            ].map((item, i) => (
              <div key={i} 
                className="text-center p-8 rounded-2xl border transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl animate-fade-in-up"
                style={{ 
                  background: 'rgba(255,255,255,0.08)', 
                  borderColor: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  animationDelay: `${i * 0.15}s`
                }}>
                <div className="text-5xl mb-6 transition-all duration-500 hover:scale-110" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 font-serif" style={{ color: '#FFC145' }}>{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #D4A017, #F9A826, #D4A017)' }}></div>
      </section>

      {/* ====== CONTACT SECTION ====== */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #FAFAF7 0%, #F5F0EB 100%)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl p-8 md:p-12 shadow-2xl border-2 card-glow" 
            style={{ 
              background: 'white', 
              borderColor: '#E8E0D8',
              boxShadow: '0 20px 60px rgba(45,35,35,0.08)'
            }}>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 gradient-text">📍 Visit Our Shop</h2>
            <p className="text-center mb-10" style={{ color: '#8B7D6B' }}>We'd love to welcome you in person!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-105 card-glow" style={{ background: '#FAFAF7' }}>
                <span className="text-2xl flex-shrink-0">🏪</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: '#800020' }}>Address</h4>
                  <p className="text-sm" style={{ color: '#8B7D6B' }}>165/2A, Saket Nagar, Bhopal<br />Near AIIMS, In Front of Bhopal Public School</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-105 card-glow" style={{ background: '#FAFAF7' }}>
                <span className="text-2xl flex-shrink-0">📞</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: '#800020' }}>Call Us</h4>
                  <p className="text-sm" style={{ color: '#8B7D6B' }}>
                    <a href="tel:7974613110" style={{ color: '#F9A826', fontWeight: 600 }}>7974613110</a> / {' '}
                    <a href="tel:9893378872" style={{ color: '#F9A826', fontWeight: 600 }}>9893378872</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-105 card-glow" style={{ background: '#FAFAF7' }}>
                <span className="text-2xl flex-shrink-0">🕐</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: '#800020' }}>Business Hours</h4>
                  <p className="text-sm" style={{ color: '#8B7D6B' }}>Mon - Sat: 9:00 AM - 9:00 PM<br />Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/checkout" 
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ripple-effect"
                style={{ background: '#F9A826', color: '#2D2323' }}>
                🛵 Order Now for Delivery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TOAST NOTIFICATION ====== */}
      {addedMsg && (
        <div className="fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl z-50 animate-slide-up flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #2A9D8F, #138D75)', color: 'white' }}>
          <span>✅</span>
          <span className="font-medium">{addedMsg} added to cart!</span>
        </div>
      )}
    </div>
  );
}

export default Home;

