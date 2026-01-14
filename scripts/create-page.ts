import fs from 'node:fs/promises'
import path from 'node:path'
import { ask } from './utils'
import { appJSON, srcPath } from './constants'

let name = process.argv[2]

if (!name) {
  // read from user input
  name = await ask('Please input the page name: ')
  if (!name) {
    process.exit(1)
  }
}

const pageTsPath = path.resolve(srcPath, `pages/${name}.ts`)
const pageTsContent = `
import type { IApp } from '../app'
import enhancePage from '../enhance-page'

const $app = getApp<IApp>()

enhancePage({
  data: {
    // TODO: Define data
  },
  onLoad() {
    // TODO: Add your logic here
  },
})
`

const pageWxmlPath = path.resolve(srcPath, `pages/${name}.wxml`)
const pageWxmlContent = `
<template>
  <view>
    <text>Hello, ${name}!, file location: {{filePath}}</text>
  </view>
</template>
`

const pageJsonPath = path.resolve(srcPath, `pages/${name}.json`)
const pageJsonContent = `
{
  "usingComponents": {
    "mp-icon": "weui-miniprogram/icon/icon",
    "app-popup": "/components/app-popup/app-popup"
  }
}
`

async function updateAppJson() {
  appJSON.pages.push(`pages/${name}`)
  await fs.writeFile(
    path.resolve(srcPath, 'app.json'),
    JSON.stringify(appJSON, null, 2),
  )
}

;(async () => {
  await fs.writeFile(pageTsPath, pageTsContent)
  await fs.writeFile(pageWxmlPath, pageWxmlContent)
  await fs.writeFile(pageJsonPath, pageJsonContent)
  await updateAppJson()
  console.log(`Page ${name} created successfully`)
})()
