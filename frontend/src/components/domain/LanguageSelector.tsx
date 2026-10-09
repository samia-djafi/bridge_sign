import React from 'react';
import { Select, SelectOption } from '@/components/ui/Select';
import { UiLang } from '@/types/domain';

export interface LanguageSelectorProps {
  value: UiLang;
  onChange: (lang: UiLang) => void;
  label?: string;
  className?: string;
}

const LANG_OPTIONS: SelectOption<UiLang>[] = [
  {
    value: 'fr',
    label: 'Français',
    icon: <span aria-hidden="true" className="text-base select-none">🇫🇷</span>,
    hint: 'French',
  },
  {
    value: 'ar',
    label: 'العربية',
    icon: <span aria-hidden="true" className="text-base select-none">🇩🇿</span>,
    hint: 'Arabic',
  },
  {
    value: 'en',
    label: 'English',
    icon: <span aria-hidden="true" className="text-base select-none">🇬🇧</span>,
    hint: 'English',
  },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  label,
  className = '',
}) => {
  return (
    <Select
      options={LANG_OPTIONS}
      value={value}
      onChange={onChange}
      label={label}
      className={className}
    />
  );
};
