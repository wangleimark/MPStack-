/**
 * DynamicRenderer —— 动态运行时渲染器
 *
 * 核心原理:
 *   递归遍历 ComponentNode[] 树，通过 componentMap 将 type 字符串
 *   映射到实际的 Taro/React 组件，实现"不生成 .wxml，纯运行时渲染"。
 *
 * 功能:
 *   1. 递归渲染组件树
 *   2. 条件渲染 (hidden / visibleCondition)
 *   3. 样式合并 (node.style 作为外层容器样式)
 *   4. 事件绑定 (node.events → Taro API)
 *   5. 未知组件的开发提示
 *   6. React.memo 优化避免不必要的重渲染
 */
import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import type { ComponentNode } from '@mpstack/schema';
import { componentMap } from './component-map';
import { buildEventHandlers } from './action-executor';

// ─── 组件树渲染入口 ───────────────────────────────────────────

interface DynamicRendererProps {
  /** 组件节点列表（通常是 PageSchema.components） */
  nodes: ComponentNode[];
}

/**
 * DynamicRenderer —— 渲染一组 ComponentNode
 *
 * @example
 * <DynamicRenderer nodes={pageSchema.components} />
 */
export const DynamicRenderer: React.FC<DynamicRendererProps> = ({ nodes }) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <>
      {nodes.map((node) => (
        <NodeRenderer key={node.id} node={node} />
      ))}
    </>
  );
};

// ─── 单个节点渲染器 ───────────────────────────────────────────

interface NodeRendererProps {
  node: ComponentNode;
}

const NodeRenderer: React.FC<NodeRendererProps> = React.memo(({ node }) => {
  // ═══ 1. 条件渲染 ═══
  if (node.hidden) return null;

  // visibleCondition: 简单的表达式判断（预留能力）
  if (node.visibleCondition) {
    try {
      // 安全沙箱式判断（仅支持简单的 true/false 字符串）
      if (node.visibleCondition === 'false') return null;
    } catch {
      // 表达式解析失败，默认显示
    }
  }

  // ═══ 2. 查找组件 ═══
  const Component = componentMap[node.type];

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <View
          style={{
            padding: '8px 12px',
            background: '#fff3cd',
            borderLeft: '3px solid #ffc107',
            margin: '4px 0',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <Text style={{ fontSize: '12px', color: '#856404' }}>
            ⚠️ 未注册组件: {node.type}
          </Text>
        </View>
      );
    }
    return null;
  }

  // ═══ 3. 外层样式 ═══
  // ComponentStyle 的 key 与 React CSSProperties 完全兼容（驼峰命名）
  // 直接展开即可，undefined 值会被 React 忽略
  const wrapperStyle = useMemo(() => {
    if (!node.style || Object.keys(node.style).length === 0) return undefined;
    return { ...node.style } as React.CSSProperties;
  }, [node.style]);

  // ═══ 4. 事件处理 ═══
  const eventHandlers = useMemo(
    () => buildEventHandlers(node.events),
    [node.events],
  );

  // ═══ 5. 递归渲染子节点 ═══
  const children =
    node.children && node.children.length > 0 ? (
      <DynamicRenderer nodes={node.children} />
    ) : undefined;

  // ═══ 6. 最终渲染 ═══
  // 有外层样式或事件时，包裹一层 View
  const needsWrapper = wrapperStyle || Object.keys(eventHandlers).length > 0;

  const rendered = (
    <Component {...node.props}>{children}</Component>
  );

  if (needsWrapper) {
    return (
      <View style={wrapperStyle} {...eventHandlers}>
        {rendered}
      </View>
    );
  }

  return rendered;
});

NodeRenderer.displayName = 'NodeRenderer';
