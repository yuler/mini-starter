import fs from 'node:fs/promises'
import path from 'node:path'
import glob from 'fast-glob'
import esbuild from 'esbuild'
import {execa} from 'execa'

import {dirname} from './utils.js'

// Paths
const __dirname = dirname(import.meta)
const root = path.resolve(__dirname, '..')

const packageJson: Record<string, any> = JSON.parse(
  await fs.readFile(path.resolve(root, 'package.json'), 'utf-8'),
)
const projectJSON: Record<string, any> = JSON.parse(
  await fs.readFile(path.resolve(root, 'project.config.json'), 'utf-8'),
)

// ESBuild
esbuild.build({
  entryPoints: glob.sync('client/**/*.ts', {cwd: root}),
  outdir: '.',
  outbase: '.',
  define: {
    __appId: JSON.stringify(projectJSON.appid),
    __version: JSON.stringify(packageJson.version),
  },
})

// Unocss
execa('unocss', [
  'client/**/*.wxml',
  '--out-file',
  'client/unocss.wxss',
]).stdout?.pipe(process.stdout)
