/** 导航端口：路由跳转（各端注入——react-router / expo-router / Taro navigateTo） */
export interface NavigationPort {
  to(path: string): void;
  replace(path: string): void;
}
