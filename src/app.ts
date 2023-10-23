import mitt from 'mitt'

import { TABS } from './constants'
import { api as $api } from './api'

const emitter = mitt()

export interface IApp {
  $system?: MP.SystemInfo
  $state: {
    retryLogin: number
    retryLoginMax: number
    user?: {
      avatar: string
      nickname: string
    }
  }

  $showLoading: typeof $showLoading
  $hideLoading: typeof $hideLoading
  $log: typeof $log
  $api: typeof $api
  $goto: typeof $goto
  $toast: typeof $toast
  $alert: typeof $alert
  $confirm: typeof $confirm

  $events: typeof emitter.all
  $on: typeof emitter.on
  $emit: typeof emitter.emit

  debug: boolean
  globalData: any
}

App<IApp>({
  // Store System info
  $system: undefined,
  $state: {
    retryLogin: 1,
    retryLoginMax: 3,
  },

  // Helper functions
  $showLoading,
  $hideLoading,
  $log,
  $api,
  $goto,
  $toast,
  $alert,
  $confirm,

  // Events
  $events: emitter.all,
  $on: emitter.on,
  $emit: emitter.emit,

  // Global state & data
  debug: false,
  globalData: {},

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

function $showLoading(options?: MP.ShowLoadingOption) {
  wx.showLoading(Object.assign({ mask: true }, options))
}
function $hideLoading() {
  wx.hideLoading({
    noConflict: true,
  })
}

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
    wx.switchTab({ url })
    return
  }
  wx.navigateTo({ url })
}

/**
 * Wrap for `wx.showToast`
 * @param message The message to show
 * @param duration @default 2000 The duration of the toast
 */
function $toast(message: string, duration = 2000) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration,
  })
}

/**
 * Wrap fro `wx.showModal`
 * @param message The message to display in the alert modal.
 * @returns A promise that resolves with user confirmed or not.
 */
function $alert(message: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false,
      success(result) {
        if (result.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail(error) {
        reject(error)
      },
    })
  })
}

/**
 * Wrap for `wx.showModal` to display a confirmation dialog.
 * @param message The message to display in the confirmation dialog.
 * @returns A promise that resolves with user confirmed or not.
 */
function $confirm(message: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: message,
      success(result) {
        if (result.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail(error) {
        reject(error)
      },
    })
  })
}
