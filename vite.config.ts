import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { seo } from './src/data/portfolio.ts';
import { copy } from './src/types/portfolio.ts';
import { generateOgSvg } from './scripts/og-image.ts';
import { collectProfile } from './scripts/profile-collector.ts';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default defineConfig({
  server: { watch: { ignored: ['**/tmp/**', '**/qa/current/**'] } },
  plugins: [react(), {
    name: 'portfolio-metadata',
    transformIndexHtml: html => html
      .replaceAll('__META_TITLE__', escape(copy(seo.title)))
      .replaceAll('__META_DESCRIPTION__', escape(copy(seo.description)))
      .replaceAll('__OG_TITLE__', escape(copy(seo.ogTitle)))
      .replaceAll('__OG_DESCRIPTION__', escape(copy(seo.ogDescription))),
    configureServer(server) {
      server.middlewares.use('/og-image.svg', (_request, response) => {
        response.setHeader('Content-Type', 'image/svg+xml');
        response.end(generateOgSvg());
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/__profile', (request, response) => { void collectProfile(request, response); });
    },
  }],
  build: { manifest: true, chunkSizeWarningLimit: 1000 },
});
