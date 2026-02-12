import React from 'react';
import type { ComponentNode } from '@mpstack/schema';

export interface MpTextProps {
  content: string;
  fontSize?: string;
  color?: string;
  bold?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  maxLines?: number;
}

export const MpText: React.FC<MpTextProps> = ({
  content,
  fontSize = '14px',
  color = '#333',
  bold = false,
  textAlign = 'left',
  maxLines,
}) => {
  const style: React.CSSProperties = {
    fontSize, color,
    fontWeight: bold ? 'bold' : 'normal',
    textAlign,
    ...(maxLines ? {
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical' as const,
      overflow: 'hidden',
    } : {}),
  };
  return <div style={style}>{content}</div>;
};

export const MpTextMeta: ComponentNode<MpTextProps> = {
  id: '', type: 'MpText',
  props: { content: '请输入文本', fontSize: '14px', color: '#333333', bold: false, textAlign: 'left' },
};
