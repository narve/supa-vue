// noinspection JSUnusedGlobalSymbols

import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'

// const defineConfig = import('vite')

// https://vitejs.dev/config/
export default defineConfig({
// @ts-ignore
  plugins: [vuePlugin()]
})
