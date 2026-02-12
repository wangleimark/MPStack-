/**
 * PropsPanel —— 右侧属性面板
 *
 * 功能：
 * 1. 根据选中组件的 ComponentMeta.propsSchema 自动生成表单
 * 2. 实时更新 Zustand Store 中的组件 props
 * 3. 支持 input / textarea / number / switch / select / color 六种控件
 * 4. 按 group 分组折叠展示
 */
import React, { useMemo, useCallback } from 'react';
import type { PropSchema, ComponentNode } from '@mpstack/schema';
import { useEditorStore } from '../store';
import { metaMap } from '../config/component-metas';
import { findNodeById } from '@mpstack/schema';

// ─── 控件渲染 ──────────────────────────────────────────────────

interface ControlProps {
  schema: PropSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}

const Control: React.FC<ControlProps> = ({ schema, value, onChange }) => {
  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '4px 8px',
    border: '1px solid #d9d9d9',
    borderRadius: 4,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };

  switch (schema.controlType) {
    case 'input':
      return (
        <input
          style={baseInputStyle}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={schema.tooltip}
        />
      );

    case 'textarea':
      return (
        <textarea
          style={{ ...baseInputStyle, minHeight: 60, resize: 'vertical' }}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={schema.tooltip}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          style={baseInputStyle}
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

    case 'switch':
      return (
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12, color: '#666' }}>
            {value ? '开启' : '关闭'}
          </span>
        </label>
      );

    case 'select':
      return (
        <select
          style={{ ...baseInputStyle, cursor: 'pointer' }}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          {schema.options?.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'color':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="color"
            value={(value as string) ?? '#000000'}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: 32, height: 28, border: 'none', cursor: 'pointer', padding: 0 }}
          />
          <input
            style={{ ...baseInputStyle, flex: 1 }}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case 'json-editor':
      return (
        <textarea
          style={{ ...baseInputStyle, minHeight: 80, resize: 'vertical', fontFamily: 'monospace', fontSize: 11 }}
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              // 用户正在输入，暂不更新
            }
          }}
          placeholder={schema.tooltip}
        />
      );

    case 'image-upload':
      return (
        <input
          style={baseInputStyle}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入图片 URL"
        />
      );

    case 'radio':
      return (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {schema.options?.map((opt) => (
            <label key={String(opt.value)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12 }}>
              <input
                type="radio"
                name={schema.key}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case 'slider':
      return (
        <input
          type="range"
          min={0}
          max={100}
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      );

    default:
      return (
        <input
          style={baseInputStyle}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

// ─── 属性面板主体 ──────────────────────────────────────────────

export const PropsPanel: React.FC = () => {
  const selectedId = useEditorStore((s) => s.selectedId);
  const components = useEditorStore((s) => s.page.components);
  const updateProps = useEditorStore((s) => s.updateProps);
  const removeComponent = useEditorStore((s) => s.removeComponent);
  const duplicateComponent = useEditorStore((s) => s.duplicateComponent);

  // 查找选中节点
  const selectedNode: ComponentNode | null = useMemo(() => {
    if (!selectedId) return null;
    return findNodeById(components, selectedId) ?? null;
  }, [selectedId, components]);

  // 查找 Meta
  const meta = useMemo(() => {
    if (!selectedNode) return null;
    return metaMap.get(selectedNode.type) ?? null;
  }, [selectedNode]);

  // 按 group 分组 propsSchema
  const groupedSchema = useMemo(() => {
    if (!meta?.propsSchema) return new Map<string, PropSchema[]>();
    const map = new Map<string, PropSchema[]>();
    for (const s of meta.propsSchema) {
      const group = s.group ?? '基本';
      const list = map.get(group) ?? [];
      list.push(s);
      map.set(group, list);
    }
    return map;
  }, [meta]);

  const handlePropChange = useCallback(
    (key: string, value: unknown) => {
      if (!selectedId) return;
      updateProps(selectedId, { [key]: value });
    },
    [selectedId, updateProps],
  );

  if (!selectedNode || !meta) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 13 }}>
        <span style={{ fontSize: 32, marginBottom: 8 }}>🖱️</span>
        <span>点击画布中的组件</span>
        <span>查看并编辑属性</span>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', fontSize: 13 }}>
      {/* 头部信息 */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontWeight: 600, color: '#333' }}>{meta.title}</div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{selectedNode.type} · {selectedNode.id.slice(0, 8)}</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => duplicateComponent(selectedNode.id)}
            style={{ padding: '2px 8px', fontSize: 12, cursor: 'pointer', border: '1px solid #d9d9d9', borderRadius: 4, background: '#fff' }}
            title="复制"
          >
            📋
          </button>
          <button
            onClick={() => removeComponent(selectedNode.id)}
            style={{ padding: '2px 8px', fontSize: 12, cursor: 'pointer', border: '1px solid #ff4d4f', borderRadius: 4, background: '#fff', color: '#ff4d4f' }}
            title="删除"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* 属性分组 */}
      {Array.from(groupedSchema.entries()).map(([group, schemas]) => (
        <div key={group} style={{ borderBottom: '1px solid #f0f0f0' }}>
          <div
            style={{
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 600,
              color: '#666',
              background: '#fafafa',
            }}
          >
            {group}
          </div>
          <div style={{ padding: '8px 16px' }}>
            {schemas.map((schema) => (
              <div key={schema.key} style={{ marginBottom: 12 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: '#666',
                    marginBottom: 4,
                  }}
                >
                  {schema.label}
                  {schema.tooltip && (
                    <span
                      style={{ marginLeft: 4, color: '#bbb', cursor: 'help' }}
                      title={schema.tooltip}
                    >
                      ⓘ
                    </span>
                  )}
                </label>
                <Control
                  schema={schema}
                  value={selectedNode.props[schema.key]}
                  onChange={(v) => handlePropChange(schema.key, v)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
