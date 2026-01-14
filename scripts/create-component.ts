import fs from 'node:fs/promises'
import path from 'node:path'
import { ask } from './utils'
import { srcPath } from './constants'

let name = process.argv[2]

if (!name) {
  // read from user input
  name = await ask('Please input the component name: ')
  if (!name) {
    process.exit(1)
  }
}

const componentTsPath = path.resolve(srcPath, `components/${name}/${name}.ts`)
const componentTsContent = `
Component({
  options: {
    virtualHost: true,
    styleIsolation: 'shared',
  },

  properties: {
    className: {
      type: String,
      value: '',
    },
  },

  data: {
    markImageValue: '',
    defaultSize: false,
  },

  lifetimes: {
    async attached() {
      // TODO: Add your logic here
    },
  },
})

`

const componentWxmlPath = path.resolve(
  srcPath,
  `components/${name}/${name}.wxml`,
)
const componentWxmlContent = `
<template>
  <view>
    <text>Hello, ${name}!, file location: {{filePath}}</text>
  </view>
</template>
`

const componentJsonPath = path.resolve(
  srcPath,
  `components/${name}/${name}.json`,
)
const componentJsonContent = `
{ "component": true }
`

;(async () => {
  await fs.mkdir(path.resolve(srcPath, `components/${name}`), {
    recursive: true,
  })
  await fs.writeFile(componentTsPath, componentTsContent)
  await fs.writeFile(componentWxmlPath, componentWxmlContent)
  await fs.writeFile(componentJsonPath, componentJsonContent)
  console.log(`component ${name} created successfully`)
})()
