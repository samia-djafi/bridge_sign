import { SignClip } from '@/types/domain';
import { SignAssetService } from '@/types/services';

const DEFAULT_DURATION = 1500;

export class AppSignAssetService implements SignAssetService {
  private manifest: Record<string, { src: string; durationMs: number; isPlaceholder: boolean }> = {};
  private manifestLoaded = false;

  private async loadManifest() {
    if (this.manifestLoaded) return;
    try {
      const res = await fetch('/signs/manifest.json');
      if (res.ok) {
        const data = await res.json();
        this.manifest = data.clips || {};
      }
    } catch {
      // Fallback to empty manifest if offline or error
      this.manifest = {};
    } finally {
      this.manifestLoaded = true;
    }
  }

  async getClips(gloss: string[]): Promise<SignClip[]> {
    await this.loadManifest();

    return gloss.map((g) => {
      const entry = this.manifest[g];
      if (entry) {
        return {
          gloss: g,
          src: entry.src,
          durationMs: entry.durationMs || DEFAULT_DURATION,
          isPlaceholder: entry.isPlaceholder ?? true,
        };
      }
      return {
        gloss: g,
        src: `/signs/${encodeURIComponent(g)}.webm`,
        durationMs: DEFAULT_DURATION,
        isPlaceholder: true,
      };
    });
  }

  preload(gloss: string[]): void {
    if (typeof window === 'undefined') return;
    for (const g of gloss) {
      const entry = this.manifest[g];
      const src = entry ? entry.src : `/signs/${encodeURIComponent(g)}.webm`;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'video';
      link.href = src;
      document.head.appendChild(link);
    }
  }
}

export const signAssetService = new AppSignAssetService();
