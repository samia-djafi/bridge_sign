export interface Story {
  id: string;
  badge: 'family' | 'healthcare' | 'deaf_community';
  title: {
    fr: string;
    ar: string;
    en: string;
  };
  role: {
    fr: string;
    ar: string;
    en: string;
  };
  location: string;
  quote: {
    fr: string;
    ar: string;
    en: string;
  };
  // Optional compatibility fields
  author?: string;
  scenarioTitle?: {
    fr: string;
    ar: string;
    en: string;
  };
  details?: {
    fr: string;
    ar: string;
    en: string;
  };
  date?: string;
  isIllustrative?: boolean;
}

export const STORIES: Story[] = [
  {
    id: 'story-1',
    badge: 'family',
    title: {
      en: 'A Brother',
      fr: 'Un frère',
      ar: 'أخ',
    },
    role: {
      en: 'Brother of a deaf sister',
      fr: "Frère d'une sœur sourde",
      ar: 'أخ لأخت صماء',
    },
    location: 'Tizi-Ouzou',
    quote: {
      en: '“It  will help my sister attend her appointments, visit places, and express herself without always needing me by her side. I want people to communicate directly with her, understand her needs, and respect her independence. She deserves to be heard, even when I\'m not there.”',
      fr: '«ça aidera ma sœur à se rendre à ses rendez-vous, à se déplacer et à exprimer ses besoins sans avoir toujours besoin de moi à ses côtés. Je veux que les gens communiquent directement avec elle, comprennent ses besoins et respectent son indépendance. Elle mérite d\'être entendue, même lorsque je ne suis pas là. »',
      ar: '« سيساعد  أختي على الذهاب إلى مواعيدها، والتنقّل، والتعبير عن احتياجاتها دون أن تضطر إلى الاعتماد عليّ في كل مرة. أريد أن يتواصل الناس معها مباشرة، وأن يفهموا احتياجاتها ويحترموا استقلاليتها. فهي تستحق أن يُصغى إليها، حتى عندما لا أكون بجانبها. »',
    },
    author: 'A Brother',
    scenarioTitle: {
      en: 'A Brother',
      fr: 'Un frère',
      ar: 'أخ',
    },
    isIllustrative: false,
  },
  {
    id: 'story-2',
    badge: 'healthcare',
    title: {
      en: 'A Pharmacist',
      fr: 'Un pharmacien',
      ar: 'صيدلي',
    },
    role: {
      en: 'Healthcare professional',
      fr: 'Professionnel de santé',
      ar: 'ممارس رعاية صحية',
    },
    location: 'Alger',
    quote: {
      en: '“Every patient deserves to explain their symptoms and understand their medication without feeling embarrassed or misunderstood. When a deaf person comes into my pharmacy, communication can be difficult. I want to help them feel comfortable, understood, and safe when seeking healthcare.”',
      fr: '« Chaque patient mérite de pouvoir expliquer ses symptômes et comprendre son traitement sans se sentir gêné ni incompris. Lorsqu\'une personne sourde entre dans ma pharmacie, la communication peut être difficile. Je veux pouvoir l\'aider à se sentir à l\'aise, comprise et en sécurité lorsqu\'elle vient chercher des soins. »',
      ar: '« يستحق كل مريض أن يشرح أعراضه ويفهم كيفية استعمال دوائه دون أن يشعر بالحرج أو بأن الآخرين لا يفهمونه. عندما يدخل شخص أصم إلى صيدليتي، قد يكون التواصل صعبًا. أريد أن أساعده على الشعور بالراحة، وأن يجد من يفهمه، وأن يحصل على الرعاية الصحية بأمان واطمئنان. »',
    },
    author: 'A Pharmacist',
    scenarioTitle: {
      en: 'A Pharmacist',
      fr: 'Un pharmacien',
      ar: 'صيدلي',
    },
    isIllustrative: false,
  },
  {
    id: 'story-3',
    badge: 'deaf_community',
    title: {
      en: 'A Deaf Person',
      fr: 'Une personne sourde',
      ar: 'شخص أصم',
    },
    role: {
      en: 'Deaf person who wants to be understood',
      fr: "Personne sourde désireuse d'être comprise",
      ar: 'شخص أصم يريد أن يُفهم',
    },
    location: 'Tizi-Ouzou',
    quote: {
      en: '“Sometimes, even the simplest things become difficult when people don\'t understand my language. Asking for help, explaining what I need, or having an everyday conversation shouldn\'t be a struggle. I want to communicate independently, confidently, and without feeling like a burden to anyone.”',
      fr: '« Parfois, même les choses les plus simples deviennent difficiles lorsque les gens ne comprennent pas ma langue. Demander de l\'aide, expliquer mes besoins ou avoir une conversation au quotidien ne devrait pas être un combat. Je veux pouvoir communiquer de manière autonome, avec confiance, sans avoir l\'impression d\'être un fardeau pour qui que ce soit. »',
      ar: '« أحيانًا، تصبح أبسط الأمور صعبة عندما لا يفهم الناس لغتي. لا ينبغي أن يكون طلب المساعدة، أو شرح ما أحتاج إليه، أو إجراء محادثة يومية أمرًا شاقًا. أريد أن أتواصل باستقلالية وثقة، دون أن أشعر بأنني عبء على أي شخص. »',
    },
    author: 'A Deaf Person',
    scenarioTitle: {
      en: 'A Deaf Person',
      fr: 'Une personne sourde',
      ar: 'شخص أصم',
    },
    isIllustrative: false,
  },
];
