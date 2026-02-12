/**
 * 组件注册入口
 *
 * 在 app 启动时调用，将所有业务组件注册到 componentMap。
 * 后续新增组件只需在此文件中添加 import + registerComponent。
 */
import { registerComponents } from './component-map';
import { MpText, MpImage, MpContainer, MpBanner } from '@mpstack/ui';

export function registerAllComponents(): void {
  registerComponents({
    MpText,
    MpImage,
    MpContainer,
    MpBanner,
  });
}
