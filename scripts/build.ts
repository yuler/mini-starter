import fs from 'node:fs/promises'
import path from 'node:path'

import glob from 'fast-glob'
import { execa } from 'execa'
import ci from 'miniprogram-ci'
import esbuild from 'esbuild'

import { API_ROOT, packageJSON, projectJSON, root } from './constants'
import { exists } from './utils'

const srcDir = path.resolve(root, projectJSON.srcMiniprogramRoot)
const distDir = path.resolve(root, projectJSON.miniprogramRoot)

buildNpm()
buildTS()
buildCopy()
buildWxss()

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
  files: string[] = glob
    .sync(`**/*.ts`, {
      cwd: srcDir,
    })
    .map(file => path.resolve(srcDir, file)),
) {
  esbuild.build({
    entryPoints: files,
    outdir: distDir,
    define: {
      __appId: JSON.stringify(projectJSON.appid),
      __version: JSON.stringify(packageJSON.version),
      __apiRoot: JSON.stringify(API_ROOT),
    },
  })
}

// Copy files w/o `.ts` extension
export async function buildCopy(
  files: string[] = glob
    .sync([`**/*`, `!**/*.ts`], {
      cwd: srcDir,
    })
    .map(file => path.resolve(srcDir, file)),
) {
  for (const file of files) {
    const dir = path.dirname(file)
    if (!(await exists(dir))) {
      await fs.mkdir(dir, { recursive: true })
    }
    await execa('cp', [
      file,
      path.resolve(distDir, path.relative(srcDir, file)),
    ])
  }
}

// Unocss
export async function buildWxss() {
  await execa('unocss', [
    ...glob.sync([`**/*.wxml`], {
      cwd: srcDir,
      absolute: true,
    }),
    `${srcDir}**/*.wxml`,
    '--out-file',
    path.resolve(distDir, 'unocss.wxss'),
  ]).pipeStdout?.(process.stdout)
}
