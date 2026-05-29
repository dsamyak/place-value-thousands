import React from 'react';
import { BaseTenBlock } from './BaseTenBlock';

export function PlaceValueChart({ th, h, t, o, className = '' }) {
  
  const columns = [
    { id: 'thousands', label: 'THOUSANDS', value: th, colorClass: 'pv-column-thousands' },
    { id: 'hundreds', label: 'HUNDREDS', value: h, colorClass: 'pv-column-hundreds' },
    { id: 'tens', label: 'TENS', value: t, colorClass: 'pv-column-tens' },
    { id: 'ones', label: 'ONES', value: o, colorClass: 'pv-column-ones' },
  ];

  return (
    <div className={`flex w-full max-w-2xl rounded-xl overflow-hidden border-2 border-borderSubtle ${className}`}>
      {columns.map((col, idx) => (
        <div key={idx} className={`flex-1 flex flex-col items-center justify-center p-4 ${col.colorClass}`}>
          <div className="text-xs font-bold text-white mb-2 tracking-wider opacity-80">{col.label}</div>
          
          {col.value !== null && col.value !== undefined ? (
            col.value === '0' ? (
              <div className="flex flex-col items-center animate-[digitFlyIn_0.3s_ease-out]">
                <div className="text-digit-lg font-mono font-bold text-white/40">0</div>
                <div className="text-sm text-white/50 mt-1" title="Nobody lives here, but the house must exist!">👻 Empty</div>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-[digitFlyIn_0.3s_ease-out]">
                <div className="text-digit-lg font-mono font-bold text-white">{col.value}</div>
              </div>
            )
          ) : (
            <div className="text-digit-lg font-mono font-bold text-transparent select-none">-</div>
          )}
        </div>
      ))}
    </div>
  );
}
