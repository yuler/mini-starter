/**
 * @description Open current project in WeChat Devtools power by CLI.
 * @url https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
 */
import path from 'node:path'
import childProcess from 'node:child_process'

import {getDevtoolCliPath, dirname} from './utils.js'

const __dirname = dirname(import.meta)

const openDevtool = async path => {
	const cliPath = await getDevtoolCliPath()
	const child = childProcess.spawn(cliPath, ['open', '--project', path], {
		detached: true,
		stdio: 'inherit',
	})
	child.unref()
}

await openDevtool(path.resolve(__dirname, '../'))
