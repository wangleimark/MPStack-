/**
 * API 配置
 *
 * 开发环境：连接本地 API 服务 (需先启动 pnpm dev:api)
 * 微信小程序开发时需在开发者工具中勾选「不校验合法域名」
 */
export const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : (process.env.TARO_APP_API_BASE || 'http://localhost:3001');
