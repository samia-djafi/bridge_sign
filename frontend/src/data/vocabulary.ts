import { VocabularyItem } from '@/types/domain';

export const ESSENTIAL_VOCABULARY: VocabularyItem[] = [
  // --- BODY PARTS (10 words) ---
  {
    id: 'voc_head',
    category: 'body_parts',
    text: {
      en: 'Head',
      fr: 'Tête',
      ar: 'رأس',
    },
    gloss: 'HEAD',
  },
  {
    id: 'voc_hand',
    category: 'body_parts',
    text: {
      en: 'Hand',
      fr: 'Main',
      ar: 'يد',
    },
    gloss: 'HAND',
  },
  {
    id: 'voc_eye',
    category: 'body_parts',
    text: {
      en: 'Eye',
      fr: 'Œil',
      ar: 'عين',
    },
    gloss: 'EYE',
  },
  {
    id: 'voc_ear',
    category: 'body_parts',
    text: {
      en: 'Ear',
      fr: 'Oreille',
      ar: 'أذن',
    },
    gloss: 'EAR',
  },
  {
    id: 'voc_mouth',
    category: 'body_parts',
    text: {
      en: 'Mouth',
      fr: 'Bouche',
      ar: 'فم',
    },
    gloss: 'MOUTH',
  },
  {
    id: 'voc_throat',
    category: 'body_parts',
    text: {
      en: 'Throat',
      fr: 'Gorge',
      ar: 'حلق',
    },
    gloss: 'THROAT',
  },
  {
    id: 'voc_chest',
    category: 'body_parts',
    text: {
      en: 'Chest',
      fr: 'Poitrine',
      ar: 'صدر',
    },
    gloss: 'CHEST',
  },
  {
    id: 'voc_stomach',
    category: 'body_parts',
    text: {
      en: 'Stomach',
      fr: 'Ventre / Estomac',
      ar: 'بطن / معدة',
    },
    gloss: 'STOMACH',
  },
  {
    id: 'voc_back',
    category: 'body_parts',
    text: {
      en: 'Back',
      fr: 'Dos',
      ar: 'ظهر',
    },
    gloss: 'BACK',
  },
  {
    id: 'voc_tooth',
    category: 'body_parts',
    text: {
      en: 'Tooth',
      fr: 'Dent',
      ar: 'سن',
    },
    gloss: 'TOOTH',
  },

  // --- SYMPTOMS (8 words) ---
  {
    id: 'voc_pain',
    category: 'symptoms',
    text: {
      en: 'Pain',
      fr: 'Douleur',
      ar: 'ألم',
    },
    gloss: 'PAIN',
  },
  {
    id: 'voc_fever',
    category: 'symptoms',
    text: {
      en: 'Fever',
      fr: 'Fièvre',
      ar: 'حمى',
    },
    gloss: 'FEVER',
  },
  {
    id: 'voc_cough',
    category: 'symptoms',
    text: {
      en: 'Cough',
      fr: 'Toux',
      ar: 'سعال',
    },
    gloss: 'COUGH',
  },
  {
    id: 'voc_dizziness',
    category: 'symptoms',
    text: {
      en: 'Dizziness',
      fr: 'Vertige',
      ar: 'دوار',
    },
    gloss: 'DIZZY',
  },
  {
    id: 'voc_allergy',
    category: 'symptoms',
    text: {
      en: 'Allergy',
      fr: 'Allergie',
      ar: 'حساسية',
    },
    gloss: 'ALLERGY',
  },
  {
    id: 'voc_nausea',
    category: 'symptoms',
    text: {
      en: 'Nausea',
      fr: 'Nausée',
      ar: 'غثيان',
    },
    gloss: 'NAUSEA',
  },
  {
    id: 'voc_fatigue',
    category: 'symptoms',
    text: {
      en: 'Fatigue',
      fr: 'Fatigue',
      ar: 'إرهاق',
    },
    gloss: 'TIRED',
  },
  {
    id: 'voc_bleeding',
    category: 'symptoms',
    text: {
      en: 'Bleeding',
      fr: 'Saignement',
      ar: 'نزيف',
    },
    gloss: 'BLOOD',
  },

  // --- MEDICINES & PHARMACY (8 words) ---
  {
    id: 'voc_medicine',
    category: 'pharmacy_medicines',
    text: {
      en: 'Medicine',
      fr: 'Médicament',
      ar: 'دواء',
    },
    gloss: 'MEDICINE',
  },
  {
    id: 'voc_prescription',
    category: 'pharmacy_medicines',
    text: {
      en: 'Prescription',
      fr: 'Ordonnance',
      ar: 'وصفة طبية',
    },
    gloss: 'PRESCRIPTION',
  },
  {
    id: 'voc_tablet',
    category: 'pharmacy_medicines',
    text: {
      en: 'Tablet',
      fr: 'Comprimé',
      ar: 'قرص دواء',
    },
    gloss: 'TABLET',
  },
  {
    id: 'voc_syrup',
    category: 'pharmacy_medicines',
    text: {
      en: 'Syrup',
      fr: 'Sirop',
      ar: 'شراب دواء',
    },
    gloss: 'SYRUP',
  },
  {
    id: 'voc_dose',
    category: 'pharmacy_medicines',
    text: {
      en: 'Dose',
      fr: 'Dose',
      ar: 'جرعة',
    },
    gloss: 'DOSE',
  },
  {
    id: 'voc_pharmacy',
    category: 'pharmacy_medicines',
    text: {
      en: 'Pharmacy',
      fr: 'Pharmacie',
      ar: 'صيدلية',
    },
    gloss: 'PHARMACY',
  },
  {
    id: 'voc_treatment',
    category: 'pharmacy_medicines',
    text: {
      en: 'Treatment',
      fr: 'Traitement',
      ar: 'علاج',
    },
    gloss: 'TREATMENT',
  },
  {
    id: 'voc_antibiotic',
    category: 'pharmacy_medicines',
    text: {
      en: 'Antibiotic',
      fr: 'Antibiotique',
      ar: 'مضاد حيوي',
    },
    gloss: 'ANTIBIOTIC',
  },

  // --- MEDICAL PLACES & STAFF (6 words) ---
  {
    id: 'voc_doctor',
    category: 'medical_places',
    text: {
      en: 'Doctor',
      fr: 'Médecin',
      ar: 'طبيب',
    },
    gloss: 'DOCTOR',
  },
  {
    id: 'voc_pharmacist',
    category: 'medical_places',
    text: {
      en: 'Pharmacist',
      fr: 'Pharmacien',
      ar: 'صيدلي',
    },
    gloss: 'PHARMACIST',
  },
  {
    id: 'voc_nurse',
    category: 'medical_places',
    text: {
      en: 'Nurse',
      fr: 'Infirmier',
      ar: 'ممرض',
    },
    gloss: 'NURSE',
  },
  {
    id: 'voc_hospital',
    category: 'medical_places',
    text: {
      en: 'Hospital',
      fr: 'Hôpital',
      ar: 'مستشفى',
    },
    gloss: 'HOSPITAL',
  },
  {
    id: 'voc_ambulance',
    category: 'medical_places',
    text: {
      en: 'Ambulance',
      fr: 'Ambulance',
      ar: 'سيارة إسعاف',
    },
    gloss: 'AMBULANCE',
  },
  {
    id: 'voc_clinic',
    category: 'medical_places',
    text: {
      en: 'Clinic',
      fr: 'Clinique',
      ar: 'عيادة',
    },
    gloss: 'CLINIC',
  },

  // --- EVERYDAY NEEDS (7 words) ---
  {
    id: 'voc_water',
    category: 'everyday_needs',
    text: {
      en: 'Water',
      fr: 'Eau',
      ar: 'ماء',
    },
    gloss: 'WATER',
  },
  {
    id: 'voc_food',
    category: 'everyday_needs',
    text: {
      en: 'Food',
      fr: 'Nourriture',
      ar: 'طعام',
    },
    gloss: 'FOOD',
  },
  {
    id: 'voc_money',
    category: 'everyday_needs',
    text: {
      en: 'Money',
      fr: 'Argent',
      ar: 'نقود',
    },
    gloss: 'MONEY',
  },
  {
    id: 'voc_phone',
    category: 'everyday_needs',
    text: {
      en: 'Phone',
      fr: 'Téléphone',
      ar: 'هاتف',
    },
    gloss: 'PHONE',
  },
  {
    id: 'voc_bathroom',
    category: 'everyday_needs',
    text: {
      en: 'Restroom',
      fr: 'Toilettes',
      ar: 'دورة مياه',
    },
    gloss: 'RESTROOM',
  },
  {
    id: 'voc_help',
    category: 'everyday_needs',
    text: {
      en: 'Help',
      fr: 'Aide',
      ar: 'مساعدة',
    },
    gloss: 'HELP',
  },
  {
    id: 'voc_transport',
    category: 'everyday_needs',
    text: {
      en: 'Transport',
      fr: 'Transport',
      ar: 'وسائل النقل',
    },
    gloss: 'TRANSPORT',
  },

  // --- COMMUNICATION (7 words) ---
  {
    id: 'voc_deaf',
    category: 'communication',
    text: {
      en: 'Deaf',
      fr: 'Sourd',
      ar: 'أصم',
    },
    gloss: 'DEAF',
  },
  {
    id: 'voc_hearing',
    category: 'communication',
    text: {
      en: 'Hearing',
      fr: 'Entendant',
      ar: 'سامع',
    },
    gloss: 'HEARING',
  },
  {
    id: 'voc_sign_language',
    category: 'communication',
    text: {
      en: 'Sign language',
      fr: 'Langue des signes',
      ar: 'لغة الإشارة',
    },
    gloss: 'SIGN_LANGUAGE',
  },
  {
    id: 'voc_write',
    category: 'communication',
    text: {
      en: 'Write',
      fr: 'Écrire',
      ar: 'كتابة',
    },
    gloss: 'WRITE',
  },
  {
    id: 'voc_repeat',
    category: 'communication',
    text: {
      en: 'Repeat',
      fr: 'Répéter',
      ar: 'إعادة',
    },
    gloss: 'REPEAT',
  },
  {
    id: 'voc_understand',
    category: 'communication',
    text: {
      en: 'Understand',
      fr: 'Comprendre',
      ar: 'فهم',
    },
    gloss: 'UNDERSTAND',
  },
  {
    id: 'voc_interpreter',
    category: 'communication',
    text: {
      en: 'Interpreter',
      fr: 'Interprète',
      ar: 'مترجم إشارة',
    },
    gloss: 'INTERPRETER',
  },

  // --- URGENCY (6 words) ---
  {
    id: 'voc_emergency',
    category: 'urgency',
    text: {
      en: 'Emergency',
      fr: 'Urgence',
      ar: 'طوارئ',
    },
    gloss: 'EMERGENCY',
  },
  {
    id: 'voc_danger',
    category: 'urgency',
    text: {
      en: 'Danger',
      fr: 'Danger',
      ar: 'خطر',
    },
    gloss: 'DANGER',
  },
  {
    id: 'voc_stop',
    category: 'urgency',
    text: {
      en: 'Stop',
      fr: 'Arrêt / Stop',
      ar: 'توقف',
    },
    gloss: 'STOP',
  },
  {
    id: 'voc_now',
    category: 'urgency',
    text: {
      en: 'Now',
      fr: 'Maintenant',
      ar: 'الآن',
    },
    gloss: 'NOW',
  },
  {
    id: 'voc_wait',
    category: 'urgency',
    text: {
      en: 'Wait',
      fr: 'Attendre',
      ar: 'انتظار',
    },
    gloss: 'WAIT',
  },
  {
    id: 'voc_safe',
    category: 'urgency',
    text: {
      en: 'Safe',
      fr: 'Sûr / En sécurité',
      ar: 'آمن',
    },
    gloss: 'SAFE',
  },
];

export const VOCABULARY_COUNT = ESSENTIAL_VOCABULARY.length;
