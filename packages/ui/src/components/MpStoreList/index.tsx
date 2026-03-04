import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import type { ComponentMeta, PropSchema } from '@mpstack/schema';

// ─── 数据类型 ─────────────────────────────────────────────────

export interface StoreItem {
  /** 店铺 ID */
  id: string;
  /** 店铺名称 */
  name: string;
  /** 店铺图片 URL */
  imageUrl?: string;
  /** 地址信息 */
  address?: string;
  /** 城市 */
  city?: string;
  /** 区域 */
  district?: string;
  /** 附加标签（如 "热门"） */
  tag?: string;
}

export interface MpStoreListProps {
  // ── 内容 ──
  /** 店铺数据列表 */
  stores: StoreItem[];
  /** 空状态文案 */
  emptyText?: string;
  /** 空状态图标 */
  emptyIcon?: string;
  /** 最大显示条数 (0=不限) */
  maxCount?: number;

  // ── 显示 ──
  /** 是否显示店铺图片 */
  showImage?: boolean;
  /** 是否显示地址 */
  showAddress?: boolean;
  /** 是否显示地址图标 */
  showLocationIcon?: boolean;
  /** 是否显示附加标签 */
  showTag?: boolean;

  // ── 样式 ──
  /** 列表背景色 */
  backgroundColor?: string;
  /** 卡片背景色 */
  cardBackgroundColor?: string;
  /** 卡片圆角 */
  cardBorderRadius?: string;
  /** 卡片间距 */
  gap?: string;
  /** 卡片内边距 */
  cardPadding?: string;
  /** 图片尺寸 */
  imageSize?: string;
  /** 图片圆角 */
  imageBorderRadius?: string;
  /** 店铺名字号 */
  nameFontSize?: string;
  /** 店铺名颜色 */
  nameColor?: string;
  /** 地址字号 */
  addressFontSize?: string;
  /** 地址颜色 */
  addressColor?: string;
  /** 地址图标颜色 */
  locationIconColor?: string;
  /** 标签文字色 */
  tagColor?: string;
  /** 标签背景色 */
  tagBackgroundColor?: string;

  // ── 行为 ──
  /** 点击店铺回调 */
  onStoreClick?: (store: StoreItem) => void;
}

// ─── 定位图标 ────────────────────────────────────────────────

const LocationIcon: React.FC<{ color: string; size: string }> = ({ color, size }) => (
  <View style={{ width: size, height: size, marginRight: '4px', flexShrink: 0 }}>
    <svg viewBox="0 0 1024 1024" width={size} height={size} fill={color}>
      <path d="M512 64C335.5 64 192 199.5 192 368c0 252 320 592 320 592s320-340 320-592C832 199.5 688.5 64 512 64zm0 440c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144z" />
    </svg>
  </View>
);

// ─── 默认店铺图片占位（灰色方块） ──────────────────────────────

const DEFAULT_STORE_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSI4IiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';

// ─── 组件实现 ─────────────────────────────────────────────────

export const MpStoreList: React.FC<MpStoreListProps> = ({
  stores = [],
  emptyText = '暂无商户',
  emptyIcon = '🏪',
  maxCount = 0,
  showImage = true,
  showAddress = true,
  showLocationIcon = true,
  showTag = true,
  backgroundColor = '#f5f5f5',
  cardBackgroundColor = '#ffffff',
  cardBorderRadius = '8px',
  gap = '12px',
  cardPadding = '16px 12px',
  imageSize = '64px',
  imageBorderRadius = '8px',
  nameFontSize = '17px',
  nameColor = '#333333',
  addressFontSize = '13px',
  addressColor = '#999999',
  locationIconColor = '#999999',
  tagColor = '#ffffff',
  tagBackgroundColor = '#ff4d4f',
  onStoreClick,
}) => {
  const displayStores = maxCount > 0 ? stores.slice(0, maxCount) : stores;

  if (displayStores.length === 0) {
    return (
      <View
        style={{
          backgroundColor,
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>
            {emptyIcon}
          </Text>
          <Text style={{ fontSize: '14px', color: addressColor }}>{emptyText}</Text>
        </View>
      </View>
    );
  }

  // 拼接地址文本
  const getAddressText = (store: StoreItem) => {
    if (store.address) return store.address;
    const parts = [store.city, store.district].filter(Boolean);
    return parts.join(' ') || '';
  };

  return (
    <View style={{ backgroundColor, padding: gap }}>
      {displayStores.map((store, index) => (
        <View
          key={store.id || `store-${index}`}
          style={{
            backgroundColor: cardBackgroundColor,
            borderRadius: cardBorderRadius,
            padding: cardPadding,
            marginBottom: index < displayStores.length - 1 ? gap : '0',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => onStoreClick?.(store)}
        >
          {/* 左侧图片 */}
          {showImage && (
            <Image
              src={store.imageUrl || DEFAULT_STORE_IMAGE}
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: imageBorderRadius,
                marginRight: '14px',
                flexShrink: 0,
              }}
              mode="aspectFill"
            />
          )}

          {/* 右侧信息 */}
          <View style={{ flex: 1, minWidth: 0 }}>
            {/* 店铺名 + 标签 */}
            <View style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Text
                style={{
                  fontSize: nameFontSize,
                  fontWeight: 'bold',
                  color: nameColor,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {store.name}
              </Text>
              {showTag && store.tag && (
                <View
                  style={{
                    marginLeft: '8px',
                    padding: '1px 8px',
                    borderRadius: '3px',
                    backgroundColor: tagBackgroundColor,
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ fontSize: '11px', color: tagColor }}>{store.tag}</Text>
                </View>
              )}
            </View>

            {/* 地址 */}
            {showAddress && getAddressText(store) && (
              <View style={{ display: 'flex', alignItems: 'center' }}>
                {showLocationIcon && (
                  <LocationIcon color={locationIconColor} size="14px" />
                )}
                <Text
                  style={{
                    fontSize: addressFontSize,
                    color: addressColor,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getAddressText(store)}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

// ─── ComponentMeta ───────────────────────────────────────────

const storeListPropsSchema: PropSchema[] = [
  // 内容
  { key: 'stores', label: '店铺数据', controlType: 'json-editor', defaultValue: [], tooltip: '店铺 JSON 数组，字段: id / name / imageUrl / address(或 city+district) / tag', group: '内容' },
  { key: 'emptyText', label: '空状态文案', controlType: 'input', defaultValue: '暂无商户', group: '内容' },
  { key: 'emptyIcon', label: '空状态图标', controlType: 'input', defaultValue: '🏪', group: '内容' },
  { key: 'maxCount', label: '最大显示数量', controlType: 'number', defaultValue: 0, tooltip: '0 表示不限制', group: '内容' },
  // 显示
  { key: 'showImage', label: '显示店铺图片', controlType: 'switch', defaultValue: true, group: '显示字段' },
  { key: 'showAddress', label: '显示地址', controlType: 'switch', defaultValue: true, group: '显示字段' },
  { key: 'showLocationIcon', label: '显示定位图标', controlType: 'switch', defaultValue: true, group: '显示字段' },
  { key: 'showTag', label: '显示标签', controlType: 'switch', defaultValue: true, tooltip: '店铺名右侧的标签', group: '显示字段' },
  // 样式
  { key: 'backgroundColor', label: '列表背景色', controlType: 'color', defaultValue: '#f5f5f5', group: '样式' },
  { key: 'cardBackgroundColor', label: '卡片背景色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
  { key: 'cardBorderRadius', label: '卡片圆角', controlType: 'input', defaultValue: '8px', group: '样式' },
  { key: 'gap', label: '卡片间距', controlType: 'input', defaultValue: '12px', group: '样式' },
  { key: 'cardPadding', label: '卡片内边距', controlType: 'input', defaultValue: '16px 12px', group: '样式' },
  { key: 'imageSize', label: '图片尺寸', controlType: 'input', defaultValue: '64px', group: '样式' },
  { key: 'imageBorderRadius', label: '图片圆角', controlType: 'input', defaultValue: '8px', group: '样式' },
  { key: 'nameFontSize', label: '名称字号', controlType: 'input', defaultValue: '17px', group: '样式' },
  { key: 'nameColor', label: '名称颜色', controlType: 'color', defaultValue: '#333333', group: '样式' },
  { key: 'addressFontSize', label: '地址字号', controlType: 'input', defaultValue: '13px', group: '样式' },
  { key: 'addressColor', label: '地址颜色', controlType: 'color', defaultValue: '#999999', group: '样式' },
  { key: 'locationIconColor', label: '定位图标色', controlType: 'color', defaultValue: '#999999', group: '样式' },
  { key: 'tagColor', label: '标签文字色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
  { key: 'tagBackgroundColor', label: '标签背景色', controlType: 'color', defaultValue: '#ff4d4f', group: '样式' },
];

export const MpStoreListMeta: ComponentMeta = {
  type: 'MpStoreList',
  title: '商户列表',
  icon: 'ShopOutlined',
  group: 'business',
  description: '商户/店铺图文列表，左图右文布局，展示店铺名称、地址',
  isContainer: false,
  defaultProps: {
    stores: [
      {
        id: '1',
        name: '餐饮版–总店',
        imageUrl: 'https://via.placeholder.com/128x128/1a1a2e/ffffff?text=POS',
        city: '北京市',
        district: '石景山区',
      },
      {
        id: '2',
        name: '姜氏餐饮1号店',
        city: '北京市',
        district: '石景山区',
      },
      {
        id: '3',
        name: '姜氏餐饮2号店',
        city: '北京市',
        district: '石景山区',
      },
      {
        id: '4',
        name: '姜氏餐饮3号店',
        city: '北京市',
        district: '石景山区',
      },
    ],
    emptyText: '暂无商户',
    emptyIcon: '🏪',
    maxCount: 0,
    showImage: true,
    showAddress: true,
    showLocationIcon: true,
    showTag: true,
    backgroundColor: '#f5f5f5',
    cardBackgroundColor: '#ffffff',
    cardBorderRadius: '8px',
    gap: '12px',
    cardPadding: '16px 12px',
    imageSize: '64px',
    imageBorderRadius: '8px',
    nameFontSize: '17px',
    nameColor: '#333333',
    addressFontSize: '13px',
    addressColor: '#999999',
    locationIconColor: '#999999',
    tagColor: '#ffffff',
    tagBackgroundColor: '#ff4d4f',
  },
  defaultStyle: {
    width: '100%',
  },
  propsSchema: storeListPropsSchema,
};
