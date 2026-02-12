import React from 'react';

/**
 * MPSTACK- Editor 主入口
 *
 * 布局结构 (后续实现):
 * ┌─────────────────────────────────────────────┐
 * │                  Toolbar                     │
 * ├──────────┬──────────────────┬────────────────┤
 * │          │                  │                │
 * │ 组件面板  │    画布 Canvas    │   属性面板     │
 * │ (左侧栏) │   (中间渲染区)    │   (右侧栏)     │
 * │          │                  │                │
 * └──────────┴──────────────────┴────────────────┘
 */
const App: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ height: 48, background: '#1a1a2e', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <h1 style={{ fontSize: 16, margin: 0 }}>MPSTACK- 可视化搭建平台</h1>
      </header>
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧: 组件面板 */}
        <aside style={{ width: 280, borderRight: '1px solid #e8e8e8', background: '#fafafa' }}>
          <div style={{ padding: 16 }}>组件面板 (TODO)</div>
        </aside>

        {/* 中间: 画布 */}
        <section style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 24, background: '#f0f0f0', overflow: 'auto' }}>
          <div style={{ width: 375, minHeight: 667, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', borderRadius: 8 }}>
            <div style={{ padding: 16, color: '#999', textAlign: 'center' }}>
              画布区域 - 拖拽组件到此处
            </div>
          </div>
        </section>

        {/* 右侧: 属性面板 */}
        <aside style={{ width: 320, borderLeft: '1px solid #e8e8e8', background: '#fafafa' }}>
          <div style={{ padding: 16 }}>属性面板 (TODO)</div>
        </aside>
      </main>
    </div>
  );
};

export default App;
