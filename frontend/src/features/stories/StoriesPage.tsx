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
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const StoriesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (['fr', 'ar', 'en'].includes(i18n.language) ? i18n.language : 'fr') as
    | 'fr'
    | 'ar'
    | 'en';

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState<'deaf' | 'healthcare' | 'supporter'>('deaf');
  const [authorMessage, setAuthorMessage] = useState('');

  useEffect(() => {
    document.title = `${t('nav.realStories', 'Témoignages')} — ${t('app.name', 'BridgeSign')}`;
  }, [t]);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorMessage.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setShareModalOpen(false);
      setFeedbackSent(false);
      setAuthorName('');
      setAuthorMessage('');
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-app-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-control bg-app-primary-soft text-app-primary-strong flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-extrabold text-app-text">
                {t('stories.title', 'Témoignages & Récits vécus')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-app-muted max-w-2xl">
              {t(
                'stories.subtitle',
                'Récits authentiques partagés par des personnes sourdes, malentendantes et des professionnels de santé en Algérie.'
              )}
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            iconStart={<MessageSquare className="w-4 h-4" />}
            onClick={() => setShareModalOpen(true)}
            className="shrink-0"
          >
            {t('stories.shareCta', 'Partager une expérience')}
          </Button>
        </div>

        {/* Transparency Banner: authentic experiences only */}
        <div
          role="region"
          aria-label="Avertissement d'authenticité"
          className="p-4 rounded-card bg-app-surface border border-app-border-strong flex items-start gap-3 shadow-1 text-xs text-app-muted leading-relaxed"
        >
          <ShieldCheck className="w-5 h-5 text-app-primary-strong shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-app-text block mb-0.5">
              Engagement de transparence & authenticité
            </span>
            <p>{t('stories.transparencyNotice')}</p>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                  <div className="flex items-center justify-between text-[11px] gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill font-semibold ${
                        isDeaf
                          ? 'bg-app-primary-soft text-app-primary-strong'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {isDeaf
                        ? t('stories.verifiedCommunity', "Communauté sourde d'Algérie")
                        : t('stories.healthcarePartner', 'Professionnel de santé')}
                    </span>
                    <span className="text-app-muted font-mono">{story.date}</span>
                  </div>

                  {/* Quote with icon */}
                  <div className="relative pt-2">
                    <Quote className="w-6 h-6 text-app-primary-strong/20 absolute -top-1 -start-1 rtl:-scale-x-100" />
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
                <div className="pt-3 border-t border-app-border flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-app-text">{story.author}</h3>
                    <p className="text-[11px] text-app-muted">
                      {story.role[currentLang] || story.role.fr}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-app-muted">
                    <MapPin className="w-3 h-3 text-app-primary-strong shrink-0" />
                    <span>{story.location}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Callout: Healthcare Partnership */}
        <div className="p-5 rounded-card bg-app-surface-2 border border-app-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-sm font-bold text-app-text flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-app-primary-strong" />
              <span>Vous êtes médecin, infirmier ou pharmacien en Algérie ?</span>
            </h3>
            <p className="text-xs text-app-muted max-w-xl">
              Participez à nos essais terrain pour tester BridgeSign au comptoir et adapter le
              vocabulaire médical LSA aux besoins de vos patients.
            </p>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShareModalOpen(true)}
            className="shrink-0"
          >
            Contribuer au projet
          </Button>
        </div>
      </div>

      {/* Share / Feedback Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={t('stories.feedbackTitle', 'Proposer un retour ou un témoignage')}
        maxWidth="md"
      >
        {feedbackSent ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-app-success mx-auto" />
            <p className="font-bold text-base text-app-text">Merci pour votre contribution !</p>
            <p className="text-xs text-app-muted">
              Votre retour sera relu avec respect par l'équipe avant toute publication avec votre
              accord.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs sm:text-sm">
            <p className="text-xs text-app-muted leading-relaxed">
              {t(
                'stories.feedbackDesc',
                'Vos retours nous aident à enrichir le vocabulaire LSA et à améliorer l’accueil en santé.'
              )}
            </p>

            <div className="space-y-1.5">
              <label htmlFor="author-name" className="block text-xs font-semibold text-app-text">
                Nom ou initiales (optionnel)
              </label>
              <input
                id="author-name"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: Yasmine B., Pharmacie El-Biar"
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
                <option value="healthcare">Professionnel de santé (pharmacien, médecin…)</option>
                <option value="supporter">Proche aidant / Interprète</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="author-message" className="block text-xs font-semibold text-app-text">
                Votre expérience ou suggestion *
              </label>
              <textarea
                id="author-message"
                required
                rows={4}
                value={authorMessage}
                onChange={(e) => setAuthorMessage(e.target.value)}
                placeholder="Racontez comment s’est passée votre interaction ou quels signes manquent pour vos échanges…"
                className="w-full p-3 rounded-control border border-app-border bg-app-surface text-app-text text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShareModalOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                iconEnd={<Send className="w-3.5 h-3.5" />}
              >
                Envoyer le témoignage
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
