import { create } from 'zustand';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'status' | 'alert' | 'success';
  durationMs?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UiState {
  toasts: ToastItem[];
  isOnline: boolean;
  canInstall: boolean;
  deferredInstallPrompt: any;
  emergencySheetOpen: boolean;
  privacySheetOpen: boolean;
  installModalOpen: boolean;

  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  setIsOnline: (online: boolean) => void;
  setInstallPrompt: (prompt: any) => void;
  setEmergencySheetOpen: (open: boolean) => void;
  setPrivacySheetOpen: (open: boolean) => void;
  setInstallModalOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  canInstall: false,
  deferredInstallPrompt: null,
  emergencySheetOpen: false,
  privacySheetOpen: false,
  installModalOpen: false,

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...toast, id };

    set((state) => ({
      // Keep max 3 toasts stacked
      toasts: [...state.toasts.slice(-2), newToast],
    }));

    const duration = toast.durationMs ?? (toast.action ? 8000 : 5000);
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  setIsOnline: (isOnline) => set({ isOnline }),
  setInstallPrompt: (prompt) => set({ deferredInstallPrompt: prompt, canInstall: !!prompt }),
  setEmergencySheetOpen: (emergencySheetOpen) => set({ emergencySheetOpen }),
  setPrivacySheetOpen: (privacySheetOpen) => set({ privacySheetOpen }),
  setInstallModalOpen: (installModalOpen) => set({ installModalOpen }),
}));
