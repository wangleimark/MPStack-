/**
 * PreviewOrderList —— 编辑器画布中的订单列表预览组件
 *
 * 纯 HTML/CSS + React，不依赖 Taro 运行时。
 * 与 @mpstack/ui 的 MpOrderList 保持 props 同构，
 * 支持所有右侧属性面板的配置项实时预览。
 */
import React from 'react';

interface OrderItem {
  id: string;
  storeName: string;
  storeIcon?: string;
  orderType?: string;
  orderTime: string;
  amount: string;
  pickupNumber?: string;
  status?: string;
}

interface Props {
  // 内容
  orders?: OrderItem[];
  emptyText?: string;
  emptyIcon?: string;
  maxCount?: number;
  // 显示字段
  showStoreIcon?: boolean;
  showOrderType?: boolean;
  showOrderTime?: boolean;
  showAmount?: boolean;
  showPickupNumber?: boolean;
  showStatus?: boolean;
  showDivider?: boolean;
  // 样式
  backgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderRadius?: string;
  gap?: string;
  cardPadding?: string;
  highlightColor?: string;
  tagColor?: string;
  tagStyle?: 'outlined' | 'filled';
  storeNameFontSize?: string;
  contentFontSize?: string;
  labelColor?: string;
  valueColor?: string;
  dividerColor?: string;
}

// 默认店铺 icon（红色波浪 SVG）
const defaultIcon = (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#FF4D4F" />
    <path d="M8 20C12 16 16 24 20 20C24 16 28 24 32 20" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M8 26C12 22 16 30 20 26C24 22 28 30 32 26" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

function hexToRgba(hex: string, alpha: number): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) return `rgba(255, 102, 0, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

const InfoRow: React.FC<{
  label: string;
  value: string;
  fontSize?: string;
  labelColor?: string;
  valueColor?: string;
  bold?: boolean;
}> = ({
  label,
  value,
  fontSize = '14px',
  labelColor = '#999',
  valueColor = '#333',
  bold = false,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      lineHeight: '22px',
    }}
  >
    <span style={{ fontSize: parseInt(fontSize), color: labelColor }}>{label}</span>
    <span style={{ fontSize: parseInt(fontSize), color: valueColor, fontWeight: bold ? 600 : 400 }}>
      {value}
    </span>
  </div>
);

export const PreviewOrderList: React.FC<Props> = ({
  // 内容
  orders = [],
  emptyText = '暂无订单',
  emptyIcon = '📋',
  maxCount = 0,
  // 显示字段
  showStoreIcon = true,
  showOrderType = true,
  showOrderTime = true,
  showAmount = true,
  showPickupNumber = true,
  showStatus = true,
  showDivider = true,
  // 样式
  backgroundColor = '#f5f5f5',
  cardBackgroundColor = '#ffffff',
  cardBorderRadius = '8px',
  gap = '12px',
  cardPadding = '16px',
  highlightColor = '#ff6600',
  tagColor = '#ff6600',
  tagStyle = 'outlined',
  storeNameFontSize = '16px',
  contentFontSize = '14px',
  labelColor = '#999999',
  valueColor = '#333333',
  dividerColor = '#f0f0f0',
}) => {
  const displayOrders = maxCount > 0 ? orders.slice(0, maxCount) : orders;
  const gapPx = parseInt(gap) || 12;
  const radiusPx = parseInt(cardBorderRadius) || 8;
  const paddingPx = parseInt(cardPadding) || 16;

  if (displayOrders.length === 0) {
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
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: 40 }}>{emptyIcon}</span>
        <span style={{ fontSize: parseInt(contentFontSize), color: labelColor }}>
          {emptyText}
        </span>
      </div>
    );
  }

  const isTagFilled = tagStyle === 'filled';
  const tagBg = isTagFilled ? tagColor : hexToRgba(tagColor, 0.06);
  const tagText = isTagFilled ? '#ffffff' : tagColor;
  const tagBorder = isTagFilled ? 'none' : `1px solid ${tagColor}`;

  return (
    <div style={{ backgroundColor, padding: gapPx }}>
      {displayOrders.map((order, index) => (
        <div
          key={order.id || index}
          style={{
            backgroundColor: cardBackgroundColor,
            borderRadius: radiusPx,
            padding: paddingPx,
            marginBottom: index < displayOrders.length - 1 ? gapPx : 0,
          }}
        >
          {/* ── 头部 ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              paddingBottom: showDivider ? 12 : 0,
              borderBottom: showDivider ? `1px solid ${dividerColor}` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {showStoreIcon &&
                (order.storeIcon ? (
                  <img
                    src={order.storeIcon}
                    alt=""
                    style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }}
                  />
                ) : (
                  defaultIcon
                ))}
              <span
                style={{
                  fontSize: parseInt(storeNameFontSize),
                  fontWeight: 600,
                  color: valueColor,
                }}
              >
                {order.storeName}
              </span>
            </div>

            {showOrderType && order.orderType && (
              <span
                style={{
                  padding: '2px 12px',
                  border: tagBorder,
                  borderRadius: 4,
                  fontSize: 12,
                  color: tagText,
                  backgroundColor: tagBg,
                  whiteSpace: 'nowrap',
                }}
              >
                {order.orderType}
              </span>
            )}
          </div>

          {/* ── 信息行 ── */}
          {showOrderTime && (
            <InfoRow
              label="下单时间："
              value={order.orderTime}
              fontSize={contentFontSize}
              labelColor={labelColor}
              valueColor={valueColor}
            />
          )}
          {showAmount && (
            <InfoRow
              label="订单金额："
              value={`¥ ${order.amount}`}
              fontSize={contentFontSize}
              labelColor={labelColor}
              valueColor={highlightColor}
            />
          )}
          {showPickupNumber && order.pickupNumber && (
            <InfoRow
              label="取餐号："
              value={order.pickupNumber}
              fontSize={contentFontSize}
              labelColor={labelColor}
              valueColor={highlightColor}
              bold
            />
          )}
          {showStatus && order.status && (
            <InfoRow
              label="订单状态："
              value={order.status}
              fontSize={contentFontSize}
              labelColor={labelColor}
              valueColor={highlightColor}
            />
          )}
        </div>
      ))}
    </div>
  );
};
