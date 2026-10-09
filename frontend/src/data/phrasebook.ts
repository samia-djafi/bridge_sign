import { Phrase } from '@/types/domain';

// NOTE: All LSA gloss tokens below are initial linguistic hypotheses for MVP testing.
// TO VALIDATE WITH DEAF LSA CONSULTANTS.

export const SEED_PHRASES: Phrase[] = [
  // --- SYMPTOMS (Deaf signer -> Hearing) ---
  {
    id: 'ph_headache',
    category: 'symptoms',
    text: {
      fr: "J'ai mal à la tête.",
      ar: 'عندي صداع في الرأس.',
      en: 'I have a headache.',
    },
    gloss: ['HEADACHE'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_pain',
    category: 'symptoms',
    text: {
      fr: "J'ai mal.",
      ar: 'أشعر بألم.',
      en: 'I have pain.',
    },
    gloss: ['PAIN'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_fever',
    category: 'symptoms',
    text: {
      fr: "J'ai de la fièvre.",
      ar: 'عندي حمى.',
      en: 'I have a fever.',
    },
    gloss: ['FEVER'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_stomach_pain',
    category: 'symptoms',
    text: {
      fr: "J'ai mal au ventre.",
      ar: 'عندي ألم في البطن.',
      en: 'My stomach hurts.',
    },
    gloss: ['STOMACH', 'PAIN'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_sick',
    category: 'symptoms',
    text: {
      fr: 'Je me sens malade.',
      ar: 'أشعر أنني مريض.',
      en: 'I feel sick.',
    },
    gloss: ['SICK'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_cough',
    category: 'symptoms',
    text: {
      fr: "J'ai de la toux.",
      ar: 'عندي سعال.',
      en: 'I have a cough.',
    },
    gloss: ['COUGH'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_dizzy',
    category: 'symptoms',
    text: {
      fr: "J'ai des vertiges.",
      ar: 'أشعر بدوار.',
      en: 'I feel dizzy.',
    },
    gloss: ['DIZZY'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_throat_pain',
    category: 'symptoms',
    text: {
      fr: "J'ai mal à la gorge.",
      ar: 'عندي ألم في الحلق.',
      en: 'I have a sore throat.',
    },
    gloss: ['THROAT', 'PAIN'],
    contexts: ['healthcare'],
  },

  // --- MEDICATION (Deaf signer & Hearing) ---
  {
    id: 'ph_need_medicine',
    category: 'medication',
    text: {
      fr: "J'ai besoin de médicaments.",
      ar: 'أحتاج إلى دواء.',
      en: 'I need medicine.',
    },
    gloss: ['I', 'NEED', 'MEDICINE'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_allergy_this',
    category: 'medication',
    text: {
      fr: 'Je suis allergique à ceci.',
      ar: 'عندي حساسية من هذا.',
      en: 'I am allergic to this.',
    },
    gloss: ['ALLERGY', 'THIS'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_what_take',
    category: 'medication',
    text: {
      fr: 'Que dois-je prendre ?',
      ar: 'ماذا يجب أن أتناول؟',
      en: 'What should I take?',
    },
    gloss: ['WHAT', 'TAKE'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_how_often_take',
    category: 'medication',
    text: {
      fr: 'À quelle fréquence dois-je le prendre ?',
      ar: 'كم مرة يجب أن أتناوله؟',
      en: 'How often should I take it?',
    },
    gloss: ['HOW-OFTEN', 'TAKE'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_safe_medicine_other',
    category: 'medication',
    text: {
      fr: 'Est-ce sans danger avec mes autres médicaments ?',
      ar: 'هل هذا آمن مع أدويتي الأخرى؟',
      en: 'Is it safe with my other medicine?',
    },
    gloss: ['SAFE', 'MEDICINE', 'OTHER'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_have_medicine_pain',
    category: 'medication',
    text: {
      fr: 'Avez-vous quelque chose contre la douleur ?',
      ar: 'هل لديكم دواء للألم؟',
      en: 'Do you have something for pain?',
    },
    gloss: ['HAVE', 'MEDICINE', 'PAIN'],
    contexts: ['healthcare'],
  },

  // --- APPOINTMENT (Deaf signer -> Hearing) ---
  {
    id: 'ph_appointment_have',
    category: 'appointment',
    text: {
      fr: "J'ai un rendez-vous.",
      ar: 'لدي موعد.',
      en: 'I have an appointment.',
    },
    gloss: ['APPOINTMENT', 'HAVE'],
    contexts: ['healthcare', 'administration'],
  },
  {
    id: 'ph_need_doctor',
    category: 'appointment',
    text: {
      fr: "J'ai besoin de voir un médecin.",
      ar: 'أحتاج إلى استشارة طبيب.',
      en: 'I need to see a doctor.',
    },
    gloss: ['NEED', 'DOCTOR'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_where_go',
    category: 'appointment',
    text: {
      fr: 'Où dois-je aller ?',
      ar: 'إلى أين يجب أن أذهب؟',
      en: 'Where should I go?',
    },
    gloss: ['WHERE'],
    contexts: ['healthcare', 'administration', 'everyday'],
  },
  {
    id: 'ph_wait_how_long',
    category: 'appointment',
    text: {
      fr: "Combien de temps faut-il attendre ?",
      ar: 'كم مدة الانتظار؟',
      en: 'How long is the wait?',
    },
    gloss: ['WAIT', 'HOW-LONG'],
    contexts: ['healthcare', 'administration'],
  },
  {
    id: 'ph_write_please',
    category: 'appointment',
    text: {
      fr: "Pouvez-vous l'écrire s'il vous plaît ?",
      ar: 'هل يمكنك كتابة ذلك من فضلك؟',
      en: 'Can you write it down please?',
    },
    gloss: ['WRITE', 'PLEASE'],
    contexts: ['healthcare', 'administration', 'everyday'],
  },

  // --- PHARMACIST / HEARING SIDE (Hearing -> LSA) ---
  {
    id: 'ph_where_pain',
    category: 'symptoms',
    text: {
      fr: 'Où avez-vous mal ?',
      ar: 'أين تشعر بالألم؟',
      en: 'Where does it hurt?',
    },
    gloss: ['WHERE', 'PAIN'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_how_long_pain',
    category: 'symptoms',
    text: {
      fr: 'Depuis combien de temps avez-vous cette douleur ?',
      ar: 'منذ متى وأنت تشعر بهذا الألم؟',
      en: 'How long have you had this pain?',
    },
    gloss: ['HOW-LONG', 'PAIN'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_since_when',
    category: 'symptoms',
    text: {
      fr: 'Depuis quand ?',
      ar: 'منذ متى؟',
      en: 'Since when?',
    },
    gloss: ['SINCE', 'WHEN'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_allergy_you',
    category: 'medication',
    text: {
      fr: 'Avez-vous des allergies ?',
      ar: 'هل لديك أي حساسية؟',
      en: 'Are you allergic to anything?',
    },
    gloss: ['ALLERGY', 'YOU'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_other_medicine_you',
    category: 'medication',
    text: {
      fr: "Prenez-vous d'autres médicaments ?",
      ar: 'هل تتناول أدوية أخرى؟',
      en: 'Do you take other medicine?',
    },
    gloss: ['OTHER', 'MEDICINE', 'YOU'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_take_once_day',
    category: 'medication',
    text: {
      fr: 'Prenez ceci une fois par jour.',
      ar: 'تناول هذا مرة واحدة يوميًا.',
      en: 'Take this once a day.',
    },
    gloss: ['THIS', 'ONCE', 'DAY', 'TAKE'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_take_twice_day',
    category: 'medication',
    text: {
      fr: 'Prenez ceci deux fois par jour.',
      ar: 'تناول هذا مرتين يوميًا.',
      en: 'Take this twice a day.',
    },
    gloss: ['THIS', 'TWICE', 'DAY', 'TAKE'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_take_after_eat',
    category: 'medication',
    text: {
      fr: 'Prenez-le après les repas.',
      ar: 'تناوله بعد الأكل.',
      en: 'Take it after eating.',
    },
    gloss: ['EAT', 'AFTER', 'TAKE'],
    contexts: ['healthcare'],
  },
  {
    id: 'ph_tomorrow_return',
    category: 'appointment',
    text: {
      fr: 'Revenez demain.',
      ar: 'عد غدًا.',
      en: 'Come back tomorrow.',
    },
    gloss: ['TOMORROW', 'RETURN'],
    contexts: ['healthcare', 'administration'],
  },
  {
    id: 'ph_wait_please',
    category: 'appointment',
    text: {
      fr: "Veuillez patienter s'il vous plaît.",
      ar: 'يرجى الانتظار من فضلك.',
      en: 'Please wait.',
    },
    gloss: ['WAIT', 'PLEASE'],
    contexts: ['healthcare', 'administration', 'everyday'],
  },
  {
    id: 'ph_price',
    category: 'everyday',
    text: {
      fr: "Quel est le prix ?",
      ar: 'كم السعر؟',
      en: 'What is the price?',
    },
    gloss: ['PRICE'],
    contexts: ['healthcare', 'everyday'],
  },
  {
    id: 'ph_understand_you',
    category: 'everyday',
    text: {
      fr: 'Est-ce que vous comprenez ?',
      ar: 'هل فهمت؟',
      en: 'Do you understand?',
    },
    gloss: ['UNDERSTAND', 'YOU'],
    contexts: ['healthcare', 'education', 'everyday'],
  },

  // --- EMERGENCY ---
  {
    id: 'ph_help',
    category: 'emergency',
    emergency: true,
    text: {
      fr: "À l'aide !",
      ar: 'ساعدوني !',
      en: 'Help !',
    },
    gloss: ['HELP'],
    contexts: ['healthcare', 'everyday', 'other'],
  },
  {
    id: 'ph_ambulance_call',
    category: 'emergency',
    emergency: true,
    text: {
      fr: 'Appelez une ambulance !',
      ar: 'اتصلوا بالإسعاف !',
      en: 'Call an ambulance !',
    },
    gloss: ['AMBULANCE', 'CALL'],
    contexts: ['healthcare', 'everyday', 'other'],
  },
  {
    id: 'ph_breathe_difficult',
    category: 'emergency',
    emergency: true,
    text: {
      fr: "J'ai du mal à respirer.",
      ar: 'أعاني من صعوبة في التنفس.',
      en: 'I am having difficulty breathing.',
    },
    gloss: ['BREATHE', 'DIFFICULT'],
    contexts: ['healthcare', 'other'],
  },
  {
    id: 'ph_injured',
    category: 'emergency',
    emergency: true,
    text: {
      fr: 'Je suis blessé.',
      ar: 'أنا مصاب.',
      en: 'I am injured.',
    },
    gloss: ['INJURED'],
    contexts: ['healthcare', 'other'],
  },
  {
    id: 'ph_bleeding',
    category: 'emergency',
    emergency: true,
    text: {
      fr: 'Je saigne.',
      ar: 'أنا أنزف.',
      en: 'I am bleeding.',
    },
    gloss: ['BLOOD'],
    contexts: ['healthcare', 'other'],
  },
  {
    id: 'ph_doctor_now',
    category: 'emergency',
    emergency: true,
    text: {
      fr: "J'ai besoin d'un médecin immédiatement.",
      ar: 'أحتاج إلى طبيب الآن.',
      en: 'I need a doctor now.',
    },
    gloss: ['DOCTOR', 'NOW'],
    contexts: ['healthcare', 'other'],
  },

  // --- EVERYDAY ---
  {
    id: 'ph_hello',
    category: 'everyday',
    text: {
      fr: 'Bonjour.',
      ar: 'مرحبًا.',
      en: 'Hello.',
    },
    gloss: ['HELLO'],
    contexts: ['healthcare', 'administration', 'education', 'everyday', 'other'],
  },
  {
    id: 'ph_thank_you',
    category: 'everyday',
    text: {
      fr: 'Merci.',
      ar: 'شكرًا.',
      en: 'Thank you.',
    },
    gloss: ['THANK-YOU'],
    contexts: ['healthcare', 'administration', 'education', 'everyday', 'other'],
  },
  {
    id: 'ph_yes',
    category: 'everyday',
    text: {
      fr: 'Oui.',
      ar: 'نعم.',
      en: 'Yes.',
    },
    gloss: ['YES'],
    contexts: ['healthcare', 'administration', 'education', 'everyday', 'other'],
  },
  {
    id: 'ph_no',
    category: 'everyday',
    text: {
      fr: 'Non.',
      ar: 'لا.',
      en: 'No.',
    },
    gloss: ['NO'],
    contexts: ['healthcare', 'administration', 'education', 'everyday', 'other'],
  },
  {
    id: 'ph_repeat_please',
    category: 'everyday',
    text: {
      fr: "Répétez s'il vous plaît.",
      ar: 'أعد من فضلك.',
      en: 'Please repeat.',
    },
    gloss: ['REPEAT', 'PLEASE'],
    contexts: ['healthcare', 'administration', 'education', 'everyday', 'other'],
  },
  {
    id: 'ph_slow_please',
    category: 'everyday',
    text: {
      fr: "Plus lentement s'il vous plaît.",
      ar: 'ببطء من فضلك.',
      en: 'Slowly please.',
    },
    gloss: ['SLOW', 'PLEASE'],
    contexts: ['healthcare', 'administration', 'education', 'everyday', 'other'],
  },
];
