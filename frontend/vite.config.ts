import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'LSA Bridge — Sign Language Communication',
        short_name: 'LSA Bridge',
        description: 'Bidirectional communication between Algerian Sign Language and French, Arabic, English.',
        id: '/app',
        start_url: '/app?source=pwa',
        scope: '/',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'any',
        theme_color: '#0F766E',
        background_color: '#FAF8F5',
        lang: 'fr',
        categories: ['accessibility', 'utilities', 'medical'],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Two-way conversation',
            url: '/app/new?mode=two_way',
            description: 'Start a two-way LSA conversation'
          },
          {
            name: 'Phrasebook',
            url: '/app/phrasebook',
            description: 'Open quick phrases'
          },
          {
            name: 'Emergency phrases',
            url: '/app/phrasebook?category=emergency',
            description: 'Emergency phrases for immediate communication'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              networkTimeoutSeconds: 3,
              cacheName: 'pages-cache',
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/v1/'),
            handler: 'NetworkOnly',
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  }
});
