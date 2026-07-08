import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Typography, theme as antdTheme } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import QRCode from 'qrcode';
import { CardData } from '@/types/card';
import { generateVCard } from '@/lib/vcard';

const { Text } = Typography;

interface QrModalProps {
  card: CardData;
  open: boolean;
  onClose: () => void;
}

const QrModal: React.FC<QrModalProps> = ({ card, open, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const accent = card.accentColor || '#2D3748';
  const generatedFor = useRef('');
  const { token } = antdTheme.useToken();

  useEffect(() => {
    if (!open || !card.fullName) return;

    // The QR carries a vCard, NOT a link. A phone camera reads a vCard QR
    // natively — it offers "Add Contact" straight away with every field
    // (name, phone, email, website, socials), no web page in between. It's
    // also far shorter than the full-card share URL, so the code is sparse
    // and scans reliably. (The branded landing page still lives behind
    // Copy Link / the share URL for when you want to send the pretty view.)
    const vcard = generateVCard(card);
    if (generatedFor.current === vcard && qrDataUrl) return;

    generatedFor.current = vcard;
    const hex = accent.replace('#', '').padEnd(6, '0').slice(0, 6);
    QRCode.toDataURL(vcard, {
      width: 512,
      margin: 2,
      color: { dark: `#${hex}`, light: '#ffffff' },
      // 'M' recovers from ~15% damage — the right call for a code scanned off
      // a glossy phone/monitor screen. 'L' (the old value) was too fragile.
      errorCorrectionLevel: 'M',
    }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
  }, [open, card, accent, qrDataUrl]);

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${card.fullName || 'card'}-qr.png`;
    a.click();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={320}
      centered
      destroyOnHidden
      styles={{ body: { padding: '8px 4px 4px' } }}
    >
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <Text strong style={{ fontSize: 14 }}>{card.fullName || 'Your Card'}</Text>
        {card.title && (
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>{card.title}</Text>
          </div>
        )}
      </div>

      {qrDataUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ borderRadius: 8, padding: 10, border: `1px solid ${accent}25` }}>
            <img src={qrDataUrl} alt="QR Code" style={{ width: 180, height: 180, display: 'block' }} />
          </div>
          <Text type="secondary" style={{ fontSize: 10 }}>Scan to save contact</Text>
          <Button icon={<DownloadOutlined />} onClick={downloadQr} block size="middle">
            Download QR
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: token.colorTextTertiary, fontSize: 12 }}>
          {card.fullName ? 'Generating...' : 'Enter a name first'}
        </div>
      )}
    </Modal>
  );
};

export default QrModal;
