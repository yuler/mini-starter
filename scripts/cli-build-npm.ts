/**
 * @description Build npm
 * @see https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
 * @see https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html
 */
import path from 'node:path'
import {execa} from 'execa'
import {IDE_CLI, dirname} from './utils'

const __dirname = dirname(import.meta)
const root = path.resolve(__dirname, '..')

execa(IDE_CLI!, ['build-npm', '--project', root]).stdout?.pipe(process.stdout)
