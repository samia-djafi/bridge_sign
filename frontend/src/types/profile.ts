export interface LocalProfile {
  id: string;
  preferredName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileStorageService {
  getProfile(): LocalProfile | null;
  saveProfile(preferredName: string | null): LocalProfile;
  updatePreferredName(preferredName: string | null): LocalProfile;
  clearProfile(): void;
  ensureProfile(): LocalProfile;
}
