import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Badge } from '@/components/ui/Badge';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { ConfidenceIndicator } from '@/components/ui/ConfidenceIndicator';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Kbd } from '@/components/ui/Kbd';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { DetectedSignChip } from '@/components/domain/DetectedSignChip';
import { SignSequenceStrip } from '@/components/domain/SignSequenceStrip';
import { Heart, Search } from 'lucide-react';

export const DesignPage: React.FC = () => {
  const [toggleVal, setToggleVal] = useState(true);
  const [segmentVal, setSegmentVal] = useState<'a' | 'b' | 'c'>('a');
  const [selectVal, setSelectVal] = useState('fr');

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-app-text">LSA Bridge — Design System Showcase</h1>
        <p className="text-sm text-app-muted mt-1">
          Vérification de tous les composants d'interface, jetons de design et états d'accessibilité.
        </p>
      </div>

      {/* Buttons */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold border-b pb-2">Boutons (Button & IconButton)</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Bouton Primaire</Button>
          <Button variant="secondary">Bouton Secondaire</Button>
          <Button variant="ghost">Bouton Fantôme</Button>
          <Button variant="destructive">Destructif</Button>
          <Button variant="primary" loading>Chargement</Button>
          <Button variant="primary" disabled>Désactivé</Button>
          <IconButton aria-label="Favori" tooltip="Ajouter aux favoris">
            <Heart className="w-5 h-5 text-red-500" />
          </IconButton>
        </div>
      </section>

      {/* Indicators */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold border-b pb-2">Indicateurs de statut & confiance</h2>
        <div className="flex flex-wrap items-center gap-4">
          <StatusIndicator status="ready" label="Prêt" />
          <StatusIndicator status="active" label="En cours (pulsing)" />
          <StatusIndicator status="warning" label="Avertissement" />
          <StatusIndicator status="error" label="Erreur" />
          <StatusIndicator status="off" label="Désactivé" />
          <ConfidenceIndicator level="high" value={0.94} showValue />
          <ConfidenceIndicator level="medium" value={0.78} showValue />
          <ConfidenceIndicator level="low" value={0.52} showValue />
        </div>
      </section>

      {/* Badges & Chips */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold border-b pb-2">Badges, Puces & Séquences</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="neutral">Neutre</Badge>
          <Badge variant="demo">Mode Démo</Badge>
          <Badge variant="live">IA Direct</Badge>
          <Badge variant="warning">Avertissement</Badge>
          <Badge variant="error">Erreur</Badge>
          <DetectedSignChip gloss="HEADACHE" confidence={0.96} level="high" />
          <DetectedSignChip gloss="UNKNOWN" confidence={0.54} level="low" onRemove={() => {}} />
        </div>
        <div className="pt-2">
          <SignSequenceStrip
            glosses={['HEADACHE', 'PAIN', 'SINCE', 'YESTERDAY']}
            currentIndex={1}
          />
        </div>
      </section>

      {/* Form Controls */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Contrôles de formulaire</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="block text-xs font-bold text-app-muted mb-2">SegmentedControl :</span>
            <SegmentedControl
              value={segmentVal}
              onChange={setSegmentVal}
              options={[
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B' },
                { value: 'c', label: 'Option C' },
              ]}
            />
          </div>

          <div>
            <span className="block text-xs font-bold text-app-muted mb-2">Toggle :</span>
            <Toggle
              checked={toggleVal}
              onChange={setToggleVal}
              label="Option active"
              description="Basculer pour tester"
            />
          </div>

          <div>
            <span className="block text-xs font-bold text-app-muted mb-2">Select :</span>
            <Select
              value={selectVal}
              onChange={setSelectVal}
              options={[
                { value: 'fr', label: 'Français' },
                { value: 'ar', label: 'العربية' },
                { value: 'en', label: 'English' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Progress & Kbd */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold border-b pb-2">Barre de progression & Raccourcis</h2>
        <div className="max-w-md space-y-4">
          <ProgressBar value={65} label="Téléchargement du pack hors-ligne" />
          <div className="flex items-center gap-2 text-xs">
            <span>Raccourci clavier :</span>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>K</Kbd>
          </div>
        </div>
      </section>

      {/* States: Empty & Error */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">États d'erreur & États vides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="Aucun résultat"
            description="Exemple d'état vide accessible."
          />
          <ErrorState
            code="CAM-001"
            title="Accès caméra refusé"
            description="Autorisez la caméra dans les préférences de votre navigateur."
            onRetry={() => {}}
          />
        </div>
      </section>
    </div>
  );
};
