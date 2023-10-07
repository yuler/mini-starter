import path from 'node:path'
import { config } from 'dotenv'
import chokidar from 'chokidar'
import { projectJSON, root } from './constants'
import { buildCopy, buildTS, buildWxss } from './build'
import { execa } from 'execa'

const srcDir = path.resolve(root, projectJSON.srcMiniprogramRoot)

// Build first, then watch
execa('npm', ['run', 'build'], { cwd: root }).stdout?.pipe(process.stdout)

// Watch `.env`, reload `dotenv`
chokidar.watch('.env').on('change', () => {
  config({
    override: true,
  })
  buildTS()
})

// Watch `.ts`
chokidar
  .watch('**/*.ts', {
    cwd: srcDir,
  })
  .on('all', async (event, filepath) => {
    if (!['add', 'change'].includes(event)) return

    filepath = path.resolve(srcDir, filepath)
    buildTS([filepath])
  })

// Watch `.wxss`
chokidar
  .watch('**/*.wxml', {
    cwd: srcDir,
  })
  .on('all', _ => {
    buildWxss()
  })

// Watch copy files
chokidar
  .watch('.', {
    cwd: srcDir,
    ignored: ['**/*.ts', '**/*.wxml'],
  })
  .on('all', (event, filepath) => {
    if (!['add', 'change'].includes(event)) return

    filepath = path.resolve(srcDir, filepath)
    buildCopy([filepath])
  })
