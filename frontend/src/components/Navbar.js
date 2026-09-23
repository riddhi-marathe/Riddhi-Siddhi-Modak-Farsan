import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ cartCount, onCartClick, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Scroll hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setPrevScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-md border-b-4 shadow-xl transition-transform duration-300" 
      style={{ 
        borderColor: '#F9A826',
        boxShadow: '0 4px 20px rgba(45,35,35,0.12)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)'
      }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/home" className="flex items-center gap-2 no-underline" onClick={() => setIsMenuOpen(false)}>
<img 
            src="/assets/logo-image.jpeg" 
            alt="Riddhi Siddhi" 
            className="h-10 w-10 rounded-full object-cover border-2 shadow-md"
            style={{ borderColor: '#F9A826' }}
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl leading-tight" style={{ 
              color: '#2D2323'
            }}>Riddhi Siddhi</span>
            <span className="text-xs" style={{ color: '#2D2323', opacity: 0.6 }}>Modak Farsan</span>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full text-sm border-2 outline-none transition-all"
              style={{ 
                borderColor: '#E8E0D8', 
                background: '#FAFAF7',
                color: '#2D2323'
              }}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all hover:scale-110"
              style={{ background: '#F9A826', color: 'white' }}>
              🔍
            </button>
          </div>
        </form>

        <button className="md:hidden flex flex-col gap-1.5 bg-none border-none cursor-pointer p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={`block w-6 h-0.5 transition-all rounded ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} style={{ background: '#2D2323' }}></span>
          <span className={`block w-6 h-0.5 transition-all rounded ${isMenuOpen ? 'opacity-0' : ''}`} style={{ background: '#2D2323' }}></span>
          <span className={`block w-6 h-0.5 transition-all rounded ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} style={{ background: '#2D2323' }}></span>
        </button>

        <div className={`md:flex items-center gap-1 ${isMenuOpen ? 'flex flex-col absolute top-16 left-0 right-0 p-4 shadow-xl border-t-2 animate-slide-up' : 'hidden'}`}
          style={{ background: '#FAFAF7', borderColor: '#F9A826' }}>
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="w-full md:hidden mb-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full text-sm border-2 outline-none"
                style={{ borderColor: '#E8E0D8', background: '#FAFAF7', color: '#2D2323' }}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full"
                style={{ background: '#F9A826', color: 'white' }}>
                🔍
              </button>
            </div>
          </form>

          <Link to="/home" className="w-full md:w-auto px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105" 
            style={{ color: '#2D2323' }}
            onClick={() => setIsMenuOpen(false)}>🏠 Home</Link>
          <Link to="/category/Dry Snacks" className="w-full md:w-auto px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            style={{ color: '#2D2323' }}
            onClick={() => setIsMenuOpen(false)}>🥨 Dry Snacks</Link>
          <Link to="/category/Namkeen" className="w-full md:w-auto px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            style={{ color: '#2D2323' }}
            onClick={() => setIsMenuOpen(false)}>🥟 Namkeen</Link>
          <Link to="/category/Sweets" className="w-full md:w-auto px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            style={{ color: '#2D2323' }}
            onClick={() => setIsMenuOpen(false)}>🍬 Sweets</Link>
          <Link to="/category/Wet Sweets" className="w-full md:w-auto px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            style={{ color: '#2D2323' }}
            onClick={() => setIsMenuOpen(false)}>🍮 Fresh Sweets</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="w-full md:w-auto px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                style={{ color: '#2D2323' }}
                onClick={() => setIsMenuOpen(false)}>📋 Orders</Link>
              <button className="w-full md:w-auto px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 bg-none border-none cursor-pointer text-left md:text-center"
                style={{ color: '#2D2323' }}
                onClick={() => { onLogout(); setIsMenuOpen(false); navigate('/home'); }}>🚪 Logout</button>
            </>
          ) : (
            <Link to="/checkout" className="w-full md:w-auto px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
              style={{ color: '#2D2323' }}
              onClick={() => setIsMenuOpen(false)}>👤 Login</Link>
          )}
        </div>

        <button className="relative bg-none border-none cursor-pointer p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95" 
          style={{ background: 'transparent' }}
          onClick={onCartClick}>
          <span className="text-xl">🛒</span>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce-in"
              style={{ background: '#F9A826' }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

