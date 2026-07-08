import React, { useState } from 'react';
import { Button, App as AntApp, theme as antdTheme } from 'antd';
import { IdcardOutlined, QrcodeOutlined, LinkOutlined } from '@ant-design/icons';
import { CardData } from '@/types/card';
import CardPreview from './CardPreview';
import QrModal from './QrModal';
import AppLogo from './AppLogo';
import { downloadVCard } from '@/lib/vcard';

interface SharedCardViewProps {
  card: CardData;
}

/** Join a factual list naturally: ["a"] → "a", ["a","b"] → "a & b",
 *  ["a","b","c"] → "a, b & c". */
function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} & ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} & ${items[items.length - 1]}`;
}

const SharedCardView: React.FC<SharedCardViewProps> = ({ card }) => {
  const [qrOpen, setQrOpen] = useState(false);
  const { message } = AntApp.useApp();
  const { token } = antdTheme.useToken();

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    message.success('Link copied');
  };

  // Honest one-liner under Save Contact — names only the fields this card
  // actually carries, so the browser-opened moment reads as purposeful.
  const savedFields = [
    card.fullName && 'name',
    card.phone && 'number',
    card.email && 'email',
  ].filter(Boolean) as string[];
  const reassurance =
    savedFields.length > 0
      ? `Adds their ${formatList(savedFields)} to your phone`
      : 'Adds this contact to your phone';

  return (
    <div style={{ minHeight: '100dvh', background: token.colorBgLayout }}>
      <header
        style={{
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
          <AppLogo size={24} />
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', color: token.colorText }}>Digital Card</span>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        <div className="animate-scale-in">
          <CardPreview card={card} />
        </div>

        <div
          style={{
            marginTop: 16,
            background: token.colorBgContainer,
            borderRadius: 12,
            padding: 16,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
          }}
        >
          <Button
            type="primary"
            size="large"
            icon={<IdcardOutlined />}
            onClick={() => { downloadVCard(card); message.success('Contact saved'); }}
            block
            style={{ height: 52, fontSize: 16, fontWeight: 600 }}
          >
            Save Contact
          </Button>
          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: token.colorTextTertiary,
              margin: '8px 0 0',
            }}
          >
            {reassurance}
          </p>

          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 14,
              paddingTop: 14,
              borderTop: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Button
              type="text"
              icon={<QrcodeOutlined />}
              onClick={() => setQrOpen(true)}
              style={{ flex: 1, color: token.colorTextSecondary }}
            >
              Show QR
            </Button>
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={copyLink}
              style={{ flex: 1, color: token.colorTextSecondary }}
            >
              Copy link
            </Button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 10, color: token.colorTextTertiary, marginTop: 16 }}>
          Made with Digital Card
        </p>
      </main>

      <QrModal card={card} open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
};

export default SharedCardView;
