import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button, Dropdown, App as AntApp } from 'antd';
import type { MenuProps } from 'antd';
import {
  LinkOutlined,
  DownloadOutlined,
  QrcodeOutlined,
  IdcardOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { CardData, isBusinessStyle } from '@/types/card';
import { getShareableUrl } from '@/lib/share';
import { downloadVCard } from '@/lib/vcard';
import { getDimensions } from '@/lib/print';
import { exportWebImage, exportPrintImage } from '@/lib/export';
import QrModal from './QrModal';
import PrintCard from './PrintCard';

interface ActionBarProps {
  card: CardData;
  cardRef: React.RefObject<HTMLDivElement>;
  onSave: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ card, cardRef, onSave }) => {
  const [qrOpen, setQrOpen] = useState(false);
  const [captureContainer, setCaptureContainer] = useState<HTMLDivElement | null>(null);
  const printCardRef = useRef<HTMLDivElement>(null);
  const { message } = AntApp.useApp();
  const dims = getDimensions(card.cardSize);
  const isBusiness = isBusinessStyle(card.cardStyle);

  const requireName = (): boolean => {
    if (!card.fullName) {
      message.error('Enter a name first');
      return false;
    }
    return true;
  };

  const copyLink = async () => {
    if (!requireName()) return;
    const url = getShareableUrl(card);
    await navigator.clipboard.writeText(url);
    message.success('Link copied');
  };

  const downloadImageWeb = async () => {
    if (!cardRef.current) return;
    try {
      await exportWebImage(cardRef.current, `${card.fullName || 'card'}.png`);
      message.success('Image saved');
    } catch {
      message.error('Export failed');
    }
  };

  const downloadImagePrint = async () => {
    if (!isBusiness) {
      message.info('Print-quality export is only available for business cards');
      return;
    }
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-99999px';
    container.style.top = '0';
    document.body.appendChild(container);
    setCaptureContainer(container);
    try {
      // Wait two animation frames so React commits + layout resolves.
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      const node = printCardRef.current;
      if (!node) throw new Error('print card not mounted');
      await exportPrintImage(node, `${card.fullName || 'card'}-print.png`);
      message.success('Print-quality image saved');
    } catch {
      message.error('Export failed');
    } finally {
      setCaptureContainer(null);
      if (container.parentNode) container.parentNode.removeChild(container);
    }
  };

  const handleVCard = () => {
    if (!requireName()) return;
    downloadVCard(card);
    message.success('Contact downloaded');
  };

  const handleSave = () => {
    if (!requireName()) return;
    onSave();
    message.success('Saved');
  };

  const handleQr = () => {
    if (!requireName()) return;
    setQrOpen(true);
  };

  const exportMenu: MenuProps = {
    items: [
      { key: 'web', icon: <DownloadOutlined />, label: 'Image (web)' },
      {
        key: 'print',
        icon: <DownloadOutlined />,
        label: 'Image (print quality)',
        disabled: !isBusiness,
      },
    ],
    onClick: ({ key }) => {
      if (key === 'web') downloadImageWeb();
      else if (key === 'print') downloadImagePrint();
    },
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <Button icon={<LinkOutlined />} onClick={copyLink} style={{ height: 40 }}>
          Link
        </Button>
        <Dropdown menu={exportMenu} trigger={['click']}>
          <Button icon={<DownloadOutlined />} style={{ height: 40 }}>
            Export
          </Button>
        </Dropdown>
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

      {captureContainer && createPortal(
        <PrintCard card={card} dimensions={dims} outerRef={printCardRef} />,
        captureContainer,
      )}
    </>
  );
};

export default ActionBar;
