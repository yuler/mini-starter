import path from 'node:path'
import {fileURLToPath} from 'node:url'
import fs from 'node:fs/promises'

/**
 * Get current file path.
 *
 * @param {ImportMeta} importMeta
 * @returns {string}
 */
export function filename(importMeta) {
	return fileURLToPath(importMeta.url)
}

/**
 * Get current directory path.
 *
 * @param {ImportMeta} importMeta
 * @returns {string}
 */
export function dirname(importMeta) {
	return path.dirname(fileURLToPath(importMeta.url))
}

/**
 * Get the path to the wechat devtool cli path.
 *
 * @returns {Promise<string>}
 */
export async function getDevtoolCliPath() {
	let cliPath
	if (process.platform === 'darwin') {
		cliPath = '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'
	} else if (process.platform === 'win32') {
		cliPath = 'C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat'
	} else {
		throw new Error('Unsupported platform')
	}

	if (!exists(cliPath)) {
		throw new Error(
			'未找到微信小程序开发者工具，请确认是否安装，如未安装请前往 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html 下载',
		)
	}
	return cliPath
}

/**
 * Check if the file exists.
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export async function exists(path) {
	try {
		await fs.access(path)
	} catch {
		return false
	}
	return true
}
