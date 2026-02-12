/**
 * 渲染器模块统一导出
 *
 * 使用方式：
 *   import { PageRenderer, registerAllComponents } from '@/renderer';
 *
 *   // App 启动时注册所有组件
 *   registerAllComponents();
 *
 *   // 页面中使用
 *   <PageRenderer schema={pageSchema} />
 */

// 页面级渲染器
export { PageRenderer } from './PageRenderer';

// 组件树递归渲染器
export { DynamicRenderer } from './DynamicRenderer';

// 组件注册
export { componentMap, registerComponent, registerComponents } from './component-map';
export { registerAllComponents } from './register';

// 事件执行器
export { executeAction, executeActions, buildEventHandlers } from './action-executor';
