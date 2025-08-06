import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Truck, Shield, CreditCard } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import RainbowText from '../components/RainbowText';
import ApiTest from '../components/ApiTest';


const Home = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const featuredProducts = products.slice(0, 4);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <RainbowText>RainbowShop</RainbowText>
          </h1>
          <p className="hero-subtitle">
            Discover amazing products with our vibrant collection. Quality meets style in every purchase.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Shop Now
              <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn btn-outline">
              Join Us
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-graphic">
            <ShoppingBag size={80} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Truck size={32} />
            </div>
            <h3>Free Shipping</h3>
            <p>Free shipping on orders over $50</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Secure Payment</h3>
            <p>100% secure payment processing</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Star size={32} />
            </div>
            <h3>Quality Guarantee</h3>
            <p>30-day money back guarantee</p>
          </div>
         </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-header">
          <h2><RainbowText>Featured Products</RainbowText></h2>
          <p>Handpicked products just for you</p>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.images && product.images.length > 0 ? product.images[0].url : product.image} alt={product.name} />
                <div className="product-overlay">
                  <Link to={`/products/${product.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <div className="product-price">₹{product.price}</div>
                <div className="product-stock">
                  {product.stock > 0 ? (
                    <span className="in-stock">In Stock ({product.stock})</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/products" className="btn btn-outline">
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="section-header">
          <h2><RainbowText>Shop by Category</RainbowText></h2>
          <p>Find what you're looking for</p>
        </div>
        <div className="categories-grid">
          <div 
            className="category-card" 
            style={{ background: 'linear-gradient(135deg, var(--red), var(--orange))' }}
            onClick={() => handleCategoryClick('Condoms')}
          >
            <h3>Condoms</h3>
            <p>For your pleasure</p>
          </div>
          <div 
            className="category-card" 
            style={{ background: 'linear-gradient(135deg, var(--yellow), var(--green))' }}
            onClick={() => handleCategoryClick('Lubes')}
          >
            <h3>Lubes</h3>
            <p>For your pleasure</p>
          </div>
         
        </div>
      </section>

      {/* API Test Section - Remove this after testing */}
      <ApiTest />
    </div>
  );
};

export default Home; 