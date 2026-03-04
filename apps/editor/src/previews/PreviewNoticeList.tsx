/**
 * PreviewNoticeList —— 编辑器画布中的消息通知列表预览组件
 *
 * 纯 HTML/CSS + React，还原截图样式：
 * 灰色背景 + 白色卡片 + 标题行（消息通知 + 全部已读 + 箭头）+ 通知列表
 */
import React from 'react';

interface NoticeItem {
  id: string;
  tag?: string;
  title: string;
  date: string;
  read?: boolean;
}

interface Props {
  title?: string;
  notices?: NoticeItem[];
  emptyText?: string;
  emptyIcon?: string;
  maxCount?: number;
  markAllReadText?: string;
  showTitle?: boolean;
  showMarkAllRead?: boolean;
  showArrow?: boolean;
  showTag?: boolean;
  showDate?: boolean;
  showDivider?: boolean;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderRadius?: string;
  cardPadding?: string;
  outerPadding?: string;
  titleFontSize?: string;
  titleColor?: string;
  tagColor?: string;
  tagFontSize?: string;
  contentFontSize?: string;
  contentColor?: string;
  dateFontSize?: string;
  dateColor?: string;
  markAllReadColor?: string;
  markAllReadBgColor?: string;
  markAllReadFontSize?: string;
  arrowColor?: string;
  itemGap?: string;
  dividerColor?: string;
  headerMarginBottom?: string;
}

export const PreviewNoticeList: React.FC<Props> = ({
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
}) => {
  const displayNotices = maxCount > 0 ? notices.slice(0, maxCount) : notices;
  const itemGapPx = parseInt(itemGap) || 16;

  if (displayNotices.length === 0 && !showTitle) {
    return (
      <div
        style={{
          backgroundColor,
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 32 }}>{emptyIcon}</span>
        <span style={{ fontSize: 13, color: dateColor }}>{emptyText}</span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor, padding: outerPadding }}>
      <div
        style={{
          backgroundColor: cardBackgroundColor,
          borderRadius: parseInt(cardBorderRadius) || 8,
          padding: cardPadding,
        }}
      >
        {/* ── 标题行 ── */}
        {showTitle && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: parseInt(headerMarginBottom) || 12,
            }}
          >
            <span
              style={{
                fontSize: parseInt(titleFontSize) || 18,
                fontWeight: 'bold',
                color: titleColor,
              }}
            >
              {title}
            </span>

            {showMarkAllRead && (
              <span
                style={{
                  marginLeft: 12,
                  padding: '2px 10px',
                  borderRadius: 12,
                  backgroundColor: markAllReadBgColor,
                  color: markAllReadColor,
                  fontSize: parseInt(markAllReadFontSize) || 12,
                  lineHeight: '18px',
                  whiteSpace: 'nowrap',
                }}
              >
                {markAllReadText}
              </span>
            )}

            {showArrow && (
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 18,
                  color: arrowColor,
                  flexShrink: 0,
                }}
              >
                ›
              </span>
            )}
          </div>
        )}

        {/* ── 通知列表 ── */}
        {displayNotices.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '20px 0',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>{emptyIcon}</span>
            <span style={{ fontSize: 13, color: dateColor }}>{emptyText}</span>
          </div>
        ) : (
          displayNotices.map((notice, index) => (
            <div key={notice.id || index}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: index === 0 ? 0 : itemGapPx,
                  paddingBottom:
                    index < displayNotices.length - 1 && showDivider ? itemGapPx : 0,
                }}
              >
                {/* 左：标签 + 标题 */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showTag && notice.tag && (
                    <span
                      style={{
                        fontSize: parseInt(tagFontSize) || 14,
                        color: tagColor,
                        fontWeight: 'bold',
                        flexShrink: 0,
                        marginRight: 4,
                      }}
                    >
                      【{notice.tag}】
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: parseInt(contentFontSize) || 15,
                      color: notice.read ? dateColor : contentColor,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {notice.title}
                  </span>
                </div>

                {/* 右：日期 */}
                {showDate && (
                  <span
                    style={{
                      fontSize: parseInt(dateFontSize) || 13,
                      color: dateColor,
                      flexShrink: 0,
                      marginLeft: 12,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {notice.date}
                  </span>
                )}
              </div>

              {/* 分割线 */}
              {showDivider && index < displayNotices.length - 1 && (
                <div
                  style={{
                    height: 1,
                    backgroundColor: dividerColor,
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
