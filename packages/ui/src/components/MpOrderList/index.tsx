import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import type { ComponentMeta, PropSchema } from '@mpstack/schema';

// ─── 数据类型 ─────────────────────────────────────────────────

export interface OrderItem {
  /** 订单 ID */
  id: string;
  /** 店铺名称 */
  storeName: string;
  /** 店铺 Icon URL（可选，不传则使用默认图标） */
  storeIcon?: string;
  /** 订单类型标签，如 "自提"、"外卖"、"堂食" */
  orderType?: string;
  /** 下单时间 */
  orderTime: string;
  /** 订单金额（字符串，纯数字） */
  amount: string;
  /** 取餐号（可选） */
  pickupNumber?: string;
  /** 订单状态（可选，如 "待支付"、"已完成"） */
  status?: string;
}

export interface MpOrderListProps {
  // ── 内容 ──
  /** 订单数据列表 */
  orders: OrderItem[];
  /** 空状态提示文案 */
  emptyText?: string;
  /** 空状态图标 */
  emptyIcon?: string;
  /** 最大展示条数（0 = 不限） */
  maxCount?: number;

  // ── 显示字段 ──
  /** 是否显示店铺图标 */
  showStoreIcon?: boolean;
  /** 是否显示订单类型标签 */
  showOrderType?: boolean;
  /** 是否显示下单时间 */
  showOrderTime?: boolean;
  /** 是否显示订单金额 */
  showAmount?: boolean;
  /** 是否显示取餐号 */
  showPickupNumber?: boolean;
  /** 是否显示订单状态 */
  showStatus?: boolean;
  /** 是否显示头部分割线 */
  showDivider?: boolean;

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
  /** 金额/取餐号高亮色 */
  highlightColor?: string;
  /** 标签边框/文字色 */
  tagColor?: string;
  /** 标签样式：描边 or 实心 */
  tagStyle?: 'outlined' | 'filled';
  /** 店铺名字号 */
  storeNameFontSize?: string;
  /** 信息行字号 */
  contentFontSize?: string;
  /** 信息行标签色 */
  labelColor?: string;
  /** 信息行默认文字色 */
  valueColor?: string;
  /** 分割线颜色 */
  dividerColor?: string;

  // ── 行为 ──
  /** 点击订单回调 */
  onOrderClick?: (order: OrderItem) => void;
}

// ─── 默认店铺 Icon（红色波浪 SVG base64） ──────────────────────

const DEFAULT_STORE_ICON =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjRkY0RDRGIi8+PHBhdGggZD0iTTggMjBDMTIgMTYgMTYgMjQgMjAgMjBDMjQgMTYgMjggMjQgMzIgMjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTggMjZDMTIgMjIgMTYgMzAgMjAgMjZDMjQgMjIgMjggMzAgMzIgMjYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+';

// ─── 组件实现 ─────────────────────────────────────────────────

export const MpOrderList: React.FC<MpOrderListProps> = ({
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
  // 行为
  onOrderClick,
}) => {
  // 截取最大条数
  const displayOrders = maxCount > 0 ? orders.slice(0, maxCount) : orders;

  if (displayOrders.length === 0) {
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
          <Text style={{ fontSize: contentFontSize, color: labelColor }}>{emptyText}</Text>
        </View>
      </View>
    );
  }

  const isTagFilled = tagStyle === 'filled';
  const tagBg = isTagFilled ? tagColor : hexToRgba(tagColor, 0.06);
  const tagText = isTagFilled ? '#ffffff' : tagColor;
  const tagBorder = isTagFilled ? 'none' : `1px solid ${tagColor}`;

  return (
    <View style={{ backgroundColor, padding: gap }}>
      {displayOrders.map((order, index) => (
        <View
          key={order.id || `order-${index}`}
          style={{
            backgroundColor: cardBackgroundColor,
            borderRadius: cardBorderRadius,
            padding: cardPadding,
            marginBottom: index < displayOrders.length - 1 ? gap : '0',
          }}
          onClick={() => onOrderClick?.(order)}
        >
          {/* ── 头部：店铺 icon + 店名 + 标签 ── */}
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: showDivider ? '12px' : '0',
              borderBottom: showDivider ? `1px solid ${dividerColor}` : 'none',
            }}
          >
            <View style={{ display: 'flex', alignItems: 'center' }}>
              {showStoreIcon && (
                <Image
                  src={order.storeIcon || DEFAULT_STORE_ICON}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    marginRight: '10px',
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: storeNameFontSize,
                  fontWeight: 'bold',
                  color: valueColor,
                }}
              >
                {order.storeName}
              </Text>
            </View>

            {showOrderType && order.orderType && (
              <View
                style={{
                  padding: '2px 12px',
                  border: tagBorder,
                  borderRadius: '4px',
                  backgroundColor: tagBg,
                }}
              >
                <Text style={{ fontSize: '12px', color: tagText }}>{order.orderType}</Text>
              </View>
            )}
          </View>

          {/* ── 信息行 ── */}
          {showOrderTime && (
            <OrderRow
              label="下单时间："
              value={order.orderTime}
              fontSize={contentFontSize}
              labelColor={labelColor}
              valueColor={valueColor}
            />
          )}

          {showAmount && (
            <OrderRow
              label="订单金额："
              value={`¥ ${order.amount}`}
              fontSize={contentFontSize}
              labelColor={labelColor}
              valueColor={highlightColor}
            />
          )}

          {showPickupNumber && order.pickupNumber && (
            <OrderRow
              label="取餐号："
              value={order.pickupNumber}
              fontSize={contentFontSize}
              labelColor={labelColor}
              valueColor={highlightColor}
              valueBold
            />
          )}

          {showStatus && order.status && (
            <OrderRow
              label="订单状态："
              value={order.status}
              fontSize={contentFontSize}
              labelColor={labelColor}
              valueColor={highlightColor}
            />
          )}
        </View>
      ))}
    </View>
  );
};

// ─── 信息行子组件 ──────────────────────────────────────────────

interface OrderRowProps {
  label: string;
  value: string;
  fontSize?: string;
  labelColor?: string;
  valueColor?: string;
  valueBold?: boolean;
}

const OrderRow: React.FC<OrderRowProps> = ({
  label,
  value,
  fontSize = '14px',
  labelColor = '#999',
  valueColor = '#333',
  valueBold = false,
}) => (
  <View
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    }}
  >
    <Text style={{ fontSize, color: labelColor }}>{label}</Text>
    <Text
      style={{
        fontSize,
        color: valueColor,
        fontWeight: valueBold ? 'bold' : 'normal',
      }}
    >
      {value}
    </Text>
  </View>
);

// ─── 辅助函数 ──────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) return `rgba(255, 102, 0, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

// ─── ComponentMeta 组件元信息 ──────────────────────────────────

const orderListPropsSchema: PropSchema[] = [
  // ── 内容 ──
  {
    key: 'orders',
    label: '订单数据',
    controlType: 'json-editor',
    defaultValue: [],
    tooltip: '订单 JSON 数组，字段: id / storeName / orderType / orderTime / amount / pickupNumber / status',
    group: '内容',
  },
  {
    key: 'emptyText',
    label: '空状态文案',
    controlType: 'input',
    defaultValue: '暂无订单',
    group: '内容',
  },
  {
    key: 'emptyIcon',
    label: '空状态图标',
    controlType: 'input',
    defaultValue: '📋',
    tooltip: '支持 emoji 或图片 URL',
    group: '内容',
  },
  {
    key: 'maxCount',
    label: '最大显示数量',
    controlType: 'number',
    defaultValue: 0,
    tooltip: '0 表示不限制，超出部分隐藏',
    group: '内容',
  },

  // ── 显示字段 ──
  {
    key: 'showStoreIcon',
    label: '显示店铺图标',
    controlType: 'switch',
    defaultValue: true,
    group: '显示字段',
  },
  {
    key: 'showOrderType',
    label: '显示订单类型',
    controlType: 'switch',
    defaultValue: true,
    tooltip: '右上角的"自提/外卖/堂食"标签',
    group: '显示字段',
  },
  {
    key: 'showOrderTime',
    label: '显示下单时间',
    controlType: 'switch',
    defaultValue: true,
    group: '显示字段',
  },
  {
    key: 'showAmount',
    label: '显示订单金额',
    controlType: 'switch',
    defaultValue: true,
    group: '显示字段',
  },
  {
    key: 'showPickupNumber',
    label: '显示取餐号',
    controlType: 'switch',
    defaultValue: true,
    group: '显示字段',
  },
  {
    key: 'showStatus',
    label: '显示订单状态',
    controlType: 'switch',
    defaultValue: true,
    group: '显示字段',
  },
  {
    key: 'showDivider',
    label: '显示头部分割线',
    controlType: 'switch',
    defaultValue: true,
    group: '显示字段',
  },

  // ── 样式 ──
  {
    key: 'backgroundColor',
    label: '列表背景色',
    controlType: 'color',
    defaultValue: '#f5f5f5',
    group: '样式',
  },
  {
    key: 'cardBackgroundColor',
    label: '卡片背景色',
    controlType: 'color',
    defaultValue: '#ffffff',
    group: '样式',
  },
  {
    key: 'cardBorderRadius',
    label: '卡片圆角',
    controlType: 'input',
    defaultValue: '8px',
    group: '样式',
  },
  {
    key: 'gap',
    label: '卡片间距',
    controlType: 'input',
    defaultValue: '12px',
    group: '样式',
  },
  {
    key: 'cardPadding',
    label: '卡片内边距',
    controlType: 'input',
    defaultValue: '16px',
    group: '样式',
  },
  {
    key: 'highlightColor',
    label: '高亮色（金额/取餐号）',
    controlType: 'color',
    defaultValue: '#ff6600',
    group: '样式',
  },
  {
    key: 'tagColor',
    label: '标签颜色',
    controlType: 'color',
    defaultValue: '#ff6600',
    group: '样式',
  },
  {
    key: 'tagStyle',
    label: '标签样式',
    controlType: 'select',
    defaultValue: 'outlined',
    options: [
      { label: '描边', value: 'outlined' },
      { label: '实心', value: 'filled' },
    ],
    group: '样式',
  },
  {
    key: 'storeNameFontSize',
    label: '店铺名字号',
    controlType: 'input',
    defaultValue: '16px',
    group: '样式',
  },
  {
    key: 'contentFontSize',
    label: '信息行字号',
    controlType: 'input',
    defaultValue: '14px',
    group: '样式',
  },
  {
    key: 'labelColor',
    label: '标签文字色',
    controlType: 'color',
    defaultValue: '#999999',
    tooltip: '"下单时间"、"订单金额" 等标签的颜色',
    group: '样式',
  },
  {
    key: 'valueColor',
    label: '默认值文字色',
    controlType: 'color',
    defaultValue: '#333333',
    tooltip: '下单时间等非高亮值的颜色',
    group: '样式',
  },
  {
    key: 'dividerColor',
    label: '分割线颜色',
    controlType: 'color',
    defaultValue: '#f0f0f0',
    group: '样式',
  },
];

export const MpOrderListMeta: ComponentMeta = {
  type: 'MpOrderList',
  title: '订单列表',
  icon: 'UnorderedListOutlined',
  group: 'business',
  description: '餐饮订单卡片列表，展示店铺、时间、金额、取餐号等信息',
  isContainer: false,
  defaultProps: {
    orders: [
      {
        id: '1',
        storeName: '餐饮版–总店',
        orderType: '自提',
        orderTime: '2025-10-31 10:39:31',
        amount: '0.01',
        pickupNumber: '10310007',
      },
      {
        id: '2',
        storeName: '餐饮版–总店',
        orderType: '自提',
        orderTime: '2025-10-31 10:09:06',
        amount: '0.01',
        pickupNumber: '10310006',
      },
      {
        id: '3',
        storeName: '餐饮版–总店',
        orderType: '自提',
        orderTime: '2025-10-17 08:33:28',
        amount: '0.02',
      },
    ],
    emptyText: '暂无订单',
    emptyIcon: '📋',
    maxCount: 0,
    showStoreIcon: true,
    showOrderType: true,
    showOrderTime: true,
    showAmount: true,
    showPickupNumber: true,
    showStatus: true,
    showDivider: true,
    backgroundColor: '#f5f5f5',
    cardBackgroundColor: '#ffffff',
    cardBorderRadius: '8px',
    gap: '12px',
    cardPadding: '16px',
    highlightColor: '#ff6600',
    tagColor: '#ff6600',
    tagStyle: 'outlined',
    storeNameFontSize: '16px',
    contentFontSize: '14px',
    labelColor: '#999999',
    valueColor: '#333333',
    dividerColor: '#f0f0f0',
  },
  defaultStyle: {
    width: '100%',
  },
  propsSchema: orderListPropsSchema,
};
