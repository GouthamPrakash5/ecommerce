import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useProducts } from '../../contexts/ProductContext';
import RainbowText from '../../components/RainbowText';


const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, error } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [{ url: '', alt: 'Product image', isPrimary: true }],
    brand: '',
    subcategory: '',
    tags: [],
    isFeatured: false,
    discount: { percentage: 0, validUntil: '' },
    shipping: { weight: '', freeShipping: false, shippingCost: 0 }
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add basic product data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('tags', JSON.stringify(formData.tags.filter(tag => tag.trim())));
      formDataToSend.append('isFeatured', formData.isFeatured);
      formDataToSend.append('discount', JSON.stringify({
        percentage: parseFloat(formData.discount.percentage),
        validUntil: formData.discount.validUntil ? new Date(formData.discount.validUntil) : null
      }));
      formDataToSend.append('shipping', JSON.stringify({
        weight: formData.shipping.weight ? parseFloat(formData.shipping.weight) : null,
        freeShipping: formData.shipping.freeShipping,
        shippingCost: parseFloat(formData.shipping.shippingCost)
      }));
      
      // Add URL-based images if any
      if (formData.images && formData.images.length > 0) {
        const urlImages = formData.images.filter(img => img.url && img.url.startsWith('http'));
        if (urlImages.length > 0) {
          formDataToSend.append('images', JSON.stringify(urlImages));
        }
      }
      
      // Add uploaded files
      selectedFiles.forEach((file, index) => {
        formDataToSend.append('images', file);
      });
      
      if (editingProduct) {
        const result = await updateProduct(editingProduct._id || editingProduct.id, formDataToSend);
        if (result.success) {
          setEditingProduct(null);
          resetForm();
        }
      } else {
        const result = await addProduct(formDataToSend);
        if (result.success) {
          resetForm();
          setShowForm(false);
        }
      }
    } catch (err) {
      console.error('Error submitting product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      images: product.images || [{ url: product.image || '', alt: 'Product image', isPrimary: true }],
      brand: product.brand || '',
      subcategory: product.subcategory || '',
      tags: product.tags || [],
      isFeatured: product.isFeatured || false,
      discount: {
        percentage: product.discount?.percentage?.toString() || '0',
        validUntil: product.discount?.validUntil ? new Date(product.discount.validUntil).toISOString().split('T')[0] : ''
      },
      shipping: {
        weight: product.shipping?.weight?.toString() || '',
        freeShipping: product.shipping?.freeShipping || false,
        shippingCost: product.shipping?.shippingCost?.toString() || '0'
      }
    });
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setImagePreview(newPreviews);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      images: [{ url: '', alt: 'Product image', isPrimary: true }],
      brand: '',
      subcategory: '',
      tags: [],
      isFeatured: false,
      discount: { percentage: 0, validUntil: '' },
      shipping: { weight: '', freeShipping: false, shippingCost: 0 }
    });
    setSelectedFiles([]);
    setImagePreview([]);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(productId);
      if (!result.success) {
        alert('Failed to delete product: ' + result.error);
      }
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1><RainbowText>Manage Products</RainbowText></h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2><RainbowText>{editingProduct ? 'Edit Product' : 'Add New Product'}</RainbowText></h2>
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
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="form-textarea"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    <option value="Condoms">Condoms</option>
                    <option value="Lubes">Lubes</option>
                 
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Subcategory</label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Product Images</label>
                <div className="image-upload-section">
                  {/* URL Input */}
                  <div className="url-input">
                    <label>Image URL (optional)</label>
                    <input
                      type="url"
                      value={formData.images[0]?.url || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        images: [{ ...formData.images[0], url: e.target.value }]
                      })}
                      placeholder="https://example.com/image.jpg"
                      className="form-input"
                    />
                  </div>
                  
                  {/* File Upload */}
                  <div className="file-upload">
                    <label>Upload Images (optional)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-input"
                    />
                    <small>Max 5 images, 5MB each. Supported formats: JPG, PNG, GIF, WEBP</small>
                  </div>
                  
                  {/* Image Previews */}
                  {imagePreview.length > 0 && (
                    <div className="image-previews">
                      <label>Selected Images:</label>
                      <div className="preview-grid">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="preview-item">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="remove-image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* URL Image Preview */}
                  {formData.images[0]?.url && (
                    <div className="url-image-preview">
                      <label>URL Image Preview:</label>
                      <div className="preview-item">
                        <img src={formData.images[0].url} alt="URL preview" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  className="form-input"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Discount Percentage</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount.percentage}
                    onChange={(e) => setFormData({
                      ...formData, 
                      discount: { ...formData.discount, percentage: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Discount Valid Until</label>
                  <input
                    type="date"
                    value={formData.discount.validUntil}
                    onChange={(e) => setFormData({
                      ...formData, 
                      discount: { ...formData.discount, validUntil: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Shipping Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.shipping.weight}
                    onChange={(e) => setFormData({
                      ...formData, 
                      shipping: { ...formData.shipping, weight: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Shipping Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.shipping.shippingCost}
                    onChange={(e) => setFormData({
                      ...formData, 
                      shipping: { ...formData.shipping, shippingCost: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  />
                  Featured Product
                </label>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.shipping.freeShipping}
                    onChange={(e) => setFormData({
                      ...formData, 
                      shipping: { ...formData.shipping, freeShipping: e.target.checked }
                    })}
                  />
                  Free Shipping
                </label>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    resetForm();
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

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id || product.id}>
                <td>
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0].url : product.image} 
                    alt={product.name} 
                    className="product-thumbnail" 
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>
                  {product.hasDiscount ? (
                    <>
                      <span className="discounted-price">₹{product.discountedPrice}</span>
                      <span className="original-price">₹{product.price}</span>
                    </>
                  ) : (
                    <span className="current-price">₹{product.price}</span>
                  )}
                </td>
                <td>
                  <span className={product.stock < 10 ? 'low-stock' : 'in-stock'}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {product.isFeatured && <span className="featured-badge">Featured</span>}
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(product)} className="btn-icon">
                      <Edit size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(product._id || product.id)} className="btn-icon danger" style={{color:'red', width:'55px'}}>
                           Delete
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

export default AdminProducts; 