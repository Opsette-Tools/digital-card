import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, theme as antdTheme } from 'antd';
import AppLogo from '@/components/AppLogo';

const NotFound: React.FC = () => {
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
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '64px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 48, fontWeight: 300, color: token.colorTextQuaternary, marginBottom: 12 }}>404</p>
        <p style={{ fontSize: 14, color: token.colorTextSecondary, marginBottom: 24 }}>This page doesn't exist.</p>
        <Button type="primary" onClick={() => navigate('/')}>
          Go home
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
