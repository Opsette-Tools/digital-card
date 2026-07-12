import { toPng } from 'html-to-image';

const triggerDownload = (dataUrl: string, filename: string) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
};

// html-to-image screenshots whatever is rendered at call time; if a Google
// Font hasn't finished swapping in, the export uses the fallback. Wait for
// document.fonts.ready before capturing so chosen fonts always render.
const ensureFontsReady = async () => {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try { await document.fonts.ready; } catch { /* fall through */ }
  }
};

/**
 * Web-quality PNG of an on-screen card, returned as a data URL (no download).
 * Same capture settings as `exportWebImage` so the baked kit image and the
 * downloaded image are identical. Used to bake the card PNG into the Brand Kit
 * blob.
 */
export const renderWebImage = async (node: HTMLElement): Promise<string> => {
  await ensureFontsReady();
  return toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: undefined });
};

/** Web-quality PNG of an on-screen card. Transparent outside rounded corners. */
export const exportWebImage = async (node: HTMLElement, filename: string) => {
  const dataUrl = await renderWebImage(node);
  triggerDownload(dataUrl, filename);
};

/**
 * Print-quality PNG. Caller mounts `node` at trim inch dimensions; we capture
 * at 300/96 ≈ 3.125x so each CSS inch becomes 300 px. backgroundColor stays
 * undefined so rounded corners export with transparency.
 */
export const exportPrintImage = async (node: HTMLElement, filename: string) => {
  await ensureFontsReady();
  const pixelRatio = 300 / 96;
  const dataUrl = await toPng(node, { pixelRatio, cacheBust: true, backgroundColor: undefined });
  triggerDownload(dataUrl, filename);
};
