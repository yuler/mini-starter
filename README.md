# WeChat MiniProgram Starter

> This is a template for WeChat MiniProgram.

## Features

- Enable `style: v2` & `weui: true` ([useExtendedLib](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#useExtendedLib)) in `app.json`
- TypeScript Integration
- Wrap a event emitter power by [mitt](https://github.com/developit/mitt)

## Scripts

- `open` & `preview` & `build:npm` is forward to [WeChat Devtools CLI](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)

## Usage

```bash
gh repo create --template yuler/mini-starter
```

## Related

- [微信小程序框架](https://developers.weixin.qq.com/miniprogram/dev/framework)

## TODO

- [ ] Rename `enchangePage` to `definePage`, add `$toast` & `$alert` & `$confirm` fns in `$app`
- [ ] Integration `tailwindcss`
- [ ] Add style lint
- [ ] Add GitHub action run `miniprogram-ci` upload
- [ ] Add eslint

<!-- Links -->

[wechat devtools]: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
[wechat devtools cli]: https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
