import React from 'react';
import { Check } from 'lucide-react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  id,
}) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-col">
        <label
          htmlFor={toggleId}
          className={`text-sm font-medium text-app-text select-none cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {label}
        </label>
        {description && (
          <span className="text-xs text-app-muted select-none">{description}</span>
        )}
      </div>

      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-app-primary-strong' : 'bg-app-border-strong'
        }`}
      >
        <span
          className={`pointer-events-none inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow-1 ring-0 transition duration-200 ease-in-out ${
            checked
              ? 'translate-x-5 rtl:-translate-x-5 text-app-primary-strong'
              : 'translate-x-0 text-transparent'
          }`}
        >
          <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
};
