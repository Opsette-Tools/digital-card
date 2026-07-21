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
  AppstoreAddOutlined,
} from '@ant-design/icons';
import QRCode from 'qrcode';
import { CardData, isHandoutStyle } from '@/types/card';
import { getShareableUrl } from '@/lib/share';
import { downloadVCard } from '@/lib/vcard';
import { getDimensions } from '@/lib/print';
import { exportWebImage, exportPrintImage, renderWebImage } from '@/lib/export';
import { toKitJson } from '@/lib/brandKit';
import QrModal from './QrModal';
import PrintCard from './PrintCard';
import ReopenCardModal from './ReopenCardModal';
import { ShareAppModal } from '@/components/opsette-share';

interface ActionBarProps {
  card: CardData;
  cardRef: React.RefObject<HTMLDivElement>;
  onSave: () => void;
  onReopen: (card: CardData) => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ card, cardRef, onSave, onReopen }) => {
  const [qrOpen, setQrOpen] = useState(false);
  const [shareAppOpen, setShareAppOpen] = useState(false);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [captureContainer, setCaptureContainer] = useState<HTMLDivElement | null>(null);
  const printCardRef = useRef<HTMLDivElement>(null);
  const { message } = AntApp.useApp();
  const dims = getDimensions(card.cardSize);
  const isHandout = isHandoutStyle(card.cardStyle);
  // Print-quality export is meaningful only for the handout now (it has a defined
  // trim size). Contact cards are share/paste-only (web PNG). Business cards — the
  // other print target — were cut in the shrink-to-real pass (§1a).
  const printableForExport = isHandout;

  const requireName = (): boolean => {
    if (!card.fullName) {
      message.error('Enter a name first');
      return false;
    }
    return true;
  };

  const requireHeadline = (): boolean => {
    if (!card.headline) {
      message.error('Enter a headline first');
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
      await exportWebImage(cardRef.current, `${card.fullName || card.headline || 'card'}.png`);
      message.success('Image saved');
    } catch {
      message.error('Export failed');
    }
  };

  const downloadImagePrint = async () => {
    if (!printableForExport) {
      message.info('Print-quality export is only available for the handout');
      return;
    }
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-99999px';
    container.style.top = '0';
    document.body.appendChild(container);
    setCaptureContainer(container);
    try {
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      const node = printCardRef.current;
      if (!node) throw new Error('print card not mounted');
      await exportPrintImage(node, `${card.fullName || card.headline || 'card'}-print.png`);
      message.success('Print-quality image saved');
    } catch {
      message.error('Export failed');
    } finally {
      setCaptureContainer(null);
      if (container.parentNode) container.parentNode.removeChild(container);
    }
  };

  const handleVCard = async () => {
    if (!requireName()) return;
    await downloadVCard(card);
    message.success('Contact downloaded');
  };

  // Bake the rendered card PNG + the .vcf into one blob and copy it to the
  // clipboard. Brand Board stores the image (→ File Builder reconstructs
  // digital_card.png) and the .vcf (the "add to contacts" half), so the card
  // finally flows into the kit with no manual download. Reopen reads data.card.
  const exportToBrandBoard = async () => {
    // The handout is a separate content model (headline/blurb/CTA), spun into
    // its own tool later — it does NOT belong in the kit's card blob (§1c). Only
    // contact cards flow to Brand Board.
    if (isHandout) {
      message.info('The handout isn’t part of the Brand Kit — switch to a contact card to export.');
      return;
    }
    if (!requireName()) return;
    setExporting(true);
    try {
      // Best-effort image capture — a failed capture still yields a valid,
      // reopen-able blob (with the vcard), it just won't carry the visual.
      let image: string | undefined;
      if (cardRef.current) {
        try {
          image = await renderWebImage(cardRef.current);
        } catch {
          image = undefined;
        }
      }
      const payload = await toKitJson(card, image);
      await navigator.clipboard.writeText(JSON.stringify(payload));
      message.success(
        image
          ? 'Copied to clipboard — paste into Brand Board (card + contact file)'
          : 'Copied — card preview couldn’t be captured, but the contact file is included',
      );
    } catch {
      message.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleSave = () => {
    if (isHandout) {
      if (!requireHeadline()) return;
    } else {
      if (!requireName()) return;
    }
    onSave();
    message.success('Saved');
  };

  const handleQr = () => {
    if (!requireName()) return;
    setQrOpen(true);
  };

  const downloadQrOnly = async () => {
    const target = card.ctaUrl || 'https://opsette.io';
    try {
      const color = card.qrColor || card.accentColor || '#2D3748';
      const hex = color.replace('#', '').padEnd(6, '0').slice(0, 6);
      const dataUrl = await QRCode.toDataURL(target, {
        width: 1024,
        margin: 2,
        color: { dark: `#${hex}`, light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${card.headline ? card.headline.replace(/\s+/g, '-').toLowerCase() : 'handout'}-qr.png`;
      a.click();
      message.success('QR saved');
    } catch {
      message.error('QR export failed');
    }
  };

  const exportMenu: MenuProps = {
    items: [
      { key: 'web', icon: <DownloadOutlined />, label: 'Image (web)' },
      {
        key: 'print',
        icon: <DownloadOutlined />,
        label: 'Image (print quality)',
        disabled: !printableForExport,
      },
      ...(isHandout
        ? [
            { type: 'divider' as const },
            { key: 'qr', icon: <QrcodeOutlined />, label: 'Download QR (1024px)' },
          ]
        : []),
    ],
    onClick: ({ key }) => {
      if (key === 'web') downloadImageWeb();
      else if (key === 'print') downloadImagePrint();
      else if (key === 'qr') downloadQrOnly();
    },
  };

  return (
    <>
      {isHandout ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Dropdown menu={exportMenu} trigger={['click']}>
            <Button icon={<DownloadOutlined />} style={{ height: 40 }}>
              Export
            </Button>
          </Dropdown>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={{ height: 40 }}
          >
            Save
          </Button>
        </div>
      ) : (
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
      )}

      {!isHandout && (
        <Button
          icon={<AppstoreAddOutlined />}
          onClick={exportToBrandBoard}
          loading={exporting}
          block
          style={{ height: 40, marginTop: 8 }}
        >
          Export to Brand Board
        </Button>
      )}

      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <Button type="link" size="small" onClick={() => setReopenOpen(true)} style={{ fontSize: 12 }}>
          Reopen a saved card
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 2 }}>
        <Button type="link" size="small" onClick={() => setShareAppOpen(true)} style={{ fontSize: 12 }}>
          Or share the Digital Card app itself →
        </Button>
      </div>

      <QrModal card={card} open={qrOpen} onClose={() => setQrOpen(false)} />
      <ShareAppModal open={shareAppOpen} onClose={() => setShareAppOpen(false)} />
      <ReopenCardModal open={reopenOpen} onClose={() => setReopenOpen(false)} onReopen={onReopen} />

      {captureContainer && createPortal(
        <PrintCard card={card} dimensions={dims} outerRef={printCardRef} />,
        captureContainer,
      )}
    </>
  );
};

export default ActionBar;
