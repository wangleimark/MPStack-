/**
 * 页面 API 客户端 —— 编辑器与后端通信
 */
import type { PageSchema } from '@mpstack/schema';

const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? '' : 'http://localhost:3001');

export interface PageListItem {
  id: string;
  title: string;
  updatedAt: string;
}

export async function fetchPage(id: string): Promise<PageSchema> {
  const res = await fetch(`${API_BASE}/api/pages/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `加载失败: ${res.status}`);
  }
  return res.json();
}

export async function savePage(page: PageSchema): Promise<PageSchema> {
  const res = await fetch(`${API_BASE}/api/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(page),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `保存失败: ${res.status}`);
  }
  return res.json();
}

export async function listPages(): Promise<PageListItem[]> {
  const res = await fetch(`${API_BASE}/api/pages`);
  if (!res.ok) throw new Error(`获取列表失败: ${res.status}`);
  return res.json();
}
