import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/menuData';

function CategoryFilter({ activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to active category
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector(`[data-cat-id="${activeCategory}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  return (
    <div 
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {categories.map((cat, index) => (
        <motion.button
          key={cat.id}
          data-cat-id={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ease-out shadow-md hover:shadow-xl hover:scale-105 active:scale-95 snap-start ${
            activeCategory === cat.id
              ? 'text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600'
          }`}
          style={{
            background: activeCategory === cat.id
              ? '#800020'
              : '',
            animation: activeCategory === cat.id ? 'glowPulse 2s ease-in-out infinite' : 'none'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-2 whitespace-nowrap">
            {typeof cat.icon === 'string' && cat.icon.startsWith('http') ? (
              <img
                src={cat.icon}
                alt={cat.label}
                style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 6 }}
              />
            ) : (
              <span>{cat.icon}</span>
            )}
            {cat.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default CategoryFilter;

