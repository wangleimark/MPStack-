import type React from 'react';

/**
 * ComponentMap —— 组件映射表
 *
 * 将 Schema 中的 type 字符串映射到实际的 Taro/React 组件。
 *
 * 使用方式:
 *   1. 在 register.ts 中调用 registerComponent() 注册组件
 *   2. DynamicRenderer 通过 componentMap[type] 查找并渲染
 *
 * 注意:
 *   这里使用普通对象而非 Map，因为小程序环境中
 *   对象字面量的序列化兼容性更好。
 */
export const componentMap: Record<string, React.ComponentType<any>> = {};

/**
 * 注册组件到映射表
 */
export function registerComponent(
  type: string,
  component: React.ComponentType<any>,
): void {
  if (componentMap[type]) {
    console.warn(`[ComponentMap] "${type}" already registered, overwriting.`);
  }
  componentMap[type] = component;
}

/**
 * 批量注册组件
 */
export function registerComponents(
  components: Record<string, React.ComponentType<any>>,
): void {
  Object.entries(components).forEach(([type, component]) => {
    registerComponent(type, component);
  });
}
