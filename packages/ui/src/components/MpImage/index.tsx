import React from 'react';
import type { ComponentNode } from '@mpstack/schema';

export interface MpImageProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  mode?: 'cover' | 'contain' | 'fill' | 'none';
}

export const MpImage: React.FC<MpImageProps> = ({
  src, alt = '', width = '100%', height = 'auto',
  borderRadius = '0', mode = 'cover',
}) => {
  const style: React.CSSProperties = {
    width, height, borderRadius,
    objectFit: mode === 'none' ? undefined : mode,
    display: 'block',
  };
  return <img src={src} alt={alt} style={style} />;
};

export const MpImageMeta: ComponentNode<MpImageProps> = {
  id: '', type: 'MpImage',
  props: { src: 'https://via.placeholder.com/375x200', alt: '图片', width: '100%', height: '200px', borderRadius: '0', mode: 'cover' },
};
