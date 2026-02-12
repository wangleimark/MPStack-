/**
 * PreviewImage —— 编辑器画布中的图片预览组件
 * 纯 HTML/CSS 实现，不依赖 Taro
 */
import React from 'react';

interface Props {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  mode?: 'cover' | 'contain' | 'fill' | 'none';
}

export const PreviewImage: React.FC<Props> = ({
  src = '',
  alt = '图片',
  width = '100%',
  height = '200px',
  borderRadius = '0',
  mode = 'cover',
}) => {
  if (!src) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#bbb',
          fontSize: 13,
          border: '1px dashed #d9d9d9',
        }}
      >
        🖼️ 请配置图片地址
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height,
        borderRadius,
        objectFit: mode === 'none' ? undefined : mode,
        display: 'block',
      }}
    />
  );
};
