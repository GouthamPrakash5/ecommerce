import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';


const ProductDetail = () => {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, getProductById]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="not-found">
          <h2>Product not found</h2>
          <p>{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <Link to="/products" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
                      <div className="product-image-section">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0].url : product.image} 
                  alt={product.name} 
                  className="product-image" 
                />
              </div>
        
        <div className="product-info-section">
          <div className="breadcrumb">
            <Link to="/products">Products</Link>
            <span> / </span>
            <span>{product.name}</span>
          </div>
          
          <h1 className="product-name">{product.name}</h1>
          <p className="product-category">{product.category}</p>
          
          <div className="product-price">
            {product.hasDiscount ? (
              <>
                <span className="discounted-price">${product.discountedPrice}</span>
                <span className="original-price">${product.price}</span>
              </>
            ) : (
              <span className="current-price">${product.price}</span>
            )}
          </div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          
          {product.stock > 0 && (
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stock}
                  className="quantity-input"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="quantity-btn"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
          
          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary add-to-cart-btn"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            
            <Link to="/products" className="btn btn-outline">
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 