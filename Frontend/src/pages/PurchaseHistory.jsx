import { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RainbowText from '../components/RainbowText';


const PurchaseHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = storedOrders.filter(order => order.userId === user?.id);
    setOrders(userOrders);
  }, [user]);

  return (
    <div className="purchase-history">
      <div className="history-header">
        <h1><RainbowText>Purchase History</RainbowText></h1>
        <p>View your past orders and purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <Package size={80} />
          <h2><RainbowText>No orders yet</RainbowText></h2>
          <p>Start shopping to see your purchase history here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    <Calendar size={16} />
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-total">
                  <DollarSign size={20} />
                  ₹{order.total.toFixed(2)}
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                    </div>
                    <div className="item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-status">
                <span className="status-badge completed">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory; 