import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Package, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import RainbowText from './RainbowText';


const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <RainbowText className="brand-text">K Condoms</RainbowText>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          {isAdmin() && (
            <>
              <Link to="/admin" className="nav-link admin-link">
                <BarChart3 size={16} />
                Dashboard
              </Link>
              <Link to="/admin/products" className="nav-link admin-link">
                <Package size={16} />
                Products
              </Link>
              <Link to="/admin/users" className="nav-link admin-link">
                <Users size={16} />
                Users
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-link">
            <ShoppingCart size={20} />
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <User size={16} />
                <span>{user.name}</span>
              </div>
              <div className="user-dropdown">
                {!isAdmin() && (
                  <>
                    <Link to="/profile" className="dropdown-item">
                      <User size={16} />
                      Profile
                    </Link>
                    <Link to="/purchase-history" className="dropdown-item">
                      <Package size={16} />
                      Purchase History
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 