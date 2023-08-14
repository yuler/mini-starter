import path from 'node:path'

import chokidar from 'chokidar'
import glob from 'fast-glob'
import { projectJSON, root } from './constants'
import { buildCopy, buildTS, buildWxss } from './build'
import { execa } from 'execa'

const srcDir = path.resolve(root, projectJSON.srcMiniprogramRoot)

// Build first, then watch
execa('npm', ['run', 'build'], { cwd: root }).stdout?.pipe(process.stdout)

// Watch `.ts`
chokidar
  .watch(
    glob.sync([`**/*.ts`], {
      cwd: srcDir,
      absolute: true,
    }),
  )
  .on('change', path => {
    buildTS([path])
  })

// Watch `.wxss`
chokidar
  .watch(
    glob.sync([`**/*.wxml`], {
      cwd: srcDir,
      absolute: true,
    }),
  )
  .on('change', _ => {
    buildWxss()
  })

// Watch copy files
chokidar
  .watch(
    glob.sync([`**/*`, `!**/*.ts`, '!**/*.wxml'], {
      cwd: srcDir,
      absolute: true,
    }),
  )
  .on('change', path => {
    buildCopy([path])
  })
