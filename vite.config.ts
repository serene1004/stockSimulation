import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const githubPagesBase = '/stockSimulation/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? githubPagesBase : '/',
  plugins: [vue()],
}))
