import type { IApp } from '../app'
import enhancePage from '../enhance-page'

const $app = getApp<IApp>()

enhancePage({
  data: {
    time: new Date().toLocaleString(),
  },
  onLoad() {
    /**
     * Event come from `app`
     * @example events
     */
    $app.$on('app:tick', () => {
      this.setData({
        time: new Date().toLocaleString(),
      })
    })
  },
})
