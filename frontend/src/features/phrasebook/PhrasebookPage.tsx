import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registry } from '@/services/registry';
import { Phrase, VocabularyItem, SignClip } from '@/types/domain';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { PhraseCard } from '@/components/domain/PhraseCard';
import { VocabularyCard } from '@/components/domain/VocabularyCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Sheet } from '@/components/ui/Sheet';
import { SignPlayer } from '@/components/domain/SignPlayer';
import { Search, BookOpen, Star, Siren, MessageSquare, BookMarked, Stethoscope, Sparkles, X } from 'lucide-react';

export const PhrasebookPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentSession, status, startSession } = useSessionStore();
  const { settings } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<'phrases' | 'vocabulary'>('phrases');
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhraseCategory, setSelectedPhraseCategory] = useState<string>('all');
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<string>('all');
  const [activeClipModal, setActiveClipModal] = useState<{ phrase: Phrase; clips: SignClip[] } | null>(
    null
  );

  const [totalPhraseCount, setTotalPhraseCount] = useState(100);
  const [totalVocabCount, setTotalVocabCount] = useState(52);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initial load to get total counts
  useEffect(() => {
    async function loadTotals() {
      const allP = await registry.phrasebook.list();
      setTotalPhraseCount(allP.length);
      const allV = await registry.phrasebook.listVocabulary();
      setTotalVocabCount(allV.length);
    }
    loadTotals();
  }, []);

  // Load phrases, vocabulary, and favorites based on active tab and filters
  useEffect(() => {
    document.title = `${t('nav.phrasebook')} | ${t('app.name')}`;

    async function load() {
      const favs = await registry.phrasebook.getFavorites();
      setFavorites(favs);

      if (activeTab === 'phrases') {
        const list = await registry.phrasebook.search(searchQuery, {
          category: selectedPhraseCategory === 'all' ? undefined : selectedPhraseCategory,
        });
        setPhrases(list);
      } else {
        const list = await registry.phrasebook.searchVocabulary(searchQuery, {
          category: selectedVocabCategory === 'all' ? undefined : selectedVocabCategory,
        });
        setVocabulary(list);
      }
    }

    load();
  }, [activeTab, searchQuery, selectedPhraseCategory, selectedVocabCategory, t]);

  // Keyboard shortcut: '/' focuses search (only when not inside an input field)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable);

      if (e.key === '/' && !isInput && activeEl !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFavorite = async (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

    await registry.phrasebook.toggleFavorite(id);
    const updated = await registry.phrasebook.getFavorites();
    setFavorites(updated);

    if (activeTab === 'phrases' && selectedPhraseCategory === 'favorites') {
      const refreshed = await registry.phrasebook.search(searchQuery, { category: 'favorites' });
      setPhrases(refreshed);
    } else if (activeTab === 'vocabulary' && selectedVocabCategory === 'favorites') {
      const refreshed = await registry.phrasebook.searchVocabulary(searchQuery, { category: 'favorites' });
      setVocabulary(refreshed);
    }
  };

  const handleSendToConversation = async (phrase: Phrase) => {
    let sessId = currentSession?.id;
    if (!sessId || status === 'ended') {
      sessId = await startSession({
        title: `Pharmacie · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        context: settings.lastContext || 'healthcare',
        signLanguage: 'LSA',
        spokenLang: settings.defaultSpokenLang,
        mode: 'two_way',
      });
    }

    navigate(`/app/workspace/${sessId}?phrase=${phrase.id}`);
  };

  const handlePlayInLsa = async (phrase: Phrase) => {
    const clips = await registry.signAssets.getClips(phrase.gloss);
    setActiveClipModal({ phrase, clips });
  };

  const phraseCategories = [
    { id: 'all', label: t('phrasebook.filterAll', 'Toutes') },
    {
      id: 'pharmacy_medical',
      label: t('phrasebook.filterPharmacyMedical', 'Pharmacie & Médical'),
      icon: <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />,
    },
    {
      id: 'emergency',
      label: t('phrasebook.filterEmergency', 'Urgences'),
      icon: <Siren className="w-3.5 h-3.5 text-app-warning" />,
    },
    {
      id: 'everyday',
      label: t('phrasebook.filterEveryday', 'Quotidien'),
      icon: <MessageSquare className="w-3.5 h-3.5 text-blue-500" />,
    },
    {
      id: 'health_access',
      label: t('phrasebook.filterHealthAccess', 'Santé & Accessibilité'),
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
    },
    {
      id: 'favorites',
      label: t('phrasebook.filterFavorites', 'Favoris'),
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />,
    },
  ];

  const vocabCategories = [
    { id: 'all', label: t('phrasebook.filterAll', 'Toutes') },
    { id: 'body_parts', label: t('phrasebook.vocabCategory.body_parts', 'Parties du corps') },
    { id: 'symptoms', label: t('phrasebook.vocabCategory.symptoms', 'Symptômes') },
    { id: 'pharmacy_medicines', label: t('phrasebook.vocabCategory.pharmacy_medicines', 'Médicaments & Pharmacie') },
    { id: 'medical_places', label: t('phrasebook.vocabCategory.medical_places', 'Lieux & Personnel') },
    { id: 'everyday_needs', label: t('phrasebook.vocabCategory.everyday_needs', 'Besoins du quotidien') },
    { id: 'communication', label: t('phrasebook.vocabCategory.communication', 'Communication') },
    { id: 'urgency', label: t('phrasebook.vocabCategory.urgency', 'Urgence') },
    {
      id: 'favorites',
      label: t('phrasebook.filterFavorites', 'Favoris'),
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Header Block with Title & Mode Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-app-text">
              {t('phrasebook.title', 'Phrases rapides & Vocabulaire')}
            </h2>
            <p className="text-sm text-app-muted mt-1">
              {t('phrasebook.subtitle', 'Communication pratique en pharmacie, urgence et quotidien.')}
            </p>
          </div>

          {/* Top Section Segmented Toggle: Phrases vs Vocabulary */}
          <div className="inline-flex p-1 bg-app-surface-2 border border-app-border rounded-control self-start sm:self-auto shadow-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('phrases');
                setSearchQuery('');
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-control text-xs font-bold transition-all ${
                activeTab === 'phrases'
                  ? 'bg-app-primary-strong text-white shadow-1'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('phrasebook.tabs.phrases', 'Phrases ({{count}})', { count: totalPhraseCount })}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('vocabulary');
                setSearchQuery('');
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-control text-xs font-bold transition-all ${
                activeTab === 'vocabulary'
                  ? 'bg-app-primary-strong text-white shadow-1'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>{t('phrasebook.tabs.vocabulary', 'Vocabulaire ({{count}})', { count: totalVocabCount })}</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search input & Category Filters */}
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-app-muted absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'phrases'
                  ? t('phrasebook.searchPlaceholder', 'Rechercher une phrase ou un signe… (Touche / pour chercher)')
                  : t('phrasebook.searchVocabPlaceholder', 'Rechercher un mot de vocabulaire… (Touche / pour chercher)')
              }
              className="w-full h-12 ps-11 pe-10 rounded-control border border-app-border-strong bg-app-surface text-app-text text-sm shadow-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="absolute end-3 p-1 text-app-muted hover:text-app-text transition-colors"
                aria-label={t('topNav.clearAria', 'Effacer la recherche')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips Horizontal Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {activeTab === 'phrases'
              ? phraseCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedPhraseCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-all border ${
                      selectedPhraseCategory === cat.id
                        ? 'bg-app-primary-strong text-white border-app-primary-strong shadow-1'
                        : 'bg-app-surface text-app-text border-app-border hover:bg-app-surface-2'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))
              : vocabCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedVocabCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-all border ${
                      selectedVocabCategory === cat.id
                        ? 'bg-app-primary-strong text-white border-app-primary-strong shadow-1'
                        : 'bg-app-surface text-app-text border-app-border hover:bg-app-surface-2'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
          </div>

          {/* Result Count Live Region */}
          <div className="flex justify-between items-center text-xs text-app-muted font-medium" aria-live="polite">
            <span>
              {activeTab === 'phrases'
                ? t('phrasebook.phraseCount', { count: phrases.length })
                : t('phrasebook.vocabCount', { count: vocabulary.length })}
            </span>
          </div>
        </div>

        {/* Content Display: Phrases or Vocabulary */}
        {activeTab === 'phrases' ? (
          phrases.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-6 h-6" />}
              title={t('phrasebook.emptySearch', 'Aucune phrase trouvée.')}
              description={t('phrasebook.emptySearchDesc', 'Essayez un autre terme de recherche ou changez de catégorie.')}
              action={
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPhraseCategory('all');
                  }}
                  className="text-xs font-bold text-app-primary-strong hover:underline"
                >
                  {t('phrasebook.clearFilters', 'Effacer les filtres')}
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {phrases.map((phrase) => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  isFavorite={favorites.includes(phrase.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSendToConversation={handleSendToConversation}
                  onPlayInLsa={handlePlayInLsa}
                />
              ))}
            </div>
          )
        ) : vocabulary.length === 0 ? (
          <EmptyState
            icon={<BookMarked className="w-6 h-6" />}
            title={t('phrasebook.emptyVocabSearch', 'Aucun mot trouvé.')}
            description={t('phrasebook.emptySearchDesc', 'Essayez un autre terme de recherche ou changez de catégorie.')}
            action={
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedVocabCategory('all');
                }}
                className="text-xs font-bold text-app-primary-strong hover:underline"
              >
                {t('phrasebook.clearFilters', 'Effacer les filtres')}
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vocabulary.map((item) => (
              <VocabularyCard
                key={item.id}
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* SignPlayer Modal / Sheet when user clicks "Voir en LSA" */}
      <Sheet
        isOpen={activeClipModal !== null}
        onClose={() => setActiveClipModal(null)}
        title={activeClipModal?.phrase.text[settings.defaultSpokenLang] || t('phrasebook.lsaSequenceTitle', 'LSA Sequence')}
        subtitle={`${t('phrasebook.glossPrefix', 'Gloss:')} ${activeClipModal?.phrase.gloss.join(' · ')}`}
        maxWidth="lg"
      >
        {activeClipModal && <SignPlayer clips={activeClipModal.clips} />}
      </Sheet>
    </div>
  );
};
