import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, theme as antdTheme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AppLogo from '@/components/AppLogo';
import { OpsetteFooterLogo } from '@/components/opsette-share';

const { Title, Paragraph, Text } = Typography;

const About: React.FC = () => {
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
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: token.colorText }}>Digital Card</span>
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px max(2rem, env(safe-area-inset-bottom))' }}>
        <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginBottom: 16, paddingLeft: 0 }}>
          Back
        </Button>

        <Title level={3} style={{ marginTop: 0, marginBottom: 16 }}>How to Use</Title>

        <Typography>
          <Title level={5} style={{ marginBottom: 6 }}>1. Choose a style</Title>
          <Paragraph>
            Pick a <Text strong>Contact Card</Text> layout (Profile, Split, or Stacked) — a clean identity graphic you can share as a link or drop into a post, slide, or page. Or switch to the <Text strong>Marketing Handout</Text> for a printable QR flyer.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>2. Fill in your details</Title>
          <Paragraph>
            Enter your name, title, business, and contact info. Add social profiles under "Social." Upload a photo or logo if you'd like.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>3. Customize</Title>
          <Paragraph>
            Pick an accent color from the palette or use the custom picker. Toggle initials on or off with the switch.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>4. Save your card</Title>
          <Paragraph>
            Tap <Text strong>Save Card</Text> to store your card locally. It'll be here next time you open the app — no account needed.
          </Paragraph>

          <Title level={5} style={{ marginBottom: 6 }}>5. Share it</Title>
          <Paragraph>You have several ways to share:</Paragraph>
          <ul style={{ paddingLeft: 18, marginTop: 0, marginBottom: 16 }}>
            <li><Text type="secondary">Link</Text> — copies a shareable URL that shows your card in the browser</li>
            <li><Text type="secondary">Image</Text> — downloads a PNG of your card for social media or printing</li>
            <li><Text type="secondary">QR</Text> — a scannable code that saves your contact straight to a phone</li>
            <li><Text type="secondary">vCard</Text> — downloads a .vcf file that adds your info (including photo) directly to someone's contacts</li>
          </ul>

          <Title level={5} style={{ marginBottom: 6 }}>Your data stays local</Title>
          <Paragraph>
            Everything is stored in your browser. Nothing is sent to any server. Shared links encode your card data directly in the URL — no backend required.
          </Paragraph>

        </Typography>

        <OpsetteFooterLogo />
      </main>
    </div>
  );
};

export default About;
