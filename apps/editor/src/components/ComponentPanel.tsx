/**
 * ComponentPanel —— 左侧组件物料面板
 *
 * 功能：
 * 1. 按分组展示所有可用组件
 * 2. 每个组件卡片使用 useDraggable 作为拖拽源
 * 3. 拖拽结束后由 App 层的 DndContext.onDragEnd 负责插入 Store
 */
import React, { useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { ComponentMeta } from '@mpstack/schema';
import { allComponentMetas } from '../config/component-metas';

// ─── 分组定义 ──────────────────────────────────────────────────────

const GROUP_LABELS: Record<string, string> = {
  basic: '基础组件',
  layout: '布局组件',
  media: '媒体组件',
  form: '表单组件',
  business: '业务组件',
  advanced: '高级组件',
};

const GROUP_ORDER = ['basic', 'layout', 'media', 'form', 'business', 'advanced'];

// ─── 单个可拖拽组件卡片 ────────────────────────────────────────────

interface DraggableCardProps {
  meta: ComponentMeta;
}

/** 拖拽数据，Canvas 侧通过 active.data.current 读取 */
export interface DragData {
  origin: 'component-panel';
  meta: ComponentMeta;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ meta }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${meta.type}`,
    data: { origin: 'component-panel', meta } satisfies DragData,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        margin: '0 0 4px',
        background: isDragging ? '#e6f4ff' : '#fff',
        border: `1px solid ${isDragging ? '#1890ff' : '#e8e8e8'}`,
        borderRadius: 6,
        cursor: 'grab',
        opacity: isDragging ? 0.6 : 1,
        transition: 'all .15s ease',
        userSelect: 'none',
        fontSize: 13,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 6,
          background: '#f0f5ff',
          color: '#1890ff',
          fontSize: 16,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {meta.title.charAt(0)}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, color: '#333' }}>{meta.title}</div>
        {meta.description && (
          <div style={{ fontSize: 11, color: '#999', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {meta.description}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── 组件面板主体 ──────────────────────────────────────────────────

export const ComponentPanel: React.FC = () => {
  const grouped = useMemo(() => {
    const map = new Map<string, ComponentMeta[]>();
    for (const meta of allComponentMetas) {
      const list = map.get(meta.group) ?? [];
      list.push(meta);
      map.set(meta.group, list);
    }
    return map;
  }, []);

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '12px 8px' }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#666',
          padding: '0 4px 8px',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: 8,
        }}
      >
        组件物料
      </div>

      {GROUP_ORDER.map((group) => {
        const metas = grouped.get(group);
        if (!metas || metas.length === 0) return null;
        return (
          <div key={group} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 12,
                color: '#999',
                padding: '4px 4px 6px',
                fontWeight: 500,
              }}
            >
              {GROUP_LABELS[group] ?? group}
            </div>
            {metas.map((meta) => (
              <DraggableCard key={meta.type} meta={meta} />
            ))}
          </div>
        );
      })}
    </div>
  );
};
