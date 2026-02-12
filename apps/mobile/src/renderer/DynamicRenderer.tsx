import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import type { ComponentNode } from '@mpstack/schema';
import { componentMap } from './component-map';

interface DynamicRendererProps {
  /** 组件树 */
  nodes: ComponentNode[];
}

/**
 * DynamicRenderer —— 动态运行时渲染器
 *
 * 核心原理:
 *   递归遍历 ComponentNode 树，通过 componentMap 将
 *   type 字符串映射到实际的 Taro 组件，实现动态渲染。
 *
 *   不生成 .wxml 代码，完全在运行时解析 JSON 树。
 */
export const DynamicRenderer: React.FC<DynamicRendererProps> = ({ nodes }) => {
  return (
    <>
      {nodes.map((node) => (
        <NodeRenderer key={node.id} node={node} />
      ))}
    </>
  );
};

/**
 * 单个节点渲染器
 */
const NodeRenderer: React.FC<{ node: ComponentNode }> = React.memo(({ node }) => {
  // 1. 条件渲染判断
  if (node.hidden) return null;

  // 2. 从注册表查找组件
  const Component = componentMap[node.type];

  if (!Component) {
    // 未注册的组件类型 → 显示占位提示
    if (process.env.NODE_ENV === 'development') {
      return (
        <View style={{ padding: '8px', background: '#fff3cd', color: '#856404', fontSize: '12px' }}>
          <Text>⚠️ 未知组件: {node.type}</Text>
        </View>
      );
    }
    return null;
  }

  // 3. 合并样式
  const mergedStyle = useMemo(() => ({
    ...node.style,
  }), [node.style]);

  // 4. 渲染组件及其子节点
  const children = node.children?.length ? (
    <DynamicRenderer nodes={node.children} />
  ) : undefined;

  return (
    <View style={mergedStyle}>
      <Component {...node.props}>
        {children}
      </Component>
    </View>
  );
});

NodeRenderer.displayName = 'NodeRenderer';
