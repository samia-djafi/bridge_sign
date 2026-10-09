import React, { useRef } from 'react';

export interface SegmentOption<T extends string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  name = 'segmented-control',
  className = '',
  size = 'md',
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex;
    const isRtl = document.documentElement.dir === 'rtl';

    if (e.key === 'ArrowRight') {
      nextIndex = isRtl ? currentIndex - 1 : currentIndex + 1;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = isRtl ? currentIndex + 1 : currentIndex - 1;
    } else {
      return;
    }

    if (nextIndex < 0) nextIndex = options.length - 1;
    if (nextIndex >= options.length) nextIndex = 0;

    e.preventDefault();
    const nextOption = options[nextIndex];
    if (nextOption) {
      onChange(nextOption.value);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  const sizeStyle = size === 'sm' ? 'p-0.5 text-xs' : 'p-1 text-sm';
  const buttonPad = size === 'sm' ? 'py-1 px-2.5' : 'py-2 px-3.5 min-h-[38px]';

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={name}
      className={`inline-flex rounded-control bg-app-surface-2 border border-app-border ${sizeStyle} ${className}`}
    >
      {options.map((opt, idx) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`inline-flex items-center justify-center gap-2 rounded-control font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong ${buttonPad} ${
              isSelected
                ? 'bg-app-surface text-app-primary-strong shadow-1 font-semibold'
                : 'text-app-muted hover:text-app-text hover:bg-app-surface/50'
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
