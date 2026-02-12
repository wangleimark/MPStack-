/**
 * ActionExecutor —— 事件行为执行器
 *
 * 根据 Action 类型分派到 Taro API：
 *   navigate  → Taro.navigateTo / redirectTo / switchTab / reLaunch
 *   showModal → Taro.showModal
 *   showToast → Taro.showToast
 *   request   → Taro.request
 *   copy      → Taro.setClipboardData
 *   makePhoneCall → Taro.makePhoneCall
 *   custom    → 自定义事件总线
 */
import Taro from '@tarojs/taro';
import type { Action, EventBinding } from '@mpstack/schema';

/**
 * 执行单个 Action
 */
export async function executeAction(action: Action): Promise<void> {
  switch (action.type) {
    case 'navigate': {
      const url = action.params
        ? `${action.url}?${new URLSearchParams(action.params).toString()}`
        : action.url;

      switch (action.navigateType) {
        case 'redirectTo':
          await Taro.redirectTo({ url });
          break;
        case 'switchTab':
          await Taro.switchTab({ url: action.url }); // switchTab 不支持参数
          break;
        case 'reLaunch':
          await Taro.reLaunch({ url });
          break;
        default:
          await Taro.navigateTo({ url });
      }
      break;
    }

    case 'showModal': {
      const result = await Taro.showModal({
        title: action.title ?? '提示',
        content: action.content,
        showCancel: action.showCancel ?? true,
      });
      // 点击确认且有后续 Action
      if (result.confirm && action.confirmAction) {
        await executeAction(action.confirmAction);
      }
      break;
    }

    case 'showToast': {
      await Taro.showToast({
        title: action.title,
        icon: action.icon ?? 'none',
        duration: action.duration ?? 2000,
      });
      break;
    }

    case 'request': {
      try {
        const res = await Taro.request({
          url: action.url,
          method: action.method ?? 'GET',
          data: action.body,
        });
        if (action.onSuccess) {
          await executeAction(action.onSuccess);
        }
      } catch {
        if (action.onFail) {
          await executeAction(action.onFail);
        }
      }
      break;
    }

    case 'copy': {
      await Taro.setClipboardData({ data: action.text });
      break;
    }

    case 'makePhoneCall': {
      await Taro.makePhoneCall({ phoneNumber: action.phoneNumber });
      break;
    }

    case 'custom': {
      // 触发自定义事件，可通过 Taro.eventCenter 监听
      Taro.eventCenter.trigger(action.eventName, action.payload);
      break;
    }

    default: {
      console.warn('[ActionExecutor] Unknown action type:', (action as any).type);
    }
  }
}

/**
 * 执行一组 Action（按顺序串行）
 */
export async function executeActions(actions: Action[]): Promise<void> {
  for (const action of actions) {
    await executeAction(action);
  }
}

/**
 * 根据 EventBinding 列表生成事件处理函数映射
 *
 * @example
 * const handlers = buildEventHandlers(node.events);
 * // handlers = { onClick: () => {...}, onLongPress: () => {...} }
 */
export function buildEventHandlers(
  events?: EventBinding[],
): Record<string, () => void> {
  if (!events || events.length === 0) return {};

  const handlers: Record<string, () => void> = {};

  for (const binding of events) {
    handlers[binding.trigger] = () => {
      executeActions(binding.actions).catch((err) => {
        console.error(`[ActionExecutor] Error executing ${binding.trigger}:`, err);
      });
    };
  }

  return handlers;
}
