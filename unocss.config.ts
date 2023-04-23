import { Preset, defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno({ preflight: false }), presetRemTorpx()],
  preflights: [],
  shortcuts: [],
  blocklist: ['container'],
  safelist: 'm-auto invisible'.split(' '),
})

// https://unocss.dev/config/presets
const remRE = /(-?[\.\d]+)rem/g
function presetRemTorpx(): Preset {
  return {
    name: 'rem-to-rpx',
    postprocess: util => {
      util.entries.forEach(i => {
        const value = i[1]
        if (value && typeof value === 'string' && remRE.test(value)) {
          i[1] = value.replace(remRE, (_, p1) => `${p1 * 32}rpx`)
        }
      })
    },
  }
}
