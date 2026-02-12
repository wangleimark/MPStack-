/**
 * 动态页面 —— 通用 Schema 驱动渲染页面
 *
 * 接收页面 ID 参数，从后端获取 PageSchema JSON，
 * 通过 PageRenderer 将 JSON 渲染为真实的小程序页面。
 *
 * 路由: /pages/dynamic/index?id=xxx
 *
 * 流程:
 *   1. 从路由参数获取 pageId
 *   2. 请求后端 API 获取 PageSchema
 *   3. 交给 PageRenderer 渲染
 */
import React, { useState, useEffect, useCallback } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import type { PageSchema } from '@mpstack/schema';
import { PageRenderer, registerAllComponents } from '@/renderer';

// 确保组件已注册
registerAllComponents();

// ─── Mock 数据（开发调试用，后续替换为真实 API） ────────────────

const MOCK_SCHEMA: PageSchema = {
  id: 'demo-page-001',
  title: '示例页面',
  config: {
    navigationBarBackgroundColor: '#1890ff',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f5f5f5',
    enablePullDownRefresh: true,
  },
  components: [
    {
      id: 'banner-1',
      type: 'MpBanner',
      props: {
        items: [
          { imageUrl: 'https://via.placeholder.com/750x400/1890ff/ffffff?text=Banner+1' },
          { imageUrl: 'https://via.placeholder.com/750x400/52c41a/ffffff?text=Banner+2' },
          { imageUrl: 'https://via.placeholder.com/750x400/faad14/ffffff?text=Banner+3' },
        ],
        height: '200px',
        autoplay: true,
        interval: 3000,
        circular: true,
        indicatorDots: true,
      },
    },
    {
      id: 'text-1',
      type: 'MpText',
      props: {
        content: '欢迎使用 MPSTACK- 可视化搭建平台',
        fontSize: '18px',
        color: '#333333',
        bold: true,
        textAlign: 'center',
      },
      style: {
        padding: '16px 12px 8px',
      },
    },
    {
      id: 'text-2',
      type: 'MpText',
      props: {
        content: '这是一个由 JSON Schema 驱动的动态页面，所有组件均通过运行时递归渲染。',
        fontSize: '14px',
        color: '#666666',
        textAlign: 'center',
      },
      style: {
        padding: '0 24px 16px',
      },
    },
    {
      id: 'container-1',
      type: 'MpContainer',
      props: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#ffffff',
      },
      style: {
        margin: '0 12px',
        borderRadius: '8px',
      },
      children: [
        {
          id: 'img-1',
          type: 'MpImage',
          props: {
            src: 'https://via.placeholder.com/160x120/e6f7ff/1890ff?text=Card+1',
            width: '100%',
            height: '100px',
            borderRadius: '4px',
            mode: 'cover',
          },
        },
        {
          id: 'img-2',
          type: 'MpImage',
          props: {
            src: 'https://via.placeholder.com/160x120/f6ffed/52c41a?text=Card+2',
            width: '100%',
            height: '100px',
            borderRadius: '4px',
            mode: 'cover',
          },
        },
      ],
    },
  ],
  version: 1,
  status: 'published',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ─── 页面组件 ─────────────────────────────────────────────────

const DynamicPage: React.FC = () => {
  const router = useRouter();
  const pageId = router.params.id;

  const [schema, setSchema] = useState<PageSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载页面数据
  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!pageId) {
        // 无 ID 参数，使用 Mock 数据
        setSchema(MOCK_SCHEMA);
        setLoading(false);
        return;
      }

      // TODO: 替换为真实 API
      // const res = await Taro.request({
      //   url: `${API_BASE}/pages/${pageId}`,
      //   method: 'GET',
      // });
      // setSchema(res.data as PageSchema);

      // 暂时使用 Mock
      setSchema(MOCK_SCHEMA);
    } catch (err) {
      setError('页面加载失败，请稍后重试');
      console.error('[DynamicPage] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // 未获取到 schema 且不在加载中也没有错误
  if (!schema && !loading && !error) {
    return null;
  }

  return (
    <PageRenderer
      schema={schema ?? MOCK_SCHEMA}
      loading={loading}
      error={error}
      onRefresh={fetchPage}
    />
  );
};

export default DynamicPage;
