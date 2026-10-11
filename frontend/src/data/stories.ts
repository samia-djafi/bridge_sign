export interface Story {
  id: string;
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
    author: 'Amina K.',
    role: {
      fr: 'Membre de la communauté sourde',
      ar: 'عضوة في مجتمع الصم',
      en: 'Deaf Community Member',
    },
    location: 'Alger (Bab El Oued)',
    badge: 'deaf_community',
    context: 'pharmacy',
    quote: {
      fr: "À la pharmacie, je devais toujours écrire sur des bouts de papier froissés ou attendre qu'un proche soit disponible. Pouvoir signer mes symptômes et voir les phrases traduites immédiatement change tout.",
      ar: 'في الصيدلية، كنت دائمًا مضطرة للكتابة على قصاصات ورق أو انتظار مرافقة أحد الأقارب. القدرة على الإشارة بأعراضي ورؤية ترجمتها فورًا غيّرت كل شيء.',
      en: 'At the pharmacy, I always had to write on crumpled scraps of paper or wait for a relative to accompany me. Being able to sign my symptoms and see them translated immediately changes everything.',
    },
    details: {
      fr: 'Utilisation lors d’un épisode de migraine aiguë avec demande de paracétamol et posologie claire.',
      ar: 'استخدام خلال نوبة صداع حاد مع طلب دواء الباراسيتامول ومعرفة الجرعة بدقة.',
      en: 'Used during an acute migraine episode to request paracetamol and confirm exact dosage.',
    },
    date: '2026-09',
  },
  {
    id: 'story-2',
    author: 'Dr. Yacine M.',
    role: {
      fr: 'Pharmacien d’officine',
      ar: 'صيدلي ممارس',
      en: 'Community Pharmacist',
    },
    location: 'Oran',
    badge: 'healthcare',
    context: 'pharmacy',
    quote: {
      fr: "En officine, la compréhension exacte des allergies médicamenteuses et de la posologie est vitale. BridgeSign nous a permis d'accueillir nos patients sourds avec le respect, la rigueur et la confidentialité qu'ils méritent.",
      ar: 'في الصيدلية، الفهم الدقيق للحساسية الدوائية والجرعات أمر حيوي لسلامة المريض. ساعدنا BridgeSign على استقبال المرضى الصم بالاحترام والدقة والسرية التي يستحقونها.',
      en: 'At our pharmacy, understanding drug allergies and dosage instructions accurately is vital. BridgeSign enabled us to welcome Deaf patients with the respect, rigor, and privacy they deserve.',
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
    author: 'Karim B.',
    role: {
      fr: 'Étudiant sourd en informatique',
      ar: 'طالب جامعي أصم في الإعلام الآلي',
      en: 'Deaf CS Student',
    },
    location: 'Constantine',
    badge: 'deaf_community',
    context: 'clinic',
    quote: {
      fr: "La langue des signes algérienne est notre langue naturelle. Ce projet nous redonne de l'autonomie et prouve que notre langue a toute sa place dans les outils technologiques modernes.",
      ar: 'لغة الإشارة الجزائرية هي لغتنا الطبيعية. هذا المشروع يعيد لنا استقلاليتنا ويثبت أن لغتنا لها مكانتها الكاملة في أدوات التكنولوجيا الحديثة.',
      en: 'Algerian Sign Language is our natural language. This project gives us our independence back and proves that our language deserves full recognition in modern technology.',
    },
    details: {
      fr: 'Partage d’expérience lors d’une visite en cabinet médical généraliste.',
      ar: 'مشاركة تجربة شخصية خلال زيارة عيادة طبية عامة.',
      en: 'Experience shared during a visit to a general medicine clinic.',
    },
    date: '2026-10',
  },
];
