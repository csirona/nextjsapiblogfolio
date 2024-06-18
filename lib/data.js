import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'posts.json');

export function readData() {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}
