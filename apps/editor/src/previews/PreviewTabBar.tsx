/**
 * PreviewTabBar —— 编辑器画布中的底部导航栏预览组件
 *
 * 纯 HTML/CSS + React，还原截图样式：
 * 白色底栏 + 图标 + 文字，选中态变红色
 *
 * fixed=true 时依赖 Canvas 的 flex 布局 + marginTop: auto 固定在手机壳底部
 */
import React, { useState, useCallback, useEffect } from 'react';

interface TabBarItem {
  key: string;
  text: string;
  iconUrl?: string;
  activeIconUrl?: string;
  pagePath?: string;
}

interface Props {
  tabs?: TabBarItem[];
  activeKey?: string;
  backgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  fontSize?: string;
  iconSize?: string;
  iconTextGap?: string;
  height?: string;
  borderTopColor?: string;
  showBorderTop?: boolean;
  fixed?: boolean;
  safeAreaBottom?: string;
  /** Tab 切换回调（编辑器中用于切换页面） */
  onTabChange?: (key: string) => void;
}

// 内置首页 icon
const DefaultHomeIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg viewBox="0 0 1024 1024" width={size} height={size} fill={color}>
    <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
  </svg>
);

// 内置用户 icon
const DefaultUserIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg viewBox="0 0 1024 1024" width={size} height={size} fill={color}>
    <path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9c54.8 54.8 85.8 127.1 87.8 204.3c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
  </svg>
);

const builtInIcons: Record<string, React.FC<{ color: string; size: number }>> = {
  home: DefaultHomeIcon,
  mine: DefaultUserIcon,
};

export const PreviewTabBar: React.FC<Props> = ({
  tabs = [],
  activeKey,
  backgroundColor = '#ffffff',
  textColor = '#999999',
  activeTextColor = '#e74c3c',
  fontSize = '11px',
  iconSize = '24px',
  iconTextGap = '4px',
  height = '56px',
  borderTopColor = '#e8e8e8',
  showBorderTop = true,
  safeAreaBottom = '0px',
  onTabChange,
}) => {
  const [currentKey, setCurrentKey] = useState(activeKey || (tabs[0]?.key ?? ''));
  const iconSizePx = parseInt(iconSize) || 24;
  const heightPx = parseInt(height) || 56;
  const safeAreaPx = parseInt(safeAreaBottom) || 0;

  // 当外部 activeKey 变化时同步内部状态（如 store 切换了 tab）
  useEffect(() => {
    if (activeKey !== undefined && activeKey !== currentKey) {
      setCurrentKey(activeKey);
    }
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabClick = useCallback((key: string) => {
    setCurrentKey(key);
    onTabChange?.(key);
  }, [onTabChange]);

  /**
   * 阻止 pointerDown 冒泡到 SortableNode 的 dnd-kit listener，
   * 防止拖拽引擎拦截 Tab 的点击事件
   */
  const stopPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  if (tabs.length === 0) {
    return (
      <div
        style={{
          height: heightPx,
          backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 12,
          borderTop: showBorderTop ? `1px solid ${borderTopColor}` : 'none',
        }}
      >
        请配置 Tab 项
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor,
        borderTop: showBorderTop ? `1px solid ${borderTopColor}` : 'none',
        paddingBottom: safeAreaPx,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: heightPx,
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentKey === tab.key;
          const color = isActive ? activeTextColor : textColor;

          const hasCustomIcon = tab.iconUrl || tab.activeIconUrl;
          const iconUrl = isActive
            ? tab.activeIconUrl || tab.iconUrl
            : tab.iconUrl;

          const BuiltInIcon = builtInIcons[tab.key];

          return (
            <div
              key={tab.key}
              // 关键：阻止 pointerDown 冒泡，让 tab 点击正常工作
              onPointerDown={stopPointerDown}
              onClick={(e) => {
                e.stopPropagation();
                handleTabClick(tab.key);
              }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                height: '100%',
                transition: 'color .15s',
              }}
            >
              {/* 图标 */}
              {hasCustomIcon && iconUrl ? (
                <img
                  src={iconUrl}
                  alt=""
                  style={{
                    width: iconSizePx,
                    height: iconSizePx,
                    marginBottom: parseInt(iconTextGap) || 4,
                    display: 'block',
                  }}
                />
              ) : BuiltInIcon ? (
                <div style={{ marginBottom: parseInt(iconTextGap) || 4 }}>
                  <BuiltInIcon color={color} size={iconSizePx} />
                </div>
              ) : null}

              {/* 文字 */}
              <span
                style={{
                  fontSize: parseInt(fontSize),
                  color,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {tab.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
