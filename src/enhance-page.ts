import { IApp } from './app'

interface Data {
  $loading: boolean
  $error: null | string | Error
}

interface Option {
  $app: IApp
}

/**
 * Override the `Page` constructor options
 * @type {WechatMiniprogram.Page.Options}
 */
type MPPageOptions<
  TData extends MP.Page.DataOption,
  TCustom extends MP.Page.CustomOption,
> = (TCustom &
  Partial<MP.Page.Data<TData>> &
  Partial<MP.Page.ILifetime> & {
    options?: MP.Component.ComponentOptions
  }) &
  ThisType<MP.Page.Instance<TData & Data, TCustom & Option>>

export default function enhancePage<
  T extends MP.Page.DataOption,
  U extends MP.Page.CustomOption,
>(options: MPPageOptions<T, U>) {
  let onLoadComplete = false
  const originOnLoad = options.onLoad
  /**
   * Intercept the original `onLoad` method, for handle common logic. ex: `wx.login`
   */
  const onLoad: MP.Page.ILifetime['onLoad'] = async function (
    this: any,
    query,
  ) {
    const $app = getApp<IApp>()
    $app.$log('enhancePage', '#onLoad', { query })
    // TODO: Login by wx.login
    // if (!wx.getStorageSync('TOKEN')) {
    //   await (async function loginWithRetry() {
    //     try {
    //       const $app = getApp<IApp>()
    //       const { code } = await wx.login()
    //       const { token } = await $app.$api<{ token: string }>({
    //         url: 'login',
    //         method: 'POST',
    //         data: {
    //           code,
    //         },
    //       })
    //       wx.setStorageSync('TOKEN', token)
    //     } catch (error) {
    //       console.log(error)
    //       if (
    //         error === 401 &&
    //         $app.$state.retryLogin < $app.$state.retryLoginMax
    //       ) {
    //         $app.$state.retryLogin++
    //         await loginWithRetry()
    //       } else {
    //         console.log(error)
    //       }
    //     }
    //   })()
    // }
    await originOnLoad?.call(this, query)
    onLoadComplete = true
    $app.$log('enhancePage', '#onLoad complete')
  }

  const originOnShow = options.onShow
  /**
   * Intercept the original `onShow` method, and wait for `onLoad` to complete before executing it
   */
  const onShow: MP.Page.ILifetime['onShow'] = async function (this: any) {
    // polling until `onLoad` complete
    if (!onLoadComplete) {
      setTimeout(() => {
        onShow()
      }, 100)
      return
    }
    const $app = getApp<IApp>()

    $app.$log('enhancePage', '#onShow')
    await originOnShow?.call(this)
    $app.$log('enhancePage', '#onShow complete')
  }

  options = {
    ...options,
    data: {
      $loading: false,
      $error: null,
      ...options.data,
    },
    onLoad,
    onShow,
  }

  Page<T, U>(options)
}
