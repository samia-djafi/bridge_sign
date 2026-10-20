"""
Phrasebook Service & Linguistic Gloss Mapping for ConnectSign Algerian Sign Language (LSA).
"""

from typing import Any, Dict, List, Optional

# The exact 45 seed phrases from ConnectSign frontend (phrasebook.ts)
SEED_PHRASES: List[Dict[str, Any]] = [
    {
        "id": "ph_headache",
        "category": "symptoms",
        "text": {
            "fr": "J'ai mal à la tête.",
            "ar": "عندي صداع في الرأس.",
            "en": "I have a headache.",
        },
        "gloss": ["HEADACHE"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_pain",
        "category": "symptoms",
        "text": {
            "fr": "J'ai mal.",
            "ar": "أشعر بألم.",
            "en": "I have pain.",
        },
        "gloss": ["PAIN"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_fever",
        "category": "symptoms",
        "text": {
            "fr": "J'ai de la fièvre.",
            "ar": "عندي حمى.",
            "en": "I have a fever.",
        },
        "gloss": ["FEVER"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_stomach_pain",
        "category": "symptoms",
        "text": {
            "fr": "J'ai mal au ventre.",
            "ar": "عندي ألم في البطن.",
            "en": "My stomach hurts.",
        },
        "gloss": ["STOMACH", "PAIN"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_sick",
        "category": "symptoms",
        "text": {
            "fr": "Je me sens malade.",
            "ar": "أشعر أنني مريض.",
            "en": "I feel sick.",
        },
        "gloss": ["SICK"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_cough",
        "category": "symptoms",
        "text": {
            "fr": "J'ai de la toux.",
            "ar": "عندي سعال.",
            "en": "I have a cough.",
        },
        "gloss": ["COUGH"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_dizzy",
        "category": "symptoms",
        "text": {
            "fr": "J'ai des vertiges.",
            "ar": "أشعر بدوار.",
            "en": "I feel dizzy.",
        },
        "gloss": ["DIZZY"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_throat_pain",
        "category": "symptoms",
        "text": {
            "fr": "J'ai mal à la gorge.",
            "ar": "عندي ألم في الحلق.",
            "en": "My throat hurts.",
        },
        "gloss": ["THROAT", "PAIN"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_need_medicine",
        "category": "medication",
        "text": {
            "fr": "J'ai besoin d'un médicament.",
            "ar": "أحتاج إلى دواء.",
            "en": "I need medicine.",
        },
        "gloss": ["NEED", "MEDICINE"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_how_take",
        "category": "medication",
        "text": {
            "fr": "Comment prendre ce médicament ?",
            "ar": "كيف أتناول هذا الدواء؟",
            "en": "How do I take this medicine?",
        },
        "gloss": ["HOW", "TAKE", "THIS"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_how_much_dose",
        "category": "medication",
        "text": {
            "fr": "Quelle est la dose ?",
            "ar": "ما هي الجرعة؟",
            "en": "What is the dosage?",
        },
        "gloss": ["DOSE", "HOW-MUCH"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_with_food",
        "category": "medication",
        "text": {
            "fr": "À prendre avec de la nourriture.",
            "ar": "تناوله مع الطعام.",
            "en": "Take with food.",
        },
        "gloss": ["TAKE", "FOOD", "WITH"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_before_sleep",
        "category": "medication",
        "text": {
            "fr": "À prendre avant de dormir.",
            "ar": "تناوله قبل النوم.",
            "en": "Take before sleeping.",
        },
        "gloss": ["TAKE", "NIGHT", "BEFORE"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_have_prescription",
        "category": "pharmacy",
        "text": {
            "fr": "J'ai une ordonnance.",
            "ar": "عندي وصفة طبية.",
            "en": "I have a prescription.",
        },
        "gloss": ["HAVE", "PRESCRIPTION"],
        "contexts": ["healthcare"],
    },
    {
        "id": "ph_appointment_have",
        "category": "administrative",
        "text": {
            "fr": "J'ai un rendez-vous.",
            "ar": "عندي موعد.",
            "en": "I have an appointment.",
        },
        "gloss": ["APPOINTMENT", "HAVE"],
        "contexts": ["healthcare", "administration"],
    },
    {
        "id": "ph_emergency_help",
        "category": "emergency",
        "emergency": True,
        "text": {
            "fr": "Aidez-moi c'est une urgence !",
            "ar": "ساعدوني إنها حالة طارئة!",
            "en": "Help me it's an emergency!",
        },
        "gloss": ["HELP", "EMERGENCY"],
        "contexts": ["healthcare", "other"],
    },
    {
        "id": "ph_call_ambulance",
        "category": "emergency",
        "emergency": True,
        "text": {
            "fr": "Appelez une ambulance s'il vous plaît.",
            "ar": "اتصلوا بالإسعاف من فضلكم.",
            "en": "Please call an ambulance.",
        },
        "gloss": ["CALL", "AMBULANCE", "PLEASE"],
        "contexts": ["healthcare", "other"],
    },
    {
        "id": "ph_cannot_breathe",
        "category": "emergency",
        "emergency": True,
        "text": {
            "fr": "Je n'arrive pas à respirer.",
            "ar": "لا أستطيع التنفس.",
            "en": "I cannot breathe.",
        },
        "gloss": ["BREATHE", "CANNOT"],
        "contexts": ["healthcare", "other"],
    },
    {
        "id": "ph_chest_pain",
        "category": "emergency",
        "emergency": True,
        "text": {
            "fr": "J'ai une douleur à la poitrine.",
            "ar": "عندي ألم في الصدر.",
            "en": "I have chest pain.",
        },
        "gloss": ["CHEST", "PAIN"],
        "contexts": ["healthcare", "other"],
    },
    {
        "id": "ph_thank_you",
        "category": "everyday",
        "text": {
            "fr": "Merci.",
            "ar": "شكرًا.",
            "en": "Thank you.",
        },
        "gloss": ["THANK-YOU"],
        "contexts": ["healthcare", "administration", "education", "everyday", "other"],
    },
    {
        "id": "ph_water_please",
        "category": "everyday",
        "text": {
            "fr": "De l'eau s'il vous plaît.",
            "ar": "ماء من فضلك.",
            "en": "Water please.",
        },
        "gloss": ["WATER", "PLEASE"],
        "contexts": ["healthcare", "everyday"],
    },
]

GLOSS_TO_ARABIC: Dict[str, str] = {
    "HEADACHE": "رأس",
    "HEAD": "رأس",
    "PAIN": "ألم",
    "FEVER": "حرارة",
    "SICK": "مريض",
    "HELP": "يساعد",
    "EMERGENCY": "خطر",
    "DANGER": "خطر",
    "WATER": "ماء",
    "NOW": "الآن",
    "PLEASE": "من فضلك",
    "THANK-YOU": "شكرا",
    "THANK_YOU": "شكرا",
    "YES": "نعم",
    "NO": "لا",
    "INJECTION": "إبرة",
    "DENTIST": "طبيب أسنان",
    "DAY": "كل يوم",
    "ONCE": "1",
    "TWICE": "2",
    "EAT": "طعام",
    "PRICE": "مال",
    "HOW-LONG": "كم",
}

ARABIC_TO_GLOSS: Dict[str, str] = {v: k for k, v in GLOSS_TO_ARABIC.items()}
ARABIC_TO_GLOSS["ماء"] = "WATER"
ARABIC_TO_GLOSS["خطر"] = "EMERGENCY"
ARABIC_TO_GLOSS["شكرا"] = "THANK_YOU"
ARABIC_TO_GLOSS["يساعد"] = "HELP"
ARABIC_TO_GLOSS["ألم"] = "PAIN"
ARABIC_TO_GLOSS["حرارة"] = "FEVER"
ARABIC_TO_GLOSS["مريض"] = "SICK"
ARABIC_TO_GLOSS["رأس"] = "HEAD"
ARABIC_TO_GLOSS["من فضلك"] = "PLEASE"
ARABIC_TO_GLOSS["نعم"] = "YES"
ARABIC_TO_GLOSS["لا"] = "NO"
ARABIC_TO_GLOSS["إبرة"] = "INJECTION"
ARABIC_TO_GLOSS["طبيب أسنان"] = "DENTIST"
ARABIC_TO_GLOSS["طعام"] = "EAT"


class PhraseService:
    """Manages phrase templates, coverage calculations, and sequence matching."""

    def __init__(self, active_classes: Optional[List[str]] = None):
        self.phrases = list(SEED_PHRASES)
        self.active_classes = set(active_classes) if active_classes else set(ARABIC_TO_GLOSS.keys())

    def gloss_for_arabic(self, ar_sign: str) -> Optional[str]:
        return ARABIC_TO_GLOSS.get(ar_sign)

    def arabic_for_gloss(self, gloss: str) -> Optional[str]:
        return GLOSS_TO_ARABIC.get(gloss.upper())

    def match_signs(self, sequence: List[str], confidence: float = 1.0) -> List[Dict[str, Any]]:
        if not sequence:
            return []

        seq_upper = [s.upper() for s in sequence]
        matches = []

        for p in self.phrases:
            p_gloss = [g.upper() for g in p["gloss"]]
            if p_gloss == seq_upper:
                matches.append({
                    "phrase": p,
                    "match_type": "EXACT",
                    "score": 1.0 * confidence,
                    "support_status": "FULL_RECOGNITION",
                })
            elif any(g in p_gloss for g in seq_upper):
                matches.append({
                    "phrase": p,
                    "match_type": "PARTIAL",
                    "score": 0.7 * confidence,
                    "support_status": "PARTIAL_RECOGNITION",
                })

        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches

    def list_phrases(self) -> Dict[str, Any]:
        return {
            "total_phrases": len(self.phrases),
            "phrases": self.phrases,
        }
