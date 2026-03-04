import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  ComponentNode,
  PageSchema,
  PageConfig,
  EventBinding,
  ComponentStyle,
} from '@mpstack/schema';
import {
  findNodeById,
  removeNodeById,
  insertNode,
  cloneNode,
  generateId,
} from '@mpstack/schema';

// ─── State 类型定义 ───────────────────────────────────────────────

export interface EditorState {
  /** 当前页面 Schema（单页编辑模式） */
  page: PageSchema;

  /** 当前选中的组件 ID */
  selectedId: string | null;

  /** 当前悬停的组件 ID（高亮用） */
  hoveredId: string | null;

  /** 操作历史栈（Undo） */
  history: PageSchema[];

  /** 重做栈（Redo） */
  future: PageSchema[];

  /** 历史记录最大长度 */
  maxHistory: number;

  /** 画布缩放比例 */
  zoom: number;

  /** 是否处于预览模式 */
  previewMode: boolean;

  // ─── 多页（TabBar 页面切换） ──────────────────
  /** 各 Tab 页对应的普通组件快照 (key → components) */
  tabPages: Record<string, ComponentNode[]>;

  /** 当前激活的 Tab key */
  activeTabKey: string;
}

export interface EditorActions {
  // ─── 组件 CRUD ─────────────────────────────────────

  /**
   * 添加组件
   * @param node 新组件节点（id 会自动生成）
   * @param parentId 父容器 ID，null 表示根层级
   * @param index 插入位置，默认追加到末尾
   */
  addComponent: (
    node: Omit<ComponentNode, 'id'>,
    parentId?: string | null,
    index?: number,
  ) => void;

  /**
   * 删除组件
   * @param id 要删除的组件 ID
   */
  removeComponent: (id: string) => void;

  /**
   * 复制组件（深拷贝，生成新 ID）
   * @param id 要复制的组件 ID
   */
  duplicateComponent: (id: string) => void;

  /**
   * 更新组件属性（浅合并）
   * @param id 组件 ID
   * @param props 要更新的属性
   */
  updateProps: (id: string, props: Record<string, unknown>) => void;

  /**
   * 更新组件样式（浅合并）
   * @param id 组件 ID
   * @param style 要更新的样式
   */
  updateStyle: (id: string, style: Partial<ComponentStyle>) => void;

  /**
   * 更新组件事件绑定
   * @param id 组件 ID
   * @param events 新的事件绑定列表
   */
  updateEvents: (id: string, events: EventBinding[]) => void;

  /**
   * 移动组件（拖拽排序核心方法）
   * @param activeId 被拖拽的组件 ID
   * @param overId 放置目标的组件 ID
   * @param parentId 目标父容器 ID，null 表示根层级
   * @param index 目标位置索引
   */
  moveComponent: (
    activeId: string,
    overId: string | null,
    parentId: string | null,
    index: number,
  ) => void;

  // ─── 选中 & 交互 ──────────────────────────────────

  /** 选中组件 */
  selectComponent: (id: string | null) => void;

  /** 悬停组件 */
  hoverComponent: (id: string | null) => void;

  // ─── 页面配置 ──────────────────────────────────────

  /** 更新页面标题 */
  updatePageTitle: (title: string) => void;

  /** 更新页面配置 */
  updatePageConfig: (config: Partial<PageConfig>) => void;

  // ─── 历史记录 ──────────────────────────────────────

  /** 撤销 */
  undo: () => void;

  /** 重做 */
  redo: () => void;

  // ─── 画布控制 ──────────────────────────────────────

  /** 设置缩放 */
  setZoom: (zoom: number) => void;

  /** 切换预览模式 */
  togglePreviewMode: () => void;

  // ─── 序列化 ────────────────────────────────────────

  /** 获取当前页面的 JSON（用于保存和导出） */
  getPageJSON: () => PageSchema;

  /** 从 JSON 加载页面 */
  loadPage: (page: PageSchema) => void;

  /** 重置为空白页面 */
  resetPage: () => void;

  // ─── 多页（TabBar 页面切换） ──────────────────

  /**
   * 切换 Tab 页面
   * 保存当前普通组件 → 加载目标 Tab 的组件 → 更新 TabBar activeKey
   */
  switchTabPage: (newKey: string) => void;
}

// ─── 初始状态 ─────────────────────────────────────────────────────

const createEmptyPage = (): PageSchema => ({
  id: generateId(),
  title: '未命名页面',
  config: {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f5f5',
    enablePullDownRefresh: false,
  },
  components: [],
  version: 1,
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ─── Store 实现 ───────────────────────────────────────────────────

export const useEditorStore = create<EditorState & EditorActions>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // ─── State ──────────────────────────

        page: createEmptyPage(),
        selectedId: null,
        hoveredId: null,
        history: [],
        future: [],
        maxHistory: 50,
        zoom: 1,
        previewMode: false,
        tabPages: {} as Record<string, ComponentNode[]>,
        activeTabKey: '',

        // ─── 内部：推入历史记录 ─────────────

        // ─── 组件 CRUD ─────────────────────

        addComponent: (node, parentId = null, index) => {
          set((state) => {
            // 1. 推入历史
            pushHistory(state);

            // 2. 生成完整节点
            const newNode: ComponentNode = {
              ...node,
              id: generateId(),
              props: { ...node.props },
              children: node.children ? [...node.children] : undefined,
            };

            // 3. 插入到组件树
            const targetList =
              parentId === null
                ? state.page.components
                : findNodeById(state.page.components, parentId)?.children;

            if (targetList) {
              const insertIndex = index ?? targetList.length;
              targetList.splice(insertIndex, 0, newNode);
            } else if (parentId === null) {
              state.page.components.push(newNode);
            }

            // 4. 自动选中新组件
            state.selectedId = newNode.id;
            state.page.updatedAt = new Date().toISOString();
          });
        },

        removeComponent: (id) => {
          set((state) => {
            pushHistory(state);
            removeNodeById(state.page.components, id);
            if (state.selectedId === id) {
              state.selectedId = null;
            }
            state.page.updatedAt = new Date().toISOString();
          });
        },

        duplicateComponent: (id) => {
          set((state) => {
            const source = findNodeById(state.page.components, id);
            if (!source) return;

            pushHistory(state);
            const cloned = cloneNode(source, generateId);

            // 在同级紧跟源节点之后插入
            const insertAfter = (nodes: ComponentNode[]): boolean => {
              for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id === id) {
                  nodes.splice(i + 1, 0, cloned);
                  return true;
                }
                if (nodes[i].children && insertAfter(nodes[i].children!)) {
                  return true;
                }
              }
              return false;
            };

            insertAfter(state.page.components);
            state.selectedId = cloned.id;
            state.page.updatedAt = new Date().toISOString();
          });
        },

        updateProps: (id, props) => {
          set((state) => {
            const node = findNodeById(state.page.components, id);
            if (!node) return;
            pushHistory(state);
            Object.assign(node.props, props);
            state.page.updatedAt = new Date().toISOString();
          });
        },

        updateStyle: (id, style) => {
          set((state) => {
            const node = findNodeById(state.page.components, id);
            if (!node) return;
            pushHistory(state);
            node.style = { ...node.style, ...style };
            state.page.updatedAt = new Date().toISOString();
          });
        },

        updateEvents: (id, events) => {
          set((state) => {
            const node = findNodeById(state.page.components, id);
            if (!node) return;
            pushHistory(state);
            node.events = events;
            state.page.updatedAt = new Date().toISOString();
          });
        },

        moveComponent: (activeId, _overId, parentId, index) => {
          set((state) => {
            pushHistory(state);
            // 1. 从原位置移除
            const removed = removeNodeById(state.page.components, activeId);
            if (!removed) return;

            // 2. 插入到新位置
            insertNode(state.page.components, parentId, index, removed);
            state.page.updatedAt = new Date().toISOString();
          });
        },

        // ─── 选中 & 交互 ───────────────────

        selectComponent: (id) => {
          set((state) => {
            state.selectedId = id;
          });
        },

        hoverComponent: (id) => {
          set((state) => {
            state.hoveredId = id;
          });
        },

        // ─── 页面配置 ──────────────────────

        updatePageTitle: (title) => {
          set((state) => {
            pushHistory(state);
            state.page.title = title;
            state.page.updatedAt = new Date().toISOString();
          });
        },

        updatePageConfig: (config) => {
          set((state) => {
            pushHistory(state);
            Object.assign(state.page.config, config);
            state.page.updatedAt = new Date().toISOString();
          });
        },

        // ─── 历史记录 ──────────────────────

        undo: () => {
          set((state) => {
            if (state.history.length === 0) return;
            const previous = state.history.pop()!;
            state.future.push(JSON.parse(JSON.stringify(state.page)));
            state.page = previous as any;
          });
        },

        redo: () => {
          set((state) => {
            if (state.future.length === 0) return;
            const next = state.future.pop()!;
            state.history.push(JSON.parse(JSON.stringify(state.page)));
            state.page = next as any;
          });
        },

        // ─── 画布控制 ──────────────────────

        setZoom: (zoom) => {
          set((state) => {
            state.zoom = Math.max(0.25, Math.min(2, zoom));
          });
        },

        togglePreviewMode: () => {
          set((state) => {
            state.previewMode = !state.previewMode;
          });
        },

        // ─── 序列化 ────────────────────────

        getPageJSON: () => {
          return JSON.parse(JSON.stringify(get().page));
        },

        loadPage: (page) => {
          set((state) => {
            state.page = page as any;
            state.selectedId = null;
            state.hoveredId = null;
            state.history = [];
            state.future = [];
          });
        },

        resetPage: () => {
          set((state) => {
            state.page = createEmptyPage() as any;
            state.selectedId = null;
            state.hoveredId = null;
            state.history = [];
            state.future = [];
            state.tabPages = {};
            state.activeTabKey = '';
          });
        },

        // ─── 多页切换 ──────────────────────

        switchTabPage: (newKey: string) => {
          set((state) => {
            let currentKey = state.activeTabKey;

            // 首次切换时，自动将当前 key 设为 TabBar 的默认 activeKey
            if (!currentKey) {
              const tabBarNode = state.page.components.find(
                (c) => c.type === 'MpTabBar' && (c.props as any).fixed === true,
              );
              currentKey = (tabBarNode?.props as any)?.activeKey || 'home';
            }

            if (currentKey === newKey) return;

            // 分离普通组件与固定底部组件
            const regularComponents: ComponentNode[] = [];
            const fixedComponents: ComponentNode[] = [];
            for (const c of state.page.components) {
              if (c.type === 'MpTabBar' && (c.props as any).fixed === true) {
                fixedComponents.push(c);
              } else {
                regularComponents.push(c);
              }
            }

            // 保存当前 Tab 的普通组件（深拷贝脱离 immer draft）
            state.tabPages[currentKey] = JSON.parse(
              JSON.stringify(regularComponents),
            );

            // 加载新 Tab 的组件（可能为空）
            const newComponents: ComponentNode[] = state.tabPages[newKey]
              ? JSON.parse(JSON.stringify(state.tabPages[newKey]))
              : [];

            // 同步 TabBar 节点的 activeKey prop
            for (const fc of fixedComponents) {
              if (fc.type === 'MpTabBar') {
                (fc.props as any).activeKey = newKey;
              }
            }

            // 重组 page.components：新页面普通组件 + 固定底部组件
            state.page.components = [...newComponents, ...fixedComponents];
            state.activeTabKey = newKey;
            state.selectedId = null;
            state.page.updatedAt = new Date().toISOString();
          });
        },
      })),
    ),
    { name: 'MPStack-EditorStore' },
  ),
);

// ─── 辅助函数 ─────────────────────────────────────────────────────

/**
 * 将当前 page 快照推入历史栈（Undo 用）
 * 同时清空 future 栈（新操作后不能 Redo）
 */
function pushHistory(state: EditorState) {
  const snapshot = JSON.parse(JSON.stringify(state.page));
  state.history.push(snapshot);
  if (state.history.length > state.maxHistory) {
    state.history.shift();
  }
  state.future = [];
}
