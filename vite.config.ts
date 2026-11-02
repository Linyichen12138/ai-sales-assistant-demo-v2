import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base './' + HashRouter + singlefile：dist/index.html 可直接双击（file://）打开
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { assetsInlineLimit: 100000000, chunkSizeWarningLimit: 5000 },
  server: { host: '0.0.0.0', port: 5173 },
})
