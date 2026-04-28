import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, theme as antdTheme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AppLogo from '@/components/AppLogo';
import { ShareAppButton, OpsetteFooterLogo } from '@/components/opsette-share';

const { Title, Paragraph, Text } = Typography;

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const { token } = antdTheme.useToken();

  return (
    <div style={{ minHeight: '100dvh', background: token.colorBgLayout }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <AppLogo size={28} />
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: token.colorText }}>CardCraft</span>
          </button>
          <div style={{ marginLeft: 'auto' }}>
            <ShareAppButton />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px max(2rem, env(safe-area-inset-bottom))' }}>
        <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginBottom: 16, paddingLeft: 0 }}>
          Back
        </Button>

        <Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>Privacy Policy</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>Last updated: April 13, 2026</Text>

        <Typography style={{ marginTop: 24 }}>
          <Title level={5} style={{ marginBottom: 6 }}>No data collection</Title>
          <Paragraph>
            CardCraft does not collect, transmit, or store any personal information on external servers. All card data you enter stays entirely on your device in your browser's local storage.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>Local storage only</Title>
          <Paragraph>
            Your card information is saved to your browser's localStorage so it persists between sessions. This data never leaves your device. Clearing your browser data will remove it.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>Sharing</Title>
          <Paragraph>
            When you share a card via link, the card data (excluding photos) is encoded directly in the URL. No server is involved — the recipient's browser decodes the data from the URL itself. Photos are included in vCard (.vcf) file exports but are not transmitted to any server.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>No cookies or tracking</Title>
          <Paragraph>
            CardCraft does not use cookies, analytics, or any third-party tracking services. There are no ads and no account creation required.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>No account required</Title>
          <Paragraph>
            You do not need to create an account or provide any credentials to use CardCraft. The app works entirely offline after the initial page load.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>Contact</Title>
          <Paragraph>
            If you have questions about this privacy policy, you can reach out via the project's GitHub repository.
          </Paragraph>
        </Typography>

        <OpsetteFooterLogo />
      </main>
    </div>
  );
};

export default Privacy;
