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

// ─── 业务组件 ─────────────────────────────────────────────────

/** 订单列表组件 Meta */
const MpOrderListMeta: ComponentMeta = {
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
  propsSchema: [
    // ── 内容 ──
    { key: 'orders', label: '订单数据', controlType: 'json-editor', defaultValue: [], tooltip: '订单 JSON 数组，字段: id / storeName / orderType / orderTime / amount / pickupNumber / status', group: '内容' },
    { key: 'emptyText', label: '空状态文案', controlType: 'input', defaultValue: '暂无订单', group: '内容' },
    { key: 'emptyIcon', label: '空状态图标', controlType: 'input', defaultValue: '📋', tooltip: '支持 emoji 或图片 URL', group: '内容' },
    { key: 'maxCount', label: '最大显示数量', controlType: 'number', defaultValue: 0, tooltip: '0 表示不限制，超出部分隐藏', group: '内容' },
    // ── 显示字段 ──
    { key: 'showStoreIcon', label: '显示店铺图标', controlType: 'switch', defaultValue: true, group: '显示字段' },
    { key: 'showOrderType', label: '显示订单类型', controlType: 'switch', defaultValue: true, tooltip: '右上角的"自提/外卖/堂食"标签', group: '显示字段' },
    { key: 'showOrderTime', label: '显示下单时间', controlType: 'switch', defaultValue: true, group: '显示字段' },
    { key: 'showAmount', label: '显示订单金额', controlType: 'switch', defaultValue: true, group: '显示字段' },
    { key: 'showPickupNumber', label: '显示取餐号', controlType: 'switch', defaultValue: true, group: '显示字段' },
    { key: 'showStatus', label: '显示订单状态', controlType: 'switch', defaultValue: true, group: '显示字段' },
    { key: 'showDivider', label: '显示头部分割线', controlType: 'switch', defaultValue: true, group: '显示字段' },
    // ── 样式 ──
    { key: 'backgroundColor', label: '列表背景色', controlType: 'color', defaultValue: '#f5f5f5', group: '样式' },
    { key: 'cardBackgroundColor', label: '卡片背景色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
    { key: 'cardBorderRadius', label: '卡片圆角', controlType: 'input', defaultValue: '8px', group: '样式' },
    { key: 'gap', label: '卡片间距', controlType: 'input', defaultValue: '12px', group: '样式' },
    { key: 'cardPadding', label: '卡片内边距', controlType: 'input', defaultValue: '16px', group: '样式' },
    { key: 'highlightColor', label: '高亮色（金额/取餐号）', controlType: 'color', defaultValue: '#ff6600', group: '样式' },
    { key: 'tagColor', label: '标签颜色', controlType: 'color', defaultValue: '#ff6600', group: '样式' },
    { key: 'tagStyle', label: '标签样式', controlType: 'select', defaultValue: 'outlined', options: [
      { label: '描边', value: 'outlined' }, { label: '实心', value: 'filled' },
    ], group: '样式' },
    { key: 'storeNameFontSize', label: '店铺名字号', controlType: 'input', defaultValue: '16px', group: '样式' },
    { key: 'contentFontSize', label: '信息行字号', controlType: 'input', defaultValue: '14px', group: '样式' },
    { key: 'labelColor', label: '标签文字色', controlType: 'color', defaultValue: '#999999', tooltip: '"下单时间"、"订单金额" 等标签的颜色', group: '样式' },
    { key: 'valueColor', label: '默认值文字色', controlType: 'color', defaultValue: '#333333', tooltip: '下单时间等非高亮值的颜色', group: '样式' },
    { key: 'dividerColor', label: '分割线颜色', controlType: 'color', defaultValue: '#f0f0f0', group: '样式' },
  ],
};

// ─── 搜索栏 ──────────────────────────────────────────────────

/** 搜索栏组件 Meta */
const MpSearchBarMeta: ComponentMeta = {
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
  defaultStyle: { width: '100%' },
  propsSchema: [
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
  ],
};

// ─── 商户列表 ─────────────────────────────────────────────────

/** 商户列表组件 Meta */
const MpStoreListMeta: ComponentMeta = {
  type: 'MpStoreList',
  title: '商户列表',
  icon: 'ShopOutlined',
  group: 'business',
  description: '商户/店铺图文列表，左图右文布局，展示店铺名称、地址',
  isContainer: false,
  defaultProps: {
    stores: [
      { id: '1', name: '餐饮版–总店', imageUrl: 'https://via.placeholder.com/128x128/1a1a2e/ffffff?text=POS', city: '北京市', district: '石景山区' },
      { id: '2', name: '姜氏餐饮1号店', city: '北京市', district: '石景山区' },
      { id: '3', name: '姜氏餐饮2号店', city: '北京市', district: '石景山区' },
      { id: '4', name: '姜氏餐饮3号店', city: '北京市', district: '石景山区' },
    ],
    emptyText: '暂无商户',
    emptyIcon: '🏪',
    maxCount: 0,
    showImage: true,
    showAddress: true,
    showLocationIcon: true,
    showTag: true,
    backgroundColor: '#f5f5f5',
    cardBackgroundColor: '#ffffff',
    cardBorderRadius: '8px',
    gap: '12px',
    cardPadding: '16px 12px',
    imageSize: '64px',
    imageBorderRadius: '8px',
    nameFontSize: '17px',
    nameColor: '#333333',
    addressFontSize: '13px',
    addressColor: '#999999',
    locationIconColor: '#999999',
    tagColor: '#ffffff',
    tagBackgroundColor: '#ff4d4f',
  },
  defaultStyle: { width: '100%' },
  propsSchema: [
    // 内容
    { key: 'stores', label: '店铺数据', controlType: 'json-editor', defaultValue: [], tooltip: '店铺 JSON 数组，字段: id / name / imageUrl / address(或 city+district) / tag', group: '内容' },
    { key: 'emptyText', label: '空状态文案', controlType: 'input', defaultValue: '暂无商户', group: '内容' },
    { key: 'emptyIcon', label: '空状态图标', controlType: 'input', defaultValue: '🏪', group: '内容' },
    { key: 'maxCount', label: '最大显示数量', controlType: 'number', defaultValue: 0, tooltip: '0 表示不限制', group: '内容' },
    // 显示字段
    { key: 'showImage', label: '显示店铺图片', controlType: 'switch', defaultValue: true, group: '显示字段' },
    { key: 'showAddress', label: '显示地址', controlType: 'switch', defaultValue: true, group: '显示字段' },
    { key: 'showLocationIcon', label: '显示定位图标', controlType: 'switch', defaultValue: true, group: '显示字段' },
    { key: 'showTag', label: '显示标签', controlType: 'switch', defaultValue: true, tooltip: '店铺名右侧的标签', group: '显示字段' },
    // 样式
    { key: 'backgroundColor', label: '列表背景色', controlType: 'color', defaultValue: '#f5f5f5', group: '样式' },
    { key: 'cardBackgroundColor', label: '卡片背景色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
    { key: 'cardBorderRadius', label: '卡片圆角', controlType: 'input', defaultValue: '8px', group: '样式' },
    { key: 'gap', label: '卡片间距', controlType: 'input', defaultValue: '12px', group: '样式' },
    { key: 'cardPadding', label: '卡片内边距', controlType: 'input', defaultValue: '16px 12px', group: '样式' },
    { key: 'imageSize', label: '图片尺寸', controlType: 'input', defaultValue: '64px', group: '样式' },
    { key: 'imageBorderRadius', label: '图片圆角', controlType: 'input', defaultValue: '8px', group: '样式' },
    { key: 'nameFontSize', label: '名称字号', controlType: 'input', defaultValue: '17px', group: '样式' },
    { key: 'nameColor', label: '名称颜色', controlType: 'color', defaultValue: '#333333', group: '样式' },
    { key: 'addressFontSize', label: '地址字号', controlType: 'input', defaultValue: '13px', group: '样式' },
    { key: 'addressColor', label: '地址颜色', controlType: 'color', defaultValue: '#999999', group: '样式' },
    { key: 'locationIconColor', label: '定位图标色', controlType: 'color', defaultValue: '#999999', group: '样式' },
    { key: 'tagColor', label: '标签文字色', controlType: 'color', defaultValue: '#ffffff', group: '样式' },
    { key: 'tagBackgroundColor', label: '标签背景色', controlType: 'color', defaultValue: '#ff4d4f', group: '样式' },
  ],
};

// ─── 消息通知 ──────────────────────────────────────────────────

/** 消息通知列表组件 Meta */
const MpNoticeListMeta: ComponentMeta = {
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
  propsSchema: [
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
  ],
};

// ─── 底部导航栏 ───────────────────────────────────────────────

/** 底部 TabBar 组件 Meta */
const MpTabBarMeta: ComponentMeta = {
  type: 'MpTabBar',
  title: '底部导航栏',
  icon: 'AppstoreOutlined',
  group: 'layout',
  description: '底部 TabBar 导航栏，支持图标 + 文字、选中态切换、页面跳转',
  isContainer: false,
  defaultProps: {
    tabs: [
      { key: 'home', text: '首页', pagePath: '/pages/index/index' },
      { key: 'mine', text: '我的', pagePath: '/pages/mine/index' },
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
  defaultStyle: { width: '100%' },
  propsSchema: [
    // 内容
    { key: 'tabs', label: 'Tab 配置', controlType: 'json-editor', defaultValue: [], tooltip: 'JSON 数组，每项: { key, text, iconUrl?, activeIconUrl?, pagePath? }', group: '内容' },
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
    { key: 'fixed', label: '固定底部', controlType: 'switch', defaultValue: true, tooltip: '开启后 TabBar 固定在手机壳底部', group: '行为' },
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
  MpOrderListMeta,
  MpNoticeListMeta,
  MpSearchBarMeta,
  MpStoreListMeta,
  MpTabBarMeta,
];

/** 按 type 快速查找 Meta */
export const metaMap = new Map<string, ComponentMeta>(
  allComponentMetas.map((m) => [m.type, m]),
);
