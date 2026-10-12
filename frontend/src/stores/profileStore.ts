import { create } from 'zustand';
import { LocalProfile } from '@/types/profile';
import { registry } from '@/services/registry';

interface ProfileState {
  profile: LocalProfile | null;
  preferredName: string | null;
  isLoaded: boolean;
  loadProfile: () => LocalProfile;
  setPreferredName: (name: string | null) => LocalProfile;
  clearProfile: () => void;
}

const initialProfile = registry.profile.getProfile();

export const useProfileStore = create<ProfileState>((set) => ({
  profile: initialProfile,
  preferredName: initialProfile?.preferredName ?? null,
  isLoaded: true,

  loadProfile: () => {
    const profile = registry.profile.getProfile();
    set({
      profile,
      preferredName: profile?.preferredName ?? null,
      isLoaded: true,
    });
    return profile || registry.profile.ensureProfile();
  },

  setPreferredName: (name: string | null) => {
    const saved = registry.profile.updatePreferredName(name);
    set({
      profile: saved,
      preferredName: saved.preferredName,
    });
    return saved;
  },

  clearProfile: () => {
    registry.profile.clearProfile();
    set({
      profile: null,
      preferredName: null,
    });
  },
}));
