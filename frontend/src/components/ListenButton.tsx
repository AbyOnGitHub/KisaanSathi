import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';

interface ListenButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
  label?: string;
}

export const ListenButton: React.FC<ListenButtonProps> = ({
  text,
  className = '',
  size = 'sm',
  label,
}) => {
  const { speak } = useTTS();
  const iconSize = size === 'sm' ? 15 : 18;

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className={`inline-flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors font-medium ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${className}`}
      title="Listen"
    >
      <Volume2 size={iconSize} />
      {label && <span>{label}</span>}
    </button>
  );
};
