/**
 * PageRenderer —— 页面级渲染器
 *
 * 顶层组件，接收完整的 PageSchema JSON，负责：
 *   1. 应用页面配置（背景色等）
 *   2. 将 components[] 交给 DynamicRenderer 递归渲染
 *   3. 处理页面级生命周期（下拉刷新、分享等）
 *   4. 提供加载态和错误态
 *
 * 使用方式:
 *   在 Taro 页面中，从后端/本地获取 PageSchema JSON，
 *   然后将其传给 <PageRenderer schema={pageSchema} />
 *
 * @example
 * // pages/dynamic/index.tsx
 * import { PageRenderer } from '@/renderer';
 *
 * export default function DynamicPage() {
 *   const [schema, setSchema] = useState<PageSchema | null>(null);
 *
 *   useEffect(() => {
 *     fetch('/api/pages/xxx').then(r => r.json()).then(setSchema);
 *   }, []);
 *
 *   if (!schema) return <Loading />;
 *   return <PageRenderer schema={schema} />;
 * }
 */
import React, { useEffect, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useShareAppMessage, usePullDownRefresh } from '@tarojs/taro';
import type { PageSchema } from '@mpstack/schema';
import { DynamicRenderer } from './DynamicRenderer';

// ─── Props ────────────────────────────────────────────────────

interface PageRendererProps {
  /** 完整的页面 Schema JSON */
  schema: PageSchema;
  /** 数据加载中 */
  loading?: boolean;
  /** 加载失败的错误信息 */
  error?: string | null;
  /** 下拉刷新回调 */
  onRefresh?: () => void | Promise<void>;
}

// ─── 主组件 ───────────────────────────────────────────────────

export const PageRenderer: React.FC<PageRendererProps> = ({
  schema,
  loading = false,
  error = null,
  onRefresh,
}) => {
  // ═══ 1. 页面标题 ═══
  useEffect(() => {
    if (schema.title) {
      Taro.setNavigationBarTitle({ title: schema.title });
    }
  }, [schema.title]);

  // ═══ 2. 导航栏配色 ═══
  useEffect(() => {
    const config = schema.config;
    if (config.navigationBarBackgroundColor || config.navigationBarTextStyle) {
      Taro.setNavigationBarColor({
        frontColor: config.navigationBarTextStyle === 'white' ? '#ffffff' : '#000000',
        backgroundColor: config.navigationBarBackgroundColor ?? '#ffffff',
        animation: { duration: 0, timingFunc: 'linear' },
      });
    }
  }, [schema.config]);

  // ═══ 3. 分享配置 ═══
  useShareAppMessage(() => {
    const share = schema.config.shareConfig;
    return {
      title: share?.title ?? schema.title,
      path: share?.path ?? `/pages/dynamic/index?id=${schema.id}`,
      imageUrl: share?.imageUrl,
    };
  });

  // ═══ 4. 下拉刷新 ═══
  usePullDownRefresh(async () => {
    if (onRefresh) {
      await onRefresh();
    }
    Taro.stopPullDownRefresh();
  });

  // ═══ 5. 页面容器样式 ═══
  const pageStyle = useMemo<React.CSSProperties>(() => ({
    minHeight: '100vh',
    backgroundColor: schema.config.backgroundColor ?? '#f5f5f5',
  }), [schema.config.backgroundColor]);

  // ═══ 6. 加载态 ═══
  if (loading) {
    return (
      <View style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ textAlign: 'center', padding: '60px 0' }}>
          <Text style={{ fontSize: '14px', color: '#999' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  // ═══ 7. 错误态 ═══
  if (error) {
    return (
      <View style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Text style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>😞</Text>
          <Text style={{ fontSize: '14px', color: '#999', display: 'block', marginBottom: '12px' }}>
            {error}
          </Text>
          <View
            style={{
              display: 'inline-block',
              padding: '8px 24px',
              backgroundColor: '#1890ff',
              color: '#fff',
              borderRadius: '20px',
              fontSize: '14px',
            }}
            onClick={() => onRefresh?.()}
          >
            <Text style={{ color: '#fff' }}>重试</Text>
          </View>
        </View>
      </View>
    );
  }

  // ═══ 8. 空页面 ═══
  if (!schema.components || schema.components.length === 0) {
    return (
      <View style={{ ...pageStyle, textAlign: 'center', padding: '80px 0' }}>
        <Text style={{ fontSize: '14px', color: '#ccc' }}>暂无内容</Text>
      </View>
    );
  }

  // ═══ 9. 正常渲染 ═══
  return (
    <View style={pageStyle}>
      <DynamicRenderer nodes={schema.components} />
    </View>
  );
};
