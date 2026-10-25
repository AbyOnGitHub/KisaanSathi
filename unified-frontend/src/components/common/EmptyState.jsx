/**
 * EmptyState placeholder component with icon, title, description, and action button.
 */

import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon = <PackageOpen className="w-16 h-16 text-gray-400 stroke-1" />,
  title = 'No items found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionText = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg border border-agri-border my-6 ${className}`}>
      <div className="mb-4 text-agri-primary/80 bg-green-50 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-5">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
