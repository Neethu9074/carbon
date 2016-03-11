import crypto from 'crypto';
import fs from 'fs';

export function getHashForFile(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('base64');
}
