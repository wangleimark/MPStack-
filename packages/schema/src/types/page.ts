import type { ComponentNode } from './component';

export interface PageSchema {
  id: string;
  title: string;
  path?: string;
  config: PageConfig;
  components: ComponentNode[];
  version: number;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
  creatorId?: string;
}

export interface PageConfig {
  navigationBarBackgroundColor?: string;
  navigationBarTextStyle?: 'black' | 'white';
  backgroundColor?: string;
  enablePullDownRefresh?: boolean;
  shareConfig?: ShareConfig;
  dataSources?: DataSource[];
}

export interface ShareConfig {
  title: string;
  desc?: string;
  imageUrl?: string;
  path?: string;
}

export interface DataSource {
  key: string;
  url: string;
  method: 'GET' | 'POST';
  params?: Record<string, unknown>;
  autoFetch?: 'onLoad' | 'onShow' | 'manual';
}

export type PageStatus = 'draft' | 'published' | 'archived';

export interface ProjectSchema {
  id: string;
  name: string;
  description?: string;
  pages: PageSchema[];
  globalConfig?: GlobalConfig;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalConfig {
  primaryColor?: string;
  fontFamily?: string;
  tabBar?: TabBarConfig;
}

export interface TabBarConfig {
  color: string;
  selectedColor: string;
  backgroundColor: string;
  list: Array<{
    pagePath: string;
    text: string;
    iconPath?: string;
    selectedIconPath?: string;
  }>;
}
