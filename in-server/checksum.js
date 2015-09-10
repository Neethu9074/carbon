import crypto from 'crypto';
import fs from 'fs';

export function getChecksumForFile(path) {
  return getChecksumForString(fs.readFileSync(path, {encoding: 'utf8'}));
}

export function getChecksumForString(str) {
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 10);
}
