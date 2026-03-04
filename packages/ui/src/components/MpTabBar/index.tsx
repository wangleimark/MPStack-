import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { ComponentMeta, PropSchema } from '@mpstack/schema';

// ─── 数据类型 ─────────────────────────────────────────────────

export interface TabBarItem {
  /** 唯一标识 */
  key: string;
  /** Tab 文字 */
  text: string;
  /** 默认图标 URL */
  iconUrl?: string;
  /** 选中状态图标 URL */
  activeIconUrl?: string;
  /** 跳转路径（如 /pages/index/index） */
  pagePath?: string;
}

export interface MpTabBarProps {
  // ── 内容 ──
  /** Tab 列表 */
  tabs: TabBarItem[];
  /** 默认选中 key */
  activeKey?: string;

  // ── 样式 ──
  /** 背景色 */
  backgroundColor?: string;
  /** 默认文字颜色 */
  textColor?: string;
  /** 选中文字颜色 */
  activeTextColor?: string;
  /** 文字字号 */
  fontSize?: string;
  /** 图标大小 */
  iconSize?: string;
  /** 图标与文字间距 */
  iconTextGap?: string;
  /** TabBar 高度 */
  height?: string;
  /** 顶部边框颜色 */
  borderTopColor?: string;
  /** 是否显示顶部边框 */
  showBorderTop?: boolean;
  /** 是否固定在底部 */
  fixed?: boolean;
  /** 安全区底部内边距 (iPhone X 等) */
  safeAreaBottom?: string;

  // ── 行为 ──
  /** 切换 tab 回调 */
  onTabChange?: (key: string, tab: TabBarItem) => void;
}

// ─── 内置默认图标 SVG ─────────────────────────────────────────

const HomeIconSvg = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="${color}"><path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"/></svg>`)}`;

const UserIconSvg = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="${color}"><path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9c54.8 54.8 85.8 127.1 87.8 204.3c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"/></svg>`)}`;

// ─── 组件实现 ─────────────────────────────────────────────────

export const MpTabBar: React.FC<MpTabBarProps> = ({
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
  fixed = true,
  safeAreaBottom = '0px',
  onTabChange,
}) => {
  const [currentKey, setCurrentKey] = useState(activeKey || (tabs[0]?.key ?? ''));

  // 当外部 activeKey 变化时同步
  useEffect(() => {
    if (activeKey !== undefined) {
      setCurrentKey(activeKey);
    }
  }, [activeKey]);

  const handleTabClick = useCallback(
    (tab: TabBarItem) => {
      // 如果已经是当前 tab，不重复触发
      if (tab.key === currentKey) return;

      setCurrentKey(tab.key);

      // 触发回调
      onTabChange?.(tab.key, tab);

      // 如果配置了 pagePath，执行页面跳转
      if (tab.pagePath) {
        // 尝试 switchTab，失败则降级到 navigateTo
        Taro.switchTab({ url: tab.pagePath }).catch(() => {
          Taro.navigateTo({ url: tab.pagePath! }).catch((err) => {
            console.warn(`[MpTabBar] 跳转失败: ${tab.pagePath}`, err);
          });
        });
      }
    },
    [currentKey, onTabChange],
  );

  if (tabs.length === 0) {
    return (
      <View
        style={{
          height,
          backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#999', fontSize: '12px' }}>请配置 Tab 项</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor,
        borderTop: showBorderTop ? `1px solid ${borderTopColor}` : 'none',
        ...(fixed
          ? {
              position: 'fixed',
              bottom: '0',
              left: '0',
              right: '0',
              zIndex: 1000,
            }
          : {}),
        paddingBottom: safeAreaBottom,
      }}
    >
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height,
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentKey === tab.key;
          const color = isActive ? activeTextColor : textColor;

          const iconUrl = isActive
            ? tab.activeIconUrl || tab.iconUrl
            : tab.iconUrl;

          return (
            <View
              key={tab.key}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={() => handleTabClick(tab)}
            >
              {iconUrl && (
                <Image
                  src={iconUrl}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    marginBottom: iconTextGap,
                  }}
                />
              )}
              <Text
                style={{
                  fontSize,
                  color,
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {tab.text}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ─── ComponentMeta ───────────────────────────────────────────

const tabBarPropsSchema: PropSchema[] = [
  // 内容
  {
    key: 'tabs',
    label: 'Tab 配置',
    controlType: 'json-editor',
    defaultValue: [],
    tooltip: 'JSON 数组，每项: { key, text, iconUrl?, activeIconUrl?, pagePath? }',
    group: '内容',
  },
  { key: 'activeKey', label: '默认选中项', controlType: 'input', defaultValue: 'home', tooltip: '与 tab.key 对应', group: '内容' },
  // 样式
  { key: 'backgroundColor', label: '背景色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
  { key: 'textColor', label: '默认文字色', controlType: 'color', defaultValue: '#999999', group: '样式' },
  { key: 'activeTextColor', label: '选中文字色', controlType: 'color', defaultValue: '#e74c3c', group: '样式' },
  { key: 'fontSize', label: '文字字号', controlType: 'input', defaultValue: '11px', group: '样式' },
  { key: 'iconSize', label: '图标大小', controlType: 'input', defaultValue: '24px', group: '样式' },
  { key: 'iconTextGap', label: '图标文字间距', controlType: 'input', defaultValue: '4px', group: '样式' },
  { key: 'height', label: 'TabBar 高度', controlType: 'input', defaultValue: '56px', group: '样式' },
  { key: 'borderTopColor', label: '顶部边框色', controlType: 'color', defaultValue: '#e8e8e8', group: '样式' },
  { key: 'showBorderTop', label: '显示顶部边框', controlType: 'switch', defaultValue: true, group: '样式' },
  { key: 'safeAreaBottom', label: '安全区底部间距', controlType: 'input', defaultValue: '0px', tooltip: 'iPhone X 等设备底部安全区', group: '样式' },
  // 行为
  { key: 'fixed', label: '固定底部', controlType: 'switch', defaultValue: true, tooltip: '开启后 TabBar 固定在页面底部', group: '行为' },
];

export const MpTabBarMeta: ComponentMeta = {
  type: 'MpTabBar',
  title: '底部导航栏',
  icon: 'AppstoreOutlined',
  group: 'layout',
  description: '底部 TabBar 导航栏，支持图标 + 文字、选中态切换、页面跳转',
  isContainer: false,
  defaultProps: {
    tabs: [
      {
        key: 'home',
        text: '首页',
        iconUrl: HomeIconSvg('#999999'),
        activeIconUrl: HomeIconSvg('#e74c3c'),
        pagePath: '/pages/index/index',
      },
      {
        key: 'mine',
        text: '我的',
        iconUrl: UserIconSvg('#999999'),
        activeIconUrl: UserIconSvg('#e74c3c'),
        pagePath: '/pages/mine/index',
      },
    ],
    activeKey: 'home',
    backgroundColor: '#ffffff',
    textColor: '#999999',
    activeTextColor: '#e74c3c',
    fontSize: '11px',
    iconSize: '24px',
    iconTextGap: '4px',
    height: '56px',
    borderTopColor: '#e8e8e8',
    showBorderTop: true,
    fixed: true,
    safeAreaBottom: '0px',
  },
  defaultStyle: {
    width: '100%',
  },
  propsSchema: tabBarPropsSchema,
};
