/**
 * MPStack API —— 页面 Schema 存储服务
 *
 * 提供 PageSchema 的 CRUD 接口，供编辑器保存、小程序端拉取。
 * 开发环境使用内存存储，重启后数据清空。
 */
import express from 'express';
import cors from 'cors';
import type { PageSchema } from '@mpstack/schema';

const app = express();
const PORT = process.env.PORT || 3001;

// 内存存储（开发用，生产可替换为 MongoDB）
const pageStore = new Map<string, PageSchema>();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '2mb' }));

// ─── 健康检查 ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'MPStack API' });
});

// ─── 获取页面 ─────────────────────────────────────────────────
app.get('/api/pages/:id', (req, res) => {
  const page = pageStore.get(req.params.id);
  if (!page) {
    res.status(404).json({ error: '页面不存在' });
    return;
  }
  res.json(page);
});

// ─── 创建/更新页面（upsert）────────────────────────────────────
app.post('/api/pages', (req, res) => {
  const page = req.body as PageSchema;
  if (!page?.id || !page?.components) {
    res.status(400).json({ error: '无效的 PageSchema' });
    return;
  }
  const now = new Date().toISOString();
  const existing = pageStore.get(page.id);
  const toSave: PageSchema = {
    ...page,
    updatedAt: now,
    createdAt: existing?.createdAt ?? now,
  };
  pageStore.set(page.id, toSave);
  res.json(toSave);
});

// ─── 更新页面 ─────────────────────────────────────────────────
app.put('/api/pages/:id', (req, res) => {
  const id = req.params.id;
  const page = pageStore.get(id);
  if (!page) {
    res.status(404).json({ error: '页面不存在' });
    return;
  }
  const updates = req.body as Partial<PageSchema>;
  const toSave: PageSchema = {
    ...page,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  pageStore.set(id, toSave);
  res.json(toSave);
});

// ─── 列出所有页面（用于编辑器「打开」列表）────────────────────
app.get('/api/pages', (_req, res) => {
  const list = Array.from(pageStore.values()).map((p) => ({
    id: p.id,
    title: p.title,
    updatedAt: p.updatedAt,
  }));
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`[MPStack API] http://localhost:${PORT}`);
});
