import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSettingsStore } from '@/stores/settingsStore';
import { useProfileStore } from '@/stores/profileStore';
import { registry } from '@/services/registry';
import { Phrase, ConversationSession } from '@/types/domain';
import { Search, Bell, X, Clock, BookOpen, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Modal } from '@/components/ui/Modal';

export interface TopNavBarProps {
  title?: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ title }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const { preferredName } = useProfileStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    phrases: Phrase[];
    sessions: ConversationSession[];
  }>({ phrases: [], sessions: [] });
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search logic across phrases and sessions
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults({ phrases: [], sessions: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [matchedPhrases, allSessions] = await Promise.all([
          registry.phrasebook.search(q),
          registry.sessions.list(),
        ]);
        const lower = q.toLowerCase();
        const matchedSessions = allSessions.filter(
          (s) =>
            s.title.toLowerCase().includes(lower) ||
            s.context.toLowerCase().includes(lower)
        );
        setSearchResults({
          phrases: matchedPhrases.slice(0, 5),
          sessions: matchedSessions.slice(0, 4),
        });
      } catch (e) {
        // ignore
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectPhrase = (phrase: Phrase) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/app/phrasebook?category=${phrase.category}`);
  };

  const handleSelectSession = (session: ConversationSession) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/app/history/${session.id}`);
  };

  return (
    <header className="h-16 bg-app-surface border-b border-app-border px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 select-none">

      {/* Search Input Bar (Center) */}
      <div className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-lg">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-app-muted absolute start-3.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder={t(
              'dash.searchPlaceholder',
              'Search a conversation, phrase or topic...'
            )}
            className="w-full h-10 ps-10 pe-9 rounded-control bg-app-surface-2 border border-app-border text-xs sm:text-sm text-app-text placeholder:text-app-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong transition-all"
            aria-label="Recherche"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute end-3 p-0.5 text-app-muted hover:text-app-text"
              aria-label="Effacer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div
            className="absolute top-full mt-2 inset-x-0 bg-app-surface border border-app-border-strong rounded-card shadow-3 p-2 z-50 max-h-96 overflow-y-auto space-y-3"
            role="listbox"
          >
            {searchResults.phrases.length === 0 && searchResults.sessions.length === 0 ? (
              <div className="p-4 text-center text-xs text-app-muted">
                Aucun résultat pour « {searchQuery} »
              </div>
            ) : (
              <>
                {searchResults.phrases.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted px-2 block mb-1">
                      Phrases utiles
                    </span>
                    <div className="space-y-0.5">
                      {searchResults.phrases.map((p) => {
                        const currentLang = (['fr', 'ar', 'en'].includes(i18n.language)
                          ? i18n.language
                          : 'fr') as 'fr' | 'ar' | 'en';
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectPhrase(p)}
                            className="w-full flex items-center justify-between p-2 rounded-control hover:bg-app-surface-2 text-start transition-colors"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <BookOpen className="w-3.5 h-3.5 text-app-primary-strong shrink-0" />
                              <span className="text-xs font-medium text-app-text truncate">
                                {p.text[currentLang] || p.text.fr}
                              </span>
                            </div>
                            <span className="text-[10px] text-app-muted font-mono shrink-0">
                              {p.gloss.join(' ')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {searchResults.sessions.length > 0 && (
                  <div className="pt-2 border-t border-app-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted px-2 block mb-1">
                      Conversations
                    </span>
                    <div className="space-y-0.5">
                      {searchResults.sessions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSelectSession(s)}
                          className="w-full flex items-center justify-between p-2 rounded-control hover:bg-app-surface-2 text-start transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Clock className="w-3.5 h-3.5 text-app-muted shrink-0" />
                            <span className="text-xs font-semibold text-app-text truncate">
                              {s.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-app-muted">
                            {s.spokenLang.toUpperCase()} ↔ LSA
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications, Theme Toggle, Account / Status Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={() => setNotificationModalOpen(true)}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-control bg-app-surface-2 hover:bg-app-border text-app-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
          aria-label="Notifications et annonces"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-app-muted" />
          <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-app-primary-strong" />
        </button>

        {/* Functional Dark/Light Theme Toggle */}
        <ThemeToggle size="sm" />

        {/* User Role / Profile Pill (Clickable to edit profile) */}
        <button
          type="button"
          onClick={() => navigate('/app/settings')}
          aria-label={preferredName ? `Profil : ${preferredName}` : 'Paramètres du profil'}
          title="Modifier le profil"
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-control bg-app-surface-2 hover:bg-app-border border border-app-border text-xs text-app-text font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong select-none"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <User className="w-3.5 h-3.5 text-app-muted" />
          <span className="max-w-[120px] truncate">
            {preferredName || <span className="capitalize">{settings.role}</span>}
          </span>
        </button>
      </div>

      {/* Notifications Informative Modal */}
      <Modal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        title="Notifications & Statut"
        maxWidth="sm"
      >
        <div className="space-y-3 text-xs sm:text-sm text-app-text">
          <div className="p-3 rounded-control bg-app-primary-soft border border-app-primary-strong/30 space-y-1">
            <p className="font-bold text-app-primary-strong">Mise à jour BridgeSign disponible</p>
            <p className="text-xs text-app-muted">
              Le nouveau module de dialogue pharmaceutique LSA est activé en mode démo et direct.
            </p>
          </div>
          <div className="p-3 rounded-control bg-app-surface-2 border border-app-border space-y-1">
            <p className="font-semibold text-app-text">Confidentialité locale active</p>
            <p className="text-xs text-app-muted">
              Toutes les conversations et données de reconnaissance restent stockées sur votre
              appareil.
            </p>
          </div>
        </div>
      </Modal>
    </header>
  );
};
