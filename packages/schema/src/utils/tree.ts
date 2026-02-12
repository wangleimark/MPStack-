import type { ComponentNode } from '../types';

export function findNodeById(
  nodes: ComponentNode[], id: string,
): ComponentNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function findNodeWithParent(
  nodes: ComponentNode[], id: string, parent: ComponentNode | null = null,
): { node: ComponentNode; parent: ComponentNode | null; index: number } | undefined {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) return { node, parent, index: i };
    if (node.children) {
      const found = findNodeWithParent(node.children, id, node);
      if (found) return found;
    }
  }
  return undefined;
}

export function removeNodeById(
  nodes: ComponentNode[], id: string,
): ComponentNode | undefined {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return nodes.splice(i, 1)[0];
    if (nodes[i].children) {
      const removed = removeNodeById(nodes[i].children!, id);
      if (removed) return removed;
    }
  }
  return undefined;
}

export function insertNode(
  nodes: ComponentNode[], parentId: string | null, index: number, newNode: ComponentNode,
): boolean {
  if (parentId === null) { nodes.splice(index, 0, newNode); return true; }
  const parent = findNodeById(nodes, parentId);
  if (!parent) return false;
  if (!parent.children) parent.children = [];
  parent.children.splice(index, 0, newNode);
  return true;
}

export function cloneNode(node: ComponentNode, genId: () => string): ComponentNode {
  return {
    ...node,
    id: genId(),
    props: { ...node.props },
    style: node.style ? { ...node.style } : undefined,
    events: node.events ? node.events.map((e) => ({ ...e, actions: [...e.actions] })) : undefined,
    children: node.children?.map((child) => cloneNode(child, genId)),
  };
}

export function flattenNodes(nodes: ComponentNode[]): ComponentNode[] {
  const result: ComponentNode[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children) result.push(...flattenNodes(node.children));
  }
  return result;
}
