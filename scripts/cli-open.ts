/**
 * @description Open current project in WeChat Devtools power by CLI.
 * @url https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
 */
import path from 'node:path'
import {execa} from 'execa'
import {IDE_CLI, dirname} from './utils'

const __dirname = dirname(import.meta)
const root = path.resolve(__dirname, '..')

await execa(IDE_CLI!, ['open', '--project', root])
