import fs from 'node:fs/promises'
import path from 'node:path'

import glob from 'fast-glob'
import { execa } from 'execa'
import ci from 'miniprogram-ci'
import esbuild from 'esbuild'
import { format } from 'date-fns'

import { packageJSON, projectJSON, root } from './constants'
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
    outbase: srcDir,
    define: {
      __APP_ID__: JSON.stringify(projectJSON.appid),
      __APP_VERSION__: JSON.stringify(packageJSON.version),
      __APP_API_ROOT__: JSON.stringify(process.env.APP_API_ROOT),
      __BUILD_TIME__: JSON.stringify(format(new Date(), 'yyyy-MM-dd HH:mm:ss')),
    },
  })
}

// Copy files w/o `.ts|.wxml` extension
export async function buildCopy(
  files: string[] = glob
    .sync([`**/*`, `!**/*.ts`, '!**/*.wxml'], {
      cwd: srcDir,
    })
    .map(file => path.resolve(srcDir, file)),
) {
  for (const file of files) {
    const dist = path.resolve(distDir, path.relative(srcDir, file))
    const dir = path.dirname(dist)
    if (!(await exists(dir))) {
      await fs.mkdir(dir, { recursive: true })
    }
    await execa('cp', [file, dist])
  }
}

// Unocss
export async function buildWxss() {
  execa('unocss', [
    ...glob.sync([`**/*.wxml`], {
      cwd: srcDir,
      absolute: true,
    }),
    '--out-file',
    path.resolve(distDir, 'unocss.wxss'),
  ]).stdout?.pipe(process.stdout)
}
