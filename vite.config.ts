import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BASE_PATH = process.env.BASE_PATH ?? '/'

const config = defineConfig({
  base: BASE_PATH,
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      // Client-rendered SPA: emit a static index.html shell + client bundle.
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          crawlLinks: true,
          // Emit the SPA shell as index.html (default is /_shell) so it
          // serves as the static entry point for GitHub Pages.
          outputPath: '/index',
        },
      },
    }),
    viteReact(),
  ],
})

export default config
