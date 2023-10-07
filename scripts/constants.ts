import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config } from 'dotenv'
import invariant from 'tiny-invariant'

// Load `.env` file & export env variables
config()
invariant(process.env.IDE_CLI, 'Please set `IDE_CLI`')
invariant(process.env.APP_API_ROOT, 'Please set `APP_API_ROOT`')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const root = path.resolve(__dirname, '..')

export const packageJSON: Record<string, any> = JSON.parse(
  await fs.readFile(path.resolve(root, 'package.json'), 'utf-8'),
)
export const projectJSON: Record<string, any> = JSON.parse(
  await fs.readFile(path.resolve(root, 'project.config.json'), 'utf-8'),
)
