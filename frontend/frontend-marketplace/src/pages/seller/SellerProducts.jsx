/**
 * Seller Product Inventory Management Tab.
 * Product table with columns: Image, Name, Category, Price, Stock, Active Toggle, Actions (Edit, Delete).
 * Purely backend-driven — no static mock products.
 */

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit3, Trash2, Search, Layers, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import ProductFormModal from '../../components/seller/ProductFormModal';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export const SellerProducts = ({ onOpenAddModal, onProductsChanged }) => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProducts = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/products/seller/${profile.id}`);
      if (Array.isArray(res.data)) {
        setSellerProducts(res.data);
      } else if (res.data?.data) {
        setSellerProducts(res.data.data);
      } else {
        setSellerProducts([]);
      }
    } catch (err) {
      console.error('Error fetching seller products:', err);
      setSellerProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [profile]);

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to deactivate and remove this product listing?')) return;
    try {
      await api.delete(`/products/${prodId}`);
      toast.success('Product listing removed');
      setSellerProducts((prev) => prev.filter((p) => p.id !== prodId));
      if (onProductsChanged) onProductsChanged();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to delete product';
      toast.error(detail);
    }
  };

  const handleToggleActive = async (prod) => {
    const updatedStatus = !prod.is_active;
    try {
      await api.put(`/products/${prod.id}`, { is_active: updatedStatus });
      toast.success(updatedStatus ? 'Product activated' : 'Product deactivated');
      setSellerProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, is_active: updatedStatus } : p))
      );
      if (onProductsChanged) onProductsChanged();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to update status';
      toast.error(detail);
    }
  };

  const filtered = sellerProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-agri-border p-5 space-y-4 shadow-xs text-xs">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-black text-gray-900 flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-agri-primary" />
            <span>Product Inventory ({sellerProducts.length} Items)</span>
          </h2>
          <p className="text-xs text-gray-500">
            Manage your store catalog, pricing, available stock, and bargaining permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary bg-gray-50"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Product
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-8 h-8 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading your product catalog...</span>
        </div>
      ) : sellerProducts.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-12 h-12 text-gray-400" />}
          title="No products listed yet"
          description="You have not published any products in your catalog. Click the button below to add your first agro-supply item."
          actionText="Add New Product"
          onAction={onOpenAddModal}
        />
      ) : (
        /* Products Table */
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product Info</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Bargain</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/60 transition">
                  {/* Product Info */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.image_urls?.[0] || 'https://images.unsplash.com/photo-1594488518002-390919246193?w=100&auto=format&fit=crop&q=80'}
                      alt={prod.name}
                      className="w-10 h-10 rounded object-cover border border-gray-200"
                    />
                    <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                      <span className="font-bold text-gray-900 truncate block leading-tight">
                        {prod.name}
                      </span>
                      <span className="text-[11px] text-gray-400">ID: #{prod.id.slice(0, 8)}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-gray-600 font-medium">
                    {prod.category?.name || 'Agri Supply'}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-black text-gray-900">
                    {formatPrice(prod.price)}
                    {prod.discount_percent > 0 && (
                      <span className="text-[10px] text-red-600 font-bold ml-1">
                        ({prod.discount_percent}% off)
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span className={`font-bold ${prod.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {prod.stock} {prod.unit || 'units'}
                    </span>
                  </td>

                  {/* Bargain Enabled */}
                  <td className="py-3 px-4">
                    {prod.allow_bargaining ? (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        💬 Enabled
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[11px]">Disabled</span>
                    )}
                  </td>

                  {/* Active Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {prod.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="p-1.5 text-gray-500 hover:text-agri-primary hover:bg-gray-100 rounded transition"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <ProductFormModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          productToEdit={editingProduct}
          onSaved={() => {
            fetchSellerProducts();
            if (onProductsChanged) onProductsChanged();
          }}
        />
      )}
    </div>
  );
};

export default SellerProducts;
