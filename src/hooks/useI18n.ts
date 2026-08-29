/**
 * useI18n — React 绑定（薄封装 @lieshoucloud/i18n 的框架无关核心）。
 *
 * 语言切换后驱动组件重渲染（useSyncExternalStore 订阅 onLocaleChange），
 * 组件内用返回的 t() 取值（重渲染时取到最新语言）。
 *
 * 用法：
 *   const { t, locale, setLocale } = useI18n();
 *   t('home.alertsToday');              // "今日告警" / "Alerts Today"
 *   setLocale('en-US');                  // 切换并触发订阅组件重渲染
 */
import { useCallback, useSyncExternalStore } from 'react';

import {
  getLocale,
  onLocaleChange,
  setLocale,
  t,
  type Locale,
} from '@lieshoucloud/i18n';

export interface UseI18nResult {
  /** 当前语言 */
  locale: Locale;
  /** 切换语言（触发所有订阅组件重渲染） */
  setLocale: (locale: Locale) => void;
  /** 取值（类型安全 key + 插值） */
  t: typeof t;
}

export function useI18n(): UseI18nResult {
  const locale = useSyncExternalStore(onLocaleChange, getLocale);
  const changeLocale = useCallback((l: Locale) => setLocale(l), []);
  return { locale, setLocale: changeLocale, t };
}
