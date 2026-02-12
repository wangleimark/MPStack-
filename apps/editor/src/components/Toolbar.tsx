/**
 * Toolbar —— 顶部工具栏
 *
 * 功能：撤销 / 重做 / 缩放 / 预览 / 导出 JSON
 */
import React, { useCallback } from 'react';
import { useEditorStore } from '../store';

export const Toolbar: React.FC = () => {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const previewMode = useEditorStore((s) => s.previewMode);
  const togglePreviewMode = useEditorStore((s) => s.togglePreviewMode);
  const getPageJSON = useEditorStore((s) => s.getPageJSON);
  const resetPage = useEditorStore((s) => s.resetPage);
  const historyLen = useEditorStore((s) => s.history.length);
  const futureLen = useEditorStore((s) => s.future.length);
  const pageTitle = useEditorStore((s) => s.page.title);
  const updatePageTitle = useEditorStore((s) => s.updatePageTitle);

  const handleExport = useCallback(() => {
    const json = getPageJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${json.title || 'page'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getPageJSON]);

  const handleLogJSON = useCallback(() => {
    const json = getPageJSON();
    console.log('[MPSTACK] Page Schema:', JSON.stringify(json, null, 2));
    alert('Schema 已输出到控制台 (F12)');
  }, [getPageJSON]);

  const btnStyle: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: 12,
    border: '1px solid rgba(255,255,255,.25)',
    borderRadius: 4,
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all .15s',
    whiteSpace: 'nowrap',
  };

  const btnDisabledStyle: React.CSSProperties = {
    ...btnStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  return (
    <header
      style={{
        height: 48,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,.2)',
      }}
    >
      {/* Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>⚡ MPSTACK-</span>
        <input
          value={pageTitle}
          onChange={(e) => updatePageTitle(e.target.value)}
          style={{
            background: 'rgba(255,255,255,.1)',
            border: '1px solid rgba(255,255,255,.15)',
            borderRadius: 4,
            color: '#fff',
            padding: '2px 8px',
            fontSize: 13,
            width: 140,
            outline: 'none',
          }}
        />
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)', margin: '0 4px' }} />

      {/* Undo / Redo */}
      <button
        onClick={undo}
        disabled={historyLen === 0}
        style={historyLen === 0 ? btnDisabledStyle : btnStyle}
        title="撤销 (Ctrl+Z)"
      >
        ↩ 撤销
      </button>
      <button
        onClick={redo}
        disabled={futureLen === 0}
        style={futureLen === 0 ? btnDisabledStyle : btnStyle}
        title="重做 (Ctrl+Shift+Z)"
      >
        ↪ 重做
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)', margin: '0 4px' }} />

      {/* Zoom */}
      <button onClick={() => setZoom(zoom - 0.1)} style={btnStyle}>−</button>
      <span style={{ fontSize: 12, minWidth: 42, textAlign: 'center' }}>
        {Math.round(zoom * 100)}%
      </span>
      <button onClick={() => setZoom(zoom + 0.1)} style={btnStyle}>+</button>
      <button onClick={() => setZoom(1)} style={btnStyle}>1:1</button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Preview */}
      <button
        onClick={togglePreviewMode}
        style={{
          ...btnStyle,
          background: previewMode ? '#1890ff' : 'transparent',
          borderColor: previewMode ? '#1890ff' : 'rgba(255,255,255,.25)',
        }}
      >
        {previewMode ? '✏️ 编辑' : '👁️ 预览'}
      </button>

      {/* Export */}
      <button onClick={handleLogJSON} style={btnStyle}>
        📋 查看 JSON
      </button>
      <button onClick={handleExport} style={{ ...btnStyle, background: '#1890ff', borderColor: '#1890ff' }}>
        💾 导出
      </button>

      {/* Clear */}
      <button
        onClick={() => { if (confirm('确定清空画布？')) resetPage(); }}
        style={{ ...btnStyle, borderColor: '#ff4d4f', color: '#ff7875' }}
      >
        🗑️ 清空
      </button>
    </header>
  );
};
