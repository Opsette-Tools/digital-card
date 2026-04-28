import React, { useRef, useState } from 'react';
import { Button, Input, Upload, theme as antdTheme } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { CardData, demoCard, emptyCard } from '@/types/card';

interface CardFormProps {
  card: CardData;
  onChange: (card: CardData) => void;
}

const CardForm: React.FC<CardFormProps> = ({ card, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showSocials, setShowSocials] = useState(false);
  const { token } = antdTheme.useToken();
  const isEmpty = !card.fullName && !card.email && !card.phone;
  const hasSocials = !!(card.linkedin || card.tiktok || card.twitter || card.youtube || card.whatsapp || card.threads);

  const set = (key: keyof CardData, value: string) => onChange({ ...card, [key]: value });

  const uploadProps: UploadProps = {
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = () => set('photo', reader.result as string);
      reader.readAsDataURL(file);
      return false;
    },
  };

  const muted = token.colorTextSecondary;
  const labelStyle: React.CSSProperties = { fontSize: 12, color: muted, display: 'block', marginBottom: 4 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isEmpty ? (
          <Button size="small" shape="round" onClick={() => onChange({ ...demoCard })}>
            Load example
          </Button>
        ) : (
          <Button
            size="small"
            shape="round"
            onClick={() => {
              onChange({ ...emptyCard });
              if (fileRef.current) fileRef.current.value = '';
            }}
          >
            Reset
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <span style={labelStyle}>Full Name</span>
          <Input
            value={card.fullName}
            onChange={e => set('fullName', e.target.value)}
            placeholder="Jordan Rivera"
            size="large"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <span style={labelStyle}>Title</span>
            <Input
              value={card.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Lead Stylist"
              size="large"
            />
          </div>
          <div>
            <span style={labelStyle}>Business</span>
            <Input
              value={card.businessName}
              onChange={e => set('businessName', e.target.value)}
              placeholder="Glow Studio"
              size="large"
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <span style={labelStyle}>Phone</span>
            <Input
              type="tel"
              value={card.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+1 555 234 5678"
              size="large"
            />
          </div>
          <div>
            <span style={labelStyle}>Email</span>
            <Input
              type="email"
              value={card.email}
              onChange={e => set('email', e.target.value)}
              placeholder="you@email.com"
              size="large"
            />
          </div>
        </div>
        <div>
          <span style={labelStyle}>Website</span>
          <Input
            type="url"
            value={card.website}
            onChange={e => set('website', e.target.value)}
            placeholder="https://yoursite.com"
            size="large"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <span style={labelStyle}>Instagram</span>
            <Input
              value={card.instagram}
              onChange={e => set('instagram', e.target.value)}
              placeholder="@handle"
              size="large"
            />
          </div>
          <div>
            <span style={labelStyle}>Facebook</span>
            <Input
              type="url"
              value={card.facebook}
              onChange={e => set('facebook', e.target.value)}
              placeholder="facebook.com/page"
              size="large"
            />
          </div>
        </div>

        <div>
          <Button
            type="link"
            size="small"
            icon={showSocials ? <MinusOutlined /> : <PlusOutlined />}
            onClick={() => setShowSocials(!showSocials)}
            style={{ paddingLeft: 0, color: muted }}
          >
            {showSocials ? 'fewer fields' : 'more socials'}
            {hasSocials && !showSocials && (
              <span style={{ marginLeft: 4, opacity: 0.5 }}>*</span>
            )}
          </Button>
        </div>

        {showSocials && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              paddingLeft: 12,
              borderLeft: `2px solid ${token.colorBorderSecondary}`,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <span style={labelStyle}>LinkedIn</span>
                <Input
                  type="url"
                  value={card.linkedin}
                  onChange={e => set('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/you"
                  size="large"
                />
              </div>
              <div>
                <span style={labelStyle}>TikTok</span>
                <Input
                  value={card.tiktok}
                  onChange={e => set('tiktok', e.target.value)}
                  placeholder="@handle"
                  size="large"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <span style={labelStyle}>X / Twitter</span>
                <Input
                  value={card.twitter}
                  onChange={e => set('twitter', e.target.value)}
                  placeholder="@handle"
                  size="large"
                />
              </div>
              <div>
                <span style={labelStyle}>YouTube</span>
                <Input
                  type="url"
                  value={card.youtube}
                  onChange={e => set('youtube', e.target.value)}
                  placeholder="youtube.com/@ch"
                  size="large"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <span style={labelStyle}>WhatsApp</span>
                <Input
                  type="tel"
                  value={card.whatsapp}
                  onChange={e => set('whatsapp', e.target.value)}
                  placeholder="+1 555 234 5678"
                  size="large"
                />
              </div>
              <div>
                <span style={labelStyle}>Threads</span>
                <Input
                  value={card.threads}
                  onChange={e => set('threads', e.target.value)}
                  placeholder="@handle"
                  size="large"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <span style={labelStyle}>Address</span>
          <Input.TextArea
            value={card.address}
            onChange={e => set('address', e.target.value)}
            placeholder="123 Main St, City, State"
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
        </div>

        <div>
          <span style={labelStyle}>Photo / Logo</span>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} size="large" block>
              {card.photo ? 'Change image' : 'Upload image'}
            </Button>
          </Upload>
          {card.photo && (
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => set('photo', '')}
              style={{ marginTop: 4, color: muted, paddingLeft: 0 }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardForm;
