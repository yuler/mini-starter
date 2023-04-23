import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'

import { config } from 'dotenv'
import invariant from 'tiny-invariant'

// Load `.env` file & export env variables
config()
invariant(process.env.IDE_CLI, 'Please set `IDE_CLI`')
invariant(process.env.API_ROOT, 'Please set `API_ROOT`')
export const IDE_CLI = process.env.IDE_CLI
export const API_ROOT = process.env.API_ROOT

/**
 * Get current file path.
 */
export function filename(importMeta: ImportMeta) {
  return fileURLToPath(importMeta.url)
}

/**
 * Get current directory path.
 *
 */
export function dirname(importMeta: ImportMeta) {
  return path.dirname(fileURLToPath(importMeta.url))
}

/**
 * Check if the file exists.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
  } catch {
    return false
  }
  return true
}
