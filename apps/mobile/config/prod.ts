import type { UserConfigExport } from '@tarojs/cli';

export default {
  mini: {},
  h5: {
    /**
     * WebpackChain 插件配置
     * 生产环境可在此开启 gzip、分包优化等
     */
  },
} satisfies UserConfigExport;
