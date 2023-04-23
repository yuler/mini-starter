import fs from 'node:fs/promises'

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
