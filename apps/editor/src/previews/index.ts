/**
 * 编辑器预览组件注册表
 *
 * 将 ComponentNode.type 映射到编辑器端的纯 HTML/CSS 预览组件。
 * 这些组件不依赖 Taro 运行时，仅用于画布的可视化预览。
 *
 * 架构说明:
 *   ┌──────────────┐        ┌──────────────┐
 *   │  @mpstack/ui │        │ editor/      │
 *   │  (Taro 组件)  │        │  previews/   │
 *   │              │        │ (纯 React)    │
 *   │  MpText ─────┼───→ PreviewText    │
 *   │  MpImage ────┼───→ PreviewImage   │
 *   │  MpContainer ┼───→ PreviewContainer│
 *   │  MpBanner ───┼───→ PreviewBanner  │
 *   └──────────────┘        └──────────────┘
 *
 * 小程序端使用 @mpstack/ui 的真实 Taro 组件
 * 编辑器端使用 previews/ 的轻量预览组件
 */
import type React from 'react';
import { PreviewText } from './PreviewText';
import { PreviewImage } from './PreviewImage';
import { PreviewContainer } from './PreviewContainer';
import { PreviewBanner } from './PreviewBanner';

/** 编辑器预览组件映射 */
const previewMap: Record<string, React.ComponentType<any>> = {
  MpText: PreviewText,
  MpImage: PreviewImage,
  MpContainer: PreviewContainer,
  MpBanner: PreviewBanner,
};

/**
 * 根据组件类型获取编辑器预览组件
 */
export function getPreviewComponent(type: string): React.ComponentType<any> | undefined {
  return previewMap[type];
}

/**
 * 注册新的预览组件
 */
export function registerPreview(type: string, component: React.ComponentType<any>): void {
  previewMap[type] = component;
}

export { PreviewText, PreviewImage, PreviewContainer, PreviewBanner };
