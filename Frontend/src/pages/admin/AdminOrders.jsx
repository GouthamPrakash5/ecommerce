import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Package } from 'lucide-react';
import RainbowText from '../../components/RainbowText';


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1><RainbowText>Manage Orders</RainbowText></h1>
        <p>View and manage customer orders</p>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>User {order.userId}</td>
                <td>{order.items.length} items</td>
                <td>${order.total.toFixed(2)}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <span className="status-badge completed">
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon">
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon">
                      <Package size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="no-orders">
            <ShoppingCart size={48} />
            <h3><RainbowText>No orders yet</RainbowText></h3>
            <p>Orders will appear here when customers make purchases</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders; 