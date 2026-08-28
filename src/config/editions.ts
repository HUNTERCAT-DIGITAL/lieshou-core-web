/**
 * 客户仓注入槽位契约（端壳 editions/extra.ts 与客户仓 deploy:prepare 生成物共享）.
 *
 * 通用仓（开源端壳）提供同形状占位；客户仓 prepare.mjs 覆盖生成注入物。
 * 客户注入字段写错 → 客户仓 TS 编译期即报错（import 本类型 + satisfies），
 * 通用仓占位只负责「不崩」（缺字段回落默认）。
 *
 * 注：禁止在客户仓 prepare 生成物里重新定义这些接口（复制粘贴 = 漂移源）。
 */
export interface ClientTab {
  /** 对应 Expo Router 文件路由名（Tabs.Screen name），如 'legalmind/workspace' */
  key: string;
  /** tab 文案 */
  title: string;
  /** MaterialCommunityIcons 图标名（端壳 TabIcon 矢量渲染，禁 emoji，见 UI.md §4.4） */
  icon: string;
  /** 路由路径（Tab 点击跳转），如 '/legalmind/workspace' */
  href: string;
}

/** 客户品牌配置（登录页/头部去商业化标识） */
export interface BrandConfig {
  /** 品牌名（短） */
  name: string;
  /** 登录页主标题 */
  title: string;
  /** 副标题 */
  subtitle: string;
}

/** editions/extra.ts 槽位完整形状；字段均可选（各端按需取用，缺省回落通用默认） */
export interface EditionsConfig {
  EXTRA_TABS?: ClientTab[];
  EXTRA_HIDDEN?: string[];
  BRAND?: BrandConfig;
  API_BASE?: string;
}
