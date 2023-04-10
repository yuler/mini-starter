import {Preset, defineConfig, presetUno} from 'unocss'

export default defineConfig({
  presets: [presetUno({preflight: false}), presetRemTorpx()],
  preflights: [],
  shortcuts: [],
  blocklist: ['container'],
  safelist: 'm-auto invisible'.split(' '),
})

// https://unocss.dev/config/presets
function presetRemTorpx(): Preset {
  const remRE = /(-?[\.\d]+)rem/g

  return {
    name: 'rem-to-rpx',
    postprocess: util => {
      util.entries.forEach(i => {
        const value = i[1]
        if (value && typeof value === 'string' && remRE.test(value)) {
          i[1] = rem2rpx(value)
        }
      })
    },
  }
}

function rem2rpx(value: string) {
  return `${+value.slice(0, -3) * 16 * 2}rpx`
}
