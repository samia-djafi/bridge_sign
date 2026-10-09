import { create } from 'zustand';
import { DEMO_SCENARIOS, DemoScenario, DemoStep } from '@/data/demo-scenarios';
import { registry } from '@/services/registry';

interface DemoState {
  isDemoActive: boolean;
  currentScenario: DemoScenario | null;
  currentStepIndex: number; // 1-indexed

  startDemo: (scenarioId: string) => DemoScenario | null;
  getCurrentStep: () => DemoStep | null;
  nextStep: () => void;
  previousStep: () => void;
  exitDemo: () => void;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  isDemoActive: false,
  currentScenario: null,
  currentStepIndex: 1,

  startDemo: (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0]!;
    set({
      isDemoActive: true,
      currentScenario: scenario,
      currentStepIndex: 1,
    });

    // Queue first step if simulated sign is ready
    const step = scenario.steps[0];
    if (step?.simulatedSigns) {
      registry.mockRecognition.setScriptedResult({
        signs: step.simulatedSigns,
        sequence: step.simulatedSigns.map((s) => s.gloss),
        overallConfidence: 0.95,
        level: 'high',
        frames: 36,
        latencyMs: 320,
        model: { name: 'LSA-Sequence-TCN-Lite', version: '0.1.0-mvp' },
        adapter: 'demo',
      });
    }

    return scenario;
  },

  getCurrentStep: () => {
    const { currentScenario, currentStepIndex } = get();
    if (!currentScenario) return null;
    return currentScenario.steps.find((s) => s.stepIndex === currentStepIndex) || null;
  },

  nextStep: () => {
    const { currentScenario, currentStepIndex } = get();
    if (!currentScenario) return;

    const nextIndex = currentStepIndex + 1;
    const nextStep = currentScenario.steps.find((s) => s.stepIndex === nextIndex);

    if (nextStep) {
      if (nextStep.simulatedSigns) {
        registry.mockRecognition.setScriptedResult({
          signs: nextStep.simulatedSigns,
          sequence: nextStep.simulatedSigns.map((s) => s.gloss),
          overallConfidence: 0.94,
          level: 'high',
          frames: 42,
          latencyMs: 310,
          model: { name: 'LSA-Sequence-TCN-Lite', version: '0.1.0-mvp' },
          adapter: 'demo',
        });
      }
      set({ currentStepIndex: nextIndex });
    } else {
      set({ isDemoActive: false, currentScenario: null, currentStepIndex: 1 });
    }
  },

  previousStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 1) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  exitDemo: () => {
    registry.mockRecognition.reset();
    set({
      isDemoActive: false,
      currentScenario: null,
      currentStepIndex: 1,
    });
  },
}));
