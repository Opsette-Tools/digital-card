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

const SharedCardView: React.FC<SharedCardViewProps> = ({ card }) => {
  const [qrOpen, setQrOpen] = useState(false);
  const { message } = AntApp.useApp();
  const { token } = antdTheme.useToken();

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    message.success('Link copied');
  };

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
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', color: token.colorText }}>CardCraft</span>
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
            padding: 12,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <Button
              type="primary"
              icon={<IdcardOutlined />}
              onClick={() => { downloadVCard(card); message.success('Contact saved'); }}
              style={{ height: 40, gridColumn: 'span 2' }}
            >
              Save Contact
            </Button>
            <Button icon={<QrcodeOutlined />} onClick={() => setQrOpen(true)} style={{ height: 40 }}>
              QR
            </Button>
            <Button icon={<LinkOutlined />} onClick={copyLink} style={{ height: 40, gridColumn: 'span 3' }}>
              Copy Link
            </Button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 10, color: token.colorTextTertiary, marginTop: 16 }}>
          Made with CardCraft
        </p>
      </main>

      <QrModal card={card} open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
};

export default SharedCardView;
