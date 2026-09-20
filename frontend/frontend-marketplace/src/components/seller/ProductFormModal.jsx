/**
 * Seller Add / Edit Product Modal.
 * Full-featured multi-field form with pricing, inventory, discount auto-calculation, and toggles.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../utils/api';

export const ProductFormModal = ({
  isOpen,
  onClose,
  productToEdit = null,
  onSaved,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    category_id: 'seeds',
    description: '',
    price: '',
    discount_percent: 0,
    unit: 'kg',
    stock: 50,
    min_order: 1,
    image_urls: [''],
    tags: '',
    allow_bargaining: true,
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category_id: productToEdit.category_id || productToEdit.category?.slug || 'seeds',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        discount_percent: productToEdit.discount_percent || 0,
        unit: productToEdit.unit || 'kg',
        stock: productToEdit.stock ?? 50,
        min_order: productToEdit.min_order ?? 1,
        image_urls: productToEdit.image_urls?.length ? productToEdit.image_urls : [''],
        tags: Array.isArray(productToEdit.tags) ? productToEdit.tags.join(', ') : '',
        allow_bargaining: productToEdit.allow_bargaining ?? true,
        is_active: productToEdit.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        category_id: 'seeds',
        description: '',
        price: '',
        discount_percent: 0,
        unit: 'kg',
        stock: 50,
        min_order: 1,
        image_urls: ['https://images.unsplash.com/photo-1594488518002-390919246193?w=800&auto=format&fit=crop&q=80'],
        tags: 'organic, hybrid, certified',
        allow_bargaining: true,
        is_active: true,
      });
    }
  }, [productToEdit, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (index, val) => {
    const updated = [...formData.image_urls];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, image_urls: updated }));
  };

  const addImageUrlField = () => {
    if (formData.image_urls.length < 4) {
      setFormData((prev) => ({ ...prev, image_urls: [...prev.image_urls, ''] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Product name and selling price are required');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: formData.name,
      category_id: formData.category_id,
      description: formData.description,
      price: Number(formData.price),
      discount_percent: Number(formData.discount_percent) || 0,
      unit: formData.unit,
      stock: Number(formData.stock) || 0,
      min_order: Number(formData.min_order) || 1,
      image_urls: formData.image_urls.filter((url) => url.trim().length > 0),
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      allow_bargaining: formData.allow_bargaining,
      is_active: formData.is_active,
    };

    try {
      if (productToEdit?.id) {
        await api.put(`/products/${productToEdit.id}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products/', payload);
        toast.success('Product created and published!');
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to save product';
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? t('seller.modal_edit_title') : t('seller.modal_add_title')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Basic Information */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-agri-primary">
            {t('seller.sec_basic')}
          </h4>

          <div>
            <label className="block font-bold text-gray-800 mb-1">{t('seller.product_title')}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t('seller.product_title_ph')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">{t('seller.category')}</label>
              <select
                value={formData.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white outline-none focus:border-agri-primary"
              >
                <option value="seeds">Seeds & Planting Material</option>
                <option value="fertilizers">Fertilizers & Nutrients</option>
                <option value="pesticides">Pesticides & Bio-Controls</option>
                <option value="tools">Machinery & Farm Tools</option>
                <option value="irrigation">Drip & Irrigation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">{t('seller.unit_of_measure')}</label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white outline-none focus:border-agri-primary"
              >
                <option value="kg">{t('seller.unit_kg')}</option>
                <option value="packet">{t('seller.unit_packet')}</option>
                <option value="bag">{t('seller.unit_bag')}</option>
                <option value="bottle">{t('seller.unit_bottle')}</option>
                <option value="piece">{t('seller.unit_piece')}</option>
                <option value="roll">{t('seller.unit_roll')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">{t('seller.desc_label')}</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('seller.desc_ph')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary resize-none"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-agri-primary">
            {t('seller.sec_pricing')}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">{t('seller.selling_price')}</label>
              <input
                type="number"
                required
                min={1}
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="820"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">{t('seller.discount_pct')}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.discount_percent}
                onChange={(e) => handleChange('discount_percent', e.target.value)}
                placeholder="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">{t('seller.stock_available')}</label>
              <input
                type="number"
                min={0}
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">{t('seller.min_order_qty')}</label>
              <input
                type="number"
                min={1}
                value={formData.min_order}
                onChange={(e) => handleChange('min_order', e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary"
              />
            </div>
          </div>
        </div>

        {/* Media & Tags */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-agri-primary">
            {t('seller.sec_media')}
          </h4>

          <div>
            <label className="block font-bold text-gray-800 mb-1">{t('seller.image_urls')}</label>
            {formData.image_urls.map((url, index) => (
              <input
                key={index}
                type="url"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary mb-2"
              />
            ))}
            {formData.image_urls.length < 3 && (
              <button
                type="button"
                onClick={addImageUrlField}
                className="text-agri-primary font-bold hover:underline text-[11px]"
              >
                {t('seller.add_another_img')}
              </button>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">{t('seller.search_tags')}</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder={t('seller.search_tags_ph')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:border-agri-primary"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="pt-2 border-t border-gray-100 space-y-2 bg-gray-50 p-3 rounded-md">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
            <input
              type="checkbox"
              checked={formData.allow_bargaining}
              onChange={(e) => handleChange('allow_bargaining', e.target.checked)}
              className="w-4 h-4 text-agri-primary rounded focus:ring-agri-primary accent-agri-primary"
            />
            <span>{t('seller.allow_bargaining_toggle')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="w-4 h-4 text-agri-primary rounded focus:ring-agri-primary accent-agri-primary"
            />
            <span>{t('seller.active_toggle')}</span>
          </label>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {productToEdit ? t('seller.save_changes') : t('seller.publish_product')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;

