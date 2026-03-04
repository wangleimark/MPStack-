/**
 * Canvas —— 编辑器中间画布
 *
 * 核心职责：
 * 1. 作为 useDroppable 接收左侧物料的拖入
 * 2. 使用 SortableContext + useSortable 支持已有组件的拖拽排序
 * 3. 递归渲染 ComponentNode 树
 * 4. 点击组件选中 → 右侧属性面板联动
 * 5. Hover 组件高亮
 * 6. 容器组件内部可投放子组件
 * 7. TabBar fixed=true 时独立渲染在手机壳底部（不参与排序流）
 */
import React, { useCallback, useMemo } from 'react';
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
import { metaMap } from '../config/component-metas';

// ─── 判断组件是否是"固定底部" ──────────────────────────────────

function isFixedBottom(node: ComponentNode): boolean {
  return node.type === 'MpTabBar' && node.props.fixed === true;
}

// ─── 容器组件内部可投放区域 ─────────────────────────────────────

interface ContainerDropZoneProps {
  containerId: string;
  children?: React.ReactNode;
  hasChildren: boolean;
}

const ContainerDropZone: React.FC<ContainerDropZoneProps> = ({
  containerId,
  children,
  hasChildren,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `container-${containerId}`,
    data: { origin: 'canvas-container', containerId },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 40,
        border: isOver ? '2px dashed #1890ff' : '1px dashed transparent',
        borderRadius: 4,
        transition: 'border-color .2s',
      }}
    >
      {hasChildren ? (
        children
      ) : (
        <div
          style={{
            color: '#bbb',
            fontSize: 12,
            textAlign: 'center',
            padding: 16,
          }}
        >
          {isOver ? '松开放入组件' : '拖入子组件'}
        </div>
      )}
    </div>
  );
};

// ─── 固定底部组件（不参与排序，absolute 定位在手机壳底部）───────

interface FixedBottomNodeProps {
  node: ComponentNode;
}

const FixedBottomNode: React.FC<FixedBottomNodeProps> = ({ node }) => {
  const selectedId = useEditorStore((s) => s.selectedId);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const selectComponent = useEditorStore((s) => s.selectComponent);
  const hoverComponent = useEditorStore((s) => s.hoverComponent);
  const switchTabPage = useEditorStore((s) => s.switchTabPage);

  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;

  const Component = getPreviewComponent(node.type);
  if (!Component) return null;

  // Tab 切换 → 调用 store 的 switchTabPage 实现多页切换
  const handleTabChange = useCallback(
    (key: string) => {
      switchTabPage(key);
    },
    [switchTabPage],
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        outline: isSelected
          ? '2px solid #1890ff'
          : isHovered
            ? '1px dashed #69c0ff'
            : 'none',
        outlineOffset: -1,
        cursor: 'pointer',
      }}
      // 捕获阶段选中组件 —— 不会被内部 stopPropagation 阻断
      onClickCapture={() => {
        selectComponent(node.id);
      }}
      // 冒泡阶段阻止事件到达 Canvas 的 handleCanvasClick（避免取消选中）
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseEnter={() => hoverComponent(node.id)}
      onMouseLeave={() => hoverComponent(null)}
    >
      {/* 选中标签 */}
      {(isSelected || isHovered) && (
        <div
          style={{
            position: 'absolute',
            top: -18,
            left: 0,
            fontSize: 10,
            background: isSelected ? '#1890ff' : '#69c0ff',
            color: '#fff',
            padding: '1px 6px',
            borderRadius: '3px 3px 0 0',
            zIndex: 10,
            userSelect: 'none',
          }}
        >
          {node.type}
        </div>
      )}

      {/* 渲染 TabBar 组件，传入 onTabChange 实现页面切换 */}
      <Component {...node.props} fixed={false} onTabChange={handleTabChange} />
    </div>
  );
};

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

  const nodeMeta = metaMap.get(node.type);
  const isContainer = nodeMeta?.isContainer === true;

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

  // 查找编辑器端预览组件
  const Component = getPreviewComponent(node.type);

  if (!Component) {
    return (
      <div
        ref={setNodeRef}
        style={{ ...style, padding: 12, background: '#fff1f0', color: '#f5222d', fontSize: 12 }}
        onClick={handleClick}
      >
        未知组件: {node.type}
      </div>
    );
  }

  const hasChildren = !!(node.children && node.children.length > 0);

  // 构建组件内容
  let content: React.ReactNode;

  if (isContainer) {
    // 容器组件：内部放一个 ContainerDropZone 接收拖入
    content = (
      <Component {...node.props}>
        <ContainerDropZone containerId={node.id} hasChildren={hasChildren}>
          {hasChildren && <NodeList nodes={node.children!} />}
        </ContainerDropZone>
      </Component>
    );
  } else if (hasChildren) {
    content = (
      <Component {...node.props}>
        <NodeList nodes={node.children!} />
      </Component>
    );
  } else {
    content = <Component {...node.props} />;
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, cursor: 'grab' }}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── 选中标签：hover/selected 时显示 ── */}
      {(isSelected || isHovered) && (
        <div
          style={{
            position: 'absolute',
            top: -18,
            left: 0,
            fontSize: 10,
            background: isSelected ? '#1890ff' : '#69c0ff',
            color: '#fff',
            padding: '1px 6px',
            borderRadius: '3px 3px 0 0',
            zIndex: 10,
            userSelect: 'none',
          }}
        >
          {node.type}
        </div>
      )}

      {/* ── 实际组件渲染 ── */}
      {content}
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

  // 分离：普通组件（参与排序）vs 固定底部组件（独立渲染）
  const { regularComponents, fixedBottomComponents } = useMemo(() => {
    const regular: ComponentNode[] = [];
    const fixedBottom: ComponentNode[] = [];
    for (const c of components) {
      if (isFixedBottom(c)) {
        fixedBottom.push(c);
      } else {
        regular.push(c);
      }
    }
    return { regularComponents: regular, fixedBottomComponents: fixedBottom };
  }, [components]);

  // 画布本身作为一个 Droppable
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: { origin: 'canvas' },
  });

  const handleCanvasClick = useCallback(() => {
    selectComponent(null);
  }, [selectComponent]);

  const showEmptyHint =
    regularComponents.length === 0 && fixedBottomComponents.length === 0;

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
      {/* 手机壳 */}
      <div
        ref={setNodeRef}
        style={{
          position: 'relative',
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
          // 为固定底部组件的 absolute 留出底部空间
          paddingBottom: fixedBottomComponents.length > 0 ? 56 : 0,
        }}
      >
        {showEmptyHint ? (
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
          <NodeList nodes={regularComponents} />
        )}

        {/* ── 固定底部组件（独立渲染，absolute 定位） ── */}
        {fixedBottomComponents.map((node) => (
          <FixedBottomNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
};
