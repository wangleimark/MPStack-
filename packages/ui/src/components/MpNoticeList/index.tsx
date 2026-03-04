import React from 'react';
import { View, Text } from '@tarojs/components';
import type { ComponentMeta, PropSchema } from '@mpstack/schema';

// ─── 数据类型 ─────────────────────────────────────────────────

export interface NoticeItem {
  /** 通知 ID */
  id: string;
  /** 通知标签，如 "重要通知" */
  tag?: string;
  /** 通知标题 */
  title: string;
  /** 日期字符串 */
  date: string;
  /** 是否已读 */
  read?: boolean;
}

export interface MpNoticeListProps {
  // ── 内容 ──
  /** 标题文字 */
  title?: string;
  /** 通知列表 */
  notices: NoticeItem[];
  /** 空状态文案 */
  emptyText?: string;
  /** 空状态图标 */
  emptyIcon?: string;
  /** 最大显示条数 (0=不限制) */
  maxCount?: number;
  /** "全部已读"按钮文字 */
  markAllReadText?: string;

  // ── 显示 ──
  /** 是否显示顶部标题行 */
  showTitle?: boolean;
  /** 是否显示"全部已读"按钮 */
  showMarkAllRead?: boolean;
  /** 是否显示右箭头 */
  showArrow?: boolean;
  /** 是否显示通知标签 */
  showTag?: boolean;
  /** 是否显示日期 */
  showDate?: boolean;
  /** 是否显示列表分割线 */
  showDivider?: boolean;

  // ── 样式 ──
  /** 外层背景色 */
  backgroundColor?: string;
  /** 卡片背景色 */
  cardBackgroundColor?: string;
  /** 卡片圆角 */
  cardBorderRadius?: string;
  /** 卡片内边距 */
  cardPadding?: string;
  /** 外层内边距 */
  outerPadding?: string;
  /** 标题字号 */
  titleFontSize?: string;
  /** 标题颜色 */
  titleColor?: string;
  /** 标签颜色 */
  tagColor?: string;
  /** 标签字号 */
  tagFontSize?: string;
  /** 通知标题字号 */
  contentFontSize?: string;
  /** 通知标题颜色 */
  contentColor?: string;
  /** 日期字号 */
  dateFontSize?: string;
  /** 日期颜色 */
  dateColor?: string;
  /** "全部已读"文字颜色 */
  markAllReadColor?: string;
  /** "全部已读"背景色 */
  markAllReadBgColor?: string;
  /** "全部已读"字号 */
  markAllReadFontSize?: string;
  /** 箭头颜色 */
  arrowColor?: string;
  /** 列表项间距 */
  itemGap?: string;
  /** 分割线颜色 */
  dividerColor?: string;
  /** 标题行底部间距 */
  headerMarginBottom?: string;

  // ── 事件 ──
  /** 点击通知条目 */
  onNoticeClick?: (notice: NoticeItem) => void;
  /** 点击"全部已读" */
  onMarkAllRead?: () => void;
  /** 点击标题行（进入通知列表页） */
  onHeaderClick?: () => void;
}

// ─── 组件实现 ─────────────────────────────────────────────────

export const MpNoticeList: React.FC<MpNoticeListProps> = ({
  title = '消息通知',
  notices = [],
  emptyText = '暂无通知',
  emptyIcon = '🔔',
  maxCount = 0,
  markAllReadText = '全部已读',
  showTitle = true,
  showMarkAllRead = true,
  showArrow = true,
  showTag = true,
  showDate = true,
  showDivider = false,
  backgroundColor = '#f5f5f5',
  cardBackgroundColor = '#ffffff',
  cardBorderRadius = '8px',
  cardPadding = '16px',
  outerPadding = '12px',
  titleFontSize = '18px',
  titleColor = '#333333',
  tagColor = '#e74c3c',
  tagFontSize = '14px',
  contentFontSize = '15px',
  contentColor = '#333333',
  dateFontSize = '13px',
  dateColor = '#999999',
  markAllReadColor = '#ffffff',
  markAllReadBgColor = '#e74c3c',
  markAllReadFontSize = '12px',
  arrowColor = '#cccccc',
  itemGap = '16px',
  dividerColor = '#f0f0f0',
  headerMarginBottom = '12px',
  onNoticeClick,
  onMarkAllRead,
  onHeaderClick,
}) => {
  const displayNotices = maxCount > 0 ? notices.slice(0, maxCount) : notices;

  if (displayNotices.length === 0 && !showTitle) {
    return (
      <View
        style={{
          backgroundColor,
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>
            {emptyIcon}
          </Text>
          <Text style={{ fontSize: '14px', color: dateColor }}>{emptyText}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor, padding: outerPadding }}>
      <View
        style={{
          backgroundColor: cardBackgroundColor,
          borderRadius: cardBorderRadius,
          padding: cardPadding,
        }}
      >
        {/* ── 标题行 ── */}
        {showTitle && (
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: headerMarginBottom,
            }}
            onClick={() => onHeaderClick?.()}
          >
            {/* 标题文字 */}
            <Text
              style={{
                fontSize: titleFontSize,
                fontWeight: 'bold',
                color: titleColor,
              }}
            >
              {title}
            </Text>

            {/* "全部已读"按钮 */}
            {showMarkAllRead && (
              <View
                style={{
                  marginLeft: '12px',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  backgroundColor: markAllReadBgColor,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllRead?.();
                }}
              >
                <Text
                  style={{
                    fontSize: markAllReadFontSize,
                    color: markAllReadColor,
                    lineHeight: '18px',
                  }}
                >
                  {markAllReadText}
                </Text>
              </View>
            )}

            {/* 右箭头 */}
            {showArrow && (
              <View style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <Text style={{ fontSize: '18px', color: arrowColor }}>›</Text>
              </View>
            )}
          </View>
        )}

        {/* ── 通知列表 ── */}
        {displayNotices.length === 0 ? (
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 0',
              flexDirection: 'column',
            }}
          >
            <Text style={{ fontSize: '32px', marginBottom: '8px' }}>{emptyIcon}</Text>
            <Text style={{ fontSize: '13px', color: dateColor }}>{emptyText}</Text>
          </View>
        ) : (
          displayNotices.map((notice, index) => (
            <View key={notice.id || `notice-${index}`}>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: index === 0 ? '0' : itemGap,
                  paddingBottom: index < displayNotices.length - 1 ? (showDivider ? itemGap : '0') : '0',
                }}
                onClick={() => onNoticeClick?.(notice)}
              >
                {/* 左侧：标签 + 标题 */}
                <View style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                  {showTag && notice.tag && (
                    <Text
                      style={{
                        fontSize: tagFontSize,
                        color: tagColor,
                        fontWeight: 'bold',
                        flexShrink: 0,
                        marginRight: '4px',
                      }}
                    >
                      【{notice.tag}】
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: contentFontSize,
                      color: notice.read ? dateColor : contentColor,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {notice.title}
                  </Text>
                </View>

                {/* 右侧：日期 */}
                {showDate && (
                  <Text
                    style={{
                      fontSize: dateFontSize,
                      color: dateColor,
                      flexShrink: 0,
                      marginLeft: '12px',
                    }}
                  >
                    {notice.date}
                  </Text>
                )}
              </View>

              {/* 分割线 */}
              {showDivider && index < displayNotices.length - 1 && (
                <View
                  style={{
                    height: '1px',
                    backgroundColor: dividerColor,
                  }}
                />
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
};

// ─── ComponentMeta ───────────────────────────────────────────

const noticeListPropsSchema: PropSchema[] = [
  // 内容
  { key: 'title', label: '标题文字', controlType: 'input', defaultValue: '消息通知', group: '内容' },
  { key: 'notices', label: '通知数据', controlType: 'json-editor', defaultValue: [], tooltip: '通知 JSON 数组，字段: id / tag / title / date / read', group: '内容' },
  { key: 'emptyText', label: '空状态文案', controlType: 'input', defaultValue: '暂无通知', group: '内容' },
  { key: 'emptyIcon', label: '空状态图标', controlType: 'input', defaultValue: '🔔', group: '内容' },
  { key: 'maxCount', label: '最大显示数量', controlType: 'number', defaultValue: 0, tooltip: '0 表示不限制', group: '内容' },
  { key: 'markAllReadText', label: '全部已读文字', controlType: 'input', defaultValue: '全部已读', group: '内容' },
  // 显示字段
  { key: 'showTitle', label: '显示标题行', controlType: 'switch', defaultValue: true, group: '显示字段' },
  { key: 'showMarkAllRead', label: '显示全部已读', controlType: 'switch', defaultValue: true, group: '显示字段' },
  { key: 'showArrow', label: '显示右箭头', controlType: 'switch', defaultValue: true, group: '显示字段' },
  { key: 'showTag', label: '显示通知标签', controlType: 'switch', defaultValue: true, group: '显示字段' },
  { key: 'showDate', label: '显示日期', controlType: 'switch', defaultValue: true, group: '显示字段' },
  { key: 'showDivider', label: '显示分割线', controlType: 'switch', defaultValue: false, group: '显示字段' },
  // 样式
  { key: 'backgroundColor', label: '外层背景色', controlType: 'color', defaultValue: '#f5f5f5', group: '样式' },
  { key: 'cardBackgroundColor', label: '卡片背景色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
  { key: 'cardBorderRadius', label: '卡片圆角', controlType: 'input', defaultValue: '8px', group: '样式' },
  { key: 'cardPadding', label: '卡片内边距', controlType: 'input', defaultValue: '16px', group: '样式' },
  { key: 'outerPadding', label: '外层内边距', controlType: 'input', defaultValue: '12px', group: '样式' },
  { key: 'titleFontSize', label: '标题字号', controlType: 'input', defaultValue: '18px', group: '样式' },
  { key: 'titleColor', label: '标题颜色', controlType: 'color', defaultValue: '#333333', group: '样式' },
  { key: 'tagColor', label: '标签颜色', controlType: 'color', defaultValue: '#e74c3c', group: '样式' },
  { key: 'tagFontSize', label: '标签字号', controlType: 'input', defaultValue: '14px', group: '样式' },
  { key: 'contentFontSize', label: '通知标题字号', controlType: 'input', defaultValue: '15px', group: '样式' },
  { key: 'contentColor', label: '通知标题颜色', controlType: 'color', defaultValue: '#333333', group: '样式' },
  { key: 'dateFontSize', label: '日期字号', controlType: 'input', defaultValue: '13px', group: '样式' },
  { key: 'dateColor', label: '日期颜色', controlType: 'color', defaultValue: '#999999', group: '样式' },
  { key: 'markAllReadColor', label: '已读按钮文字色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
  { key: 'markAllReadBgColor', label: '已读按钮背景色', controlType: 'color', defaultValue: '#e74c3c', group: '样式' },
  { key: 'markAllReadFontSize', label: '已读按钮字号', controlType: 'input', defaultValue: '12px', group: '样式' },
  { key: 'arrowColor', label: '箭头颜色', controlType: 'color', defaultValue: '#cccccc', group: '样式' },
  { key: 'itemGap', label: '列表项间距', controlType: 'input', defaultValue: '16px', group: '样式' },
  { key: 'dividerColor', label: '分割线颜色', controlType: 'color', defaultValue: '#f0f0f0', group: '样式' },
  { key: 'headerMarginBottom', label: '标题行底部间距', controlType: 'input', defaultValue: '12px', group: '样式' },
];

export const MpNoticeListMeta: ComponentMeta = {
  type: 'MpNoticeList',
  title: '消息通知',
  icon: 'BellOutlined',
  group: 'business',
  description: '消息通知列表，展示标签、标题、日期，支持全部已读',
  isContainer: false,
  defaultProps: {
    title: '消息通知',
    notices: [
      { id: '1', tag: '重要通知', title: '缴费模板到期通知', date: '2025-03-10' },
      { id: '2', tag: '重要通知', title: '选品缴费模板到期通知', date: '2025-03-10' },
      { id: '3', tag: '重要通知', title: '缴费模板到期通知', date: '2025-03-01' },
      { id: '4', tag: '重要通知', title: '选品缴费模板到期通知', date: '2025-03-01' },
      { id: '5', tag: '重要通知', title: '缴费模板到期通知', date: '2025-02-20' },
    ],
    emptyText: '暂无通知',
    emptyIcon: '🔔',
    maxCount: 0,
    markAllReadText: '全部已读',
    showTitle: true,
    showMarkAllRead: true,
    showArrow: true,
    showTag: true,
    showDate: true,
    showDivider: false,
    backgroundColor: '#f5f5f5',
    cardBackgroundColor: '#ffffff',
    cardBorderRadius: '8px',
    cardPadding: '16px',
    outerPadding: '12px',
    titleFontSize: '18px',
    titleColor: '#333333',
    tagColor: '#e74c3c',
    tagFontSize: '14px',
    contentFontSize: '15px',
    contentColor: '#333333',
    dateFontSize: '13px',
    dateColor: '#999999',
    markAllReadColor: '#ffffff',
    markAllReadBgColor: '#e74c3c',
    markAllReadFontSize: '12px',
    arrowColor: '#cccccc',
    itemGap: '16px',
    dividerColor: '#f0f0f0',
    headerMarginBottom: '12px',
  },
  defaultStyle: { width: '100%' },
  propsSchema: noticeListPropsSchema,
};
