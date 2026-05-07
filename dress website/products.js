const catalog = [
    // Women Ethnic
    {
        id: 1,
        title: "Aakarsha Attractive Designer Gown",
        price: 499,
        originalPrice: 999,
        category: "ethnic",
        subcategory: "gowns",
        color: "Pink",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Fabric: Georgette", "Pattern: Solid", "Sleeve Length: Sleeveless"]
    },
    {
        id: 2,
        title: "Alisha Superior Rayon Kurtis",
        price: 350,
        originalPrice: 599,
        category: "ethnic",
        subcategory: "kurtis",
        color: "Yellow",
        image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Fabric: Rayon", "Pattern: Printed", "Length: Knee-Length"]
    },
    {
        id: 3,
        title: "Banarasi Silk Saree",
        price: 899,
        originalPrice: 1599,
        category: "ethnic",
        subcategory: "sarees",
        color: "Red",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Fabric: Art Silk", "Pattern: Woven Design", "Blouse Piece: Unstitched"]
    },
    // Women Western
    {
        id: 4,
        title: "Urbane Glamorous Women Dresses",
        price: 299,
        originalPrice: 499,
        category: "western",
        subcategory: "dresses",
        color: "Black",
        image: "https://images.unsplash.com/photo-1515347619152-16a73c0beff3?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1515347619152-16a73c0beff3?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Fabric: Crepe", "Pattern: Solid", "Length: Mini"]
    },
    {
        id: 5,
        title: "Trendy Party Wear Pink Dress",
        price: 549,
        originalPrice: 899,
        category: "western",
        subcategory: "dresses",
        color: "Pink",
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Fabric: Poly Crepe", "Pattern: Embellished", "Occasion: Party"]
    },
    {
        id: 6,
        title: "Casual Printed Top",
        price: 199,
        originalPrice: 399,
        category: "western",
        subcategory: "tops",
        color: "Blue",
        image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Fabric: Cotton Blend", "Pattern: Floral Print", "Neck: Round Neck"]
    },
    // Men
    {
        id: 7,
        title: "Men Casual White Shirt",
        price: 450,
        originalPrice: 799,
        category: "men",
        subcategory: "shirts",
        color: "White",
        image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Fabric: Cotton", "Pattern: Solid", "Sleeve: Full Sleeve"]
    },
    {
        id: 8,
        title: "Men Slim Fit Denim Jeans",
        price: 699,
        originalPrice: 1299,
        category: "men",
        subcategory: "jeans",
        color: "Blue",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Fabric: Denim", "Fit: Slim", "Stretch: Stretchable"]
    },
    // Accessories
    {
        id: 9,
        title: "Elegant Women Handbag",
        price: 399,
        originalPrice: 899,
        category: "accessories",
        subcategory: "bags",
        color: "Brown",
        image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop"
        ],
        details: ["Material: PU Leather", "Type: Handheld", "Compartments: 2"]
    }
];

// Helper functions for dynamic fetching
function getProductsByCategory(categoryParam) {
    if (!categoryParam || categoryParam === 'all') return catalog;
    return catalog.filter(p => p.category === categoryParam || p.subcategory === categoryParam);
}

function getProductById(id) {
    return catalog.find(p => p.id === parseInt(id));
}

function getTrendingProducts() {
    // Just return some featured items for the homepage
    return [catalog[0], catalog[3], catalog[4], catalog[1]];
}
