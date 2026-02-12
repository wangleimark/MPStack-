/**
 * PreviewContainer —— 编辑器画布中的容器预览组件
 * 纯 HTML/CSS 实现，不依赖 Taro
 */
import React from 'react';

interface Props {
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const PreviewContainer: React.FC<Props> = ({
  flexDirection = 'column',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  gap = '8px',
  padding = '12px',
  backgroundColor = 'transparent',
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection,
        justifyContent,
        alignItems,
        gap,
        padding,
        backgroundColor,
        minHeight: 40,
        border: '1px dashed #e8e8e8',
        borderRadius: 4,
      }}
    >
      {children || (
        <div
          style={{
            color: '#bbb',
            fontSize: 12,
            textAlign: 'center',
            padding: 16,
          }}
        >
          拖入子组件
        </div>
      )}
    </div>
  );
};
