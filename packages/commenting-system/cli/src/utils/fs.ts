import fs from 'fs/promises';
import path from 'path';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeFileIfNotExists(filePath: string, content: string): Promise<boolean> {
  const exists = await fileExists(filePath);
  if (exists) {
    return false;
  }
  
  await fs.writeFile(filePath, content, 'utf-8');
  return true;
}

export async function appendToFile(filePath: string, content: string): Promise<void> {
  await fs.appendFile(filePath, content, 'utf-8');
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8');
}

export function getRelativePath(from: string, to: string): string {
  return path.relative(from, to);
}

