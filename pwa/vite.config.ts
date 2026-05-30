import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/app/',
  build: {
    outDir: '../app',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'ExpiryX',
        short_name: 'ExpiryX',
        description: 'Expiry Reminder & Document Tracker',
        theme_color: '#F47C20',
        background_color: '#F2F7F8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/app/',
        scope: '/app/',
        icons: [
          { src: '/app/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/app/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/app/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/app/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/doctracker-backend\.onrender\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
  ],
})
