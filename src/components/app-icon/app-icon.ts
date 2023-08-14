import icons from './icons'

Component({
  options: {
    virtualHost: true,
    styleIsolation: 'shared',
  },

  properties: {
    className: {
      type: String,
      value: '',
    },
    name: {
      type: String,
      value: '',
    },
  },

  data: {
    markImageValue: '',
    defaultSize: false,
  },

  lifetimes: {
    async attached() {
      const { className } = this.data
      this.setData({
        defaultSize: !className.includes('w-') && !className.includes('h-'),
        markImageValue: `url(data:image/svg+xml,${encodeURIComponent(
          icons[this.data.name],
        )})`,
      })
    },
  },
})
