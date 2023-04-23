# WeChat MiniProgram Starter

> This is a template for [WeChat MiniProgram](https://developers.weixin.qq.com/miniprogram/dev/framework/).

## Features

- 🚀 Enable `style: v2` & `weui: true` ([useExtendedLib](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#useExtendedLib)) in `app.json`
- 💪 Integration TypeScript
- 🎨 Integration UnoCSS
- 🛠️ Build System with [scripts](./scripts/)
- 📣 Wrap a event emitter power by [mitt](https://github.com/developit/mitt)

## Scripts

- `ide:*` forward to [WeChat Devtools CLI](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)
- `build` compiles the source code to the `dist` directory
- `dev` runs with watch mode
- `upload` uploads the code

## Usage

```bash
gh repo create --template yuler/mini-starter
```

- Change the `appid` in [project.config.json](./project.config.json)
- Download `private.${appid}.key` file from [Weixin Official Accounts Platform](https://mp.weixin.qq.com/wxamp/devprofile/get_profile)

## Related

- [微信小程序框架](https://developers.weixin.qq.com/miniprogram/dev/framework)
