import type { ComponentStyle } from './style';
import type { EventBinding } from './action';

/**
 * ComponentNode —— 组件节点
 */
export interface ComponentNode<P extends object = Record<string, unknown>> {
  /** 全局唯一 ID (UUID v4) */
  id: string;
  /** 组件类型标识符 */
  type: string;
  /** 组件业务属性 */
  props: P;
  /** 通用样式 */
  style?: ComponentStyle;
  /** 事件绑定列表 */
  events?: EventBinding[];
  /** 子节点（容器组件专用） */
  children?: ComponentNode[];
  /** 是否隐藏（条件渲染） */
  hidden?: boolean;
  /** 条件渲染表达式 */
  visibleCondition?: string;
  /** 组件锁定状态 */
  locked?: boolean;
}

/**
 * 组件元信息 —— 注册到编辑器侧边栏的描述信息
 */
export interface ComponentMeta {
  /** 组件类型 key */
  type: string;
  /** 展示名称 */
  title: string;
  /** 图标 */
  icon?: string;
  /** 分组 */
  group: ComponentGroup;
  /** 组件描述 */
  description?: string;
  /** 默认属性 */
  defaultProps: Record<string, unknown>;
  /** 默认样式 */
  defaultStyle?: ComponentStyle;
  /** 默认子节点 */
  defaultChildren?: ComponentNode[];
  /** 是否为容器组件 */
  isContainer?: boolean;
  /** 属性面板配置 */
  propsSchema?: PropSchema[];
}

/** 组件分组 */
export type ComponentGroup =
  | 'basic'
  | 'layout'
  | 'media'
  | 'form'
  | 'business'
  | 'advanced';

/**
 * 属性面板字段描述
 */
export interface PropSchema {
  /** 属性 key */
  key: string;
  /** 展示标签 */
  label: string;
  /** 表单控件类型 */
  controlType:
    | 'input'
    | 'textarea'
    | 'number'
    | 'switch'
    | 'select'
    | 'color'
    | 'image-upload'
    | 'radio'
    | 'slider'
    | 'json-editor';
  /** 默认值 */
  defaultValue?: unknown;
  /** select / radio 的选项 */
  options?: Array<{ label: string; value: string | number | boolean }>;
  /** 是否必填 */
  required?: boolean;
  /** 提示文字 */
  tooltip?: string;
  /** 分组标签 */
  group?: string;
}
