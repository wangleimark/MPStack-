/**
 * 编辑器可用组件元信息注册表
 *
 * 左侧面板从此处读取所有可拖拽的组件列表。
 * 每新增一个组件，在此处追加 Meta 即可。
 *
 * 注意：此文件不应 import @mpstack/ui 的组件实现，
 * 因为 UI 包中的 Taro 组件依赖 Stencil 运行时，在纯 Vite 环境中会报错。
 * 只引入 @mpstack/schema 的类型定义。
 */
import type { ComponentMeta } from '@mpstack/schema';

// ─── 基础组件 ──────────────────────────────────────────────────

/** 文本组件 Meta */
const MpTextMeta: ComponentMeta = {
  type: 'MpText',
  title: '文本',
  icon: 'FontSizeOutlined',
  group: 'basic',
  description: '基础文本组件，支持字号、颜色、对齐、多行省略',
  isContainer: false,
  defaultProps: {
    content: '请输入文本',
    fontSize: '14px',
    color: '#333333',
    bold: false,
    textAlign: 'left',
  },
  propsSchema: [
    { key: 'content', label: '文本内容', controlType: 'textarea', defaultValue: '请输入文本', group: '内容' },
    { key: 'fontSize', label: '字体大小', controlType: 'input', defaultValue: '14px', group: '样式' },
    { key: 'color', label: '字体颜色', controlType: 'color', defaultValue: '#333333', group: '样式' },
    { key: 'bold', label: '加粗', controlType: 'switch', defaultValue: false, group: '样式' },
    { key: 'textAlign', label: '对齐方式', controlType: 'select', defaultValue: 'left', options: [
      { label: '居左', value: 'left' }, { label: '居中', value: 'center' }, { label: '居右', value: 'right' },
    ], group: '样式' },
    { key: 'maxLines', label: '最大行数', controlType: 'number', defaultValue: 0, tooltip: '0 表示不限制', group: '样式' },
  ],
};

/** 图片组件 Meta */
const MpImageMeta: ComponentMeta = {
  type: 'MpImage',
  title: '图片',
  icon: 'PictureOutlined',
  group: 'basic',
  description: '基础图片组件，支持填充模式和圆角',
  isContainer: false,
  defaultProps: {
    src: 'https://via.placeholder.com/375x200/e8e8e8/999?text=Image',
    alt: '图片',
    width: '100%',
    height: '200px',
    borderRadius: '0',
    mode: 'cover',
  },
  propsSchema: [
    { key: 'src', label: '图片地址', controlType: 'input', defaultValue: '', group: '内容' },
    { key: 'alt', label: '描述文字', controlType: 'input', defaultValue: '图片', group: '内容' },
    { key: 'width', label: '宽度', controlType: 'input', defaultValue: '100%', group: '样式' },
    { key: 'height', label: '高度', controlType: 'input', defaultValue: '200px', group: '样式' },
    { key: 'borderRadius', label: '圆角', controlType: 'input', defaultValue: '0', group: '样式' },
    { key: 'mode', label: '填充模式', controlType: 'select', defaultValue: 'cover', options: [
      { label: '覆盖', value: 'cover' }, { label: '包含', value: 'contain' }, { label: '拉伸', value: 'fill' },
    ], group: '样式' },
  ],
};

// ─── 布局组件 ──────────────────────────────────────────────────

/** 容器组件 Meta */
const MpContainerMeta: ComponentMeta = {
  type: 'MpContainer',
  title: '容器',
  icon: 'BorderOuterOutlined',
  group: 'layout',
  description: 'Flex 布局容器，可拖入子组件',
  isContainer: true,
  defaultProps: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'transparent',
  },
  propsSchema: [
    { key: 'flexDirection', label: '排列方向', controlType: 'select', defaultValue: 'column', options: [
      { label: '纵向', value: 'column' }, { label: '横向', value: 'row' },
    ], group: '布局' },
    { key: 'justifyContent', label: '主轴对齐', controlType: 'select', defaultValue: 'flex-start', options: [
      { label: '起始', value: 'flex-start' }, { label: '居中', value: 'center' },
      { label: '末尾', value: 'flex-end' }, { label: '两端', value: 'space-between' },
    ], group: '布局' },
    { key: 'alignItems', label: '交叉轴对齐', controlType: 'select', defaultValue: 'stretch', options: [
      { label: '拉伸', value: 'stretch' }, { label: '起始', value: 'flex-start' },
      { label: '居中', value: 'center' }, { label: '末尾', value: 'flex-end' },
    ], group: '布局' },
    { key: 'gap', label: '间距', controlType: 'input', defaultValue: '8px', group: '布局' },
    { key: 'padding', label: '内边距', controlType: 'input', defaultValue: '12px', group: '样式' },
    { key: 'backgroundColor', label: '背景色', controlType: 'color', defaultValue: 'transparent', group: '样式' },
  ],
};

// ─── 媒体组件 ──────────────────────────────────────────────────

/** 轮播图组件 Meta */
const MpBannerMeta: ComponentMeta = {
  type: 'MpBanner',
  title: '轮播图',
  icon: 'PictureOutlined',
  group: 'media',
  description: '支持自动轮播、循环播放、指示点配置的轮播图组件',
  isContainer: false,
  defaultProps: {
    items: [
      { imageUrl: 'https://via.placeholder.com/750x400/1890ff/ffffff?text=Banner+1' },
      { imageUrl: 'https://via.placeholder.com/750x400/52c41a/ffffff?text=Banner+2' },
      { imageUrl: 'https://via.placeholder.com/750x400/faad14/ffffff?text=Banner+3' },
    ],
    height: '200px',
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    indicatorDots: true,
    indicatorColor: 'rgba(255, 255, 255, 0.4)',
    indicatorActiveColor: '#ffffff',
    borderRadius: '0',
  },
  defaultStyle: {
    width: '100%',
    margin: '0',
  },
  propsSchema: [
    { key: 'items', label: '轮播图片', controlType: 'json-editor', defaultValue: [], tooltip: '配置图片列表，每项包含 imageUrl 和可选的 linkUrl', group: '内容' },
    { key: 'height', label: '高度', controlType: 'input', defaultValue: '200px', group: '样式' },
    { key: 'borderRadius', label: '圆角', controlType: 'input', defaultValue: '0', group: '样式' },
    { key: 'autoplay', label: '自动播放', controlType: 'switch', defaultValue: true, group: '行为' },
    { key: 'interval', label: '切换间隔(ms)', controlType: 'number', defaultValue: 3000, group: '行为' },
    { key: 'duration', label: '动画时长(ms)', controlType: 'number', defaultValue: 500, group: '行为' },
    { key: 'circular', label: '循环轮播', controlType: 'switch', defaultValue: true, group: '行为' },
    { key: 'indicatorDots', label: '显示指示点', controlType: 'switch', defaultValue: true, group: '行为' },
    { key: 'indicatorColor', label: '指示点颜色', controlType: 'color', defaultValue: 'rgba(255, 255, 255, 0.4)', group: '样式' },
    { key: 'indicatorActiveColor', label: '指示点激活色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
  ],
};

// ─── 导出 ──────────────────────────────────────────────────────

/**
 * 所有可用组件的 Meta 列表
 * 按分组排列，左侧面板直接消费
 */
export const allComponentMetas: ComponentMeta[] = [
  MpTextMeta,
  MpImageMeta,
  MpContainerMeta,
  MpBannerMeta,
];

/** 按 type 快速查找 Meta */
export const metaMap = new Map<string, ComponentMeta>(
  allComponentMetas.map((m) => [m.type, m]),
);
