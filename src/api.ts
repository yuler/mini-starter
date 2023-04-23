// https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
export async function api<T = any>({
  url,
  method,
  data,
  abort,
}: {
  url: string
  method:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT'
    | undefined
  data?: any
  abort?: Function
}) {
  return new Promise<T>((resolve, reject) => {
    const headers: Record<string, string> = {
      appId: __appId,
      version: __version,
      source: 'miniprogram',
    }
    const token = wx.getStorageSync('TOKEN')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const requestTask = wx.request<{ code: number; msg: string }>({
      url: `${__apiRoot}/${url}`,
      method,
      dataType: 'json',
      data,
      header: headers,
      success: response => {
        // Http code error
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(response)
        }

        // Biz code error
        if (response.data.code !== 0) {
          reject(response.data)
        }

        resolve(response.data as T)
      },
      fail: reject,
    })
    if (abort) abort = requestTask.abort
  })
}
