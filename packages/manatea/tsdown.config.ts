import { defineConfig, type UserConfig } from 'tsdown';

const config: UserConfig = defineConfig({
  entry: { manatea: './src/index.ts' },
  outDir: 'dist',
  format: ['esm', 'cjs', 'umd'],
  platform: 'neutral',
  globalName: 'manatea',
  fixedExtension: true,
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
});

export default config;
