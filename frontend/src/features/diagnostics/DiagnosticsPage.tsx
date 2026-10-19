import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { registry } from '@/services/registry';
import { ModelMetrics } from '@/types/domain';
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

  // Technical Metrics State
  const [metrics, setMetrics] = useState<ModelMetrics>(registry.metrics.getMetrics());
  const [logs, setLogs] = useState<LogEntry[]>(logger.getLogs());
  const [showJson, setShowJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    document.title = `${t('nav.diagnostics')} | ${t('app.name')}`;
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
      `connectsign_diagnostics_${new Date().toISOString().slice(0, 10)}.json`,
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
    <div className="flex flex-col min-h-full bg-app-bg text-app-text">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app-border pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-app-text flex items-center gap-2">
              <Activity className="w-6 h-6 text-app-primary-strong" />
              <span>{t('diagnostics.title', 'AI Diagnostics')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-app-muted">
              {t(
                'diagnostics.metricsIntro',
                'Real-time recognition pipeline metrics, architecture details, and diagnostic event logs.'
              )}
            </p>
          </div>
        </div>

        {/* Technical Metrics, Live Pipeline & Event Logs */}
        <div className="space-y-6">
          {/* Top Banner: Demo vs Live data */}
          <div
            role="region"
            aria-label={t('diagnostics.title')}
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
                  ? t('diagnostics.demoBanner')
                  : t('diagnostics.liveBanner')}
              </span>
            </div>
            <span className="font-bold text-xs uppercase px-2 py-0.5 rounded-pill bg-black/10">
              {isDemo ? t('badge.demo') : t('badge.live')}
            </span>
          </div>

          {/* Section 1: Real Metrics Cards */}
          <div>
            <h3 className="text-base font-bold text-app-text mb-3">
              {t('diagnostics.metricsTitle', 'Performance & Metrics')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label={t('diagnostics.camFps', 'Camera frame rate')}
                value={metrics.fps}
                unit="FPS"
                badge={isDemo ? 'demo' : 'live'}
                subtext={t('diagnostics.camFpsSub', 'Measured real-time rate')}
              />
              <MetricCard
                label={t('diagnostics.inferenceLatency', 'Inference latency')}
                value={isDemo ? '—' : `${metrics.inferenceMs ?? 0} ms`}
                badge={isDemo ? 'demo' : 'live'}
                subtext={
                  isDemo
                    ? t('diagnostics.latencySubDemo', 'Not measured in demo')
                    : t('diagnostics.latencySubLive', 'Round-trip delay')
                }
              />
              <MetricCard
                label={t('diagnostics.vocabSize', 'Vocabulary size')}
                value={VOCAB_SIZE}
                unit={t('diagnostics.signsUnit', 'signs')}
                subtext={t('diagnostics.vocabSub', 'Supported MVP vocabulary')}
              />
              <MetricCard
                label={t('diagnostics.trackingState', 'Tracking status')}
                value={
                  metrics.tracking === 'stable'
                    ? t('diagnostics.trackingStable', 'Stable')
                    : metrics.tracking === 'unstable'
                    ? t('diagnostics.trackingUnstable', 'Unstable')
                    : t('diagnostics.trackingLost', 'Lost')
                }
                badge={isDemo ? 'demo' : 'live'}
                subtext={t('diagnostics.trackingSub', 'Hand landmarks visibility')}
              />
            </div>
          </div>

          {/* Section 2: Live Pipeline Stepper */}
          <div>
            <h3 className="text-base font-bold text-app-text mb-3">
              {t('diagnostics.pipelineHeading', 'Processing Engine (Pipeline)')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <PipelineStep
                stepNumber={1}
                icon={<Video className="w-4 h-4 text-app-primary-strong" />}
                title={t('diagnostics.step1Title', 'Video Stream')}
                description={t('diagnostics.step1Desc', 'Local camera capture')}
                state="done"
              />
              <PipelineStep
                stepNumber={2}
                icon={<Layers className="w-4 h-4 text-app-primary-strong" />}
                title={t('diagnostics.step2Title', 'Skeletal Landmarks')}
                description={t('diagnostics.step2Desc', 'MediaPipe Hands (2x21 points)')}
                state="done"
              />
              <PipelineStep
                stepNumber={3}
                icon={<Activity className="w-4 h-4 text-app-primary-strong" />}
                title={t('diagnostics.step3Title', 'Temporal Analysis')}
                description={t('diagnostics.step3Desc', 'Buffer of 48 normalized frames')}
                state="active"
              />
              <PipelineStep
                stepNumber={4}
                icon={<Cpu className="w-4 h-4 text-app-primary-strong" />}
                title={t('diagnostics.step4Title', 'LSA Gloss')}
                description={t('diagnostics.step4Desc', 'Sign classification')}
                state="done"
              />
              <PipelineStep
                stepNumber={5}
                icon={<CheckCircle className="w-4 h-4 text-app-primary-strong" />}
                title={t('diagnostics.step5Title', 'Sentence Synthesis')}
                description={t('diagnostics.step5Desc', 'Structured FR / AR / EN')}
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
                <p className="font-semibold text-app-text mb-1">{t('diagnostics.architecture', 'Architecture:')}</p>
                <p>{modelCardData.architecture}</p>
              </div>
              <div>
                <p className="font-semibold text-app-text mb-1">{t('diagnostics.inputs', 'Inputs:')}</p>
                <p>{modelCardData.input}</p>
              </div>
              <div>
                <p className="font-semibold text-app-text mb-1">{t('diagnostics.outputs', 'Outputs:')}</p>
                <p>{modelCardData.output}</p>
              </div>
              <div>
                <p className="font-semibold text-app-text mb-1">{t('diagnostics.evaluation', 'Evaluation & Accuracy:')}</p>
                <p className="italic text-app-warning">
                  {modelCardData.evaluation === null
                    ? t('diagnostics.evaluationNone', 'No formal evaluation published yet (Scientific honesty).')
                    : modelCardData.evaluation}
                </p>
              </div>
            </div>

            {/* Known Limitations */}
            <div className="pt-3 border-t border-app-border">
              <h4 className="text-xs font-bold text-app-text mb-2">
                {t('diagnostics.knownLimitationsTitle', 'Known MVP limitations:')}
              </h4>
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
                <span>
                  {showJson
                    ? t('diagnostics.hideJson', 'Hide JSON')
                    : t('diagnostics.showJson', 'View raw model card (JSON)')}
                </span>
              </button>

              {showJson && (
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="absolute top-2 end-2 p-1 rounded bg-app-surface text-app-muted hover:text-app-text border text-xs flex items-center gap-1"
                  >
                    {copiedJson ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedJson ? t('diagnostics.copied', 'Copied') : t('diagnostics.copy', 'Copy')}</span>
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
                  {t('diagnostics.logs', 'Event log')}
                </h3>
                <p className="text-xs text-app-muted mt-0.5">
                  {t('diagnostics.logsPrivacyNote', 'Without personal data (no faces or video stored).')}
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadLogs}
                iconStart={<Download className="w-3.5 h-3.5" />}
              >
                {t('diagnostics.downloadLogs', 'Download log')}
              </Button>
            </div>

            <div className="p-2 bg-app-surface-2 rounded-control border border-app-border max-h-56 overflow-y-auto font-mono text-xs space-y-1">
              {logs.length === 0 ? (
                <p className="text-app-muted italic p-2">{t('diagnostics.noLogs', 'No events recorded.')}</p>
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
    </div>
  );
};
