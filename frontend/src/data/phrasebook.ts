import { Phrase } from '@/types/domain';

// NOTE: All LSA gloss tokens below are initial linguistic hypotheses for MVP testing.
// TO VALIDATE WITH DEAF LSA CONSULTANTS.

export const SEED_PHRASES: Phrase[] = [
  {
    "id": "ph_headache",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai mal à la tête.",
      "ar": "عندي صداع في الرأس.",
      "en": "I have a headache."
    },
    "gloss": [
      "HEADACHE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_pain",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai mal.",
      "ar": "أشعر بألم.",
      "en": "I have pain."
    },
    "gloss": [
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_fever",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai de la fièvre.",
      "ar": "عندي حمى.",
      "en": "I have a fever."
    },
    "gloss": [
      "FEVER"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_stomach_pain",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai mal au ventre.",
      "ar": "عندي ألم في البطن.",
      "en": "My stomach hurts."
    },
    "gloss": [
      "STOMACH",
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_sick",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Je me sens malade.",
      "ar": "أشعر أنني مريض.",
      "en": "I feel sick."
    },
    "gloss": [
      "SICK"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_cough",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai de la toux.",
      "ar": "عندي سعال.",
      "en": "I have a cough."
    },
    "gloss": [
      "COUGH"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_dizzy",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai des vertiges.",
      "ar": "أشعر بدوار.",
      "en": "I feel dizzy."
    },
    "gloss": [
      "DIZZY"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_throat_pain",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai mal à la gorge.",
      "ar": "عندي ألم في الحلق.",
      "en": "I have a sore throat."
    },
    "gloss": [
      "THROAT",
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_need_medicine",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai besoin de médicaments.",
      "ar": "أحتاج إلى دواء.",
      "en": "I need medicine."
    },
    "gloss": [
      "I",
      "NEED",
      "MEDICINE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_allergy_this",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Je suis allergique à ceci.",
      "ar": "عندي حساسية من هذا.",
      "en": "I am allergic to this."
    },
    "gloss": [
      "ALLERGY",
      "THIS"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_what_take",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Que dois-je prendre ?",
      "ar": "ماذا يجب أن أتناول؟",
      "en": "What should I take?"
    },
    "gloss": [
      "WHAT",
      "TAKE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_how_often_take",
    "category": "pharmacy_medical",
    "text": {
      "fr": "À quelle fréquence dois-je le prendre ?",
      "ar": "كم مرة يجب أن أتناوله؟",
      "en": "How often should I take it?"
    },
    "gloss": [
      "HOW-OFTEN",
      "TAKE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_safe_medicine_other",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Est-ce sans danger avec mes autres médicaments ?",
      "ar": "هل هذا آمن مع أدويتي الأخرى؟",
      "en": "Is it safe with my other medicine?"
    },
    "gloss": [
      "SAFE",
      "MEDICINE",
      "OTHER"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_have_medicine_pain",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Avez-vous quelque chose contre la douleur ?",
      "ar": "هل لديكم دواء للألم؟",
      "en": "Do you have something for pain?"
    },
    "gloss": [
      "HAVE",
      "MEDICINE",
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_appointment_have",
    "category": "health_access",
    "text": {
      "fr": "J'ai un rendez-vous.",
      "ar": "لدي موعد.",
      "en": "I have an appointment."
    },
    "gloss": [
      "APPOINTMENT",
      "HAVE"
    ],
    "contexts": [
      "healthcare",
      "administration"
    ]
  },
  {
    "id": "ph_where_pain",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Où avez-vous mal ?",
      "ar": "أين تشعر بالألم؟",
      "en": "Where does it hurt?"
    },
    "gloss": [
      "WHERE",
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_how_long_pain",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Depuis combien de temps avez-vous cette douleur ?",
      "ar": "منذ متى وأنت تشعر بهذا الألم؟",
      "en": "How long have you had this pain?"
    },
    "gloss": [
      "HOW-LONG",
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_since_when",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Depuis quand ?",
      "ar": "منذ متى؟",
      "en": "Since when?"
    },
    "gloss": [
      "SINCE",
      "WHEN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_allergy_you",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Avez-vous des allergies ?",
      "ar": "هل لديك أي حساسية؟",
      "en": "Are you allergic to anything?"
    },
    "gloss": [
      "ALLERGY",
      "YOU"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_other_medicine_you",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Prenez-vous d'autres médicaments ?",
      "ar": "هل تتناول أدوية أخرى؟",
      "en": "Do you take other medicine?"
    },
    "gloss": [
      "OTHER",
      "MEDICINE",
      "YOU"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_take_once_day",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Prenez ceci une fois par jour.",
      "ar": "تناول هذا مرة واحدة يوميًا.",
      "en": "Take this once a day."
    },
    "gloss": [
      "THIS",
      "ONCE",
      "DAY",
      "TAKE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_take_twice_day",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Prenez ceci deux fois par jour.",
      "ar": "تناول هذا مرتين يوميًا.",
      "en": "Take this twice a day."
    },
    "gloss": [
      "THIS",
      "TWICE",
      "DAY",
      "TAKE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_take_after_eat",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Prenez-le après les repas.",
      "ar": "تناوله بعد الأكل.",
      "en": "Take it after eating."
    },
    "gloss": [
      "EAT",
      "AFTER",
      "TAKE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_nausea",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai des nausées.",
      "ar": "أشعر بالغثيان.",
      "en": "I feel nauseous."
    },
    "gloss": [
      "NAUSEA"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_vomiting",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai des vomissements.",
      "ar": "أعاني من التقيؤ.",
      "en": "I have been vomiting."
    },
    "gloss": [
      "VOMITING"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_toothache",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai mal aux dents.",
      "ar": "عندي ألم في أسناني.",
      "en": "I have a toothache."
    },
    "gloss": [
      "TOOTH",
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_back_pain",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai mal au dos.",
      "ar": "عندي ألم في الظهر.",
      "en": "I have back pain."
    },
    "gloss": [
      "BACK",
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_chest_tightness",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Je ressens une oppression dans la poitrine.",
      "ar": "أشعر بضيق في صدري.",
      "en": "I feel tightness in my chest."
    },
    "gloss": [
      "CHEST",
      "PAIN"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_fatigue",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Je me sens très faible et fatigué.",
      "ar": "أشعر بتعب وإرهاق شديد.",
      "en": "I feel very weak and fatigued."
    },
    "gloss": [
      "TIRED"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_skin_rash",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai une éruption cutanée et des démangeaisons.",
      "ar": "لدي طفح جلدي وحكة.",
      "en": "I have a skin rash and itching."
    },
    "gloss": [
      "SKIN",
      "ITCH"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_prescription_have",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai une ordonnance de mon médecin.",
      "ar": "لدي وصفة طبية من الطبيب.",
      "en": "I have a prescription from my doctor."
    },
    "gloss": [
      "PRESCRIPTION",
      "HAVE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_medicine_available",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Ce médicament est-il disponible ?",
      "ar": "هل هذا الدواء متوفر؟",
      "en": "Is this medicine available?"
    },
    "gloss": [
      "MEDICINE",
      "AVAILABLE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_dosage_explain",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Pouvez-vous m'expliquer la posologie s'il vous plaît ?",
      "ar": "يرجى توضيح الجرعة المحددة لي.",
      "en": "Please explain the dosage to me."
    },
    "gloss": [
      "EXPLAIN",
      "DOSE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_take_before_eat",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Dois-je le prendre avant ou après les repas ?",
      "ar": "هل يجب تناوله قبل الأكل أم بعده؟",
      "en": "Should I take it before or after meals?"
    },
    "gloss": [
      "TAKE",
      "BEFORE",
      "AFTER",
      "EAT"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_side_effects",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Y a-t-il des effets secondaires ?",
      "ar": "هل توجد أي آثار جانبية؟",
      "en": "Are there any side effects?"
    },
    "gloss": [
      "SIDE_EFFECT"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_child_suitable",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Est-ce adapté pour un enfant ?",
      "ar": "هل هذا مناسب لطفل؟",
      "en": "Is this suitable for a child?"
    },
    "gloss": [
      "SUITABLE",
      "CHILD"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_generic_alternative",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Existe-t-il une alternative générique ou moins chère ?",
      "ar": "هل يوجد دواء جنيس أو بديل أقل سعرًا؟",
      "en": "Is there a generic or cheaper alternative?"
    },
    "gloss": [
      "ALTERNATIVE",
      "MEDICINE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_how_many_days",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Pendant combien de jours dois-je suivre ce traitement ?",
      "ar": "كم يومًا يجب أن أستمر في هذا العلاج؟",
      "en": "For how many days should I take this treatment?"
    },
    "gloss": [
      "HOW-LONG",
      "TREATMENT"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_missed_dose",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Que dois-je faire si j'oublie une prise ?",
      "ar": "ماذا أفعل إذا نسيت جرعة من الدواء؟",
      "en": "What should I do if I miss a dose?"
    },
    "gloss": [
      "FORGET",
      "DOSE"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_storage_instructions",
    "category": "pharmacy_medical",
    "text": {
      "fr": "Ce médicament doit-il être conservé au réfrigérateur ?",
      "ar": "هل يجب حفظ هذا الدواء في الثلاجة؟",
      "en": "Should this medicine be stored in the refrigerator?"
    },
    "gloss": [
      "KEEP",
      "COLD"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_cough_fever_relief",
    "category": "pharmacy_medical",
    "text": {
      "fr": "J'ai besoin de quelque chose pour calmer la toux et la fièvre.",
      "ar": "أحتاج إلى دواء لتخفيف السعال والحمى.",
      "en": "I need something to reduce cough and fever."
    },
    "gloss": [
      "NEED",
      "COUGH",
      "FEVER"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_help",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "À l'aide !",
      "ar": "ساعدوني !",
      "en": "Help !"
    },
    "gloss": [
      "HELP"
    ],
    "contexts": [
      "healthcare",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_ambulance_call",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "Appelez une ambulance !",
      "ar": "اتصلوا بالإسعاف !",
      "en": "Call an ambulance !"
    },
    "gloss": [
      "AMBULANCE",
      "CALL"
    ],
    "contexts": [
      "healthcare",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_breathe_difficult",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "J'ai du mal à respirer.",
      "ar": "أعاني من صعوبة في التنفس.",
      "en": "I am having difficulty breathing."
    },
    "gloss": [
      "BREATHE",
      "DIFFICULT"
    ],
    "contexts": [
      "healthcare",
      "other"
    ]
  },
  {
    "id": "ph_injured",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "Je suis blessé.",
      "ar": "أنا مصاب.",
      "en": "I am injured."
    },
    "gloss": [
      "INJURED"
    ],
    "contexts": [
      "healthcare",
      "other"
    ]
  },
  {
    "id": "ph_bleeding",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "Je saigne.",
      "ar": "أنا أنزف.",
      "en": "I am bleeding."
    },
    "gloss": [
      "BLOOD"
    ],
    "contexts": [
      "healthcare",
      "other"
    ]
  },
  {
    "id": "ph_doctor_now",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "J'ai besoin d'un médecin immédiatement.",
      "ar": "أحتاج إلى طبيب الآن.",
      "en": "I need a doctor now."
    },
    "gloss": [
      "DOCTOR",
      "NOW"
    ],
    "contexts": [
      "healthcare",
      "other"
    ]
  },
  {
    "id": "ph_allergy_emergency",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "J'ai une allergie sévère.",
      "ar": "عندي حساسية شديدة.",
      "en": "I have a severe allergy."
    },
    "gloss": [
      "ALLERGY",
      "PAIN"
    ],
    "contexts": [
      "healthcare",
      "other"
    ]
  },
  {
    "id": "ph_emergency_contact",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "Contactez mon contact d'urgence s'il vous plaît.",
      "ar": "يرجى الاتصال بجهة الاتصال الخاصة بالطوارئ.",
      "en": "Please contact my emergency contact."
    },
    "gloss": [
      "HELP",
      "PLEASE"
    ],
    "contexts": [
      "healthcare",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_emergency_cant_hear",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "Je n'entends pas. Veuillez communiquer par écrit.",
      "ar": "أنا لا أسمع. يرجى التواصل كتابة.",
      "en": "I cannot hear. Please communicate in writing."
    },
    "gloss": [
      "DEAF",
      "WRITE"
    ],
    "contexts": [
      "healthcare",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_fainting",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "Je sens que je vais m'évanouir.",
      "ar": "أشعر أنني سأفقد الوعي.",
      "en": "I feel like I am going to faint."
    },
    "gloss": [
      "FAINT"
    ],
    "contexts": [
      "healthcare",
      "other"
    ]
  },
  {
    "id": "ph_severe_chest_pain",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "J'ai une douleur intense dans la poitrine.",
      "ar": "عندي ألم شديد في الصدر.",
      "en": "I have intense chest pain."
    },
    "gloss": [
      "SEVERE",
      "CHEST",
      "PAIN"
    ],
    "contexts": [
      "healthcare",
      "other"
    ]
  },
  {
    "id": "ph_take_to_hospital",
    "category": "emergency",
    "emergency": true,
    "text": {
      "fr": "Emmenez-moi à l'hôpital le plus proche s'il vous plaît.",
      "ar": "يرجى نقلي إلى أقرب مستشفى.",
      "en": "Please take me to the nearest hospital."
    },
    "gloss": [
      "TAKE",
      "HOSPITAL"
    ],
    "contexts": [
      "healthcare",
      "other"
    ]
  },
  {
    "id": "ph_price",
    "category": "everyday",
    "text": {
      "fr": "Quel est le prix ?",
      "ar": "كم السعر؟",
      "en": "What is the price?"
    },
    "gloss": [
      "PRICE"
    ],
    "contexts": [
      "healthcare",
      "everyday"
    ]
  },
  {
    "id": "ph_understand_you",
    "category": "everyday",
    "text": {
      "fr": "Est-ce que vous comprenez ?",
      "ar": "هل فهمت؟",
      "en": "Do you understand?"
    },
    "gloss": [
      "UNDERSTAND",
      "YOU"
    ],
    "contexts": [
      "healthcare",
      "education",
      "everyday"
    ]
  },
  {
    "id": "ph_hello",
    "category": "everyday",
    "text": {
      "fr": "Bonjour.",
      "ar": "مرحبًا.",
      "en": "Hello."
    },
    "gloss": [
      "HELLO"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "education",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_thank_you",
    "category": "everyday",
    "text": {
      "fr": "Merci.",
      "ar": "شكرًا.",
      "en": "Thank you."
    },
    "gloss": [
      "THANK-YOU"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "education",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_yes",
    "category": "everyday",
    "text": {
      "fr": "Oui.",
      "ar": "نعم.",
      "en": "Yes."
    },
    "gloss": [
      "YES"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "education",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_no",
    "category": "everyday",
    "text": {
      "fr": "Non.",
      "ar": "لا.",
      "en": "No."
    },
    "gloss": [
      "NO"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "education",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_repeat_please",
    "category": "everyday",
    "text": {
      "fr": "Répétez s'il vous plaît.",
      "ar": "أعد من فضلك.",
      "en": "Please repeat."
    },
    "gloss": [
      "REPEAT",
      "PLEASE"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "education",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_slow_please",
    "category": "everyday",
    "text": {
      "fr": "Plus lentement s'il vous plaît.",
      "ar": "ببطء من فضلك.",
      "en": "Slowly please."
    },
    "gloss": [
      "SLOW",
      "PLEASE"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "education",
      "everyday",
      "other"
    ]
  },
  {
    "id": "ph_good_morning",
    "category": "everyday",
    "text": {
      "fr": "Bonjour / Bonne matinée.",
      "ar": "صباح الخير.",
      "en": "Good morning."
    },
    "gloss": [
      "GOOD",
      "MORNING"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_good_evening",
    "category": "everyday",
    "text": {
      "fr": "Bonsoir.",
      "ar": "مساء الخير.",
      "en": "Good evening."
    },
    "gloss": [
      "GOOD",
      "EVENING"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_how_are_you",
    "category": "everyday",
    "text": {
      "fr": "Comment allez-vous ?",
      "ar": "كيف حالك؟",
      "en": "How are you?"
    },
    "gloss": [
      "HOW",
      "YOU"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_nice_to_meet_you",
    "category": "everyday",
    "text": {
      "fr": "Enchanté de faire votre connaissance.",
      "ar": "تشرفت بمعرفتك.",
      "en": "Nice to meet you."
    },
    "gloss": [
      "NICE",
      "MEET"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_my_name_is",
    "category": "everyday",
    "text": {
      "fr": "Je m'appelle...",
      "ar": "اسمي...",
      "en": "My name is..."
    },
    "gloss": [
      "MY",
      "NAME"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_goodbye",
    "category": "everyday",
    "text": {
      "fr": "Au revoir.",
      "ar": "مع السلامة.",
      "en": "Goodbye."
    },
    "gloss": [
      "GOODBYE"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_you_are_welcome",
    "category": "everyday",
    "text": {
      "fr": "De rien / Je vous en prie.",
      "ar": "عفوًا / على الرحب والسعة.",
      "en": "You're welcome."
    },
    "gloss": [
      "WELCOME"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_excuse_me",
    "category": "everyday",
    "text": {
      "fr": "Excusez-moi, pardon.",
      "ar": "معذرة / من فضلك.",
      "en": "Excuse me, pardon."
    },
    "gloss": [
      "EXCUSE"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_dont_understand",
    "category": "everyday",
    "text": {
      "fr": "Je ne comprends pas.",
      "ar": "أنا لا أفهم.",
      "en": "I do not understand."
    },
    "gloss": [
      "NOT",
      "UNDERSTAND"
    ],
    "contexts": [
      "everyday",
      "healthcare",
      "education"
    ]
  },
  {
    "id": "ph_please_help_me",
    "category": "everyday",
    "text": {
      "fr": "Pourriez-vous m'aider s'il vous plaît ?",
      "ar": "هل يمكنك مساعدتي من فضلك؟",
      "en": "Could you please help me?"
    },
    "gloss": [
      "HELP",
      "PLEASE"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_would_like_buy",
    "category": "everyday",
    "text": {
      "fr": "Je voudrais acheter ceci.",
      "ar": "أود شراء هذا.",
      "en": "I would like to buy this."
    },
    "gloss": [
      "BUY",
      "THIS"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_accept_card",
    "category": "everyday",
    "text": {
      "fr": "Acceptez-vous les cartes bancaires ?",
      "ar": "هل تقبلون الدفع بالبطاقة البنكية؟",
      "en": "Do you accept bank cards or digital payment?"
    },
    "gloss": [
      "CARD",
      "PAY"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_need_bag",
    "category": "everyday",
    "text": {
      "fr": "J'ai besoin d'un sac s'il vous plaît.",
      "ar": "أحتاج إلى كيس من فضلك.",
      "en": "I need a bag, please."
    },
    "gloss": [
      "BAG",
      "PLEASE"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_water_please",
    "category": "everyday",
    "text": {
      "fr": "Puis-je avoir un verre d'eau s'il vous plaît ?",
      "ar": "هل يمكنني الحصول على ماء للشرب من فضلك؟",
      "en": "Could I have some drinking water, please?"
    },
    "gloss": [
      "WATER",
      "PLEASE"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_where_bathroom",
    "category": "everyday",
    "text": {
      "fr": "Où sont les toilettes ?",
      "ar": "أين توجد دورة المياه؟",
      "en": "Where are the restrooms?"
    },
    "gloss": [
      "WHERE",
      "RESTROOM"
    ],
    "contexts": [
      "everyday",
      "healthcare"
    ]
  },
  {
    "id": "ph_nearest_bus_stop",
    "category": "everyday",
    "text": {
      "fr": "Où se trouve l'arrêt de bus ou de transport le plus proche ?",
      "ar": "أين أقرب موقف للحافلات؟",
      "en": "Where is the nearest bus stop or station?"
    },
    "gloss": [
      "WHERE",
      "BUS"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_i_am_lost",
    "category": "everyday",
    "text": {
      "fr": "Je suis perdu, pouvez-vous m'indiquer la direction ?",
      "ar": "أنا تائه، هل يمكنك إرشادي إلى الاتجاه الصحيح؟",
      "en": "I am lost, can you point me in the right direction?"
    },
    "gloss": [
      "LOST",
      "DIRECTION"
    ],
    "contexts": [
      "everyday"
    ]
  },
  {
    "id": "ph_need_doctor",
    "category": "health_access",
    "text": {
      "fr": "J'ai besoin de voir un médecin.",
      "ar": "أحتاج إلى استشارة طبيب.",
      "en": "I need to see a doctor."
    },
    "gloss": [
      "NEED",
      "DOCTOR"
    ],
    "contexts": [
      "healthcare"
    ]
  },
  {
    "id": "ph_where_go",
    "category": "health_access",
    "text": {
      "fr": "Où dois-je aller ?",
      "ar": "إلى أين يجب أن أذهب؟",
      "en": "Where should I go?"
    },
    "gloss": [
      "WHERE"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "everyday"
    ]
  },
  {
    "id": "ph_wait_how_long",
    "category": "health_access",
    "text": {
      "fr": "Combien de temps faut-il attendre ?",
      "ar": "كم مدة الانتظار؟",
      "en": "How long is the wait?"
    },
    "gloss": [
      "WAIT",
      "HOW-LONG"
    ],
    "contexts": [
      "healthcare",
      "administration"
    ]
  },
  {
    "id": "ph_write_please",
    "category": "health_access",
    "text": {
      "fr": "Pouvez-vous l'écrire s'il vous plaît ?",
      "ar": "هل يمكنك كتابة ذلك من فضلك؟",
      "en": "Can you write it down please?"
    },
    "gloss": [
      "WRITE",
      "PLEASE"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "everyday"
    ]
  },
  {
    "id": "ph_tomorrow_return",
    "category": "health_access",
    "text": {
      "fr": "Revenez demain.",
      "ar": "عد غدًا.",
      "en": "Come back tomorrow."
    },
    "gloss": [
      "TOMORROW",
      "RETURN"
    ],
    "contexts": [
      "healthcare",
      "administration"
    ]
  },
  {
    "id": "ph_wait_please",
    "category": "health_access",
    "text": {
      "fr": "Veuillez patienter s'il vous plaît.",
      "ar": "يرجى الانتظار من فضلك.",
      "en": "Please wait."
    },
    "gloss": [
      "WAIT",
      "PLEASE"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "everyday"
    ]
  },
  {
    "id": "ph_deaf_sign_lang",
    "category": "health_access",
    "text": {
      "fr": "Je suis sourd et je communique en langue des signes.",
      "ar": "أنا أصم وأتواصل بلغة الإشارة.",
      "en": "I am deaf and I communicate in sign language."
    },
    "gloss": [
      "I",
      "DEAF",
      "SIGN"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "education"
    ]
  },
  {
    "id": "ph_face_me_speaking",
    "category": "health_access",
    "text": {
      "fr": "Regardez-moi en face lorsque vous parlez s'il vous plaît.",
      "ar": "يرجى النظر إليّ مباشرة عندما تتحدث.",
      "en": "Please look directly at me when speaking so I can lipread."
    },
    "gloss": [
      "LOOK",
      "SPEAK"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "everyday"
    ]
  },
  {
    "id": "ph_need_more_time",
    "category": "health_access",
    "text": {
      "fr": "J'ai besoin d'un peu plus de temps pour lire et communiquer.",
      "ar": "أحتاج إلى مزيد من الوقت للقراءة والتواصل.",
      "en": "I need a little more time to read and communicate."
    },
    "gloss": [
      "TIME",
      "COMMUNICATE"
    ],
    "contexts": [
      "healthcare",
      "administration",
      "education"
    ]
  }
];
