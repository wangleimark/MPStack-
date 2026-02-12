/**
 * Action —— 用户交互行为定义
 *
 * 描述点击/触摸事件触发的行为，如页面跳转、弹窗、接口调用等。
 * 每个组件可绑定多个 Action（按顺序执行）。
 */

/** 页面跳转 */
export interface NavigateAction {
  type: 'navigate';
  /** 目标页面路径，如 '/pages/detail/index' */
  url: string;
  /** 跳转方式 */
  navigateType?: 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch';
  /** 携带参数 */
  params?: Record<string, string>;
}

/** 弹窗 / Toast */
export interface ShowModalAction {
  type: 'showModal';
  title?: string;
  content: string;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 确认按钮触发的子 Action */
  confirmAction?: Action;
}

/** Toast 提示 */
export interface ShowToastAction {
  type: 'showToast';
  title: string;
  icon?: 'success' | 'error' | 'loading' | 'none';
  duration?: number;
}

/** 调用自定义接口 */
export interface RequestAction {
  type: 'request';
  /** 接口地址 */
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 请求体（JSON） */
  body?: Record<string, unknown>;
  /** 成功后触发的 Action */
  onSuccess?: Action;
  /** 失败后触发的 Action */
  onFail?: Action;
}

/** 复制到剪贴板 */
export interface CopyAction {
  type: 'copy';
  text: string;
}

/** 拨打电话 */
export interface MakePhoneCallAction {
  type: 'makePhoneCall';
  phoneNumber: string;
}

/** 自定义事件（留给业务扩展） */
export interface CustomAction {
  type: 'custom';
  /** 自定义事件名称 */
  eventName: string;
  /** 自定义参数 */
  payload?: Record<string, unknown>;
}

/**
 * Action 联合类型
 * 可按需扩展更多行为
 */
export type Action =
  | NavigateAction
  | ShowModalAction
  | ShowToastAction
  | RequestAction
  | CopyAction
  | MakePhoneCallAction
  | CustomAction;

/**
 * 事件绑定
 * 一个组件可以有多个事件触发点，每个触发点绑定一组 Action
 */
export interface EventBinding {
  /** 触发时机，如 'onClick', 'onLongPress', 'onLoad' */
  trigger: string;
  /** 按顺序执行的 Action 列表 */
  actions: Action[];
}
