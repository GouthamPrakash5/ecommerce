import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Eye } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import RainbowText from '../components/RainbowText';


const Products = () => {
  const { products, loading, error, searchProducts } = useProducts();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  // Get category from URL params on component mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const categories = ['All', ...new Set(products.map(product => product.category))];

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
        case 'price-high':
          return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Handle search with API
  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const results = await searchProducts(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  // Use search results if available, otherwise use filtered products
  const displayProducts = searchResults || filteredProducts;

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1><RainbowText>Our Products</RainbowText></h1>
        <p>Discover our amazing collection of products</p>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
            style={{color:'#000'}}
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option style={{color:'#000'}} key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort by:</label>
            <select
            style={{color:'#000'}}
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option style={{color:'#000'}} value="name">Name</option>
              <option style={{color:'#000'}} value="price-low">Price: Low to High</option>
              <option style={{color:'#000'}} value="price-high">Price: High to Low</option>
              <option style={{color:'#000'}} value="stock">Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        <p>Showing {displayProducts.length} of {products.length} products</p>
        {searchResults && (
          <button onClick={() => setSearchResults(null)} className="clear-search-btn">
            Clear Search
          </button>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {displayProducts.length === 0 ? (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="products-grid">
          {displayProducts.map(product => (
                          <div key={product._id || product.id} className="product-card">
                              <div className="product-image">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0].url : product.image} 
                    alt={product.name} 
                  />
                  <div className="product-overlay">
                    <div className="overlay-buttons">
                      <Link to={`/products/${product._id || product.id}`} className="btn btn-outline">
                        <Eye size={16} />
                        View
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="btn btn-primary"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  {product.stock === 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                  {product.hasDiscount && (
                    <div className="discount-badge">-{product.discount.percentage}%</div>
                  )}
                </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                  <span className="product-stock">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="product-price">
                  {product.hasDiscount ? (
                    <>
                      <span className="discounted-price">₹{product.discountedPrice}</span>
                      <span className="original-price">₹{product.price}</span>
                    </>
                  ) : (
                    <span className="current-price">₹{product.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products; 