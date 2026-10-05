const menuData = [
  // DRY SNACKS
  { 
    id: 1, name: "Matri", category: "Dry Snacks", 
    prices: { "1KG": 250, "1/2KG": 130, "250GM": 65 },
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNGn8Ok8eG8igVH8_Dd68xUAfHO2586zAiwLBUF7aug&s=10",
    bgColor: "from-amber-100 to-orange-100",
    emoji: ""
  },
  { 
    id: 2, name: "Methi Matri", category: "Dry Snacks", 
    prices: { "1KG": 250, "1/2KG": 130, "250GM": 65 },
    image: "https://i0.wp.com/foodtrails25.com/wp-content/uploads/2019/09/Khasta-Mathri-recipe.jpg?resize=683%2C1024&ssl=1",
    bgColor: "from-green-50 to-emerald-50",
    emoji: ""
  },
  { 
    id: 3, name: "Namkeen Para", category: "Dry Snacks", 
    prices: { "1KG": 250, "1/2KG": 130, "250GM": 65 },
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ06xF6MlxmHuUPt1LLMkm1Yr_UJQqfw1KMvr38R6e9BQj05dahQsFbsyw&s=10",
    bgColor: "from-yellow-50 to-amber-50",
    emoji: ""
  },
  { 
    id: 4, name: "Kaju Masala Para", category: "Dry Snacks", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 75 },
    image: "https://gudmishri.in/cdn/shop/files/A_KAJU_MASALA_17-6-26-01.jpg?v=1782480057&width=2000",
    bgColor: "from-orange-50 to-red-50",
    emoji: ""
  },
  { 
    id: 5, name: "Dry Samosa", category: "Dry Snacks", 
    prices: { "1KG": 280, "1/2KG": 145, "250GM": 150 },
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4eI9RuxdGpGGfNwkuD_ZNjVGcqk7TGN4A4lAIQTSVqkF92_zO8S_GAs0&s=10",
    bgColor: "from-amber-50 to-yellow-50",
    emoji: ""
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
    image: "https://pipingpotcurry.com/wp-content/uploads/2021/11/Pohe-chivda-recipe.jpg",
    bgColor: "from-yellow-50 to-orange-50",
    emoji: ""
  },
  // NAMKEEN
  { 
    id: 8, name: "Chakli", category: "Namkeen", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 80 },
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Chakli_in_a_bowl.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    bgColor: "from-amber-100 to-orange-100",
    emoji: ""
  },
  { 
    id: 9, name: "Sev/Namkeen", category: "Namkeen", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 75 },
    image: "https://5.imimg.com/data5/NR/LD/QP/SELLER-8958827/sev-namkeen-500x500.JPG",
    bgColor: "from-orange-50 to-red-50",
    emoji: ""
  },
  { 
    id: 10, name: "Palak/Tamater Sev", category: "Namkeen", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 75 },
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrToTSxJAK0a-VvVwWPsIuDY2AEchYqpxpU4lz2Ls9P4Vc4KMOKKKFWhA&s=10",
    bgColor: "from-green-50 to-red-50",
    emoji: ""
  },
  // SWEETS (Longer Shelf Life)
  { 
    id: 11, name: "Mitha Para", category: "Sweets", 
    prices: { "1KG": 300, "1/2KG": 150, "250GM": 80 },
    image: "https://5.imimg.com/data5/MD/TG/DJ/SELLER-101546433/mitha-shakkarpara-175rs.jpeg",
    bgColor: "from-yellow-100 to-amber-100",
    emoji: ""
  },
  { 
    id: 12, name: "Mitha Para Ghee", category: "Sweets", 
    prices: { "1KG": 450, "1/2KG": 230, "250GM": 120 },
    image: "https://5.imimg.com/data5/ANDROID/Default/2024/1/374441282/VH/YJ/EJ/100305124/product-jpeg-500x500.jpg",
    bgColor: "from-amber-100 to-yellow-100",
    emoji: ""
  },
  { 
    id: 13, name: "Mitha Sugarkoted", category: "Sweets", 
    prices: { "1KG": 320, "1/2KG": 165, "250GM": 85 },
    image: "https://m.media-amazon.com/images/I/41k6OPYm+jL._AC_UF894,1000_QL80_.jpg",
    bgColor: "from-white to-yellow-50",
    emoji: ""
  },
  { 
    id: 14, name: "Mitha Goudkoted", category: "Sweets", 
    prices: { "1KG": 400, "1/2KG": 210, "250GM": 110 },
    image: "https://m.media-amazon.com/images/I/618Coisc9gL._AC_UF894,1000_QL80_.jpg",
    bgColor: "from-amber-100 to-orange-100",
    emoji: ""
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
  { id: "Dry Snacks", label: "Dry Snacks", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNGn8Ok8eG8igVH8_Dd68xUAfHO2586zAiwLBUF7aug&s=10" },
  { id: "Namkeen", label: "Namkeen", icon: "🥟" },
  { id: "Sweets", label: "Sweets", icon: "🍬" },
  { id: "Wet Sweets", label: "Wet/Fresh Sweets", icon: "🍮" }
];

export default menuData;

