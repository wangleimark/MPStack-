/**
 * 通用样式定义
 * 与小程序和 Web 端共享的 CSS 子集
 */
export interface ComponentStyle {
  /** 宽度，如 '100%', '375px', 'auto' */
  width?: string;
  /** 高度 */
  height?: string;
  /** 内边距，如 '12px 16px' */
  padding?: string;
  /** 外边距 */
  margin?: string;
  /** 背景色 */
  backgroundColor?: string;
  /** 背景图 */
  backgroundImage?: string;
  /** 圆角，如 '8px' */
  borderRadius?: string;
  /** 边框，如 '1px solid #eee' */
  border?: string;
  /** 字体大小 */
  fontSize?: string;
  /** 字体颜色 */
  color?: string;
  /** 文本对齐 */
  textAlign?: 'left' | 'center' | 'right';
  /** 弹性布局方向 */
  flexDirection?: 'row' | 'column';
  /** 弹性布局对齐 */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** 自定义扩展样式 */
  [key: string]: string | number | undefined;
}
