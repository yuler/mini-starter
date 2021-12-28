declare interface IApp {
	$system?: MP.SystemInfo
	$request: typeof request

	globalData: {
		debug: boolean
	}

	// Goto debug page
	gotoDebug?: () => void
}

App<IApp>({
	$system: undefined,

	globalData: {
		debug: false,
	},

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
	},

	$request: request,
})

/**
 * Wrapper function for wx.request
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
 *
 * @param url - Request url
 * @param options - Request options
 * @param requestTask - RequestTask for abort or interrupt
 * @returns - Response data when request success
 */
function request<T = any>(
	url: string,
	options: Omit<MP.RequestOption, 'url'>,
	requestTask?: MP.RequestTask,
): Promise<T> {
	return new Promise((resolve, reject) => {
		requestTask = wx.request<T>({
			url,
			timeout: 2000,
			header: {
				// TODO: replace to package.version
				version: '0.0.0',
			},
			success(result) {
				// Success
				if (result.statusCode >= 200 && result.statusCode < 300) {
					resolve(result.data)
				}
				reject(result)
			},
			fail: reject,
			...options,
		})
	})
}
