/**
 * @description Forwarding arguments(set `project` option) to WeChat Devtools power by CLI.
 * @see https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
 */
import { execa } from 'execa'
import { root } from './constants'

const args = process.argv.slice(2)

execa(process.env.IDE_CLI!, [...args, '--project', root]).stdout?.pipe(
  process.stdout,
)
