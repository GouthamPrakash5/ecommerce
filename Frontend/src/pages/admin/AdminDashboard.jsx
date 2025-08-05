import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  Plus,
  Eye,
  Settings
} from 'lucide-react';
import { useProducts } from '../../contexts/ProductContext';
import RainbowText from '../../components/RainbowText';


const AdminDashboard = () => {
  const { products } = useProducts();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Load orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Calculate statistics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    setStats({
      totalProducts: products.length,
      totalUsers: 10, // Mock data
      totalOrders: orders.length,
      totalRevenue: totalRevenue
    });
  }, [products]);

  const recentOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    .slice(-5)
    .reverse();

  const lowStockProducts = products.filter(product => product.stock < 10);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1><RainbowText>Admin Dashboard</RainbowText></h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--blue), var(--indigo))' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--green), var(--yellow))' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--orange), var(--red))' }}>
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--violet), var(--indigo))' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>${stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/products" className="action-card">
            <Plus size={24} />
            <h3>Add Product</h3>
            <p>Create a new product listing</p>
          </Link>
          
          <Link to="/admin/users" className="action-card">
            <Users size={24} />
            <h3>Manage Users</h3>
            <p>View and manage user accounts</p>
          </Link>
          
          <Link to="/admin/orders" className="action-card">
            <ShoppingCart size={24} />
            <h3>View Orders</h3>
            <p>Check recent orders and status</p>
          </Link>
          
          <Link to="/admin/products" className="action-card">
            <Settings size={24} />
            <h3>Product Settings</h3>
            <p>Manage inventory and pricing</p>
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Low Stock Alert */}
        <div className="dashboard-section">
          <h2>Low Stock Alert</h2>
          {lowStockProducts.length > 0 ? (
            <div className="low-stock-list">
              {lowStockProducts.map(product => (
                <div key={product.id} className="low-stock-item">
                  <img src={product.image} alt={product.name} />
                  <div className="item-info">
                    <h4>{product.name}</h4>
                    <p>Stock: {product.stock} units</p>
                  </div>
                  <Link to={`/admin/products`} className="btn btn-outline">
                    <Eye size={16} />
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-alerts">No low stock products</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="recent-orders">
              {recentOrders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <h4>Order #{order.id}</h4>
                    <p>{new Date(order.date).toLocaleDateString()}</p>
                    <p>{order.items.length} items</p>
                  </div>
                  <div className="order-total">
                    ${order.total.toFixed(2)}
                  </div>
                  <div className="order-status">
                    <span className="status-badge completed">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-orders">No recent orders</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 