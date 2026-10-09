import { DetectedSign, SpokenLang, Translation } from '@/types/domain';

export interface DemoStep {
  stepIndex: number;
  coachInstruction: Record<SpokenLang, string>;
  targetSide: 'sign' | 'speech';
  suggestedAction?: 'simulate_sign' | 'pick_suggestion' | 'send_proposal' | 'translate' | 'finish';
  simulatedSigns?: DetectedSign[];
  simulatedSentence?: Translation;
  pharmacistInput?: Record<SpokenLang, string>;
  expectedGloss?: string[];
}

export interface DemoScenario {
  id: string;
  title: Record<SpokenLang, string>;
  description: Record<SpokenLang, string>;
  context: 'healthcare';
  steps: DemoStep[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'pharmacy_headache',
    title: {
      fr: 'Pharmacie — Mal de tête',
      ar: 'الصيدلية — صداع الرأس',
      en: 'Pharmacy — Headache',
    },
    description: {
      fr: 'Scénario complet entre un patient sourd signalant un mal de tête et un pharmacien.',
      ar: 'سيناريو كامل بين مريض أصم يعاني من الصداع وصيدلي يقدم الإرشادات.',
      en: 'Complete dialogue between a Deaf customer reporting a headache and a pharmacist.',
    },
    context: 'healthcare',
    steps: [
      {
        stepIndex: 1,
        targetSide: 'sign',
        coachInstruction: {
          fr: "Appuyez sur 'Démarrer la reconnaissance' et signez 'J'ai mal à la tête' — ou appuyez sur 'Simuler le signe'.",
          ar: "اضغط على 'بدء التعرّف' وأشر 'عندي صداع' — أو اضغط على 'محاكاة الإشارة'.",
          en: "Press 'Start recognition' and sign 'I have a headache' — or press 'Simulate sign'.",
        },
        suggestedAction: 'simulate_sign',
        simulatedSigns: [
          { gloss: 'I', confidence: 0.94, level: 'high', atMs: 800 },
          { gloss: 'HAVE', confidence: 0.91, level: 'high', atMs: 1600 },
          { gloss: 'HEADACHE', confidence: 0.96, level: 'high', atMs: 2400 },
        ],
        simulatedSentence: {
          fr: "J'ai mal à la tête.",
          ar: 'عندي صداع في الرأس.',
          en: 'I have a headache.',
        },
      },
      {
        stepIndex: 2,
        targetSide: 'sign',
        coachInstruction: {
          fr: "La phrase a été formulée avec une confiance élevée. Appuyez sur 'Envoyer' pour l'ajouter à la conversation et l'énoncer.",
          ar: "تم استنتاج العبارة بثقة عالية. اضغط على 'إرسال' لإضافتها للمحادثة ونطقها.",
          en: "Sentence recognized with high confidence. Press 'Send' to add it to the conversation and speak it.",
        },
        suggestedAction: 'send_proposal',
      },
      {
        stepIndex: 3,
        targetSide: 'speech',
        coachInstruction: {
          fr: "Côté pharmacien : appuyez sur la suggestion rapide 'Depuis combien de temps avez-vous cette douleur ?' puis sur 'Traduire en LSA'.",
          ar: "جهة الصيدلي: اختر الاقتراح السريع 'منذ متى وأنت تشعر بهذا الألم؟' ثم اضغط 'ترجمة إلى لغة الإشارة'.",
          en: "Pharmacist side: tap quick suggestion 'How long have you had this pain?' then tap 'Translate to LSA'.",
        },
        suggestedAction: 'pick_suggestion',
        pharmacistInput: {
          fr: 'Depuis combien de temps avez-vous cette douleur ?',
          ar: 'منذ متى وأنت تشعر بهذا الألم؟',
          en: 'How long have you had this pain?',
        },
        expectedGloss: ['HOW-LONG', 'PAIN'],
      },
      {
        stepIndex: 4,
        targetSide: 'sign',
        coachInstruction: {
          fr: "Répondez côté LSA : signez 'Depuis hier' ou appuyez sur 'Simuler le signe'.",
          ar: "أجب بلغة الإشارة: أشر 'منذ أمس' أو اضغط على 'محاكاة الإشارة'.",
          en: "Answer via LSA: sign 'Since yesterday' or press 'Simulate sign'.",
        },
        suggestedAction: 'simulate_sign',
        simulatedSigns: [
          { gloss: 'SINCE', confidence: 0.93, level: 'high', atMs: 900 },
          { gloss: 'YESTERDAY', confidence: 0.95, level: 'high', atMs: 1800 },
        ],
        simulatedSentence: {
          fr: 'Depuis hier.',
          ar: 'منذ أمس.',
          en: 'Since yesterday.',
        },
      },
      {
        stepIndex: 5,
        targetSide: 'speech',
        coachInstruction: {
          fr: "Le pharmacien vérifie les allergies et donne les consignes : 'Prenez ce médicament deux fois par jour.'",
          ar: "الصيدلي يقدم التعليمات: 'تناول هذا مرتين يوميًا.'",
          en: "Pharmacist provides instructions: 'Take this twice a day.'",
        },
        suggestedAction: 'pick_suggestion',
        pharmacistInput: {
          fr: 'Prenez ceci deux fois par jour.',
          ar: 'تناول هذا مرتين يوميًا.',
          en: 'Take this twice a day.',
        },
        expectedGloss: ['THIS', 'TWICE', 'DAY', 'TAKE'],
      },
      {
        stepIndex: 6,
        targetSide: 'sign',
        coachInstruction: {
          fr: "Félicitations ! Vous avez complété la boucle bidirectionnelle complète. Vous pouvez maintenant terminer la session et consulter l'historique.",
          ar: "تهانينا! لقد أكملت دورة المحادثة ثنائية الاتجاه كاملة. يمكنك الآن إنهاء المحادثة وتصفح السجل.",
          en: "Congratulations! You have completed the full two-way loop. You can now end the session and view history.",
        },
        suggestedAction: 'finish',
      },
    ],
  },
  {
    id: 'pharmacy_allergy',
    title: {
      fr: 'Pharmacie — Allergie & Médicaments',
      ar: 'الصيدلية — الحساسية والأدوية',
      en: 'Pharmacy — Allergy & Medication',
    },
    description: {
      fr: 'Communication d’alerte sur les allergies médicamenteuses.',
      ar: 'تواصل فوري للتحقق من وجود حساسية ضد أدوية معينة.',
      en: 'Communication about drug allergies and safe medications.',
    },
    context: 'healthcare',
    steps: [
      {
        stepIndex: 1,
        targetSide: 'sign',
        coachInstruction: {
          fr: "Signez 'Je suis allergique à ceci' ou appuyez sur 'Simuler le signe'.",
          ar: "أشر 'عندي حساسية من هذا' أو اضغط 'محاكاة الإشارة'.",
          en: "Sign 'I am allergic to this' or press 'Simulate sign'.",
        },
        suggestedAction: 'simulate_sign',
        simulatedSigns: [
          { gloss: 'ALLERGY', confidence: 0.95, level: 'high', atMs: 1000 },
          { gloss: 'THIS', confidence: 0.92, level: 'high', atMs: 1900 },
        ],
        simulatedSentence: {
          fr: 'Je suis allergique à ceci.',
          ar: 'عندي حساسية من هذا.',
          en: 'I am allergic to this.',
        },
      },
      {
        stepIndex: 2,
        targetSide: 'speech',
        coachInstruction: {
          fr: "Le pharmacien répond : 'Avez-vous d'autres médicaments ?'",
          ar: "يجيب الصيدلي: 'هل تتناول أدوية أخرى؟'",
          en: "Pharmacist asks: 'Do you take other medicine?'",
        },
        suggestedAction: 'pick_suggestion',
        pharmacistInput: {
          fr: "Prenez-vous d'autres médicaments ?",
          ar: 'هل تتناول أدوية أخرى؟',
          en: 'Do you take other medicine?',
        },
        expectedGloss: ['OTHER', 'MEDICINE', 'YOU'],
      },
    ],
  },
  {
    id: 'clinic_appointment',
    title: {
      fr: 'Clinique — Accueil & Rendez-vous',
      ar: 'العيادة — الاستقبال والموعد',
      en: 'Clinic — Reception & Appointment',
    },
    description: {
      fr: "Accueil d'un patient sourd à la réception d'une clinique.",
      ar: 'استقبال مريض أصم في مكتب الاستقبال بالعيادة الطبية.',
      en: 'Reception check-in for a Deaf patient at a clinic.',
    },
    context: 'healthcare',
    steps: [
      {
        stepIndex: 1,
        targetSide: 'sign',
        coachInstruction: {
          fr: "Signez 'J'ai un rendez-vous' ou appuyez sur 'Simuler'.",
          ar: "أشر 'لدي موعد' أو اضغط محاكاة.",
          en: "Sign 'I have an appointment' or press simulate.",
        },
        suggestedAction: 'simulate_sign',
        simulatedSigns: [
          { gloss: 'APPOINTMENT', confidence: 0.97, level: 'high', atMs: 900 },
          { gloss: 'HAVE', confidence: 0.94, level: 'high', atMs: 1800 },
        ],
        simulatedSentence: {
          fr: "J'ai un rendez-vous.",
          ar: 'لدي موعد.',
          en: 'I have an appointment.',
        },
      },
      {
        stepIndex: 2,
        targetSide: 'speech',
        coachInstruction: {
          fr: "La réceptionniste répond : 'Veuillez patienter s'il vous plaît.'",
          ar: "تجيب موظفة الاستقبال: 'يرجى الانتظار من فضلك.'",
          en: "Receptionist replies: 'Please wait.'",
        },
        suggestedAction: 'pick_suggestion',
        pharmacistInput: {
          fr: "Veuillez patienter s'il vous plaît.",
          ar: 'يرجى الانتظار من فضلك.',
          en: 'Please wait.',
        },
        expectedGloss: ['WAIT', 'PLEASE'],
      },
    ],
  },
];
