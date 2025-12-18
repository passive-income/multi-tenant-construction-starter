import fs from 'fs/promises'
import path from 'path'

export async function getJsonData(fileName: string) {
  const filePath = path.join(process.cwd(), 'data', fileName)
  const file = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(file)
}
