import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registry } from '@/services/registry';
import { Phrase, SignClip } from '@/types/domain';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { StatusBar } from '@/components/domain/StatusBar';
import { PhraseCard } from '@/components/domain/PhraseCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Sheet } from '@/components/ui/Sheet';
import { SignPlayer } from '@/components/domain/SignPlayer';
import { Search, BookOpen, Star, Siren } from 'lucide-react';

export const PhrasebookPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentSession, status, startSession } = useSessionStore();
  const { settings } = useSettingsStore();

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeClipModal, setActiveClipModal] = useState<{ phrase: Phrase; clips: SignClip[] } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load phrases and favorites
  useEffect(() => {
    document.title = `${t('nav.phrasebook')} — ${t('app.name')}`;

    async function load() {
      const favs = await registry.phrasebook.getFavorites();
      setFavorites(favs);
      const list = await registry.phrasebook.search(searchQuery, {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
      });
      setPhrases(list);
    }

    load();
  }, [searchQuery, selectedCategory, t]);

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFavorite = async (id: string) => {
    await registry.phrasebook.toggleFavorite(id);
    const updated = await registry.phrasebook.getFavorites();
    setFavorites(updated);
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

  const categories = [
    { id: 'all', label: t('phrasebook.filterAll', 'Toutes') },
    { id: 'emergency', label: t('phrasebook.filterEmergency', 'Urgences'), icon: <Siren className="w-3.5 h-3.5 text-app-warning" /> },
    { id: 'symptoms', label: t('phrasebook.filterSymptoms', 'Symptômes') },
    { id: 'medication', label: t('phrasebook.filterMedication', 'Médicaments') },
    { id: 'appointment', label: t('phrasebook.filterAppointment', 'Rendez-vous') },
    { id: 'everyday', label: t('phrasebook.filterEveryday', 'Quotidien') },
    { id: 'favorites', label: t('phrasebook.filterFavorites', 'Favoris'), icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={t('nav.phrasebook', 'Phrases rapides')} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Header Block */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-app-text">
            {t('phrasebook.title', 'Phrases rapides')}
          </h2>
          <p className="text-sm text-app-muted mt-1">
            {t('phrasebook.subtitle', 'Phrases courantes pour la communication quotidienne.')}
          </p>
        </div>

        {/* Toolbar: Search input & Category Filters */}
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-app-muted absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('phrasebook.searchPlaceholder', 'Rechercher une phrase ou un signe… (Touche / pour chercher)')}
              className="w-full h-12 ps-11 pe-4 rounded-control border border-app-border-strong bg-app-surface text-app-text text-sm shadow-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
            />
          </div>

          {/* Category Chips Horizontal Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
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
            <span>{t('phrasebook.phraseCount', { count: phrases.length })}</span>
          </div>
        </div>

        {/* Grid of PhraseCards */}
        {phrases.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title={t('phrasebook.emptySearch', 'Aucune phrase trouvée.')}
            description="Essayez avec un autre mot-clé ou modifiez la catégorie sélectionnée."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
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
        )}
      </div>

      {/* SignPlayer Modal / Sheet when user clicks "Voir en LSA" */}
      <Sheet
        isOpen={activeClipModal !== null}
        onClose={() => setActiveClipModal(null)}
        title={activeClipModal?.phrase.text[settings.defaultSpokenLang] || 'Séquence LSA'}
        subtitle={`Glose : ${activeClipModal?.phrase.gloss.join(' · ')}`}
        maxWidth="lg"
      >
        {activeClipModal && <SignPlayer clips={activeClipModal.clips} />}
      </Sheet>
    </div>
  );
};
