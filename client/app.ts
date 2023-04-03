import mitt from 'mitt'

import {TABS} from './constants'
import {api as $api} from './api'

const emitter = mitt()

export interface IApp {
  $system?: MP.SystemInfo

  $log: typeof $log
  $api: typeof $api
  $goto: typeof $goto

  $events: typeof emitter.all
  $on: typeof emitter.on
  $emit: typeof emitter.emit

  debug: boolean
  gloablData: any
}

App<IApp>({
  // Store System info
  $system: undefined,

  // Helper functions
  $log,
  $api,
  $goto,

  // Events
  $events: emitter.all,
  $on: emitter.on,
  $emit: emitter.emit,

  // Global state & data
  debug: false,
  gloablData: {},

  onLaunch() {
    /**
     * Save system info to `$system`
     * @url https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfo.html
     */
    wx.getSystemInfo()
      .then(data => {
        this.$system = data
      })
      .catch(_ => {})

    /**
     * Event emit to `home` page
     * @example events
     */
    setInterval(() => {
      this.$emit('app:tick', 'tick')
    }, 1000)
  },
})

/**
 * Wrap `console.log` with debug mode
 */
function $log(this: IApp, namespace: string, ...args: unknown[]) {
  getApp<IApp>().debug && console.log(`[${namespace}]: `, ...args)
}

/**
 * Wrap for `wx.navigateTo`
 * @param url The page path
 */
function $goto(url: string) {
  if (TABS.includes(url)) {
    wx.switchTab({url})
    return
  }
  wx.navigateTo({url})
}
