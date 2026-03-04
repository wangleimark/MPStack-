// ===== 基础组件 =====
export { MpText } from './components/MpText';
export type { MpTextProps } from './components/MpText';

export { MpImage } from './components/MpImage';
export type { MpImageProps } from './components/MpImage';

export { MpContainer } from './components/MpContainer';
export type { MpContainerProps } from './components/MpContainer';

// ===== 媒体组件 =====
export { MpBanner, MpBannerMeta } from './components/MpBanner';
export type { MpBannerProps, BannerItem } from './components/MpBanner';

// ===== 业务组件 =====
export { MpOrderList, MpOrderListMeta } from './components/MpOrderList';
export type { MpOrderListProps, OrderItem } from './components/MpOrderList';

export { MpSearchBar, MpSearchBarMeta } from './components/MpSearchBar';
export type { MpSearchBarProps } from './components/MpSearchBar';

export { MpStoreList, MpStoreListMeta } from './components/MpStoreList';
export type { MpStoreListProps, StoreItem } from './components/MpStoreList';

export { MpTabBar, MpTabBarMeta } from './components/MpTabBar';
export type { MpTabBarProps, TabBarItem } from './components/MpTabBar';

export { MpNoticeList, MpNoticeListMeta } from './components/MpNoticeList';
export type { MpNoticeListProps, NoticeItem } from './components/MpNoticeList';

// ===== 注册表 =====
export { componentRegistry } from './registry';
export type { RegistryEntry } from './registry';
