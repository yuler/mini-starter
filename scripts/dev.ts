import chokidar from 'chokidar'
import { projectJSON, root } from './constants'
import { buildCopy, buildTS, buildWxss } from './build'
import { execa } from 'execa'

const srcDir = projectJSON.srcMiniprogramRoot

// Build first, then watch
execa('npm', ['run', 'build'], { cwd: root }).stdout?.pipe(process.stdout)

// Watch `.ts`
chokidar.watch(`${srcDir}**/*.ts`).on('change', path => {
  buildTS([path])
})

// Watch `.wxss`
chokidar.watch(`${srcDir}**/*.wxml`).on('change', _ => {
  buildWxss()
})

// Watch copy files
chokidar.watch(`${srcDir}**/*.{wxml,wxss,json,png}`).on('change', path => {
  buildCopy([path])
})
