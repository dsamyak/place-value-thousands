import React from 'react';
import { BaseTenBlock } from './BaseTenBlock';

export function PlaceValueColumn({ type, label, count, target, colorClass }) {
  // count is the current number of blocks in this column
  const blocks = Array.from({ length: count });

  return (
    <div 
      className={`flex-1 flex flex-col items-center p-2 min-h-[250px] relative transition-colors ${colorClass}`}
      data-dropzone={type}
    >
      <div className="text-xs font-bold text-white mb-2 tracking-wider opacity-80">{label}</div>
      <div className="text-sm font-mono text-white/60 mb-2">
        {count} / {target}
      </div>
      
      <div className="flex flex-col-reverse items-center justify-start flex-1 w-full gap-1 overflow-hidden pointer-events-none">
        {blocks.map((_, i) => (
          <div key={i} className="animate-[digitFlyIn_0.2s_ease-out]">
            <BaseTenBlock type={type} className="w-8 h-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
