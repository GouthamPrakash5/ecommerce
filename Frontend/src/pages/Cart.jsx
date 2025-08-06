import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import RainbowText from '../components/RainbowText';


const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }

    setCheckoutLoading(true);
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save order to localStorage (in a real app, this would go to a database)
      const order = {
        id: Date.now(),
        userId: user.id,
        items: cart,
        total: getCartTotal(),
        date: new Date().toISOString(),
        status: 'completed'
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart after successful checkout
      clearCart();
      alert('Order placed successfully!');
    } catch (error) {
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <ShoppingBag size={80} />
          <h2><RainbowText>Your cart is empty</RainbowText></h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1><RainbowText>Shopping Cart</RainbowText></h1>
        <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <div className="item-price">₹{item.price}</div>
              </div>

              <div className="item-quantity">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="quantity-btn"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
                title="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          
          <div className="summary-item">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          
          <div className="summary-item total">
            <span>Total:</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading || !user}
            className="btn btn-primary checkout-btn"
          >
            {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>

          {!user && (
            <p className="login-notice">
              Please <Link to="/login">login</Link> to checkout
            </p>
          )}

          <div className="cart-actions">
            <Link to="/products" className="btn btn-outline">
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="btn btn-danger">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 