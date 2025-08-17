'use client';

import { useState, useEffect } from 'react';

export interface QualitySliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
}

export default function QualitySlider({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  label = "Quality",
  showValue = true
}: QualitySliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getQualityLabel = (val: number) => {
    if (val <= 30) return 'Low';
    if (val <= 70) return 'Medium';
    return 'High';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--color-foreground)]">
          {label}
        </label>
        {showValue && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-muted-foreground)]">
              {getQualityLabel(localValue)}
            </span>
            <span className="text-sm font-mono text-[var(--color-foreground)] min-w-[3rem] text-right">
              {localValue}
            </span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          className="w-full h-2 bg-[var(--color-muted)] rounded-lg appearance-none cursor-pointer slider"
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--color-primary);
            border: 2px solid var(--color-card);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .slider::-webkit-slider-thumb:hover {
            background: var(--color-primary);
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--color-primary);
            border: 2px solid var(--color-card);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .slider::-moz-range-thumb:hover {
            background: var(--color-primary);
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          
          .slider::-webkit-slider-track {
            background: linear-gradient(
              to right,
              var(--color-primary) 0%,
              var(--color-primary) ${(localValue / max) * 100}%,
              var(--color-muted) ${(localValue / max) * 100}%,
              var(--color-muted) 100%
            );
            border-radius: 8px;
            height: 8px;
          }
          
          .slider::-moz-range-track {
            background: var(--color-muted);
            border-radius: 8px;
            height: 8px;
          }
          
          .slider::-moz-range-progress {
            background: var(--color-primary);
            border-radius: 8px;
            height: 8px;
          }
        `}</style>
      </div>
    </div>
  );
}
