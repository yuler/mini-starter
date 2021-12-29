interface Data {
	$loading: false
	$error: null | Error
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

export default function enchangePage<T = {}, U = {}>(
	options: MPPageOptions<T, U>,
) {
	const $app = getApp<IApp>()

	// Decorator onLoad
	const originOnLoad = options.onLoad
	const onLoad: MP.Page.ILifetime['onLoad'] = query => {
		$app.$log('enchangePage => onLoad', {query})
		originOnLoad?.(query)
	}

	options = {
		...options,
		$app,
		data: {
			$loading: false,
			$error: null,
			...options.data,
		},
		onLoad,
	}

	Page<T, U>(options)
}
