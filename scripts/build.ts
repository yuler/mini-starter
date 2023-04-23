import fs from 'node:fs/promises'
import path from 'node:path'
import glob from 'fast-glob'
import esbuild from 'esbuild'
import { execa } from 'execa'

import { API_ROOT, dirname, exists } from './utils.js'

// Paths
const __dirname = dirname(import.meta)
const root = path.resolve(__dirname, '..')

const packageJSON: Record<string, any> = JSON.parse(
  await fs.readFile(path.resolve(root, 'package.json'), 'utf-8'),
)
const projectJSON: Record<string, any> = JSON.parse(
  await fs.readFile(path.resolve(root, 'project.config.json'), 'utf-8'),
)

// ESBuild
esbuild.build({
  entryPoints: glob.sync(`${projectJSON.srcMiniprogramRoot}/**/*.ts`, {
    cwd: root,
  }),
  outdir: './dist/',
  outbase: '',
  define: {
    __appId: JSON.stringify(projectJSON.appid),
    __version: JSON.stringify(packageJSON.version),
    __apiRoot: JSON.stringify(API_ROOT),
  },
})

// Copy files w/o `.ts` extension
const files = glob.sync([`**/*`, '!**/*.ts'], {
  cwd: projectJSON.srcMiniprogramRoot,
})
for (const file of files) {
  const dir = path.resolve('dist', path.dirname(file))
  if (!(await exists(dir))) {
    await fs.mkdir(dir, { recursive: true })
  }
  await execa('cp', [
    `${projectJSON.srcMiniprogramRoot}${file}`,
    `dist/${path.dirname(file)}`,
  ])
}

// Unocss
execa('unocss', [
  'src/**/*.wxml',
  '--out-file',
  'dist/unocss.wxss',
]).stdout?.pipe(process.stdout)
