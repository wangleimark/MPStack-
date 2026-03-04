import React, { useState, useCallback } from 'react';
import { View, Text, Input } from '@tarojs/components';
import type { ComponentMeta, PropSchema } from '@mpstack/schema';

// ─── 数据类型 ─────────────────────────────────────────────────

export interface MpSearchBarProps {
  // ── 内容 ──
  /** 输入框占位文本 */
  placeholder?: string;
  /** 默认搜索关键词 */
  defaultValue?: string;
  /** 搜索按钮文字 */
  buttonText?: string;

  // ── 显示 ──
  /** 是否显示搜索图标 */
  showSearchIcon?: boolean;
  /** 是否显示搜索按钮 */
  showButton?: boolean;

  // ── 样式 ──
  /** 外层背景色 */
  backgroundColor?: string;
  /** 输入框背景色 */
  inputBackgroundColor?: string;
  /** 输入框圆角 */
  inputBorderRadius?: string;
  /** 输入框文字颜色 */
  inputColor?: string;
  /** 占位文字颜色 */
  placeholderColor?: string;
  /** 输入框字号 */
  inputFontSize?: string;
  /** 按钮文字颜色 */
  buttonColor?: string;
  /** 按钮字号 */
  buttonFontSize?: string;
  /** 外层上下内边距 */
  paddingVertical?: string;
  /** 外层左右内边距 */
  paddingHorizontal?: string;
  /** 输入框高度 */
  inputHeight?: string;

  // ── 行为 ──
  /** 搜索回调 */
  onSearch?: (keyword: string) => void;
}

// ─── 搜索图标 SVG path ───────────────────────────────────────

const SearchIcon: React.FC<{ color: string; size: string }> = ({ color, size }) => (
  <View style={{ width: size, height: size, marginRight: '8px', flexShrink: 0 }}>
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      fill={color}
    >
      <path d="M469.333 810.667c-188.522 0-341.333-152.811-341.333-341.334S280.811 128 469.333 128s341.334 152.811 341.334 341.333c0 82.474-29.355 158.202-78.167 217.19l196.944 196.944a42.667 42.667 0 0 1-60.34 60.34L672.16 746.862c-58.988 48.812-134.716 78.167-217.19 78.167l-0.001-14.362zm0-85.334c141.385 0 256-114.615 256-256s-114.615-256-256-256-256 114.615-256 256 114.615 256 256 256z" />
    </svg>
  </View>
);

// ─── 组件实现 ─────────────────────────────────────────────────

export const MpSearchBar: React.FC<MpSearchBarProps> = ({
  placeholder = '搜索商户名称',
  defaultValue = '',
  buttonText = '搜索',
  showSearchIcon = true,
  showButton = true,
  backgroundColor = '#ffffff',
  inputBackgroundColor = '#f5f5f5',
  inputBorderRadius = '20px',
  inputColor = '#333333',
  placeholderColor = '#cccccc',
  inputFontSize = '14px',
  buttonColor = '#333333',
  buttonFontSize = '16px',
  paddingVertical = '8px',
  paddingHorizontal = '16px',
  inputHeight = '40px',
  onSearch,
}) => {
  const [keyword, setKeyword] = useState(defaultValue);

  const handleConfirm = useCallback(() => {
    onSearch?.(keyword);
  }, [keyword, onSearch]);

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor,
        padding: `${paddingVertical} ${paddingHorizontal}`,
      }}
    >
      {/* 输入区域 */}
      <View
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: inputBackgroundColor,
          borderRadius: inputBorderRadius,
          height: inputHeight,
          padding: '0 16px',
        }}
      >
        {showSearchIcon && (
          <SearchIcon color={placeholderColor} size="16px" />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          placeholderStyle={`color: ${placeholderColor}; font-size: ${inputFontSize}`}
          value={keyword}
          onInput={(e) => setKeyword(e.detail.value)}
          onConfirm={handleConfirm}
          style={{
            flex: 1,
            fontSize: inputFontSize,
            color: inputColor,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
          }}
        />
      </View>

      {/* 搜索按钮 */}
      {showButton && (
        <View
          style={{
            marginLeft: '12px',
            flexShrink: 0,
            cursor: 'pointer',
          }}
          onClick={handleConfirm}
        >
          <Text
            style={{
              fontSize: buttonFontSize,
              color: buttonColor,
              fontWeight: '500',
            }}
          >
            {buttonText}
          </Text>
        </View>
      )}
    </View>
  );
};

// ─── ComponentMeta ───────────────────────────────────────────

const searchBarPropsSchema: PropSchema[] = [
  // 内容
  { key: 'placeholder', label: '占位文本', controlType: 'input', defaultValue: '搜索商户名称', group: '内容' },
  { key: 'defaultValue', label: '默认关键词', controlType: 'input', defaultValue: '', group: '内容' },
  { key: 'buttonText', label: '按钮文字', controlType: 'input', defaultValue: '搜索', group: '内容' },
  // 显示
  { key: 'showSearchIcon', label: '显示搜索图标', controlType: 'switch', defaultValue: true, group: '显示' },
  { key: 'showButton', label: '显示搜索按钮', controlType: 'switch', defaultValue: true, group: '显示' },
  // 样式
  { key: 'backgroundColor', label: '外层背景色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
  { key: 'inputBackgroundColor', label: '输入框背景色', controlType: 'color', defaultValue: '#f5f5f5', group: '样式' },
  { key: 'inputBorderRadius', label: '输入框圆角', controlType: 'input', defaultValue: '20px', group: '样式' },
  { key: 'inputColor', label: '输入文字色', controlType: 'color', defaultValue: '#333333', group: '样式' },
  { key: 'placeholderColor', label: '占位文字色', controlType: 'color', defaultValue: '#cccccc', group: '样式' },
  { key: 'inputFontSize', label: '输入框字号', controlType: 'input', defaultValue: '14px', group: '样式' },
  { key: 'buttonColor', label: '按钮文字色', controlType: 'color', defaultValue: '#333333', group: '样式' },
  { key: 'buttonFontSize', label: '按钮字号', controlType: 'input', defaultValue: '16px', group: '样式' },
  { key: 'paddingVertical', label: '上下内边距', controlType: 'input', defaultValue: '8px', group: '样式' },
  { key: 'paddingHorizontal', label: '左右内边距', controlType: 'input', defaultValue: '16px', group: '样式' },
  { key: 'inputHeight', label: '输入框高度', controlType: 'input', defaultValue: '40px', group: '样式' },
];

export const MpSearchBarMeta: ComponentMeta = {
  type: 'MpSearchBar',
  title: '搜索栏',
  icon: 'SearchOutlined',
  group: 'basic',
  description: '搜索输入框，支持占位文本、搜索图标、搜索按钮配置',
  isContainer: false,
  defaultProps: {
    placeholder: '搜索商户名称',
    defaultValue: '',
    buttonText: '搜索',
    showSearchIcon: true,
    showButton: true,
    backgroundColor: '#ffffff',
    inputBackgroundColor: '#f5f5f5',
    inputBorderRadius: '20px',
    inputColor: '#333333',
    placeholderColor: '#cccccc',
    inputFontSize: '14px',
    buttonColor: '#333333',
    buttonFontSize: '16px',
    paddingVertical: '8px',
    paddingHorizontal: '16px',
    inputHeight: '40px',
  },
  defaultStyle: {
    width: '100%',
  },
  propsSchema: searchBarPropsSchema,
};
