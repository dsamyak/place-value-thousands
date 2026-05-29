import React from 'react';
import { useDragDrop } from '../../hooks/useDragDrop';

export function ValueCard({ value, isDraggable = false, className = '' }) {
  const { handlePointerDown } = useDragDrop({ onDrop: () => {} });

  const formatValue = (v) => {
    return Number(v).toLocaleString();
  };

  return (
    <div 
      className={`
        px-4 py-2 bg-bgCard border-2 border-accentPrimary rounded-lg 
        text-white font-mono font-bold text-xl shadow-lg
        ${isDraggable ? 'cursor-grab hover:bg-bgCardHover touch-none hover:-translate-y-1 transition-transform' : ''}
        ${className}
      `}
      onPointerDown={isDraggable ? (e) => handlePointerDown(e, { value }) : undefined}
    >
      {formatValue(value)}
    </div>
  );
}
