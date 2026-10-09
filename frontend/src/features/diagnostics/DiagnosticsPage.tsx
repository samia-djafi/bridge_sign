import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { registry } from '@/services/registry';
import { ModelMetrics } from '@/types/domain';
import { StatusBar } from '@/components/domain/StatusBar';
import { MetricCard } from '@/components/domain/MetricCard';
import { PipelineStep } from '@/components/domain/PipelineStep';
import { Button } from '@/components/ui/Button';
import { logger, LogEntry } from '@/lib/logger';
import { downloadFile } from '@/lib/download';
import modelCardData from '@/data/model-card.json';
import { VOCAB_SIZE } from '@/data/vocabulary.config';
import {
  Activity,
  Cpu,
  Download,
  Video,
  Layers,
  Sparkles,
  CheckCircle,
  Code,
  Copy,
  Check,
} from 'lucide-react';

export const DiagnosticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<ModelMetrics>(registry.metrics.getMetrics());
  const [logs, setLogs] = useState<LogEntry[]>(logger.getLogs());
  const [showJson, setShowJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    document.title = `${t('nav.diagnostics')} — ${t('app.name')}`;
    const unsubMetrics = registry.metrics.subscribe(setMetrics);
    const unsubLogs = logger.subscribe(setLogs);

    return () => {
      unsubMetrics();
      unsubLogs();
    };
  }, [t]);

  const isDemo = registry.ai.adapter === 'demo';

  const handleDownloadLogs = () => {
    downloadFile(
      `lsa_diagnostics_${new Date().toISOString().slice(0, 10)}.json`,
      logger.exportAsJson(),
      'application/json'
    );
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(modelCardData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={t('nav.diagnostics', 'Diagnostic IA')} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Top Banner: Demo vs Live data */}
        <div
          role="region"
          aria-label="Statut des données IA"
          className={`p-4 rounded-card border flex items-center justify-between gap-3 text-sm font-medium ${
            isDemo
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 shrink-0" />
            <span>
              {isDemo
                ? t(
                    'diagnostics.demoBanner',
                    'Données de simulation. Activez le backend direct dans les Paramètres une fois connecté.'
                  )
                : t('diagnostics.liveBanner', 'Données d’inférence en direct.')}
            </span>
          </div>
          <span className="font-bold text-xs uppercase px-2 py-0.5 rounded-pill bg-black/10">
            {isDemo ? 'Mode Démo' : 'Mode Direct'}
          </span>
        </div>

        {/* Section 1: Real Metrics Cards */}
        <div>
          <h3 className="text-base font-bold text-app-text mb-3">Mesures & Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Fréquence caméra"
              value={metrics.fps}
              unit="FPS"
              badge={isDemo ? 'demo' : 'live'}
              subtext="Cadence réelle mesurée"
            />
            <MetricCard
              label="Latence d'inférence"
              value={isDemo ? '—' : `${metrics.inferenceMs ?? 0} ms`}
              badge={isDemo ? 'demo' : 'live'}
              subtext={isDemo ? 'Non mesuré en démo' : 'Délai d’aller-retour'}
            />
            <MetricCard
              label="Taille vocabulaire"
              value={VOCAB_SIZE}
              unit="signes"
              subtext="Vocabulaire supporté MVP"
            />
            <MetricCard
              label="État du suivi"
              value={
                metrics.tracking === 'stable'
                  ? 'Stable'
                  : metrics.tracking === 'unstable'
                  ? 'Instable'
                  : 'Perdu'
              }
              badge={isDemo ? 'demo' : 'live'}
              subtext="Visibilité des repères mains"
            />
          </div>
        </div>

        {/* Section 2: Live Pipeline Stepper */}
        <div>
          <h3 className="text-base font-bold text-app-text mb-3">Moteur de traitement (Pipeline)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <PipelineStep
              stepNumber={1}
              icon={<Video className="w-4 h-4 text-app-primary-strong" />}
              title="Flux Vidéo"
              description="Capture locale caméra"
              state="done"
            />
            <PipelineStep
              stepNumber={2}
              icon={<Layers className="w-4 h-4 text-app-primary-strong" />}
              title="Points squelettiques"
              description="MediaPipe Hands (2x21 points)"
              state="done"
            />
            <PipelineStep
              stepNumber={3}
              icon={<Activity className="w-4 h-4 text-app-primary-strong" />}
              title="Analyse temporelle"
              description="Buffer de 48 trames normalisées"
              state="active"
            />
            <PipelineStep
              stepNumber={4}
              icon={<Cpu className="w-4 h-4 text-app-primary-strong" />}
              title="Glose LSA"
              description="Classification de signes"
              state="done"
            />
            <PipelineStep
              stepNumber={5}
              icon={<CheckCircle className="w-4 h-4 text-app-primary-strong" />}
              title="Synthèse phrase"
              description="FR / AR / EN structuré"
              state="done"
            />
          </div>
        </div>

        {/* Section 3: Model Card Information */}
        <div className="p-5 rounded-card bg-app-surface border border-app-border space-y-4 shadow-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-app-primary-strong" />
              <h3 className="text-base font-bold text-app-text">{modelCardData.name}</h3>
            </div>
            <span className="text-xs font-mono text-app-muted">v{modelCardData.version}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-app-muted">
            <div>
              <p className="font-semibold text-app-text mb-1">Architecture :</p>
              <p>{modelCardData.architecture}</p>
            </div>
            <div>
              <p className="font-semibold text-app-text mb-1">Entrées :</p>
              <p>{modelCardData.input}</p>
            </div>
            <div>
              <p className="font-semibold text-app-text mb-1">Sorties :</p>
              <p>{modelCardData.output}</p>
            </div>
            <div>
              <p className="font-semibold text-app-text mb-1">Évaluation & Précision :</p>
              <p className="italic text-app-warning">
                {modelCardData.evaluation === null
                  ? 'Aucune évaluation formelle publiée pour le moment (Honnêteté scientifique).'
                  : modelCardData.evaluation}
              </p>
            </div>
          </div>

          {/* Known Limitations */}
          <div className="pt-3 border-t border-app-border">
            <h4 className="text-xs font-bold text-app-text mb-2">Limites connues du MVP :</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-app-muted">
              {modelCardData.knownLimitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="text-xs font-semibold text-app-primary-strong hover:underline flex items-center gap-1"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJson ? 'Masquer le JSON' : 'Afficher la fiche modèle brute (JSON)'}</span>
            </button>

            {showJson && (
              <div className="relative mt-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="absolute top-2 end-2 p-1 rounded bg-app-surface text-app-muted hover:text-app-text border text-xs flex items-center gap-1"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copié' : 'Copier'}</span>
                </button>
                <pre className="p-3 bg-app-surface-2 rounded-control text-xs font-mono overflow-auto max-h-48 text-app-text">
                  {JSON.stringify(modelCardData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Diagnostics Event Log */}
        <div className="p-5 rounded-card bg-app-surface border border-app-border space-y-3 shadow-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-app-text">
                {t('diagnostics.logs', 'Journal d’événements (50 derniers)')}
              </h3>
              <p className="text-xs text-app-muted mt-0.5">
                Sans données personnelles (aucun visage ni vidéo persistée).
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadLogs}
              iconStart={<Download className="w-3.5 h-3.5" />}
            >
              {t('diagnostics.downloadLogs', 'Télécharger le journal')}
            </Button>
          </div>

          <div className="p-2 bg-app-surface-2 rounded-control border border-app-border max-h-56 overflow-y-auto font-mono text-xs space-y-1">
            {logs.length === 0 ? (
              <p className="text-app-muted italic p-2">Aucun événement enregistré.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 py-0.5 text-app-text">
                  <span className="text-app-muted shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`font-bold shrink-0 ${
                      log.level === 'error'
                        ? 'text-app-error'
                        : log.level === 'warn'
                        ? 'text-app-warning'
                        : 'text-app-primary-strong'
                    }`}
                  >
                    [{log.level.toUpperCase()}]
                  </span>
                  {log.code && <span className="font-bold shrink-0">[{log.code}]</span>}
                  <span className="truncate">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
