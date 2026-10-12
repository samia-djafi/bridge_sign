export interface Story {
  id: string;
  isIllustrative: boolean;
  scenarioTitle: {
    fr: string;
    ar: string;
    en: string;
  };
  author: string;
  role: {
    fr: string;
    ar: string;
    en: string;
  };
  location: string;
  badge: 'deaf_community' | 'healthcare';
  context: 'pharmacy' | 'clinic' | 'daily';
  quote: {
    fr: string;
    ar: string;
    en: string;
  };
  details: {
    fr: string;
    ar: string;
    en: string;
  };
  date: string;
}

export const STORIES: Story[] = [
  {
    id: 'story-1',
    isIllustrative: true,
    scenarioTitle: {
      fr: 'Scénario 1 : Consultation en officine',
      ar: 'سيناريو 1: استشارة في الصيدلية',
      en: 'Scenario 1: Pharmacy Consultation',
    },
    author: 'Cas d’usage : Demande de médicament',
    role: {
      fr: 'Patiente sourde (Cas illustratif)',
      ar: 'مريضة صماء (حالة توضيحية)',
      en: 'Deaf Patient (Illustrative case)',
    },
    location: 'Alger (Bab El Oued)',
    badge: 'deaf_community',
    context: 'pharmacy',
    quote: {
      fr: 'Situation illustrée : Exprimer directement des symptômes de migraine et valider la posologie du traitement sans dépendre de papier froissé ou d’un tiers.',
      ar: 'حالة توضيحية: التعبير عن أعراض الصداع بدقة ومعرفة الجرعة المحددة دون الحاجة إلى قصاصة ورقية أو وسيط.',
      en: 'Illustrative situation: Expressing headache symptoms directly and validating treatment dosage without relying on scraps of paper or a third party.',
    },
    details: {
      fr: 'Cas d’usage lors d’un épisode de migraine aiguë avec demande de paracétamol et posologie claire.',
      ar: 'دراسة حالة لاستخدام المنظومة خلال نوبة صداع حاد مع طلب دواء الباراسيتامول ومعرفة الجرعة بدقة.',
      en: 'Use case during an acute headache episode to request paracetamol and confirm exact dosage.',
    },
    date: '2026-09',
  },
  {
    id: 'story-2',
    isIllustrative: true,
    scenarioTitle: {
      fr: 'Scénario 2 : Accueil au comptoir pharmaceutique',
      ar: 'سيناريو 2: استقبال بالصيدلية وتوضيح الجرعات',
      en: 'Scenario 2: Pharmacy Counter Communication',
    },
    author: 'Cas d’usage : Sécurisation de la posologie',
    role: {
      fr: 'Pharmacien d’officine (Cas illustratif)',
      ar: 'صيدلي ممارس (حالة توضيحية)',
      en: 'Community Pharmacist (Illustrative case)',
    },
    location: 'Oran',
    badge: 'healthcare',
    context: 'pharmacy',
    quote: {
      fr: 'Situation illustrée : Vérification rigoureuse des allergies médicamenteuses et explication des prises matin et soir dans le respect de la confidentialité du patient.',
      ar: 'حالة توضيحية: التحقق الدقيق من الحساسية الدوائية وشرح مواعيد تناول الدواء في إطار السرية التامة للمريض.',
      en: 'Illustrative situation: Rigorous allergy verification and clear morning/evening dosage instructions preserving patient confidentiality.',
    },
    details: {
      fr: 'Validation de posologie et explication de prise matin et soir sans intermédiaire.',
      ar: 'تأكيد الجرعة اليومية وشرح أوقات تناول الدواء صباحًا ومساءً دون وسيط.',
      en: 'Direct confirmation of twice-daily dosage instructions without needing an intermediary.',
    },
    date: '2026-09',
  },
  {
    id: 'story-3',
    isIllustrative: true,
    scenarioTitle: {
      fr: 'Scénario 3 : Consultation médicale et vocabulaire LSA',
      ar: 'سيناريو 3: استشارة طبية ومفردات لغة الإشارة',
      en: 'Scenario 3: Clinical Consultation & LSA Vocabulary',
    },
    author: 'Cas d’usage : Autonomie de communication',
    role: {
      fr: 'Étudiant sourd (Cas illustratif)',
      ar: 'طالب أصم (حالة توضيحية)',
      en: 'Deaf Student (Illustrative case)',
    },
    location: 'Constantine',
    badge: 'deaf_community',
    context: 'clinic',
    quote: {
      fr: 'Situation illustrée : Échange direct avec un professionnel de santé pour décrire des antécédents médicaux en s’appuyant sur les signes du lexique LSA standardisé.',
      ar: 'حالة توضيحية: تواصل مباشر مع الطبيب لوصف التاريخ المرضي بالاعتماد على إشارات القاموس الطبي للغة الإشارة الجزائرية.',
      en: 'Illustrative situation: Direct communication with a healthcare provider describing medical history using standardized LSA sign vocabulary.',
    },
    details: {
      fr: 'Cas d’usage d’expression de symptômes lors d’une visite en cabinet médical généraliste.',
      ar: 'دراسة حالة لوصف الأعراض خلال زيارة عيادة طبية عامة.',
      en: 'Symptom expression use case during a visit to a general medicine clinic.',
    },
    date: '2026-10',
  },
];
