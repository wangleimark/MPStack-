# MPSTACK- 小程序可视化搭建平台

> Web 端拖拽搭建页面 → 生成 JSON Schema → 小程序端动态渲染，实现"所见即所得"。

---

## 📐 项目架构

基于 **PNPM Workspace + Turborepo** 的 Monorepo 工程：

```
MPStack-/
├── apps/
│   ├── editor/          # 🖥️  Web 可视化编辑器 (React + Vite)
│   └── mobile/          # 📱  小程序运行端 (Taro 3.x)
├── packages/
│   ├── schema/          # 🧬  共享类型定义 & 工具函数
│   └── ui/              # 🎨  跨端组件库 (Web + 小程序同构)
├── turbo.json           # Turborepo 任务编排
├── pnpm-workspace.yaml  # PNPM Workspace 声明
└── tsconfig.base.json   # 全局 TypeScript 基础配置
```

---

## 🛠️ 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **Monorepo** | PNPM Workspace + Turborepo | 依赖管理 & 构建编排 |
| **编辑器框架** | React 18 + Vite | Web 编辑器核心 |
| **编辑器 UI** | Ant Design 5.x | 属性面板、工具栏等骨架 UI |
| **拖拽引擎** | dnd-kit | 组件拖拽排序 |
| **状态管理** | Zustand + Immer | 管理 JSON 组件树，内置 Undo/Redo |
| **小程序框架** | Taro 3.x (React) | 跨端运行时，动态渲染 JSON Schema |
| **后端** | NestJS | RESTful API 服务 |
| **数据库** | MongoDB | 存储非结构化的 Page Schema |
| **语言** | TypeScript 5.x | 全栈类型安全 |

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.x
- **PNPM** >= 9.x（`corepack enable` 即可自动启用）

### 1. 安装依赖

```bash
# 克隆项目
git clone <your-repo-url> MPStack-
cd MPStack-

# 安装全部依赖（自动链接 workspace 包）
pnpm install
```

### 2. 构建共享包

首次运行前需先构建 `schema` 和 `ui`，因为 `apps/*` 依赖它们：

```bash
# 构建所有共享包（按拓扑顺序）
pnpm build

# 或单独构建
pnpm build:schema
pnpm build:ui
```

### 3. 启动开发服务

```bash
# 启动 Web 编辑器 (默认端口 http://localhost:3000)
pnpm dev:editor

# 启动小程序端（微信小程序）
pnpm dev:mobile
```

---

## 📦 包说明

### `@mpstack/schema`

核心数据结构和工具函数，被所有其他包共享引用。

- **类型定义**：`ComponentNode`、`PageSchema`、`Action`、`ComponentMeta` 等
- **工具函数**：`findNodeById`、`removeNodeById`、`insertNode`、`cloneNode`、`generateId` 等

### `@mpstack/ui`

跨端组件库，同时提供 Web 和小程序端的渲染组件。

- **已有组件**：`MpText`（文本）、`MpImage`（图片）、`MpContainer`（容器）
- **组件注册表**：`ComponentRegistry`，管理 type → Component 的映射

### `@mpstack/editor`

Web 可视化编辑器，核心能力：

- **Zustand Store**：管理组件树的增删改查、拖拽排序、Undo/Redo
- **画布**：模拟 375px 宽手机屏幕，实时预览
- **属性面板**：基于 Ant Design 自动生成表单

### `@mpstack/mobile`

小程序运行端，核心能力：

- **DynamicRenderer**：递归遍历 JSON 组件树，运行时渲染（不生成 `.wxml`）
- **ComponentMap**：`type` 字符串 → Taro 组件的映射表

---

## 🧩 核心数据流

```
┌──────────────┐     JSON Schema      ┌──────────────┐
│   Editor     │ ──────────────────▶   │   MongoDB    │
│  (Web 编辑器) │                       │  (后端存储)   │
└──────────────┘                       └──────┬───────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │   Mobile     │
                                       │ (小程序运行端) │
                                       └──────────────┘

数据流: 编辑器拖拽 → Zustand Store → PageSchema JSON → API 存储 → 小程序拉取 → DynamicRenderer 渲染
```

---

## 📜 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装所有依赖 |
| `pnpm build` | 构建所有包（按依赖拓扑顺序） |
| `pnpm build:schema` | 单独构建 `@mpstack/schema` |
| `pnpm build:ui` | 单独构建 `@mpstack/ui` |
| `pnpm dev:editor` | 启动 Web 编辑器开发服务 |
| `pnpm dev:mobile` | 启动小程序开发编译 |
| `pnpm lint` | 全项目 Lint 检查 |
| `pnpm clean` | 清理所有构建产物和 `node_modules` |

---

## 📄 License

MIT
