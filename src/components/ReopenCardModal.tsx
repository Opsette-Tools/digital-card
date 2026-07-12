import React, { useState } from 'react';
import { Modal, Input, Typography, App as AntApp } from 'antd';
import { CardData } from '@/types/card';
import { fromKitJson } from '@/lib/brandKit';

const { Text, Paragraph } = Typography;

interface ReopenCardModalProps {
  open: boolean;
  onClose: () => void;
  onReopen: (card: CardData) => void;
}

/**
 * Paste a saved Brand Board card blob back in to reopen / revise it — the
 * "import own shape" half of the interop triple duty. Same pattern as Palette
 * Studio's "Reopen a saved palette". Strict on the envelope (junk is rejected
 * with a friendly message), never throws.
 */
const ReopenCardModal: React.FC<ReopenCardModalProps> = ({ open, onClose, onReopen }) => {
  const [text, setText] = useState('');
  const { message } = AntApp.useApp();

  const handleReopen = () => {
    const card = fromKitJson(text);
    if (!card) {
      message.error("That doesn't look like a saved card. Paste the card blob copied from Brand Board.");
      return;
    }
    onReopen(card);
    message.success('Card reopened');
    setText('');
    onClose();
  };

  const handleCancel = () => {
    setText('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleReopen}
      okText="Reopen card"
      okButtonProps={{ disabled: !text.trim() }}
      title="Reopen a saved card"
      centered
      destroyOnHidden
      width={440}
    >
      <Paragraph type="secondary" style={{ fontSize: 13, marginTop: 4 }}>
        Paste the card blob you exported to Brand Board to load it back here and
        make edits.
      </Paragraph>
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='{"type":"card","v":1,"source":"opsette",…}'
        autoSize={{ minRows: 5, maxRows: 10 }}
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />
      <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 8 }}>
        This restores every field — name, style, colors, photo, links — exactly
        as it was.
      </Text>
    </Modal>
  );
};

export default ReopenCardModal;
