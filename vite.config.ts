import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import content from './content-plugin.ts';

/**
 * Base path for GitHub Pages.
 *
 *  - User/root site (achalla18.github.io) or a custom domain  → '/'
 *  - Project site (achalla18.github.io/<repo>/)              → '/<repo>/'
 *
 * The deploy workflow computes this automatically and passes it in as
 * BASE_PATH. Locally it defaults to '/'. To test a subpath build locally:
 *   BASE_PATH=/my-repo/ npm run build && npm run preview
 */
function normalizeBase(raw: string | undefined): string {
  if (!raw || raw === '/') return '/';
  return `/${raw.replace(/^\/+|\/+$/g, '')}/`;
}

export default defineConfig({
  base: normalizeBase(process.env.BASE_PATH),
  plugins: [react(), content()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
  },
});
