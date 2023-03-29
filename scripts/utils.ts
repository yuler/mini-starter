import path from 'node:path'
import {fileURLToPath} from 'node:url'
import fs from 'node:fs/promises'

import {config} from 'dotenv'

// Load `.env` file
config()

export const IDE_CLI = process.env.IDE_CLI

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
