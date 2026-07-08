import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, App as AntApp, theme as antdTheme } from 'antd';
import { IdcardOutlined, QrcodeOutlined, LinkOutlined } from '@ant-design/icons';
import { CardData } from '@/types/card';
import CardPreview from './CardPreview';
import QrModal from './QrModal';
import { OpsetteHeader } from '@/components/opsette-header';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { useTheme } from '@/hooks/use-theme';
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
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { token } = antdTheme.useToken();
  const { theme: appTheme } = useTheme();

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
      <OpsetteHeader theme={appTheme} rightExtra={<ThemeToggleButton />} />

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

        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0 4px' }}>
          <Space split={<span style={{ color: token.colorTextQuaternary }}>·</span>} size="small">
            <button
              onClick={() => navigate('/about')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: token.colorTextSecondary, padding: 0 }}
            >
              How to Use
            </button>
            <button
              onClick={() => navigate('/privacy')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: token.colorTextSecondary, padding: 0 }}
            >
              Privacy
            </button>
            <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
              By{' '}
              <a
                href="https://opsette.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                Opsette
              </a>
            </span>
          </Space>
        </footer>
      </main>

      <QrModal card={card} open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
};

export default SharedCardView;
