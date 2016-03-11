import crypto from 'crypto';
import fs from 'fs';

export function getSriIntegrityForFile(path) {
  return 'sha256-' + crypto.createHash('sha256').update(fs.readFileSync(path)).digest('base64');
}

export function getChecksumForFile(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
}
