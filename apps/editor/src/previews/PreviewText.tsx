/**
 * PreviewText —— 编辑器画布中的文本预览组件
 * 纯 HTML/CSS 实现，不依赖 Taro
 */
import React from 'react';

interface Props {
  content?: string;
  fontSize?: string;
  color?: string;
  bold?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  maxLines?: number;
}

export const PreviewText: React.FC<Props> = ({
  content = '请输入文本',
  fontSize = '14px',
  color = '#333',
  bold = false,
  textAlign = 'left',
  maxLines,
}) => {
  const style: React.CSSProperties = {
    fontSize,
    color,
    fontWeight: bold ? 'bold' : 'normal',
    textAlign,
    padding: '4px 0',
    lineHeight: 1.6,
    wordBreak: 'break-word',
    ...(maxLines && maxLines > 0
      ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }
      : {}),
  };

  return <div style={style}>{content}</div>;
};
