import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Ban, Edit, Trash2, Eye } from 'lucide-react';
import RainbowText from '../../components/RainbowText';


const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    role: 'admin'
  });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error: Unable to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new admin user
  const createAdminUser = async (userData) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => [...prev, data.data.user]);
        return { success: true, data: data.data };
      } else {
        setError(data.message || 'Failed to create admin user');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Network error: Unable to create admin user');
      return { success: false, error: 'Network error' };
    }
  };

  // Toggle user block status
  const toggleUserBlock = async (userId, isBlocked) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isBlocked }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev =>
          prev.map(user =>
            user._id === userId ? { ...user, isBlocked } : user
          )
        );
        return { success: true };
      } else {
        setError(data.message || 'Failed to update user status');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Network error: Unable to update user status');
      return { success: false, error: 'Network error' };
    }
  };

  // Change user role
  const changeUserRole = async (userId, role) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev =>
          prev.map(user =>
            user._id === userId ? { ...user, role } : user
          )
        );
        return { success: true };
      } else {
        setError(data.message || 'Failed to change user role');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Network error: Unable to change user role');
      return { success: false, error: 'Network error' };
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => prev.filter(user => user._id !== userId));
        return { success: true };
      } else {
        setError(data.message || 'Failed to delete user');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Network error: Unable to delete user');
      return { success: false, error: 'Network error' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const userData = {
        ...formData,
        age: parseInt(formData.age),
        role: 'admin' // Force admin role for admin registration
      };
      
      const result = await createAdminUser(userData);
      if (result.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          age: '',
          role: 'admin'
        });
        setShowForm(false);
      }
    } catch (err) {
      console.error('Error creating admin user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlockUser = async (userId, currentStatus) => {
    const result = await toggleUserBlock(userId, !currentStatus);
    if (!result.success) {
      alert('Failed to update user status: ' + result.error);
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const result = await changeUserRole(userId, newRole);
    if (!result.success) {
      alert('Failed to change user role: ' + result.error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const result = await deleteUser(userId);
      if (!result.success) {
        alert('Failed to delete user: ' + result.error);
      }
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="admin-users">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1><RainbowText>Manage Users</RainbowText></h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <UserPlus size={16} />
          Admin Registration
        </button>
      </div>

      {/* Admin Registration Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2><RainbowText>Register New Admin</RainbowText></h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={6}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                  min="18"
                  max="120"
                  className="form-input"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Admin'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      age: '',
                      role: 'admin'
                    });
                  }}
                  className="btn btn-outline"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age || 'N/A'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleChangeRole(user._id, user.role)}
                      className="btn-icon"
                      title={user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    >
                      <Shield size={16} />Make Admin
                    </button>
                    <button 
                      onClick={() => handleBlockUser(user._id, user.isBlocked)}
                      className={`btn-icon ${user.isBlocked ? 'success' : 'danger'}`}
                      title={user.isBlocked ? 'Unblock User' : 'Block User'}
                    >
                      <Ban size={16} />Block
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="btn-icon danger"
                      title="Delete User"
                    >
                      <Trash2 size={16} />Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers; 