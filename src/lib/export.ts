import { toPng } from 'html-to-image';

const triggerDownload = (dataUrl: string, filename: string) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
};

/** Web-quality PNG of an on-screen card. Transparent outside rounded corners. */
export const exportWebImage = async (node: HTMLElement, filename: string) => {
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: undefined });
  triggerDownload(dataUrl, filename);
};

/**
 * Print-quality PNG. Caller mounts `node` at trim inch dimensions; we capture
 * at 300/96 ≈ 3.125x so each CSS inch becomes 300 px. backgroundColor stays
 * undefined so rounded corners export with transparency.
 */
export const exportPrintImage = async (node: HTMLElement, filename: string) => {
  const pixelRatio = 300 / 96;
  const dataUrl = await toPng(node, { pixelRatio, cacheBust: true, backgroundColor: undefined });
  triggerDownload(dataUrl, filename);
};
