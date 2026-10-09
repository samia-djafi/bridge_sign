import { ContextId } from '@/types/domain';

export interface ContextDefinition {
  id: ContextId;
  iconName: string;
  nameKey: string;
  descriptionKey: string;
  suggestedPhrases: string[];
}

export const CONTEXTS: ContextDefinition[] = [
  {
    id: 'healthcare',
    iconName: 'HeartPulse',
    nameKey: 'contexts.healthcare',
    descriptionKey: 'Pharmacie / Clinique / Hôpital',
    suggestedPhrases: ['ph_where_pain', 'ph_since_when', 'ph_allergy_you', 'ph_take_once_day'],
  },
  {
    id: 'administration',
    iconName: 'Building2',
    nameKey: 'contexts.administration',
    descriptionKey: 'Mairie / Poste / Services publics',
    suggestedPhrases: ['ph_wait_please', 'ph_appointment_have', 'ph_write_please'],
  },
  {
    id: 'education',
    iconName: 'GraduationCap',
    nameKey: 'contexts.education',
    descriptionKey: 'Université / École / Formation',
    suggestedPhrases: ['ph_understand_you', 'ph_repeat_please', 'ph_slow_please'],
  },
  {
    id: 'everyday',
    iconName: 'ShoppingBag',
    nameKey: 'contexts.everyday',
    descriptionKey: 'Commerces / Transports / Rue',
    suggestedPhrases: ['ph_hello', 'ph_thank_you', 'ph_price'],
  },
  {
    id: 'other',
    iconName: 'MoreHorizontal',
    nameKey: 'contexts.other',
    descriptionKey: 'Autre contexte de communication',
    suggestedPhrases: ['ph_hello', 'ph_repeat_please', 'ph_help'],
  },
];
