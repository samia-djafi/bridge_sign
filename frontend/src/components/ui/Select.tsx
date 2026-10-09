import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  hint?: string;
}

export interface SelectProps<T extends string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select<T extends string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Sélectionner...',
  className = '',
  disabled = false,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(options.findIndex((o) => o.value === value));
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = options[highlightedIndex];
      if (opt) {
        onChange(opt.value);
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block w-full text-start ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-app-muted uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full h-11 px-3.5 rounded-control bg-app-surface border border-app-border-strong text-app-text text-sm flex items-center justify-between gap-2 shadow-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span aria-hidden="true">{selectedOption.icon}</span>}
              <span className="font-medium">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-app-muted">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-app-muted shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-control bg-app-surface border border-app-border-strong p-1 shadow-2 focus:outline-none animate-fade-in"
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-control text-sm cursor-pointer select-none transition-colors ${
                  isHighlighted
                    ? 'bg-app-surface-2 text-app-text'
                    : 'text-app-text'
                } ${isSelected ? 'font-semibold text-app-primary-strong bg-app-primary-soft' : ''}`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
                  <span>{opt.label}</span>
                  {opt.hint && <span className="text-xs text-app-muted font-normal">({opt.hint})</span>}
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-app-primary-strong shrink-0" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
