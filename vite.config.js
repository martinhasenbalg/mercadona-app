import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-icon.svg'],
      manifest: {
        name: 'Mercadona App',
        short_name: 'Mercadona',
        description: 'Explora productos y precios de Mercadona',
        theme_color: '#00823B',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tienda\.mercadona\.es\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'mercadona-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /^https:\/\/prod-mercadona\.imgix\.net\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mercadona-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://tienda.mercadona.es',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
