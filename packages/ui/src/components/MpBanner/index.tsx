import React, { useMemo } from 'react';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import type { ComponentMeta, PropSchema } from '@mpstack/schema';

// ─── Props 定义 ──────────────────────────────────────────────────

export interface MpBannerProps {
  /** 轮播图片列表 */
  items: BannerItem[];
  /** Banner 高度，如 '200px' */
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
  /** 图片地址 */
  imageUrl: string;
  /** 跳转链接（可选） */
  linkUrl?: string;
  /** 图片描述（无障碍） */
  alt?: string;
}

// ─── 组件实现 ─────────────────────────────────────────────────────

/**
 * MpBanner —— 轮播图组件
 *
 * 使用 Taro 的 Swiper + Image 实现，天然跨端：
 *  - 小程序端 → <swiper> + <image>
 *  - H5/Web 端 → Taro H5 Web Components 兼容实现
 *
 * @example
 * <MpBanner
 *   items={[
 *     { imageUrl: 'https://example.com/1.jpg', linkUrl: '/pages/detail?id=1' },
 *     { imageUrl: 'https://example.com/2.jpg' },
 *   ]}
 *   height="200px"
 *   autoplay
 *   circular
 *   indicatorDots
 * />
 */
export const MpBanner: React.FC<MpBannerProps> = ({
  items = [],
  height = '200px',
  autoplay = true,
  interval = 3000,
  duration = 500,
  circular = true,
  indicatorDots = true,
  indicatorColor = 'rgba(255, 255, 255, 0.4)',
  indicatorActiveColor = '#ffffff',
  borderRadius = '0',
}) => {
  const containerStyle = useMemo(
    () => ({
      width: '100%',
      height,
      borderRadius,
      overflow: 'hidden' as const,
    }),
    [height, borderRadius],
  );

  const imageStyle = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      display: 'block' as const,
    }),
    [],
  );

  if (items.length === 0) {
    return (
      <View
        style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#999',
          fontSize: '14px',
        }}
      >
        请配置轮播图片
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Swiper
        style={{ width: '100%', height: '100%' }}
        autoplay={autoplay}
        interval={interval}
        duration={duration}
        circular={circular}
        indicatorDots={indicatorDots}
        indicatorColor={indicatorColor}
        indicatorActiveColor={indicatorActiveColor}
      >
        {items.map((item, index) => (
          <SwiperItem key={`banner-${index}`}>
            <Image
              src={item.imageUrl}
              style={imageStyle}
              mode="aspectFill"
            />
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
};

// ─── ComponentMeta 组件元信息 ─────────────────────────────────────

/** 属性面板配置 */
const bannerPropsSchema: PropSchema[] = [
  {
    key: 'items',
    label: '轮播图片',
    controlType: 'json-editor',
    defaultValue: [],
    tooltip: '配置图片列表，每项包含 imageUrl 和可选的 linkUrl',
    group: '内容',
  },
  {
    key: 'height',
    label: '高度',
    controlType: 'input',
    defaultValue: '200px',
    group: '样式',
  },
  {
    key: 'borderRadius',
    label: '圆角',
    controlType: 'input',
    defaultValue: '0',
    group: '样式',
  },
  {
    key: 'autoplay',
    label: '自动播放',
    controlType: 'switch',
    defaultValue: true,
    group: '行为',
  },
  {
    key: 'interval',
    label: '切换间隔(ms)',
    controlType: 'number',
    defaultValue: 3000,
    group: '行为',
  },
  {
    key: 'duration',
    label: '动画时长(ms)',
    controlType: 'number',
    defaultValue: 500,
    group: '行为',
  },
  {
    key: 'circular',
    label: '循环轮播',
    controlType: 'switch',
    defaultValue: true,
    group: '行为',
  },
  {
    key: 'indicatorDots',
    label: '显示指示点',
    controlType: 'switch',
    defaultValue: true,
    group: '行为',
  },
  {
    key: 'indicatorColor',
    label: '指示点颜色',
    controlType: 'color',
    defaultValue: 'rgba(255, 255, 255, 0.4)',
    group: '样式',
  },
  {
    key: 'indicatorActiveColor',
    label: '指示点激活色',
    controlType: 'color',
    defaultValue: '#ffffff',
    group: '样式',
  },
];

/**
 * BannerMeta —— 注册到编辑器侧边栏的完整元信息
 *
 * 编辑器通过此对象：
 *  1. 在左侧组件面板显示 Banner 卡片
 *  2. 拖拽到画布时，用 defaultProps 创建初始 ComponentNode
 *  3. 选中后，根据 propsSchema 自动生成属性面板表单
 */
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
    interval: 3000,
    duration: 500,
    circular: true,
    indicatorDots: true,
    indicatorColor: 'rgba(255, 255, 255, 0.4)',
    indicatorActiveColor: '#ffffff',
    borderRadius: '0',
  },
  defaultStyle: {
    width: '100%',
    margin: '0',
  },
  propsSchema: bannerPropsSchema,
};
