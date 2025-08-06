import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

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

  // Fetch all products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.api.get('/api/products');
      setProducts(data.data);
    } catch (err) {
      setError(err.message || 'Network error: Unable to fetch products');
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
      
      if (isFormData) {
        // For file uploads, use the axios instance directly with proper headers
        const data = await apiService.api.post('/api/products', productData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProducts(prev => [...prev, data.data]);
        return { success: true, data: data.data };
      } else {
        // For regular JSON data
        const data = await apiService.api.post('/api/products', productData);
        setProducts(prev => [...prev, data.data]);
        return { success: true, data: data.data };
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
      return { success: false, error: err.message };
    }
  };

  // Update product
  const updateProduct = async (id, updates) => {
    try {
      setError(null);
      
      // Check if updates is FormData (file upload) or regular object
      const isFormData = updates instanceof FormData;
      
      if (isFormData) {
        // For file uploads, use the axios instance directly with proper headers
        const data = await apiService.api.put(`/api/products/${id}`, updates, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProducts(prev =>
          prev.map(product =>
            product._id === id ? data.data : product
          )
        );
        return { success: true, data: data.data };
      } else {
        // For regular JSON data
        const data = await apiService.api.put(`/api/products/${id}`, updates);
        setProducts(prev =>
          prev.map(product =>
            product._id === id ? data.data : product
          )
        );
        return { success: true, data: data.data };
      }
    } catch (err) {
      setError(err.message || 'Failed to update product');
      return { success: false, error: err.message };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setError(null);
      await apiService.api.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(product => product._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      return { success: false, error: err.message };
    }
  };

  // Get product by ID
  const getProductById = async (id) => {
    try {
      const data = await apiService.api.get(`/api/products/${id}`);
      return data.data;
    } catch (err) {
      setError(err.message || 'Product not found');
      return null;
    }
  };

  // Search products
  const searchProducts = async (query) => {
    try {
      const data = await apiService.api.get(`/api/products/search?q=${encodeURIComponent(query)}`);
      return data.data;
    } catch (err) {
      setError(err.message || 'Search failed');
      return [];
    }
  };

  // Get products by category
  const getProductsByCategory = async (category) => {
    try {
      const data = await apiService.api.get(`/api/products/category/${encodeURIComponent(category)}`);
      return data.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch category products');
      return [];
    }
  };

  // Get featured products
  const getFeaturedProducts = async () => {
    try {
      const data = await apiService.api.get('/api/products/featured');
      return data.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch featured products');
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