import { defineConfig } from 'tsup'

export default defineConfig({
	entryPoints: ['src/index.ts'],
	outDir: 'dist',
  format: ['iife'],
  bundle: true,
  shims: true,
	publicDir: 'public'
})
