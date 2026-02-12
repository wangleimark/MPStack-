# MPSTACK- 跨端组件开发指南

> 本文档以 `MpBanner` 轮播图组件为例，说明如何在 `packages/ui` 中开发一个同时适配 **Web 编辑器** 和 **小程序端** 的跨端组件。

---

## 一、架构原理

### 核心思路：一份代码，两端运行

```
packages/ui/src/components/MpBanner/index.tsx
  ├─ import { View, Swiper, Image } from '@tarojs/components'
  │
  ├─ 小程序端 (Taro CLI 编译)
  │     @tarojs/components → 原生模块
  │     <View>  → <view>
  │     <Swiper> → <swiper>
  │     <Image> → <image>
  │
  └─ Web 编辑器 (Vite 构建)
        @tarojs/components → lib/react (H5 兼容版)
        <View>  → <taro-view>   (Web Component)
        <Swiper> → <taro-swiper> (Web Component)
        <Image> → <taro-image>  (Web Component)
```

| 环境 | 构建工具 | `@tarojs/components` 解析路径 | 渲染产物 |
|------|---------|------------------------------|---------|
| 小程序端 | Taro CLI | `@tarojs/components` 原生模块 | `<view>` / `<swiper>` 等原生标签 |
| Web 编辑器 | Vite | `@tarojs/components/lib/react` (H5 版) | `<taro-view>` / `<taro-swiper>` 等 Web Components |

### 关键配置：Vite 别名

编辑器的 `apps/editor/vite.config.ts` 中配置了以下别名，使 Taro 组件在纯 Web 环境下可用：

```ts
// apps/editor/vite.config.ts
resolve: {
  alias: {
    '@tarojs/components': path.resolve(
      __dirname,
      '../../packages/ui/node_modules/@tarojs/components/lib/react',
    ),
  },
},
define: {
  'process.env.TARO_ENV': JSON.stringify('h5'),
},
```

---

## 二、组件文件结构

每个组件遵循统一目录结构：

```
packages/ui/src/components/MpBanner/
└── index.tsx       # 组件实现 + Props 类型 + ComponentMeta
```

文件内包含三个部分：

| 部分 | 说明 |
|------|------|
| `MpBannerProps` (interface) | TypeScript 属性类型定义 |
| `MpBanner` (React.FC) | 组件渲染逻辑，使用 `@tarojs/components` |
| `MpBannerMeta` (ComponentMeta) | 编辑器元信息（侧边栏展示 + 属性面板生成） |

---

## 三、完整示例：MpBanner 轮播图

### 3.1 Props 定义

```ts
export interface MpBannerProps {
  /** 轮播图片列表 */
  items: BannerItem[];
  /** Banner 高度 */
  height?: string;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 自动切换间隔（毫秒） */
  interval?: number;
  /** 滑动动画时长（毫秒） */
  duration?: number;
  /** 是否循环轮播 */
  circular?: boolean;
  /** 是否显示指示点 */
  indicatorDots?: boolean;
  /** 指示点颜色 */
  indicatorColor?: string;
  /** 指示点激活颜色 */
  indicatorActiveColor?: string;
  /** 图片圆角 */
  borderRadius?: string;
}

export interface BannerItem {
  imageUrl: string;
  linkUrl?: string;
  alt?: string;
}
```

### 3.2 组件实现

```tsx
import React, { useMemo } from 'react';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';

export const MpBanner: React.FC<MpBannerProps> = ({
  items = [],
  height = '200px',
  autoplay = true,
  interval = 3000,
  circular = true,
  indicatorDots = true,
  indicatorColor = 'rgba(255, 255, 255, 0.4)',
  indicatorActiveColor = '#ffffff',
  borderRadius = '0',
  // ...
}) => {
  return (
    <View style={{ width: '100%', height, borderRadius, overflow: 'hidden' }}>
      <Swiper
        autoplay={autoplay}
        interval={interval}
        circular={circular}
        indicatorDots={indicatorDots}
        indicatorColor={indicatorColor}
        indicatorActiveColor={indicatorActiveColor}
      >
        {items.map((item, index) => (
          <SwiperItem key={`banner-${index}`}>
            <Image src={item.imageUrl} style={{ width: '100%', height: '100%' }} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
};
```

> **要点**：所有 UI 标签必须来自 `@tarojs/components`（`View` / `Image` / `Swiper` 等），不要使用 `div` / `img` 等 HTML 原生标签。

### 3.3 ComponentMeta 元信息

`ComponentMeta` 是编辑器消费的描述对象，用于：

1. **左侧组件面板**：展示标题、图标、分组
2. **拖入画布**：用 `defaultProps` 创建初始 `ComponentNode`
3. **右侧属性面板**：根据 `propsSchema` 自动生成表单控件

```ts
import type { ComponentMeta, PropSchema } from '@mpstack/schema';

const bannerPropsSchema: PropSchema[] = [
  { key: 'items',      label: '轮播图片',     controlType: 'json-editor', group: '内容' },
  { key: 'height',     label: '高度',         controlType: 'input',       group: '样式' },
  { key: 'autoplay',   label: '自动播放',     controlType: 'switch',      group: '行为' },
  { key: 'interval',   label: '切换间隔(ms)', controlType: 'number',      group: '行为' },
  { key: 'circular',   label: '循环轮播',     controlType: 'switch',      group: '行为' },
  { key: 'indicatorDots', label: '显示指示点', controlType: 'switch',      group: '行为' },
  // ... 更多属性
];

export const MpBannerMeta: ComponentMeta = {
  type: 'MpBanner',
  title: '轮播图',
  icon: 'PictureOutlined',
  group: 'media',
  description: '支持自动轮播、循环播放、指示点配置的轮播图组件',
  isContainer: false,
  defaultProps: {
    items: [
      { imageUrl: 'https://via.placeholder.com/750x400/1890ff/ffffff?text=Banner+1' },
      { imageUrl: 'https://via.placeholder.com/750x400/52c41a/ffffff?text=Banner+2' },
      { imageUrl: 'https://via.placeholder.com/750x400/faad14/ffffff?text=Banner+3' },
    ],
    height: '200px',
    autoplay: true,
    // ...
  },
  propsSchema: bannerPropsSchema,
};
```

---

## 四、注册流程（三步完成）

### Step 1：包入口导出

在 `packages/ui/src/index.ts` 中添加导出：

```ts
// ===== 媒体组件 =====
export { MpBanner, MpBannerMeta } from './components/MpBanner';
export type { MpBannerProps, BannerItem } from './components/MpBanner';
```

### Step 2：小程序端注册

在 `apps/mobile/src/renderer/register.ts` 中注册到 ComponentMap：

```ts
import { MpText, MpImage, MpContainer, MpBanner } from '@mpstack/ui';

export function registerAllComponents(): void {
  registerComponents({
    MpText,
    MpImage,
    MpContainer,
    MpBanner,  // ← 新增
  });
}
```

### Step 3：编辑器消费

编辑器拖入画布时，调用 Store：

```ts
import { MpBannerMeta } from '@mpstack/ui';

// 用户拖拽 Banner 到画布 → 触发
store.addComponent({
  type: MpBannerMeta.type,
  props: { ...MpBannerMeta.defaultProps },
  style: { ...MpBannerMeta.defaultStyle },
});
```

---

## 五、新增组件 Checklist

每次新增组件时，按以下清单逐项检查：

- [ ] **组件文件**：`packages/ui/src/components/MpXxx/index.tsx`
  - [ ] Props 接口定义（含 JSDoc 注释）
  - [ ] 组件实现（仅使用 `@tarojs/components` 标签）
  - [ ] `ComponentMeta` 导出（含 `defaultProps` + `propsSchema`）
- [ ] **包导出**：`packages/ui/src/index.ts` 添加 export
- [ ] **小程序注册**：`apps/mobile/src/renderer/register.ts` 添加注册
- [ ] **编译验证**：`pnpm build:ui` 通过
- [ ] **编辑器验证**：`pnpm dev:editor` 画布中可拖入渲染

---

## 六、常见问题

### Q1：编辑器中 Taro 组件不渲染 / 报错？

检查 `apps/editor/vite.config.ts` 的 `@tarojs/components` 别名是否指向 `lib/react` 目录。

### Q2：小程序端样式与编辑器预览不一致？

Taro H5 组件基于 Web Components，样式隔离机制与小程序不同。建议：
- 使用 `style` 行内样式而非 className
- 复杂样式通过 CSS Variables 统一

### Q3：能用 `<div>` / `<img>` 等 HTML 标签吗？

**不推荐**。HTML 标签在小程序端无法渲染。必须使用：

| HTML 标签 | Taro 对应组件 |
|-----------|--------------|
| `<div>` | `<View>` |
| `<span>` | `<Text>` |
| `<img>` | `<Image>` |
| `<input>` | `<Input>` |
| `<button>` | `<Button>` |
| `<a>` | `<Navigator>` |

### Q4：如何调试 Taro 组件的 H5 渲染？

在编辑器的 `vite.config.ts` 中已配置 `process.env.TARO_ENV = 'h5'`，可在浏览器 DevTools 中查看 Taro Web Components 的渲染结果（`<taro-view>`、`<taro-swiper>` 等自定义元素）。
