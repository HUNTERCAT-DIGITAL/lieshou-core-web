import { existsSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

/**
 * @lieshoucloud/* 解析双布局自适应：
 * - 本地开发：工作区并列（../lieshou-contract-api，与 tsconfig paths 一致）
 * - CI/消费方：open/* submodule 挂载（core-web 在 workspace 根）
 * node_modules 链接可能指向已删除的 open/（断链），不依赖它。
 */
function resolveShared(name: 'contract-api' | 'contract-types', sub: 'index.ts' | '') {
  const open = new URL(`./open/${name}/src/${sub}`, import.meta.url).pathname;
  const local = new URL(`../lieshou-${name}/src/${sub}`, import.meta.url).pathname;
  return existsSync(open) ? open : local;
}

export default defineConfig({
  resolve: {
    alias: {
      '@lieshoucloud/contract-api': resolveShared('contract-api', 'index.ts'),
      '@lieshoucloud/contract-types': resolveShared('contract-types', ''),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
