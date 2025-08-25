import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
base: '/', // IMPORTANT for Vercel
build: { outDir: 'dist' } // Use dist on Vercel
})