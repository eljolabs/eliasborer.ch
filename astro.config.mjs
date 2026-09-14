// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://eliasborer.ch',
  base: `/${(process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/'),
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
