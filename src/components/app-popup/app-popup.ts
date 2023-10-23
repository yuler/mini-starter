Component({
  options: {
    styleIsolation: 'shared',
    multipleSlots: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: '_onChangeShow',
    },
    title: {
      type: String,
      value: '',
    },
  },
  data: {
    visible: false,
  },
  lifetimes: {
    ready() {
      this._onChangeShow(this.data.show)
    },
  },
  methods: {
    _onChangeShow(show: boolean) {
      if (show) {
        this.setData({ visible: true })
      } else {
        // Simple way for wait animate
        setTimeout(() => {
          this.setData({ visible: false })
        }, 300)
      }
    },
    onClose() {
      this.setData({
        show: false,
      })
    },
  },
})
