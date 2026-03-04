/**
 * PreviewSearchBar —— 编辑器画布中的搜索栏预览组件
 *
 * 纯 HTML/CSS + React，还原截图样式：
 * 圆角输入框 + 放大镜图标 + 搜索按钮
 */
import React from 'react';

interface Props {
  placeholder?: string;
  defaultValue?: string;
  buttonText?: string;
  showSearchIcon?: boolean;
  showButton?: boolean;
  backgroundColor?: string;
  inputBackgroundColor?: string;
  inputBorderRadius?: string;
  inputColor?: string;
  placeholderColor?: string;
  inputFontSize?: string;
  buttonColor?: string;
  buttonFontSize?: string;
  paddingVertical?: string;
  paddingHorizontal?: string;
  inputHeight?: string;
}

export const PreviewSearchBar: React.FC<Props> = ({
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
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor,
        padding: `${paddingVertical} ${paddingHorizontal}`,
      }}
    >
      {/* 输入区域 */}
      <div
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
          <svg
            viewBox="0 0 1024 1024"
            width="16"
            height="16"
            fill={placeholderColor}
            style={{ marginRight: 8, flexShrink: 0 }}
          >
            <path d="M469.333 810.667c-188.522 0-341.333-152.811-341.333-341.334S280.811 128 469.333 128s341.334 152.811 341.334 341.333c0 82.474-29.355 158.202-78.167 217.19l196.944 196.944a42.667 42.667 0 0 1-60.34 60.34L672.16 746.862c-58.988 48.812-134.716 78.167-217.19 78.167l-0.001-14.362zm0-85.334c141.385 0 256-114.615 256-256s-114.615-256-256-256-256 114.615-256 256 114.615 256 256 256z" />
          </svg>
        )}
        <span
          style={{
            flex: 1,
            fontSize: parseInt(inputFontSize),
            color: defaultValue ? inputColor : placeholderColor,
            lineHeight: inputHeight,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {defaultValue || placeholder}
        </span>
      </div>

      {/* 搜索按钮 */}
      {showButton && (
        <span
          style={{
            marginLeft: 12,
            fontSize: parseInt(buttonFontSize),
            color: buttonColor,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {buttonText}
        </span>
      )}
    </div>
  );
};
