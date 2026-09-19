/**
 * Seller Orders Table Row with fulfillment status update dropdown.
 */

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Clock } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/formatters';
import api from '../../utils/api';

export const SellerOrderRow = ({ order, onStatusUpdated, onViewDetails }) => {
  const [currentStatus, setCurrentStatus] = useState(order.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    shipped: 'bg-purple-100 text-purple-800 border-purple-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.put(`/orders/${order.id}/status`, { status: newStatus });
      setCurrentStatus(newStatus);
      toast.success(`Order status updated to '${newStatus}'`);
      if (onStatusUpdated) onStatusUpdated();
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition text-xs">
      {/* Order ID */}
      <td className="py-3 px-4 font-mono font-bold text-gray-900">
        #{order.id.slice(0, 8)}...
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
        {formatDate(order.created_at)}
      </td>

      {/* Shipping City & Pincode */}
      <td className="py-3 px-4 text-gray-800">
        <span className="font-semibold block">{order.shipping_city || 'Farm Location'}</span>
        <span className="text-[11px] text-gray-400">{order.shipping_pincode || '440001'}</span>
      </td>

      {/* Items Count */}
      <td className="py-3 px-4 font-bold text-gray-900">
        {order.items?.length || 1} Item(s)
      </td>

      {/* Total Amount */}
      <td className="py-3 px-4 font-extrabold text-gray-900">
        {formatPrice(order.total_amount)}
      </td>

      {/* Fulfillment Status Dropdown */}
      <td className="py-3 px-4">
        <select
          value={currentStatus}
          disabled={isUpdating}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer ${
            statusColors[currentStatus] || statusColors.pending
          }`}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onViewDetails(order)}
          className="p-1.5 text-gray-500 hover:text-agri-primary hover:bg-gray-100 rounded-md transition"
          title="View Order Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default SellerOrderRow;
