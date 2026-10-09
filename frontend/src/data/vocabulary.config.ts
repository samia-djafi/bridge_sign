import { Sign } from '@/types/domain';

export const SUPPORTED_SIGNS: Sign[] = [
  // Symptoms
  { id: 's1', gloss: 'HEADACHE', labels: { fr: 'Mal de tête', ar: 'صداع الرأس', en: 'Headache' }, category: 'symptoms' },
  { id: 's2', gloss: 'PAIN', labels: { fr: 'Douleur', ar: 'ألم', en: 'Pain' }, category: 'symptoms' },
  { id: 's3', gloss: 'FEVER', labels: { fr: 'Fièvre', ar: 'حمى', en: 'Fever' }, category: 'symptoms' },
  { id: 's4', gloss: 'STOMACH', labels: { fr: 'Ventre / Estomac', ar: 'بطن / معدة', en: 'Stomach' }, category: 'symptoms' },
  { id: 's5', gloss: 'SICK', labels: { fr: 'Malade', ar: 'مريض', en: 'Sick' }, category: 'symptoms' },
  { id: 's6', gloss: 'COUGH', labels: { fr: 'Toux', ar: 'سعال', en: 'Cough' }, category: 'symptoms' },
  { id: 's7', gloss: 'DIZZY', labels: { fr: 'Vertige', ar: 'دوار', en: 'Dizzy' }, category: 'symptoms' },
  { id: 's8', gloss: 'THROAT', labels: { fr: 'Gorge', ar: 'حلق', en: 'Throat' }, category: 'symptoms' },

  // Medication
  { id: 's9', gloss: 'MEDICINE', labels: { fr: 'Médicament', ar: 'دواء', en: 'Medicine' }, category: 'medication' },
  { id: 's10', gloss: 'ALLERGY', labels: { fr: 'Allergie', ar: 'حساسية', en: 'Allergy' }, category: 'medication' },
  { id: 's11', gloss: 'TAKE', labels: { fr: 'Prendre', ar: 'تناول / أخذ', en: 'Take' }, category: 'medication' },
  { id: 's12', gloss: 'SAFE', labels: { fr: 'Sûr / Sans danger', ar: 'آمن', en: 'Safe' }, category: 'medication' },
  { id: 's13', gloss: 'OTHER', labels: { fr: 'Autre', ar: 'آخر', en: 'Other' }, category: 'medication' },

  // Appointment & Questions
  { id: 's14', gloss: 'APPOINTMENT', labels: { fr: 'Rendez-vous', ar: 'موعد', en: 'Appointment' }, category: 'appointment' },
  { id: 's15', gloss: 'DOCTOR', labels: { fr: 'Médecin', ar: 'طبيب', en: 'Doctor' }, category: 'appointment' },
  { id: 's16', gloss: 'WHERE', labels: { fr: 'Où', ar: 'أين', en: 'Where' }, category: 'questions' },
  { id: 's17', gloss: 'WAIT', labels: { fr: 'Attendre', ar: 'انتظار', en: 'Wait' }, category: 'appointment' },
  { id: 's18', gloss: 'WRITE', labels: { fr: 'Écrire', ar: 'كتابة', en: 'Write' }, category: 'appointment' },
  { id: 's19', gloss: 'HOW-LONG', labels: { fr: 'Combien de temps', ar: 'كم من الوقت', en: 'How long' }, category: 'questions' },
  { id: 's20', gloss: 'WHAT', labels: { fr: 'Quoi', ar: 'ماذا', en: 'What' }, category: 'questions' },
  { id: 's21', gloss: 'HOW-OFTEN', labels: { fr: 'À quelle fréquence', ar: 'كم مرة', en: 'How often' }, category: 'questions' },

  // Time & Frequency
  { id: 's22', gloss: 'SINCE', labels: { fr: 'Depuis', ar: 'منذ', en: 'Since' }, category: 'time' },
  { id: 's23', gloss: 'WHEN', labels: { fr: 'Quand', ar: 'متى', en: 'When' }, category: 'time' },
  { id: 's24', gloss: 'YESTERDAY', labels: { fr: 'Hier', ar: 'أمس', en: 'Yesterday' }, category: 'time' },
  { id: 's25', gloss: 'TODAY', labels: { fr: "Aujourd'hui", ar: 'اليوم', en: 'Today' }, category: 'time' },
  { id: 's26', gloss: 'TOMORROW', labels: { fr: 'Demain', ar: 'غدًا', en: 'Tomorrow' }, category: 'time' },
  { id: 's27', gloss: 'ONCE', labels: { fr: 'Une fois', ar: 'مرة واحدة', en: 'Once' }, category: 'time' },
  { id: 's28', gloss: 'TWICE', labels: { fr: 'Deux fois', ar: 'مرتين', en: 'Twice' }, category: 'time' },
  { id: 's29', gloss: 'DAY', labels: { fr: 'Jour', ar: 'يوم', en: 'Day' }, category: 'time' },
  { id: 's30', gloss: 'EAT', labels: { fr: 'Manger / Repas', ar: 'أكل / طعام', en: 'Eat' }, category: 'medication' },
  { id: 's31', gloss: 'AFTER', labels: { fr: 'Après', ar: 'بعد', en: 'After' }, category: 'time' },
  { id: 's32', gloss: 'RETURN', labels: { fr: 'Revenir', ar: 'عودة', en: 'Return' }, category: 'appointment' },
  { id: 's33', gloss: 'PRICE', labels: { fr: 'Prix', ar: 'سعر', en: 'Price' }, category: 'everyday' },
  { id: 's34', gloss: 'UNDERSTAND', labels: { fr: 'Comprendre', ar: 'فهم', en: 'Understand' }, category: 'everyday' },

  // Emergency
  { id: 's35', gloss: 'HELP', labels: { fr: 'Aide', ar: 'مساعدة', en: 'Help' }, category: 'emergency' },
  { id: 's36', gloss: 'AMBULANCE', labels: { fr: 'Ambulance', ar: 'إسعاف', en: 'Ambulance' }, category: 'emergency' },
  { id: 's37', gloss: 'CALL', labels: { fr: 'Appeler', ar: 'اتصال', en: 'Call' }, category: 'emergency' },
  { id: 's38', gloss: 'BREATHE', labels: { fr: 'Respirer', ar: 'تنفس', en: 'Breathe' }, category: 'emergency' },
  { id: 's39', gloss: 'DIFFICULT', labels: { fr: 'Difficile', ar: 'صعب', en: 'Difficult' }, category: 'emergency' },
  { id: 's40', gloss: 'INJURED', labels: { fr: 'Blessé', ar: 'مصاب', en: 'Injured' }, category: 'emergency' },
  { id: 's41', gloss: 'BLOOD', labels: { fr: 'Sang', ar: 'دم', en: 'Blood' }, category: 'emergency' },
  { id: 's42', gloss: 'NOW', labels: { fr: 'Maintenant', ar: 'الآن', en: 'Now' }, category: 'emergency' },

  // Everyday & Politeness
  { id: 's43', gloss: 'HELLO', labels: { fr: 'Bonjour', ar: 'مرحبًا', en: 'Hello' }, category: 'everyday' },
  { id: 's44', gloss: 'THANK-YOU', labels: { fr: 'Merci', ar: 'شكرًا', en: 'Thank you' }, category: 'everyday' },
  { id: 's45', gloss: 'YES', labels: { fr: 'Oui', ar: 'نعم', en: 'Yes' }, category: 'everyday' },
  { id: 's46', gloss: 'NO', labels: { fr: 'Non', ar: 'لا', en: 'No' }, category: 'everyday' },
  { id: 's47', gloss: 'REPEAT', labels: { fr: 'Répéter', ar: 'إعادة', en: 'Repeat' }, category: 'everyday' },
  { id: 's48', gloss: 'SLOW', labels: { fr: 'Lentement', ar: 'ببطء', en: 'Slow' }, category: 'everyday' },
  { id: 's49', gloss: 'PLEASE', labels: { fr: "S'il vous plaît", ar: 'من فضلك', en: 'Please' }, category: 'everyday' },
  { id: 's50', gloss: 'I', labels: { fr: 'Moi / Je', ar: 'أنا', en: 'I' }, category: 'pronouns' },
  { id: 's51', gloss: 'YOU', labels: { fr: 'Vous / Toi', ar: 'أنت', en: 'You' }, category: 'pronouns' },
  { id: 's52', gloss: 'HAVE', labels: { fr: 'Avoir', ar: 'عندي / لدي', en: 'Have' }, category: 'verbs' },
  { id: 's53', gloss: 'NEED', labels: { fr: 'Avoir besoin', ar: 'أحتاج', en: 'Need' }, category: 'verbs' },
  { id: 's54', gloss: 'THIS', labels: { fr: 'Ceci / Ce', ar: 'هذا', en: 'This' }, category: 'pronouns' },
];

export const VOCAB_SIZE = SUPPORTED_SIGNS.length;
