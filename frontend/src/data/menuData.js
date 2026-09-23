const menuData = [
  // DRY SNACKS
  { 
    id: 1, name: "Matri", category: "Dry Snacks", 
    prices: { "1KG": 250, "1/2KG": 130, "250GM": 65 },
    image: "https://images.unsplash.com/photo-1626772875710-2c9d3f0b6a4b?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-amber-100 to-orange-100",
    emoji: "🥨"
  },
  { 
    id: 2, name: "Methi Matri", category: "Dry Snacks", 
    prices: { "1KG": 250, "1/2KG": 130, "250GM": 65 },
    image: "https://images.unsplash.com/photo-1601050690597-df0568f7095c?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-green-50 to-emerald-50",
    emoji: "🌿"
  },
  { 
    id: 3, name: "Namkeen Para", category: "Dry Snacks", 
    prices: { "1KG": 250, "1/2KG": 130, "250GM": 65 },
    image: "https://images.unsplash.com/photo-1627662052153-95c6481d4b6d?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-yellow-50 to-amber-50",
    emoji: "🥟"
  },
  { 
    id: 4, name: "Kaju Masala Para", category: "Dry Snacks", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 75 },
    image: "https://images.unsplash.com/photo-1606061874045-5574ec2b8de5?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-orange-50 to-red-50",
    emoji: "🥜"
  },
  { 
    id: 5, name: "Dry Samosa", category: "Dry Snacks", 
    prices: { "1KG": 280, "1/2KG": 145, "250GM": 150 },
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-amber-50 to-yellow-50",
    emoji: "🥟"
  },
  { 
    id: 6, name: "Murmura/Bhel", category: "Dry Snacks", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 75 },
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-orange-50 to-amber-50",
    emoji: "🍿"
  },
  { 
    id: 7, name: "Nagpuri Poha", category: "Dry Snacks", 
    prices: { "1KG": 320, "1/2KG": 165, "250GM": 85 },
    image: "https://images.unsplash.com/photo-1624378440829-e7bab8b92cec?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-yellow-50 to-orange-50",
    emoji: "🍚"
  },
  // NAMKEEN
  { 
    id: 8, name: "Chakli", category: "Namkeen", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 80 },
    image: "https://images.unsplash.com/photo-1615280622115-9e40e3e58f3a?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-amber-100 to-orange-100",
    emoji: "🌀"
  },
  { 
    id: 9, name: "Sev/Namkeen", category: "Namkeen", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 75 },
    image: "https://images.unsplash.com/photo-1630369061242-6f73250b6f0e?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-orange-50 to-red-50",
    emoji: "🥢"
  },
  { 
    id: 10, name: "Palak/Tamater Sev", category: "Namkeen", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 75 },
    image: "https://images.unsplash.com/photo-1608226174019-5db3bed9a6ec?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-green-50 to-red-50",
    emoji: "🌶️"
  },
  // SWEETS (Longer Shelf Life)
  { 
    id: 11, name: "Mitha Para", category: "Sweets", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 80 },
    image: "https://images.unsplash.com/photo-1589119908995-c6837e14841d?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-yellow-100 to-amber-100",
    emoji: "🍯"
  },
  { 
    id: 12, name: "Mitha Para Ghee", category: "Sweets", 
    prices: { "1KG": 450, "1/2KG": 230, "250GM": 120 },
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-amber-100 to-yellow-100",
    emoji: "✨"
  },
  { 
    id: 13, name: "Mitha Sugarkoted", category: "Sweets", 
    prices: { "1KG": 320, "1/2KG": 165, "250GM": 85 },
    image: "https://images.unsplash.com/photo-1589765473287-1ef36c312523?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-white to-yellow-50",
    emoji: "⬜"
  },
  { 
    id: 14, name: "Mitha Goudkoted", category: "Sweets", 
    prices: { "1KG": 400, "1/2KG": 210, "250GM": 110 },
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-amber-100 to-orange-100",
    emoji: "🟫"
  },
  // WET/FRESH SWEETS
  { 
    id: 15, name: "Modak Mawa", category: "Wet Sweets", 
    prices: { "1KG": 550, "1/2KG": 280, "250GM": 140 },
    image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-red-50 to-amber-50",
    emoji: "🔴"
  },
  { 
    id: 16, name: "Khoprapak (Naril Barfi)", category: "Wet Sweets", 
    prices: { "1KG": 520, "1/2KG": 265, "250GM": 130 },
    image: "https://images.unsplash.com/photo-1635537173637-d0b1eddde3bb?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-white to-amber-50",
    emoji: "🥥"
  },
  { 
    id: 17, name: "Gujiya Mawa Dryfruits", category: "Wet Sweets", 
    prices: { "1KG": 650, "1/2KG": 330, "250GM": 170 },
    image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-amber-100 to-yellow-100",
    emoji: "🥟"
  },
  { 
    id: 18, name: "Laddu Besan", category: "Wet Sweets", 
    prices: { "1KG": 520, "1/2KG": 260, "250GM": 130 },
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-yellow-100 to-orange-100",
    emoji: "🟡"
  },
  { 
    id: 19, name: "Laddu Rava", category: "Wet Sweets", 
    prices: { "1KG": 500, "1/2KG": 260, "250GM": 130 },
    image: "https://images.unsplash.com/photo-1589119908995-c6837e14841d?w=600&h=400&fit=crop&auto=format",
    bgColor: "from-white to-yellow-50",
    emoji: "⚪"
  }
];

// Realistic Unsplash food images - professional food photography references
export const getProductImage = (product) => {
  // Each product already has its own image URL
  return product.image;
};

export const categories = [
  { id: "all", label: "All", icon: "🛍️" },
  { id: "Dry Snacks", label: "Dry Snacks", icon: "🥨" },
  { id: "Namkeen", label: "Namkeen", icon: "🥟" },
  { id: "Sweets", label: "Sweets", icon: "🍬" },
  { id: "Wet Sweets", label: "Wet/Fresh Sweets", icon: "🍮" }
];

export default menuData;

