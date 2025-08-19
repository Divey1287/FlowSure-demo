import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT for GitHub Pages
export default defineConfig({
plugins: [react()],
base: '/FlowSure-demo/',
build: { outDir: 'docs' }
})

