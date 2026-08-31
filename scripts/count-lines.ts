import fs from 'fs';
import path from 'path';

function countLinesInDir(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0;
  let totalLines = 0;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        totalLines += countLinesInDir(fullPath);
      }
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx|json|css)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n').filter((l) => l.trim().length > 0).length;
      totalLines += lines;
    }
  }

  return totalLines;
}

const rootDir = process.cwd();
const totalLines = countLinesInDir(rootDir);
console.log(`\n==============================================`);
console.log(`DATASTREAM SOURCE CODE LINE COUNT`);
console.log(`Measured Meaningful Lines: ${totalLines.toLocaleString()}`);
console.log(`==============================================\n`);
