Component({
  options: {
    styleIsolation: 'shared',
    multipleSlots: true,
  },
  properties: {
    value: {
      type: String,
      value: '',
    },
    options: {
      type: Array,
      value: [],
    },
    placeholder: {
      type: String,
      value: '',
    },
  },
  data: {
    optionVisible: false,
  },
  lifetimes: {
    ready() {},
  },
  methods: {
    onInput(event: MP.Input) {
      const { value } = event.detail
      this.triggerEvent('input', { value })
    },
    onFocus() {
      this.setData({ optionVisible: true })
      this.triggerEvent('focus')
    },
    onBlur() {
      this.triggerEvent('blur')
    },
    onSelect(event: MP.CustomEvent) {
      const { option } = event.currentTarget.dataset
      this.triggerEvent('select', { option })
      this.setData({ optionVisible: false })
    },
  },
})
