import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Filter, X } from 'lucide-react';

// Sample product data
const productsData = [
  // Electronics
  { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 79.99, image: '🎧', rating: 4.5, description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.' },
  { id: 2, name: 'Smart Watch', category: 'electronics', price: 299.99, image: '⌚', rating: 4.7, description: 'Advanced fitness tracking, heart rate monitor, and smartphone notifications.' },
  { id: 3, name: 'Bluetooth Speaker', category: 'electronics', price: 49.99, image: '🔊', rating: 4.3, description: 'Portable waterproof speaker with 360-degree sound and 12-hour playtime.' },
  { id: 4, name: 'Laptop Stand', category: 'electronics', price: 34.99, image: '💻', rating: 4.6, description: 'Ergonomic aluminum laptop stand with adjustable height and angle.' },
  { id: 5, name: 'USB-C Hub', category: 'electronics', price: 45.99, image: '🔌', rating: 4.4, description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.' },
  { id: 6, name: 'Wireless Mouse', category: 'electronics', price: 24.99, image: '🖱', rating: 4.2, description: 'Ergonomic wireless mouse with precision tracking and long battery life.' },
  // Clothing
  { id: 7, name: 'Classic T-Shirt', category: 'clothing', price: 24.99, image: '👕', rating: 4.4, description: '100% organic cotton t-shirt, breathable and comfortable for everyday wear.' },
  { id: 8, name: 'Denim Jeans', category: 'clothing', price: 59.99, image: '👖', rating: 4.6, description: 'Classic fit denim jeans with stretch fabric for maximum comfort.' },
  { id: 9, name: 'Leather Jacket', category: 'clothing', price: 199.99, image: '🧥', rating: 4.8, description: 'Genuine leather jacket with premium stitching and timeless design.' },
  { id: 10, name: 'Running Shoes', category: 'clothing', price: 89.99, image: '👟', rating: 4.5, description: 'Lightweight running shoes with cushioned sole and breathable mesh.' },
  { id: 11, name: 'Hoodie', category: 'clothing', price: 44.99, image: '🧥', rating: 4.3, description: 'Cozy fleece-lined hoodie with adjustable drawstring and kangaroo pocket.' },
  { id: 12, name: 'Summer Dress', category: 'clothing', price: 54.99, image: '👗', rating: 4.7, description: 'Flowy summer dress with vibrant patterns, perfect for warm weather.' },
  // Accessories
  { id: 13, name: 'Leather Wallet', category: 'accessories', price: 39.99, image: '👛', rating: 4.5, description: 'Handcrafted leather wallet with RFID protection and multiple card slots.' },
  { id: 14, name: 'Sunglasses', category: 'accessories', price: 69.99, image: '🕶', rating: 4.6, description: 'UV400 protection sunglasses with polarized lenses and stylish frame.' },
  { id: 15, name: 'Backpack', category: 'accessories', price: 79.99, image: '🎒', rating: 4.7, description: 'Durable water-resistant backpack with laptop compartment and USB port.' },
  { id: 16, name: 'Watch Band', category: 'accessories', price: 19.99, image: '⌚', rating: 4.2, description: 'Premium silicone watch band, comfortable and sweat-resistant.' },
  { id: 17, name: 'Phone Case', category: 'accessories', price: 14.99, image: '📱', rating: 4.4, description: 'Shockproof phone case with raised edges for screen protection.' },
  { id: 18, name: 'Belt', category: 'accessories', price: 29.99, image: '🎀', rating: 4.3, description: 'Genuine leather belt with reversible buckle, fits all occasions.' },
];

const categories = [
  { id: 'all', name: 'All Products', icon: '🏪', count: productsData.length },
  { id: 'electronics', name: 'Electronics', icon: '💻', count: productsData.filter(p => p.category === 'electronics').length },
  { id: 'clothing', name: 'Clothing', icon: '👕', count: productsData.filter(p => p.category === 'clothing').length },
  { id: 'accessories', name: 'Accessories', icon: '👜', count: productsData.filter(p => p.category === 'accessories').length },
];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = productsData.filter(product => {
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && searchMatch;
    });

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  // Handle Add to Cart
  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Update cart quantity
  const updateCartQuantity = (productId, change) => {
    setCartItems(prev => prev
      .map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
      .filter(item => item.quantity > 0)
    );
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-3xl">🛍</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MyShop
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-purple-600 font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold text-purple-600">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold">{selectedProduct.name}</h2>
                <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="text-8xl text-center my-8">{selectedProduct.image}</div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-purple-600">${selectedProduct.price}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="font-semibold">{selectedProduct.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">{selectedProduct.description}</p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Category: {selectedProduct.category}</li>
                    <li>• Free shipping on orders over $50</li>
                    <li>• 30-day return policy</li>
                    <li>• 1-year warranty included</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all text-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white hover:shadow-md'}`}
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="font-semibold">{cat.name}</div>
              <div className="text-sm opacity-75">{cat.count} items</div>
            </button>
          ))}
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="text-gray-600">
              {filteredProducts.length} products found
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
                <span className="text-sm font-semibold bg-purple-100 px-3 py-1 rounded">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-6xl mb-4">{product.image}</div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-semibold">{product.rating}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedProduct(product); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={e => addToCart(product, e)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white mt-16 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">© 2025 MyShop. All rights reserved.</p>
          <p className="text-sm">Built with React • Responsive Design • Modern UI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;