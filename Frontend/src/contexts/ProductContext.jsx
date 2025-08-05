import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch all products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Network error: Unable to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new product
  const addProduct = async (productData) => {
    try {
      setError(null);
      
      // Check if productData is FormData (file upload) or regular object
      const isFormData = productData instanceof FormData;
      
      const headers = {};
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      const body = isFormData ? productData : JSON.stringify(productData);
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers,
        body,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => [...prev, data.data]);
        return { success: true, data: data.data };
      } else {
        setError(data.message || 'Failed to create product');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Network error: Unable to create product');
      return { success: false, error: 'Network error' };
    }
  };

  // Update product
  const updateProduct = async (id, updates) => {
    try {
      setError(null);
      
      // Check if updates is FormData (file upload) or regular object
      const isFormData = updates instanceof FormData;
      
      const headers = {};
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      const body = isFormData ? updates : JSON.stringify(updates);
      
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers,
        body,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev =>
          prev.map(product =>
            product._id === id ? data.data : product
          )
        );
        return { success: true, data: data.data };
      } else {
        setError(data.message || 'Failed to update product');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Network error: Unable to update product');
      return { success: false, error: 'Network error' };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => prev.filter(product => product._id !== id));
        return { success: true };
      } else {
        setError(data.message || 'Failed to delete product');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Network error: Unable to delete product');
      return { success: false, error: 'Network error' };
    }
  };

  // Get product by ID
  const getProductById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.message || 'Product not found');
        return null;
      }
    } catch (err) {
      setError('Network error: Unable to fetch product');
      return null;
    }
  };

  // Search products
  const searchProducts = async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.message || 'Search failed');
        return [];
      }
    } catch (err) {
      setError('Network error: Unable to search products');
      return [];
    }
  };

  // Get products by category
  const getProductsByCategory = async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.message || 'Failed to fetch category products');
        return [];
      }
    } catch (err) {
      setError('Network error: Unable to fetch category products');
      return [];
    }
  };

  // Get featured products
  const getFeaturedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.message || 'Failed to fetch featured products');
        return [];
      }
    } catch (err) {
      setError('Network error: Unable to fetch featured products');
      return [];
    }
  };

  // Update stock
  const updateStock = async (productId, quantity) => {
    try {
      const product = products.find(p => p._id === productId);
      if (!product) return false;
      
      const newStock = Math.max(0, product.stock - quantity);
      const result = await updateProduct(productId, { stock: newStock });
      return result.success;
    } catch (err) {
      setError('Failed to update stock');
      return false;
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getFeaturedProducts,
    updateStock,
    fetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 