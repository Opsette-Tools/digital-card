import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { CardData } from '@/types/card';
import { getShareableUrl } from '@/lib/share';

interface QrModalProps {
  card: CardData;
  open: boolean;
  onClose: () => void;
}

const QrModal: React.FC<QrModalProps> = ({ card, open, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const accent = card.accentColor || '#2D3748';
  const generatedFor = useRef('');

  useEffect(() => {
    if (!open || !card.fullName) return;

    const url = getShareableUrl(card);
    // Skip if already generated for this exact URL
    if (generatedFor.current === url && qrDataUrl) return;

    generatedFor.current = url;
    const hex = accent.replace('#', '').padEnd(6, '0').slice(0, 6);
    QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: `#${hex}`, light: '#ffffff' },
      errorCorrectionLevel: 'L',
    }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
  }, [open]);

  if (!open) return null;

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${card.fullName || 'card'}-qr.png`;
    a.click();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-[300px] rounded-xl bg-white p-5 animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 16px 48px -12px rgba(0,0,0,0.25)' }}
      >
        <button onClick={onClose} className="absolute top-2.5 right-2.5 p-1 rounded-md hover:bg-gray-100 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7m0-7l-7 7" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>

        <div className="text-center mb-3">
          <p className="text-sm font-semibold text-gray-900">{card.fullName || 'Your Card'}</p>
          {card.title && <p className="text-[11px] text-gray-400 mt-0.5">{card.title}</p>}
        </div>

        {qrDataUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-lg p-2.5" style={{ border: `1px solid ${accent}15` }}>
              <img src={qrDataUrl} alt="QR Code" className="w-44 h-44" />
            </div>
            <p className="text-[10px] text-gray-400">Scan to view card</p>
            <button
              onClick={downloadQr}
              className="w-full h-9 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              Download QR
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-44 text-gray-400 text-xs">
            {card.fullName ? 'Generating...' : 'Enter a name first'}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default QrModal;
