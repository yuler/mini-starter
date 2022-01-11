import type {IApp} from '../app'
import enchangePage from '../enchange-page'

const $app = getApp<IApp>()

enchangePage({
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
