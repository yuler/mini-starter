import path from 'node:path'
import fs from 'node:fs/promises'
import bytes from 'bytes'
import ci from 'miniprogram-ci'

import { packageJSON, projectJSON, root } from './constants'

// Paths

// Upload miniporgram
const project = new ci.Project({
  appid: projectJSON.appid,
  type: 'miniProgram',
  projectPath: root,
  privateKeyPath: path.resolve(root, `./private.${projectJSON.appid}.key`),
})
const uploadResult = await ci.upload({
  project,
  version: packageJSON.version,
  desc: packageJSON.description,
  robot: 1,
  setting: {
    es6: true,
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
  path.resolve(root, './upload-result.json'),
  JSON.stringify(uploadResultFormat, null, 2),
)
