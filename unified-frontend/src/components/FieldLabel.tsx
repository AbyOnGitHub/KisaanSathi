import React from 'react';
import { ListenButton } from './ListenButton';

interface Props {
  text: string;
  className?: string;
  lang?: string;
}

/** A label with a speaker button on the left so the field name can be heard. */
export const FieldLabel: React.FC<Props> = ({ text, className = '', lang }) => (
  <div className="flex items-center gap-2 mb-1">
    <ListenButton text={text} lang={lang} size="md" />
    <label className={className.replace(/\bmb-\d(\.5)?\b/g, '').trim()}>{text}</label>
  </div>
);
