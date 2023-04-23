import path from 'node:path'
import fs from 'node:fs/promises'
import bytes from 'bytes'
import ci from 'miniprogram-ci'

import { dirname } from './utils.js'

// Paths
const __dirname = dirname(import.meta)
const root = path.resolve(__dirname, '..')

const pakcageJSON: Record<string, any> = JSON.parse(
  await fs.readFile(path.resolve(root, 'package.json'), 'utf-8'),
)
const projectJSON: Record<string, any> = JSON.parse(
  await fs.readFile(path.resolve(root, 'project.config.json'), 'utf-8'),
)
const {
  packageJsonPath,
  miniprogramNpmDistDir,
}: {
  packageJsonPath: string
  miniprogramNpmDistDir: string
} = projectJSON['setting']['packNpmRelationList'][0]

// Build NPM
const buildNpmResult = await ci.packNpmManually({
  packageJsonPath,
  miniprogramNpmDistDir,
})
console.log(buildNpmResult)

// Upload miniporgram
const project = new ci.Project({
  appid: projectJSON.appid,
  type: 'miniProgram',
  projectPath: root,
  privateKeyPath: path.resolve(root, `./private.${projectJSON.appid}.key`),
  // ignores: ['scripts', 'README.md'],
})
const uploadResult = await ci.upload({
  project,
  version: pakcageJSON.version,
  desc: pakcageJSON.description,
  robot: 1,
  setting: {
    // es6: true,
    es7: true,
    minify: true,
    minifyJS: true,
    minifyWXML: true,
    minifyWXSS: true,
    codeProtect: true,
    autoPrefixWXSS: true,
  },
  onProgressUpdate: console.log,
})

const uploadResultFormat = {
  ...uploadResult,
  subPackageInfo: uploadResult.subPackageInfo?.map(subpack => {
    // @ts-ignore
    subpack.size = bytes.format(subpack.size)
    return subpack
  }),
  pluginInfo: uploadResult.pluginInfo?.map(plugin => {
    // @ts-ignore
    plugin.size = bytes.format(plugin.size)
    return plugin
  }),
}
console.log(uploadResultFormat)

fs.writeFile(
  path.resolve(__dirname, '../upload-result.json'),
  JSON.stringify(uploadResultFormat, null, 2),
)
