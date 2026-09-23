import React from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl block mb-4">📭</span>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try a different category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;

