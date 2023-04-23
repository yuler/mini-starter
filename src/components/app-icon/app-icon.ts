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
    size: {
      type: String,
      value: 'medium',
    },
  },

  lifetimes: {
    async attached() {
      this.setData({
        markImageValue: `url(data:image/svg+xml,${encodeURIComponent(
          icons[this.data.name],
        )})`,
      })
    },
  },
})
