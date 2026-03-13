# 编辑器与小程序端打通实现文档

> 本文档详细记录 MPStack- 项目中，将 Web 可视化编辑器与小程序运行端打通的具体实现过程。

---

## 一、背景与目标

### 1.1 现状

打通前，编辑器和小程序端处于**割裂状态**：

| 端 | 现状 |
|---|------|
| **编辑器** | 拖拽搭建 → 仅支持「导出 JSON 文件」到本地，无持久化 |
| **小程序** | 动态页使用硬编码的 `MOCK_SCHEMA`，无法加载编辑器保存的页面 |

### 1.2 目标

实现完整数据流：

```
编辑器拖拽搭建 → 保存到后端 → 小程序按 pageId 拉取 → 动态渲染
```

---

## 二、整体架构

### 2.1 打通后的数据流

```
┌─────────────────┐     POST /api/pages      ┌─────────────────┐
│     Editor      │ ──────────────────────▶ │   API 服务       │
│  (Web 编辑器)   │     GET /api/pages/:id   │  (Express)       │
│   localhost:3000│ ◀────────────────────── │  localhost:3001  │
└─────────────────┘                          └────────┬────────┘
                                                      │
                                                      │ GET /api/pages/:id
                                                      ▼
                                             ┌─────────────────┐
                                             │     Mobile      │
                                             │  (小程序运行端)  │
                                             │  动态页 ?id=xxx  │
                                             └─────────────────┘
```

### 2.2 涉及模块

| 模块 | 路径 | 职责 |
|------|------|------|
| API 服务 | `apps/api/` | 提供 PageSchema 的 CRUD 接口，内存存储 |
| 编辑器 | `apps/editor/` | 保存、打开、预览，通过 API 与后端通信 |
| 小程序 | `apps/mobile/` | 动态页根据 `pageId` 从 API 拉取 Schema 并渲染 |

---

## 三、实现步骤

### 3.1 第一步：创建 API 服务

#### 3.1.1 新建 `apps/api` 包

在 `apps/` 下新增 `api` 目录，结构如下：

```
apps/api/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts
```

#### 3.1.2 依赖配置

`apps/api/package.json`：

```json
{
  "name": "@mpstack/api",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc"
  },
  "dependencies": {
    "@mpstack/schema": "workspace:*",
    "cors": "^2.8.5",
    "express": "^4.21.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0"
  }
}
```

- `@mpstack/schema`：共享 `PageSchema` 类型
- `express` + `cors`：HTTP 服务与跨域
- `tsx`：开发时直接运行 TypeScript

#### 3.1.3 API 接口实现

`apps/api/src/index.ts` 核心逻辑：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/pages` | GET | 获取页面列表（id、title、updatedAt） |
| `/api/pages/:id` | GET | 获取单个页面 Schema |
| `/api/pages` | POST | 创建/更新页面（upsert） |
| `/api/pages/:id` | PUT | 更新页面 |

存储使用 `Map<string, PageSchema>` 内存存储，重启后清空。生产环境可替换为 MongoDB。

#### 3.1.4 根目录脚本

在根 `package.json` 中新增：

```json
{
  "scripts": {
    "dev:api": "turbo run dev --filter=@mpstack/api",
    "dev": "turbo run dev --filter=@mpstack/api --filter=@mpstack/editor"
  }
}
```

---

### 3.2 第二步：编辑器接入 API

#### 3.2.1 创建 API 客户端

新建 `apps/editor/src/api/page-api.ts`：

```typescript
import type { PageSchema } from '@mpstack/schema';

const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? '' : 'http://localhost:3001');

export async function fetchPage(id: string): Promise<PageSchema> { ... }
export async function savePage(page: PageSchema): Promise<PageSchema> { ... }
export async function listPages(): Promise<PageListItem[]> { ... }
```

- 开发环境 `API_BASE` 为空字符串，请求走同源 `/api`，由 Vite 代理到 3001
- 生产环境可通过 `VITE_API_BASE` 配置

#### 3.2.2 配置 Vite 代理

`apps/editor/vite.config.ts`：

```typescript
server: {
  port: 3000,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
},
```

编辑器访问 `/api/pages` 时，会被代理到 `http://localhost:3001/api/pages`。

#### 3.2.3 工具栏新增功能

在 `apps/editor/src/components/Toolbar.tsx` 中新增：

| 按钮 | 功能 |
|------|------|
| **保存** | 调用 `savePage(getPageJSON())`，将当前页面 Schema 提交到 API |
| **打开** | 打开 Modal，展示已保存页面列表，选择后调用 `fetchPage(id)` 并 `loadPage(page)` |
| **预览** | 复制当前 `pageId` 到剪贴板，提示用户在小程序动态页传入 `?id=xxx` 预览 |

关键代码片段：

```tsx
const handleSave = useCallback(async () => {
  setSaving(true);
  try {
    const json = getPageJSON();
    await savePage(json);
    message.success('保存成功');
  } catch (e) {
    message.error((e as Error).message || '保存失败');
  } finally {
    setSaving(false);
  }
}, [getPageJSON]);
```

---

### 3.3 第三步：小程序端接入 API

#### 3.3.1 API 配置

新建 `apps/mobile/src/config/api.ts`：

```typescript
export const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : (process.env.TARO_APP_API_BASE || 'http://localhost:3001');
```

- 开发环境固定为 `http://localhost:3001`
- 生产环境通过 `TARO_APP_API_BASE` 配置

#### 3.3.2 动态页改造

修改 `apps/mobile/src/pages/dynamic/index.tsx`：

1. 引入 `API_BASE`
2. 当存在 `pageId` 时，使用 `Taro.request` 请求 API：

```typescript
const res = await Taro.request({
  url: `${API_BASE}/api/pages/${pageId}`,
  method: 'GET',
});
setSchema(res.data as PageSchema);
```

3. 无 `pageId` 或请求失败时，回退到 `MOCK_SCHEMA` 兜底

#### 3.3.3 微信小程序域名配置

开发阶段需在微信开发者工具中勾选：

**「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」**

否则无法请求 `http://localhost:3001`。

---

## 四、文件变更清单

| 操作 | 路径 |
|------|------|
| 新增 | `apps/api/package.json` |
| 新增 | `apps/api/tsconfig.json` |
| 新增 | `apps/api/src/index.ts` |
| 新增 | `apps/editor/src/api/page-api.ts` |
| 新增 | `apps/mobile/src/config/api.ts` |
| 修改 | `apps/editor/vite.config.ts`（添加 proxy） |
| 修改 | `apps/editor/src/components/Toolbar.tsx`（保存/打开/预览） |
| 修改 | `apps/mobile/src/pages/dynamic/index.tsx`（真实 API 拉取） |
| 修改 | `package.json`（dev:api、dev 脚本） |
| 修改 | `README.md`（架构说明、启动方式） |

---

## 五、使用流程

### 5.1 启动服务

```bash
# 1. 安装依赖
pnpm install

# 2. 构建共享包（首次）
pnpm build:schema

# 3. 同时启动 API + 编辑器
pnpm dev

# 4. 另开终端启动小程序
pnpm dev:mobile
```

### 5.2 操作步骤

1. 在编辑器中拖拽搭建页面
2. 点击 **保存**，将 Schema 存入 API
3. 点击 **预览**，复制页面 ID
4. 在微信开发者工具中：
   - 添加编译模式：启动页面 `pages/dynamic/index`，启动参数 `id=<页面ID>`
   - 或从首页点击「查看动态渲染示例」进入动态页（示例 ID：`demo-page-001`）

### 5.3 数据流验证

```
编辑器保存 → 打开「打开」弹窗可见已保存页面 → 小程序传入对应 id 可渲染
```

---

## 六、扩展与优化

### 6.1 生产环境

- 将 API 的 `Map` 存储替换为 MongoDB 等持久化方案
- 配置 `VITE_API_BASE`、`TARO_APP_API_BASE` 指向生产 API 地址
- 微信小程序需在后台配置 request 合法域名

### 6.2 可选增强

- 页面版本管理、发布/草稿状态
- 用户鉴权、权限控制
- 编辑器「预览」直接打开 H5 动态页（若启用 Taro H5 构建）

---

## 七、常见问题

### Q1：编辑器保存失败，提示网络错误

- 确认已执行 `pnpm dev:api` 或 `pnpm dev`，API 服务在 3001 端口运行
- 检查 `curl http://localhost:3001/api/health` 是否返回 `{"ok":true}`

### Q2：小程序动态页一直显示 Mock 数据

- 确认传入的 `id` 与编辑器保存的页面 ID 一致
- 检查微信开发者工具是否勾选「不校验合法域名」
- 查看调试器 Network 面板，确认请求是否发出及返回内容

### Q3：模拟器启动失败，错误 41001

- 多为微信开发者工具 AppID 配置问题，与项目代码无关
- 在「详情」→「基本信息」中配置测试号或有效 AppID

---

## 八、总结

通过新增 API 服务、编辑器保存/打开/预览能力、以及小程序动态页的真实 API 拉取，实现了「编辑器 ↔ 后端 ↔ 小程序」的完整打通。核心改动集中在：

1. **API 层**：Express 提供 PageSchema CRUD
2. **编辑器层**：API 客户端 + 工具栏交互
3. **小程序层**：API 配置 + 动态页按 id 拉取

整体实现保持轻量，便于后续扩展为生产级方案。
