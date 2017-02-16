const path = require('path');

exports.assetDir = path.join(__dirname, '..', 'assets');
exports.bundleDir = path.join(exports.assetDir, 'bundle');
exports.indexJs = path.join(exports.bundleDir, 'index.js');
exports.indexHtmlTemplate = path.join(__dirname, '..', 'templates', 'index.hbs');
