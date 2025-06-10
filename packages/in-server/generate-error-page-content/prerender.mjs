/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fileURLToPath } from 'url';
import path from 'node:path';
import fs from 'node:fs';

import { SSRRender } from './dist/server/pageserver.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const toAbsolute = p => path.resolve(__dirname, p);
console.log('directory path', __dirname);

const pagesToPrerender = ['403', '404', '500', 'maintenance'];

const templatesDir = '../src/templates/generated';
const templatesPath = toAbsolute(templatesDir);

// copy styles and fonts
const outStylePath = toAbsolute('../assets/errorPages/css');
const inStylePath = toAbsolute('./dist/server/errorPages/css');

function clearDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    fs.rmSync(filePath);
  });
}

// Clear or create the errorPages assets directory then copy to assets
if (!fs.existsSync(outStylePath)) {
  fs.mkdirSync(outStylePath);
} else {
  clearDirectory(outStylePath);
}
fs.cpSync(inStylePath, outStylePath, { recursive: true });

// Create or clear the generated templates directory
if (!fs.existsSync(templatesPath)) {
  fs.mkdirSync(templatesPath);
} else {
  clearDirectory(templatesPath);
}

const template = fs.readFileSync(toAbsolute(`dist/server/content.hbs`), 'utf-8');

(async () => {
  // pre-render each page...
  for (const page of pagesToPrerender) {
    const contentHtml = SSRRender(page);
    const pageName = page === 'maintenance' ? 'Maintenance' : page;
    const templateName = `content${pageName}.hbs`;

    const html = template.replace(`<!--content-html-->`, contentHtml);

    const filePath = `${templatesDir}/${templateName}`;
    fs.writeFileSync(toAbsolute(filePath), html);
    console.log('Rendered template', filePath);
  }
})();
