import React, { useState } from 'react';
import { Button, App as AntApp } from 'antd';
import {
  LinkOutlined,
  DownloadOutlined,
  QrcodeOutlined,
  IdcardOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { CardData } from '@/types/card';
import { getShareableUrl } from '@/lib/share';
import { downloadVCard } from '@/lib/vcard';
import { toPng } from 'html-to-image';
import QrModal from './QrModal';

interface ActionBarProps {
  card: CardData;
  cardRef: React.RefObject<HTMLDivElement>;
  onSave: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ card, cardRef, onSave }) => {
  const [qrOpen, setQrOpen] = useState(false);
  const { message } = AntApp.useApp();

  const copyLink = async () => {
    if (!card.fullName) { message.error('Enter a name first'); return; }
    const url = getShareableUrl(card);
    await navigator.clipboard.writeText(url);
    message.success('Link copied');
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${card.fullName || 'card'}.png`;
      a.click();
      message.success('Image saved');
    } catch {
      message.error('Export failed');
    }
  };

  const handleVCard = () => {
    if (!card.fullName) { message.error('Enter a name first'); return; }
    downloadVCard(card);
    message.success('Contact downloaded');
  };

  const handleSave = () => {
    if (!card.fullName) { message.error('Enter a name first'); return; }
    onSave();
    message.success('Saved');
  };

  const handleQr = () => {
    if (!card.fullName) { message.error('Enter a name first'); return; }
    setQrOpen(true);
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <Button icon={<LinkOutlined />} onClick={copyLink} style={{ height: 40 }}>
          Link
        </Button>
        <Button icon={<DownloadOutlined />} onClick={downloadImage} style={{ height: 40 }}>
          Image
        </Button>
        <Button icon={<QrcodeOutlined />} onClick={handleQr} style={{ height: 40 }}>
          QR
        </Button>
        <Button icon={<IdcardOutlined />} onClick={handleVCard} style={{ height: 40 }}>
          vCard
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          style={{ height: 40, gridColumn: 'span 2' }}
        >
          Save Card
        </Button>
      </div>
      <QrModal card={card} open={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
};

export default ActionBar;
