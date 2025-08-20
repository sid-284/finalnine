import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { apiFetch } from '../utils/api';
import Header from '../components/ui/Header';
import Footer from './homepage/components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { convertUSDToINR, formatINR } from '../utils/currency';

const AdminPanel = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    category: '', 
    subCategory: '', 
    sizes: '["XS", "S", "M", "L", "XL"]',
    bestseller: false,
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [adminLoading, setAdminLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showPaidOnly, setShowPaidOnly] = useState(true);

  // Check admin authentication status on component mount
  useEffect(() => {
    checkAdminAuth();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchProducts();
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [isAdminLoggedIn]);

  const checkAdminAuth = async () => {
    try {
      console.log('Checking admin authentication...');
      const response = await apiFetch('/user/getadmin');
      console.log('Admin auth response:', response);
      if (response && response.role === 'admin') {
        setIsAdminLoggedIn(true);
        console.log('Admin authentication verified');
      } else {
        setIsAdminLoggedIn(false);
        console.log('Admin authentication failed - invalid response');
      }
    } catch (error) {
      console.log('Admin not authenticated:', error.message);
      setIsAdminLoggedIn(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    console.log('Admin login form submitted:', adminForm);
    setAdminLoading(true);
    setError('');
    try {
      const response = await apiFetch('/auth/adminlogin', {
        method: 'POST',
        body: JSON.stringify({
          email: adminForm.email,
          password: adminForm.password
        }),
      });
      console.log('Admin login response:', response);
      setIsAdminLoggedIn(true);
      setSuccess('Admin login successful!');
      // Store token as fallback for Authorization header when cookies aren't sent
      if (response?.token) {
        localStorage.setItem('adminToken', response.token);
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Invalid admin credentials');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      // Call backend logout to clear the cookie
      await apiFetch('/auth/logout', { method: 'GET' });
    } catch (error) {
      console.error('Logout error:', error);
    }

    setIsAdminLoggedIn(false);
    setAdminForm({ email: '', password: '' });
    setSuccess('');
    setError('');
    localStorage.removeItem('adminToken');
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/product/list');
      setProducts(data);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      // Admin list endpoint requires POST
      const data = await apiFetch('/order/list', { method: 'POST' });
      // Sort by createdAt desc
      const sorted = Array.isArray(data) ? [...data].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      setOrders(sorted);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
    setOrdersLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      // Show preview for any image upload
      if (name.startsWith('image')) {
        setImagePreviews(prev => ({
          ...prev,
          [name]: URL.createObjectURL(files[0])
        }));
      }
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
    setSuccess('');
  };

  const handleAdd = () => {
    setForm({ 
      name: '', 
      price: '', 
      description: '', 
      category: '', 
      subCategory: '', 
      sizes: '["XS", "S", "M", "L", "XL"]',
      bestseller: false,
      image1: null,
      image2: null,
      image3: null,
      image4: null
    });
    // Reset all image previews
    setImagePreviews({
      image1: null,
      image2: null,
      image3: null,
      image4: null
    });
    setEditProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setForm({ 
      name: product.name, 
      price: product.price, 
      description: product.description, 
      category: product.category, 
      subCategory: product.subCategory || product.category,
      sizes: JSON.stringify(product.sizes || ["XS", "S", "M", "L", "XL"]),
      bestseller: product.bestseller || false,
      image1: null,
      image2: null,
      image3: null,
      image4: null
    });
    
    // Set image previews for existing product images
    setImagePreviews({
      image1: product.image1 || null,
      image2: product.image2 || null,
      image3: product.image3 || null,
      image4: product.image4 || null
    });
    
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await apiFetch(`/product/delete/${id}`, { method: 'DELETE' });
      setSuccess('Product deleted');
      fetchProducts();
    } catch {
      setError('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let body = new FormData();
      
      // Add all form fields to FormData
      body.append('name', form.name);
      body.append('price', form.price);
      body.append('description', form.description);
      body.append('category', form.category);
      body.append('subCategory', form.subCategory);
      body.append('sizes', form.sizes);
      body.append('bestseller', form.bestseller.toString());
      
      // Add images if they exist
      if (form.image1) {
        body.append('image1', form.image1);
      }
      if (form.image2) {
        body.append('image2', form.image2);
      }
      if (form.image3) {
        body.append('image3', form.image3);
      }
      if (form.image4) {
        body.append('image4', form.image4);
      }
      
      console.log('Submitting FormData with fields:', {
        name: form.name,
        price: form.price,
        category: form.category,
        hasImage1: !!form.image1,
        hasImage2: !!form.image2,
        hasImage3: !!form.image3,
        hasImage4: !!form.image4
      });

      console.log('Admin logged in status:', isAdminLoggedIn);

      if (editProduct) {
        console.log('Updating product:', editProduct._id || editProduct.id);
        const response = await apiFetch(`/product/update/${editProduct._id || editProduct.id}`, {
          method: 'PUT',
          body,
        });
        console.log('Update response:', response);
        setSuccess('Product updated');
      } else {
        console.log('Adding new product...');
        const response = await apiFetch('/product/addproduct', {
          method: 'POST',
          body,
        });
        console.log('Add product response:', response);
        setSuccess('Product added');
      }
      setShowForm(false);
      setImagePreviews({
        image1: null,
        image2: null,
        image3: null,
        image4: null
      });
      fetchProducts();
    } catch (error) {
      console.error('Submit error:', error);
      setError('Failed to save: ' + (error.message || 'Unknown error'));
    }
  };

  const filteredOrders = orders.filter(o => showPaidOnly ? o.payment === true : true);

  const shorten = (str) => {
    if (!str) return '';
    return str.length > 12 ? `${str.slice(0,6)}...${str.slice(-4)}` : str;
  }

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col overflow-x-hidden" style={{ background: '#FEFEFE' }}>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 w-full max-w-full">
          <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 text-center">Admin Login</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2 relative">
                <label htmlFor="admin-username" className="block text-sm font-medium text-foreground">
                  Admin Username *
                </label>
                <input
                  id="admin-username"
                  type="text"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  required
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-10"
                />
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="admin-password" className="block text-sm font-medium text-foreground">
                  Admin Password *
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  placeholder="Enter admin password"
                  required
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-10"
                />
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-500 text-sm text-center">{success}</div>}
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                loading={adminLoading}
              >
                Admin Login
              </Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden" style={{ background: '#FEFEFE' }}>
      <Header />
      <main className="flex-1 flex flex-col items-center py-16 px-4 w-full max-w-full">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-5xl w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="w-full sm:w-auto">
              <h2 className="text-2xl font-serif font-semibold text-foreground">Admin Panel</h2>
              <div className="text-sm text-muted-foreground mt-1">
                Status: <span className={isAdminLoggedIn ? "text-green-600" : "text-red-600"}>
                  {isAdminLoggedIn ? "✅ Authenticated" : "❌ Not Authenticated"}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="secondary" onClick={checkAdminAuth} className="w-full sm:w-auto">Check Auth</Button>
              <Button variant="primary" onClick={fetchProducts} className="w-full sm:w-auto">Refresh Products</Button>
              <Button variant="primary" onClick={fetchOrders} className="w-full sm:w-auto">Refresh Orders</Button>
              <Button variant="outline" onClick={handleAdminLogout} className="w-full sm:w-auto">Logout</Button>
            </div>
          </div>

          {/* Products section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-serif font-semibold text-foreground">Products</h3>
              <Button variant="primary" onClick={() => setShowForm(true)} className="w-auto">Add Product</Button>
            </div>
            {error && <div className="text-error text-sm text-center mb-2">{error}</div>}
            {success && <div className="text-success text-sm text-center mb-2">{success}</div>}
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border border-border rounded-lg overflow-hidden min-w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-3 text-sm sm:text-base">Name</th>
                      <th className="p-3 text-sm sm:text-base">Price</th>
                      <th className="p-3 text-sm sm:text-base hidden sm:table-cell">Description</th>
                      <th className="p-3 text-sm sm:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id || product.id} className="border-t border-border">
                        <td className="p-3 text-sm sm:text-base">{product.name}</td>
                        <td className="p-3 text-sm sm:text-base">{formatINR(convertUSDToINR(product.price))}</td>
                        <td className="p-3 text-sm sm:text-base hidden sm:table-cell">{product.description}</td>
                        <td className="p-3">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="w-full sm:w-auto">Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id || product.id)} className="w-full sm:w-auto">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Orders section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-serif font-semibold text-foreground">Orders</h3>
              <div className="flex items-center gap-3">
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" checked={showPaidOnly} onChange={(e) => setShowPaidOnly(e.target.checked)} />
                  Show paid only
                </label>
                <Button variant="secondary" onClick={fetchOrders}>Refresh</Button>
              </div>
            </div>
            {ordersLoading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border border-border rounded-lg overflow-hidden min-w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-3 text-sm sm:text-base">Order</th>
                      <th className="p-3 text-sm sm:text-base">User</th>
                      <th className="p-3 text-sm sm:text-base">Email</th>
                      <th className="p-3 text-sm sm:text-base">Amount</th>
                      <th className="p-3 text-sm sm:text-base">Items</th>
                      <th className="p-3 text-sm sm:text-base">Status</th>
                      <th className="p-3 text-sm sm:text-base">Paid</th>
                      <th className="p-3 text-sm sm:text-base hidden md:table-cell">RZP Order</th>
                      <th className="p-3 text-sm sm:text-base hidden lg:table-cell">RZP Payment</th>
                      <th className="p-3 text-sm sm:text-base hidden xl:table-cell">Verified At</th>
                      <th className="p-3 text-sm sm:text-base">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <React.Fragment key={o._id}>
                        <tr className="border-t border-border">
                          <td className="p-3 text-sm sm:text-base align-top">{shorten(o._id)}</td>
                          <td className="p-3 text-sm sm:text-base align-top">{o.user?.name || shorten(o.userId)}</td>
                          <td className="p-3 text-sm sm:text-base align-top">{o.user?.email || '-'}</td>
                          <td className="p-3 text-sm sm:text-base align-top">{formatINR(o.amount)}</td>
                          <td className="p-3 text-sm sm:text-base align-top">{Array.isArray(o.items) ? o.items.length : 0}</td>
                          <td className="p-3 text-sm sm:text-base align-top">{o.status || '-'}</td>
                          <td className="p-3 text-sm sm:text-base align-top">{o.payment ? '✅' : '❌'}</td>
                          <td className="p-3 text-sm sm:text-base hidden md:table-cell align-top">{shorten(o.razorpayOrderId)}</td>
                          <td className="p-3 text-sm sm:text-base hidden lg:table-cell align-top">{shorten(o.razorpayPaymentId)}</td>
                          <td className="p-3 text-sm sm:text-base hidden xl:table-cell align-top">{o.paymentVerifiedAt ? new Date(o.paymentVerifiedAt).toLocaleString() : '-'}</td>
                          <td className="p-3 text-sm sm:text-base align-top">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/10">
                          <td colSpan={11} className="p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-medium mb-2">Shipping Address</div>
                                <div className="text-sm text-muted-foreground">
                                  {o.address?.name && <div><span className="font-medium text-foreground">Name:</span> {o.address.name}</div>}
                                  {o.address?.address && <div><span className="font-medium text-foreground">Address:</span> {o.address.address}</div>}
                                  {o.address?.city && <div><span className="font-medium text-foreground">City:</span> {o.address.city}</div>}
                                  {o.address?.state && <div><span className="font-medium text-foreground">State:</span> {o.address.state}</div>}
                                  {o.address?.zip && <div><span className="font-medium text-foreground">Zip:</span> {o.address.zip}</div>}
                                  {o.address?.phone && <div><span className="font-medium text-foreground">Phone:</span> {o.address.phone}</div>}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium mb-2">Items</div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-sm">
                                    <thead>
                                      <tr className="text-muted-foreground">
                                        <th className="p-1 text-left">Product</th>
                                        <th className="p-1 text-left">Size</th>
                                        <th className="p-1 text-left">Color</th>
                                        <th className="p-1 text-left">Qty</th>
                                        <th className="p-1 text-left">Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(o.items || []).map((it, idx) => (
                                        <tr key={idx} className="border-t border-border/50">
                                          <td className="p-1">{it.name || it.productName || it.id || '-'}</td>
                                          <td className="p-1">{it.size || '-'}</td>
                                          <td className="p-1">{it.color || '-'}</td>
                                          <td className="p-1">{it.quantity || 1}</td>
                                          <td className="p-1">{typeof it.price === 'number' ? formatINR(it.price) : '-'}</td>
                                        </tr>
                                      ))}
                                      {(Array.isArray(o.items) && o.items.length === 0) && (
                                        <tr><td colSpan={5} className="p-2 text-muted-foreground">No items</td></tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={11} className="p-4 text-center text-muted-foreground">No orders to display</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-hidden">
            <div
              className="bg-card rounded-lg shadow-lg w-full max-w-md relative flex flex-col overflow-hidden"
              style={{
                maxHeight: '90vh',
                height: 'auto'
              }}
            >
              <form className="flex flex-col" style={{height: '100%'}} onSubmit={handleSubmit}>
                <div className="flex-shrink-0 p-6 pb-4 border-b border-border">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-accent"
                    onClick={() => setShowForm(false)}
                    aria-label="Close"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <h3 className="text-xl font-serif font-semibold text-foreground">{editProduct ? 'Edit' : 'Add'} Product</h3>
                </div>
                <div
                  className="flex-1 p-6 pt-4 space-y-4"
                  style={{
                    overflowY: 'auto',
                    minHeight: '0',
                    maxHeight: 'calc(90vh - 200px)'
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sub Category</label>
                    <input
                      type="text"
                      name="subCategory"
                      value={form.subCategory}
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                      placeholder="e.g., Coats, Dresses, Sweaters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sizes (JSON)</label>
                    <input
                      type="text"
                      name="sizes"
                      value={form.sizes}
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                      placeholder='["XS", "S", "M", "L", "XL"]'
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="bestseller"
                        checked={form.bestseller}
                        onChange={handleFormChange}
                        className="rounded border-border"
                      />
                      <span className="text-sm font-medium">Bestseller</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Main Image</label>
                    <input
                      type="file"
                      name="image1"
                      accept="image/*"
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                    />
                    {imagePreviews.image1 && (
                      <img src={imagePreviews.image1} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image 2 (Optional)</label>
                    <input
                      type="file"
                      name="image2"
                      accept="image/*"
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                    />
                    {imagePreviews.image2 && (
                      <img src={imagePreviews.image2} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image 3 (Optional)</label>
                    <input
                      type="file"
                      name="image3"
                      accept="image/*"
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                    />
                    {imagePreviews.image3 && (
                      <img src={imagePreviews.image3} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image 4 (Optional)</label>
                    <input
                      type="file"
                      name="image4"
                      accept="image/*"
                      onChange={handleFormChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                    />
                    {imagePreviews.image4 && (
                      <img src={imagePreviews.image4} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 p-6 pt-4 border-t border-border">
                  <Button type="submit" variant="primary" fullWidth>{editProduct ? 'Update' : 'Add'} Product</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
