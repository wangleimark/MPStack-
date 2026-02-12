/**
 * Canvas —— 编辑器中间画布
 *
 * 核心职责：
 * 1. 作为 useDroppable 接收左侧物料的拖入
 * 2. 使用 SortableContext + useSortable 支持已有组件的拖拽排序
 * 3. 递归渲染 ComponentNode 树
 * 4. 点击组件选中 → 右侧属性面板联动
 * 5. Hover 组件高亮
 */
import React, { useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ComponentNode } from '@mpstack/schema';
import { useEditorStore } from '../store';
import { getPreviewComponent } from '../previews';

// ─── 单个可排序的组件 Wrapper ────────────────────────────────────

interface SortableNodeProps {
  node: ComponentNode;
}

const SortableNode: React.FC<SortableNodeProps> = ({ node }) => {
  const selectedId = useEditorStore((s) => s.selectedId);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const selectComponent = useEditorStore((s) => s.selectComponent);
  const hoverComponent = useEditorStore((s) => s.hoverComponent);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
    data: { origin: 'canvas', node },
  });

  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    outline: isSelected
      ? '2px solid #1890ff'
      : isHovered
        ? '1px dashed #69c0ff'
        : '1px dashed transparent',
    outlineOffset: -1,
    borderRadius: 2,
    cursor: 'pointer',
    minHeight: 20,
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectComponent(node.id);
    },
    [node.id, selectComponent],
  );

  const handleMouseEnter = useCallback(() => {
    hoverComponent(node.id);
  }, [node.id, hoverComponent]);

  const handleMouseLeave = useCallback(() => {
    hoverComponent(null);
  }, [hoverComponent]);

  // 查找编辑器端预览组件（纯 HTML/CSS，不依赖 Taro 运行时）
  const Component = getPreviewComponent(node.type);

  if (!Component) {
    return (
      <div
        ref={setNodeRef}
        style={{ ...style, padding: 12, background: '#fff1f0', color: '#f5222d', fontSize: 12 }}
        {...attributes}
        {...listeners}
        onClick={handleClick}
      >
        未知组件: {node.type}
      </div>
    );
  }

  // 容器组件需要递归渲染 children
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 选中标签 */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -18,
            left: 0,
            fontSize: 10,
            background: '#1890ff',
            color: '#fff',
            padding: '1px 6px',
            borderRadius: '3px 3px 0 0',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {node.type}
        </div>
      )}

      {/* 实际组件渲染 */}
      {hasChildren ? (
        <Component {...node.props}>
          <NodeList nodes={node.children!} />
        </Component>
      ) : (
        <Component {...node.props} />
      )}
    </div>
  );
};

// ─── 节点列表（SortableContext 包裹） ──────────────────────────

interface NodeListProps {
  nodes: ComponentNode[];
}

const NodeList: React.FC<NodeListProps> = ({ nodes }) => {
  const ids = nodes.map((n) => n.id);

  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      {nodes.map((node) => (
        <SortableNode key={node.id} node={node} />
      ))}
    </SortableContext>
  );
};

// ─── 画布主体 ─────────────────────────────────────────────────

export const Canvas: React.FC = () => {
  const components = useEditorStore((s) => s.page.components);
  const selectComponent = useEditorStore((s) => s.selectComponent);
  const zoom = useEditorStore((s) => s.zoom);

  // 画布本身作为一个 Droppable
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: { origin: 'canvas' },
  });

  const handleCanvasClick = useCallback(() => {
    selectComponent(null);
  }, [selectComponent]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 24,
        background: '#f0f2f5',
        overflow: 'auto',
      }}
      onClick={handleCanvasClick}
    >
      <div
        ref={setNodeRef}
        style={{
          width: 375,
          minHeight: 667,
          background: '#fff',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          borderRadius: 8,
          border: isOver ? '2px dashed #1890ff' : '2px solid transparent',
          transition: 'border-color .2s ease',
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          overflow: 'hidden',
        }}
      >
        {components.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 300,
              color: '#bbb',
              fontSize: 14,
              gap: 8,
            }}
          >
            <span style={{ fontSize: 40 }}>📱</span>
            <span>拖拽左侧组件到此处</span>
          </div>
        ) : (
          <NodeList nodes={components} />
        )}
      </div>
    </div>
  );
};
