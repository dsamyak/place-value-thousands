import React, { useState } from 'react';
import { Delete } from 'lucide-react';

export function NumberPad({ onUpdate, onSubmit, maxLength = 4 }) {
  const [value, setValue] = useState('');

  const handlePress = (digit) => {
    if (value.length < maxLength) {
      const newValue = value + digit;
      setValue(newValue);
      onUpdate(newValue);
    }
  };

  const handleBackspace = () => {
    const newValue = value.slice(0, -1);
    setValue(newValue);
    onUpdate(newValue);
  };

  const handleSubmit = () => {
    if (value.length > 0) {
      onSubmit(value);
      setValue('');
    }
  };

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="flex flex-col items-center bg-bgCard p-4 rounded-xl shadow-lg border border-borderSubtle max-w-[280px] w-full">
      <div className="h-14 w-full bg-bgPrimary rounded-lg mb-4 flex items-center justify-end px-4 text-3xl font-mono text-white tracking-widest border border-borderSubtle">
        {value || <span className="opacity-20">____</span>}
      </div>
      
      <div className="grid grid-cols-3 gap-3 w-full">
        {digits.slice(0, 9).map(d => (
          <button 
            key={d} 
            onClick={() => handlePress(d.toString())}
            className="h-14 bg-slate-700 hover:bg-accentPrimary text-white text-xl font-bold rounded-lg transition-colors active:scale-95"
          >
            {d}
          </button>
        ))}
        <button 
          onClick={handleBackspace}
          className="h-14 bg-slate-800 hover:bg-slate-600 text-white flex items-center justify-center rounded-lg transition-colors active:scale-95"
        >
          <Delete size={24} />
        </button>
        <button 
          onClick={() => handlePress('0')}
          className="h-14 bg-slate-700 hover:bg-accentPrimary text-white text-xl font-bold rounded-lg transition-colors active:scale-95"
        >
          0
        </button>
        <button 
          onClick={handleSubmit}
          disabled={value.length === 0}
          className="h-14 bg-colorSuccess hover:bg-green-500 disabled:opacity-50 disabled:bg-colorSuccess text-slate-900 text-lg font-bold rounded-lg transition-colors active:scale-95 flex items-center justify-center"
        >
          GO
        </button>
      </div>
    </div>
  );
}
