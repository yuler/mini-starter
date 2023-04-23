import fs from 'node:fs/promises'
import path from 'node:path'

import glob from 'fast-glob'
import { execa } from 'execa'
import ci from 'miniprogram-ci'
import esbuild from 'esbuild'

import { API_ROOT, packageJSON, projectJSON, root } from './constants'
import { exists } from './utils'

const srcDir = projectJSON.srcMiniprogramRoot
const distDir = projectJSON.miniprogramRoot

buildNpm()
buildTS()
buildWxss()
buildCopy()

// buildNpm
export async function buildNpm() {
  const {
    packageJsonPath,
    miniprogramNpmDistDir,
  }: {
    packageJsonPath: string
    miniprogramNpmDistDir: string
  } = projectJSON['setting']['packNpmRelationList'][0]
  const buildNpmResult = await ci.packNpmManually({
    packageJsonPath,
    miniprogramNpmDistDir,
  })
  console.log(buildNpmResult)
}

// ESBuild
export function buildTS(
  paths: string[] = glob.sync(`${srcDir}**/*.ts`, {
    cwd: root,
  }),
) {
  esbuild.build({
    entryPoints: paths,
    outdir: `./${distDir}/`,
    outbase: '',
    define: {
      __appId: JSON.stringify(projectJSON.appid),
      __version: JSON.stringify(packageJSON.version),
      __apiRoot: JSON.stringify(API_ROOT),
    },
  })
}

// Copy files w/o `.ts` extension
export async function buildCopy(
  paths: string[] = glob.sync([`**/*`, '!**/*.ts'], {
    cwd: srcDir,
  }),
) {
  for (const file of paths) {
    const dir = path.resolve(distDir, path.dirname(file))
    if (!(await exists(dir))) {
      await fs.mkdir(dir, { recursive: true })
    }
    await execa('cp', [`${srcDir}${file}`, `${distDir}/${path.dirname(file)}`])
  }
}

// Unocss
export async function buildWxss() {
  execa('unocss', [
    `${srcDir}**/*.wxml`,
    '--out-file',
    `${distDir}unocss.wxss`,
  ]).stdout?.pipe(process.stdout)
}
