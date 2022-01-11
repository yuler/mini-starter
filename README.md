# Template WeChat MiniProgram

> This is a template for WeChat MiniProgram.

## Features

- TypeScript Integration
- Enable [useExtendedLib](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#useExtendedLib) weui

## Scripts

- `open` & `preview` & `build:npm` is forward to [WeChat Devtools CLI](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)

## Usage

```bash
gh repo create --template yuler/template-wechat-miniprogram
```

## Related

- [微信小程序框架](https://developers.weixin.qq.com/miniprogram/dev/framework)

## TODO

- [ ] Integration `tailwindcss` or `windicss` or `unocss`
- [ ] Add GitHub action run `miniprogram-ci` upload
- [ ] Move `$app` to enchangePage, add `$toast` & `$alert` & `$confirm` fns in `$app`

<!-- Links -->

[wechat devtools]: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
[wechat devtools cli]: https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
