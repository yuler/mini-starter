import {defineConfig, presetUno} from 'unocss'

export default defineConfig({
  presets: [presetUno({preflight: false})],
  preflights: [],
  shortcuts: [],
  blocklist: ['container'],
  safelist: 'm-auto invisible'.split(' '),
})
