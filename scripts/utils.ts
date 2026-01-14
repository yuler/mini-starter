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

/**
 * Ask user a question via command line input.
 */
export async function ask(question: string): Promise<string> {
  const readline = await import('node:readline/promises')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const answer = (await rl.question(question)).trim()
  rl.close()
  return answer
}
