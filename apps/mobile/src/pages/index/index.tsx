/**
 * 首页 —— 动态渲染入口
 *
 * 这里演示直接使用 PageRenderer 渲染一份内置的 PageSchema。
 * 实际场景中 schema 会从后端 API 获取。
 */
import React, { useState, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { PageSchema } from '@mpstack/schema';
import { PageRenderer } from '@/renderer';

const DEMO_SCHEMA: PageSchema = {
  id: 'home-page',
  title: '首页',
  config: {
    navigationBarBackgroundColor: '#1890ff',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f5f5f5',
  },
  components: [
    {
      id: 'banner-1',
      type: 'MpBanner',
      props: {
        items: [
          { imageUrl: 'https://via.placeholder.com/750x400/1890ff/ffffff?text=MPSTACK+1' },
          { imageUrl: 'https://via.placeholder.com/750x400/52c41a/ffffff?text=MPSTACK+2' },
          { imageUrl: 'https://via.placeholder.com/750x400/faad14/ffffff?text=MPSTACK+3' },
        ],
        height: '360rpx',
        autoplay: true,
        interval: 3000,
        circular: true,
        indicatorDots: true,
      },
    },
    {
      id: 'title-1',
      type: 'MpText',
      props: {
        content: '欢迎使用 MPSTACK- 可视化搭建平台',
        fontSize: '36rpx',
        color: '#333',
        bold: true,
        textAlign: 'center',
      },
      style: { padding: '24rpx' },
    },
    {
      id: 'desc-1',
      type: 'MpText',
      props: {
        content: '拖拽编辑 → 生成 JSON Schema → 小程序动态渲染',
        fontSize: '28rpx',
        color: '#999',
        textAlign: 'center',
      },
      style: { padding: '0 40rpx 32rpx' },
    },
  ],
  version: 1,
  status: 'published',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const Index: React.FC = () => {
  const [loading] = useState(false);

  const handleNavigate = useCallback(() => {
    Taro.navigateTo({ url: '/pages/dynamic/index?id=demo-page-001' });
  }, []);

  return (
    <View>
      <PageRenderer schema={DEMO_SCHEMA} loading={loading} />
      <View
        style={{
          margin: '24rpx 32rpx',
          padding: '20rpx 0',
          backgroundColor: '#1890ff',
          borderRadius: '12rpx',
          textAlign: 'center',
        }}
        onClick={handleNavigate}
      >
        <Text style={{ color: '#fff', fontSize: '30rpx' }}>查看动态渲染示例 →</Text>
      </View>
    </View>
  );
};

export default Index;
