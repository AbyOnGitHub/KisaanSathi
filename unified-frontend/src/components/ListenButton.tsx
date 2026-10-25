import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';

interface ListenButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
  label?: string;
  lang?: string; // force a language (e.g. 'en' for English-only labels)
}

export const ListenButton: React.FC<ListenButtonProps> = ({
  text,
  className = '',
  size = 'sm',
  label,
  lang,
}) => {
  const { speak } = useTTS();
  const iconSize = size === 'sm' ? 15 : 18;

  return (
    <button
      type="button"
      onClick={() => speak(text, lang)}
      className={`inline-flex items-center justify-center gap-1 shrink-0 p-1.5 rounded-full bg-green-50 text-green-600 hover:text-green-800 transition-colors font-medium ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${className}`}
      title="Listen" aria-label="Listen"
    >
      <Volume2 size={iconSize} />
      {label && <span>{label}</span>}
    </button>
  );
};
