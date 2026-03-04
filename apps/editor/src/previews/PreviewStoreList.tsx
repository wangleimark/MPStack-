/**
 * PreviewStoreList —— 编辑器画布中的商户列表预览组件
 *
 * 纯 HTML/CSS + React，还原截图样式：
 * 灰色背景 + 白色卡片 + 左图右文 + 定位图标 + 地址
 */
import React from 'react';

interface StoreItem {
  id: string;
  name: string;
  imageUrl?: string;
  address?: string;
  city?: string;
  district?: string;
  tag?: string;
}

interface Props {
  stores?: StoreItem[];
  emptyText?: string;
  emptyIcon?: string;
  maxCount?: number;
  showImage?: boolean;
  showAddress?: boolean;
  showLocationIcon?: boolean;
  showTag?: boolean;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderRadius?: string;
  gap?: string;
  cardPadding?: string;
  imageSize?: string;
  imageBorderRadius?: string;
  nameFontSize?: string;
  nameColor?: string;
  addressFontSize?: string;
  addressColor?: string;
  locationIconColor?: string;
  tagColor?: string;
  tagBackgroundColor?: string;
}

const getAddressText = (store: StoreItem) => {
  if (store.address) return store.address;
  const parts = [store.city, store.district].filter(Boolean);
  return parts.join(' ') || '';
};

export const PreviewStoreList: React.FC<Props> = ({
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
}) => {
  const displayStores = maxCount > 0 ? stores.slice(0, maxCount) : stores;
  const gapPx = parseInt(gap) || 12;
  const imgSize = parseInt(imageSize) || 64;

  if (displayStores.length === 0) {
    return (
      <div
        style={{
          backgroundColor,
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 40 }}>{emptyIcon}</span>
        <span style={{ fontSize: 14, color: addressColor }}>{emptyText}</span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor, padding: gapPx }}>
      {displayStores.map((store, index) => (
        <div
          key={store.id || index}
          style={{
            backgroundColor: cardBackgroundColor,
            borderRadius: parseInt(cardBorderRadius) || 8,
            padding: cardPadding,
            marginBottom: index < displayStores.length - 1 ? gapPx : 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* 左侧图片 */}
          {showImage && (
            <div
              style={{
                width: imgSize,
                height: imgSize,
                borderRadius: parseInt(imageBorderRadius) || 8,
                marginRight: 14,
                flexShrink: 0,
                backgroundColor: '#f0f0f0',
                overflow: 'hidden',
              }}
            >
              {store.imageUrl ? (
                <img
                  src={store.imageUrl}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f0f0f0',
                  }}
                />
              )}
            </div>
          )}

          {/* 右侧信息 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 店名 + 标签 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span
                style={{
                  fontSize: parseInt(nameFontSize),
                  fontWeight: 600,
                  color: nameColor,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {store.name}
              </span>
              {showTag && store.tag && (
                <span
                  style={{
                    marginLeft: 8,
                    padding: '1px 8px',
                    borderRadius: 3,
                    backgroundColor: tagBackgroundColor,
                    color: tagColor,
                    fontSize: 11,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {store.tag}
                </span>
              )}
            </div>

            {/* 地址 */}
            {showAddress && getAddressText(store) && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {showLocationIcon && (
                  <svg
                    viewBox="0 0 1024 1024"
                    width="14"
                    height="14"
                    fill={locationIconColor}
                    style={{ marginRight: 4, flexShrink: 0 }}
                  >
                    <path d="M512 64C335.5 64 192 199.5 192 368c0 252 320 592 320 592s320-340 320-592C832 199.5 688.5 64 512 64zm0 440c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144z" />
                  </svg>
                )}
                <span
                  style={{
                    fontSize: parseInt(addressFontSize),
                    color: addressColor,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getAddressText(store)}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
