import React from 'react';
import { BaseTenBlock } from './BaseTenBlock';
import { useDragDrop } from '../../hooks/useDragDrop';

export function BaseTenBlockTray({ onDragStart }) {
  // onDragStart is optional, mostly we rely on handlePointerDown
  const { handlePointerDown } = useDragDrop({ onDrop: () => {} });

  const blocks = [
    { type: 'thousands', count: 9 },
    { type: 'hundreds', count: 9 },
    { type: 'tens', count: 9 },
    { type: 'ones', count: 9 },
  ];

  return (
    <div className="flex justify-around items-center bg-bgCardHover p-4 rounded-xl border border-borderSubtle mt-6 w-full max-w-2xl">
      {blocks.map(b => (
        <div key={b.type} className="flex flex-col items-center">
          <div 
            className="cursor-grab hover:scale-110 transition-transform touch-none"
            onPointerDown={(e) => {
              handlePointerDown(e, { type: b.type, source: 'tray' });
              if (onDragStart) onDragStart(b.type);
            }}
          >
            <BaseTenBlock type={b.type} />
          </div>
          <div className="text-xs text-slate-400 mt-2 capitalize">{b.type}</div>
        </div>
      ))}
    </div>
  );
}
