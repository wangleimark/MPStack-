import { defineConfig } from '@tarojs/cli';
import path from 'path';
import devConfig from './dev';
import prodConfig from './prod';

// https://taro-docs.jd.com/docs/next/config
export default defineConfig(async (merge) => {
  const baseConfig = {
    projectName: 'mpstack-mobile',
    date: '2025-01-01',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
      '@tarojs/plugin-framework-react',
      '@tarojs/plugin-platform-weapp',
    ],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: 'webpack5',
    cache: {
      enable: false,
    },
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
    mini: {
      webpackChain(chain) {
        // 让 packages/ui 等 workspace 子包能正确解析到 apps/mobile 的 node_modules
        chain.resolve.modules.add(path.resolve(__dirname, '..', 'node_modules'));
        // 同时加入 monorepo 根的 node_modules（pnpm 扁平提升目录）
        chain.resolve.modules.add(path.resolve(__dirname, '..', '..', '..', 'node_modules'));
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
  };

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig);
  }
  return merge({}, baseConfig, prodConfig);
});
