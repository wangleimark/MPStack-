import React from 'react';
import type { ComponentNode } from '@mpstack/schema';

export interface MpContainerProps {
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
}

export const MpContainer: React.FC<React.PropsWithChildren<MpContainerProps>> = ({
  flexDirection = 'column', justifyContent = 'flex-start',
  alignItems = 'stretch', gap = '0', padding = '0',
  backgroundColor = 'transparent', children,
}) => {
  const style: React.CSSProperties = {
    display: 'flex', flexDirection, justifyContent,
    alignItems, gap, padding, backgroundColor, minHeight: '40px',
  };
  return <div style={style}>{children}</div>;
};

export const MpContainerMeta: ComponentNode<MpContainerProps> = {
  id: '', type: 'MpContainer',
  props: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', gap: '8px', padding: '12px', backgroundColor: 'transparent' },
  children: [],
};
