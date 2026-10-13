import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { STORIES } from '@/data/stories';
import {
  HeartHandshake,
  ShieldCheck,
  Quote,
  MapPin,
  Save,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Trash2,
  Info,
} from 'lucide-react';

interface LocalFeedbackEntry {
  id: string;
  authorName: string;
  authorRole: 'deaf' | 'healthcare' | 'supporter';
  message: string;
  createdAt: number;
}

const LOCAL_FEEDBACK_KEY = 'bridgesign-local-feedback';

export const StoriesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (['en', 'fr', 'ar'].includes(i18n.language) ? i18n.language : 'en') as
    | 'en'
    | 'fr'
    | 'ar';

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'form' | 'list'>('form');
  const [savedFeedbacks, setSavedFeedbacks] = useState<LocalFeedbackEntry[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState<'deaf' | 'healthcare' | 'supporter'>('deaf');
  const [authorMessage, setAuthorMessage] = useState('');

  // Load saved local feedback on mount
  useEffect(() => {
    document.title = `${t('nav.realStories', 'Real Stories')} | ${t('app.name', 'BridgeSign')}`;
    loadLocalFeedback();
  }, [t]);

  const loadLocalFeedback = () => {
    try {
      const raw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedFeedbacks(parsed);
        }
      }
    } catch {
      // ignore local storage read errors
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorMessage.trim()) return;

    setSaveError(null);
    try {
      const newEntry: LocalFeedbackEntry = {
        id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        authorName: authorName.trim() || 'Anonyme',
        authorRole,
        message: authorMessage.trim(),
        createdAt: Date.now(),
      };

      const updated = [newEntry, ...savedFeedbacks];
      localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(updated));
      setSavedFeedbacks(updated);
      setSaveSuccess(true);
      setAuthorName('');
      setAuthorMessage('');
    } catch (err) {
      setSaveError(
        'Impossible d’enregistrer la note localement (mémoire de stockage saturée ou désactivée).'
      );
    }
  };

  const handleDeleteFeedback = (id: string) => {
    try {
      const updated = savedFeedbacks.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(updated));
      setSavedFeedbacks(updated);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-app-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-control bg-app-primary-soft text-app-primary-strong flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-extrabold text-app-text">
                {t('stories.title', 'Témoignages')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-app-muted max-w-2xl leading-relaxed">
              {t(
                'stories.subtitle',
                'Histoires vécues et scénarios illustratifs de BridgeSign dans le milieu médical et le quotidien en Algérie.'
              )}
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            iconStart={<MessageSquare className="w-4 h-4" />}
            onClick={() => {
              setSaveSuccess(false);
              setSaveError(null);
              setShareModalOpen(true);
            }}
            className="shrink-0"
          >
            {t('stories.shareCta', 'Enregistrer une suggestion locale')}
          </Button>
        </div>

        {/* Transparency Banner: Honest illustrative disclosure */}
        <div
          role="region"
          aria-label="Avertissement d'authenticité"
          className="p-4 rounded-card bg-app-surface border border-app-border-strong flex items-start gap-3 shadow-1 text-xs text-app-muted leading-relaxed"
        >
          <ShieldCheck className="w-5 h-5 text-app-primary-strong shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-app-text block">
              Engagement de transparence & d’honnêteté
            </span>
            <p>
              {t(
                'stories.transparencyNotice',
                'Ces scénarios sont illustratifs et ne constituent pas des témoignages réels. Les témoignages authentiques seront publiés dès qu’ils auront été recueillis avec le consentement libre et éclairé de leurs participants.'
              )}
            </p>
          </div>
        </div>

        {/* Stories Grid: Responsive Layout (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STORIES.map((story) => {
            const isDeaf = story.badge === 'deaf_community';
            return (
              <Card
                key={story.id}
                p={20}
                className="flex flex-col justify-between gap-4 bg-app-surface border border-app-border hover:border-app-border-strong transition-all shadow-1"
              >
                <div className="space-y-3">
                  {/* Category Pill & Date */}
                  <div className="flex items-center justify-between text-[11px] gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill font-semibold ${
                        isDeaf
                          ? 'bg-app-primary-soft text-app-primary-strong'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {isDeaf
                        ? t('stories.verifiedCommunity', 'Cas illustratif — Communauté sourde')
                        : t('stories.healthcarePartner', 'Cas illustratif — Professionnel de santé')}
                    </span>
                    <span className="text-app-muted font-mono">{story.date}</span>
                  </div>

                  {/* Scenario Title */}
                  <h3 className="font-bold text-sm text-app-text">
                    {story.scenarioTitle[currentLang] || story.scenarioTitle.fr}
                  </h3>

                  {/* Illustrated Situation with quote styling */}
                  <div className="relative pt-1">
                    <Quote className="w-5 h-5 text-app-primary-strong/20 absolute -top-1 -start-1 rtl:-scale-x-100" />
                    <p className="text-xs sm:text-sm text-app-text leading-relaxed italic relative z-10 ps-3">
                      « {story.quote[currentLang] || story.quote.fr} »
                    </p>
                  </div>

                  {/* Context Note */}
                  <div className="p-2.5 rounded-control bg-app-surface-2 text-[11px] text-app-muted leading-relaxed">
                    {story.details[currentLang] || story.details.fr}
                  </div>
                </div>

                {/* Author Info */}
                <div className="pt-3 border-t border-app-border flex items-center justify-between text-xs gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-app-text block truncate">
                      {story.author}
                    </span>
                    <p className="text-[11px] text-app-muted truncate">
                      {story.role[currentLang] || story.role.fr}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-app-muted shrink-0">
                    <MapPin className="w-3 h-3 text-app-primary-strong shrink-0" />
                    <span>{story.location}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Callout: Field Trials Participation */}
        <div className="p-5 rounded-card bg-app-surface-2 border border-app-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-sm font-bold text-app-text flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-app-primary-strong" />
              <span>Vous souhaitez tester BridgeSign sur le terrain ?</span>
            </h3>
            <p className="text-xs text-app-muted max-w-xl">
              Participez à nos essais pour adapter le vocabulaire médical et quotidien de la LSA aux
              besoins concrets des échanges en santé en Algérie.
            </p>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setSaveSuccess(false);
              setSaveError(null);
              setShareModalOpen(true);
            }}
            className="shrink-0"
          >
            Noter une suggestion
          </Button>
        </div>
      </div>

      {/* Share / Local Feedback Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={t('stories.feedbackTitle', 'Retours & suggestions (brouillon local)')}
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Honest local storage banner */}
          <div className="p-3 rounded-control bg-app-surface-2 border border-app-border flex items-start gap-2.5 text-xs text-app-muted leading-relaxed">
            <Info className="w-4 h-4 text-app-primary-strong shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-app-text">Enregistrement local sur cet appareil</p>
              <p className="mt-0.5">
                {t(
                  'stories.feedbackDesc',
                  'Vos retours sont conservés uniquement sur cet appareil pour vos futures contributions. Aucune transmission à un serveur distant.'
                )}
              </p>
            </div>
          </div>

          {/* Sub-tabs if saved entries exist */}
          <div className="flex border-b border-app-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setModalTab('form');
                setSaveSuccess(false);
              }}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                modalTab === 'form'
                  ? 'border-app-primary-strong text-app-primary-strong'
                  : 'border-transparent text-app-muted hover:text-app-text'
              }`}
            >
              Nouvelle note
            </button>
            <button
              type="button"
              onClick={() => setModalTab('list')}
              className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                modalTab === 'list'
                  ? 'border-app-primary-strong text-app-primary-strong'
                  : 'border-transparent text-app-muted hover:text-app-text'
              }`}
            >
              <span>Mes notes locales</span>
              <span className="px-1.5 py-0.2 rounded-pill bg-app-surface-2 text-[10px] font-mono">
                {savedFeedbacks.length}
              </span>
            </button>
          </div>

          {modalTab === 'form' ? (
            saveSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-app-success mx-auto" />
                <p className="font-bold text-base text-app-text">
                  Note enregistrée localement avec succès !
                </p>
                <p className="text-xs text-app-muted leading-relaxed">
                  Votre brouillon est sauvegardé dans le stockage local de ce navigateur. Il n’a pas
                  été transmis à un serveur et reste accessible depuis cet appareil.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSaveSuccess(false);
                      setModalTab('list');
                    }}
                  >
                    Voir mes notes ({savedFeedbacks.length})
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSaveSuccess(false);
                    }}
                  >
                    Ajouter une autre note
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs sm:text-sm">
                {saveError && (
                  <div className="p-2.5 rounded-control bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-app-error text-xs">
                    {saveError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="author-name" className="block text-xs font-semibold text-app-text">
                    Nom ou référence (facultatif)
                  </label>
                  <input
                    id="author-name"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Pharmacie El-Biar, Yasmine B."
                    className="w-full h-10 px-3 rounded-control border border-app-border bg-app-surface text-app-text text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="author-role" className="block text-xs font-semibold text-app-text">
                    Votre profil
                  </label>
                  <select
                    id="author-role"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-control border border-app-border bg-app-surface text-app-text text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
                  >
                    <option value="deaf">Personne sourde ou malentendante</option>
                    <option value="healthcare">
                      Professionnel de santé (pharmacien, médecin…)
                    </option>
                    <option value="supporter">Proche aidant / Interprète</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="author-message"
                    className="block text-xs font-semibold text-app-text"
                  >
                    Votre suggestion ou retour d'expérience *
                  </label>
                  <textarea
                    id="author-message"
                    required
                    rows={4}
                    value={authorMessage}
                    onChange={(e) => setAuthorMessage(e.target.value)}
                    placeholder="Notez les signes manquants, les difficultés rencontrées ou les propositions d'amélioration…"
                    className="w-full p-3 rounded-control border border-app-border bg-app-surface text-app-text text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setShareModalOpen(false)}
                  >
                    Fermer
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    iconStart={<Save className="w-3.5 h-3.5" />}
                  >
                    Enregistrer localement
                  </Button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-3">
              {savedFeedbacks.length === 0 ? (
                <div className="p-8 text-center text-xs text-app-muted space-y-2">
                  <p>Aucune note enregistrée pour le moment.</p>
                  <Button variant="secondary" size="sm" onClick={() => setModalTab('form')}>
                    Créer une note
                  </Button>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2.5 pe-1">
                  {savedFeedbacks.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-control bg-app-surface-2 border border-app-border text-xs space-y-1.5 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-app-text">{item.authorName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-app-muted font-mono">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="text-app-muted hover:text-app-error p-1 rounded transition-colors"
                            aria-label="Supprimer cette note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-app-text whitespace-pre-wrap">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
