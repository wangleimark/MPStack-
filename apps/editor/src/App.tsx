/**
 * MPSTACK- Editor 主入口
 *
 * 职责：
 * 1. 用 DndContext 包裹全局，统一处理 drag start / end 事件
 * 2. 三栏布局：ComponentPanel | Canvas | PropsPanel
 * 3. 顶部工具栏 Toolbar
 *
 * 布局结构:
 * ┌───────────────────────────────────────────────┐
 * │                  Toolbar                       │
 * ├──────────┬───────────────────┬─────────────────┤
 * │          │                   │                 │
 * │ 组件面板  │    画布 Canvas     │   属性面板       │
 * │ (左侧栏) │   (中间渲染区)     │   (右侧栏)       │
 * │          │                   │                 │
 * └──────────┴───────────────────┴─────────────────┘
 */
import React, { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';


import { useEditorStore } from './store';
import { metaMap } from './config/component-metas';
import type { DragData } from './components/ComponentPanel';
import { ComponentPanel } from './components/ComponentPanel';
import { Canvas } from './components/Canvas';
import { PropsPanel } from './components/PropsPanel';
import { Toolbar } from './components/Toolbar';

// ─── App ────────────────────────────────────────────────────────

const App: React.FC = () => {
  const addComponent = useEditorStore((s) => s.addComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const page = useEditorStore((s) => s.page);
  const previewMode = useEditorStore((s) => s.previewMode);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeMeta, setActiveMeta] = useState<string | null>(null);

  // 传感器：需要 5px 移动距离才启动拖拽，避免和点击冲突
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // ─── 拖拽开始 ──────────────────────────────

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(String(active.id));

    const data = active.data.current as DragData | undefined;
    if (data?.origin === 'component-panel') {
      setActiveMeta(data.meta.title);
    } else {
      setActiveMeta(null);
    }
  }, []);

  // ─── 拖拽结束 ──────────────────────────────

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setActiveMeta(null);

      if (!over) return;

      const activeData = active.data.current as Record<string, any> | undefined;

      // ═══ 场景 1：从左侧面板拖入画布 ═══
      if (activeData?.origin === 'component-panel') {
        const meta = activeData.meta;
        if (!meta) return;

        // 查找完整的 meta 信息
        const fullMeta = metaMap.get(meta.type);
        if (!fullMeta) return;

        const newNode = {
          type: fullMeta.type,
          props: { ...fullMeta.defaultProps },
          style: fullMeta.defaultStyle ? { ...fullMeta.defaultStyle } : undefined,
          children: fullMeta.isContainer ? [] : undefined,
        };

        // 检查是否投放到容器组件内部
        const overData = over.data.current as Record<string, any> | undefined;
        if (overData?.origin === 'canvas-container') {
          addComponent(newNode, overData.containerId);
          return;
        }

        // 默认添加到根层级
        addComponent(newNode, null);
        return;
      }

      // ═══ 场景 2：画布内部排序 ═══
      if (activeData?.origin === 'canvas' && active.id !== over.id) {
        const components = page.components;
        const oldIndex = components.findIndex((c) => c.id === String(active.id));
        const newIndex = components.findIndex((c) => c.id === String(over.id));

        if (oldIndex !== -1 && newIndex !== -1) {
          moveComponent(String(active.id), String(over.id), null, newIndex);
        }
      }
    },
    [addComponent, moveComponent, page.components],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {/* 顶部工具栏 */}
        <Toolbar />

        {/* 三栏主体 */}
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 左侧: 组件面板 */}
          {!previewMode && (
            <aside
              style={{
                width: 260,
                borderRight: '1px solid #e8e8e8',
                background: '#fafafa',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <ComponentPanel />
            </aside>
          )}

          {/* 中间: 画布 */}
          <Canvas />

          {/* 右侧: 属性面板 */}
          {!previewMode && (
            <aside
              style={{
                width: 300,
                borderLeft: '1px solid #e8e8e8',
                background: '#fafafa',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <PropsPanel />
            </aside>
          )}
        </main>
      </div>

      {/* 拖拽浮层 */}
      <DragOverlay>
        {activeId ? (
          <div
            style={{
              padding: '8px 16px',
              background: '#1890ff',
              color: '#fff',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(24,144,255,.4)',
              opacity: 0.9,
              pointerEvents: 'none',
            }}
          >
            {activeMeta ?? '移动组件'}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
