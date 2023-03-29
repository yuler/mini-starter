import path from 'node:path'
import fs from 'node:fs/promises'

import ci from 'miniprogram-ci'
import glob from 'fast-glob'
import esbuild from 'esbuild'

import {dirname} from './utils'

// Paths
const __dirname = dirname(import.meta)
const root = path.resolve(__dirname, '..')

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

// `build npm`
const buildNpmResult = await ci.packNpmManually({
  packageJsonPath,
  miniprogramNpmDistDir,
})
console.warn(buildNpmResult)

// ESBuild
esbuild.build({
  entryPoints: glob.sync('client/**/*.ts', {cwd: root}),
  outdir: '.',
  outbase: '.',
})
