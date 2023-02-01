import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import { presetAttributify, presetWind, presetIcons } from 'unocss'

export default defineConfig({
	plugins: [
		jsx(),
		unocss({
			presets: [presetAttributify(), presetWind(), presetIcons()]
		})
	],
	define: {
		'process.env': {}
	},
	build: {
		lib: {
			name: 'juejinBookSearch',
			entry: 'src/index.ts',
			fileName: () => 'index.js',
			formats: ['iife']
		},
		cssCodeSplit: true,
		copyPublicDir: true,
	}
})
