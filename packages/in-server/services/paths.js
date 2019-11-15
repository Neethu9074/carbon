const path = require('path');

exports.assetDir = path.join(__dirname, '..', 'assets');
exports.bundleDir = path.join(exports.assetDir, 'bundle');
exports.indexJs = path.join(exports.bundleDir, 'index.js');
exports.indexCss = path.join(exports.bundleDir, 'index.css');
exports.indexHtmlTemplate = path.join(__dirname, '..', 'templates', 'index.hbs');
exports.redirectToSignInTemplate = path.join(__dirname, '..', 'templates', 'redirectToSignIn.hbs');
exports.maximumCookiesTemplate = path.join(__dirname, '..', 'templates', 'maximumCookies.hbs');

exports.waitingCss = path.join(exports.bundleDir, 'waiting.css');
exports.waitingJs = path.join(exports.bundleDir, 'waiting.js');
exports.waitingHtmlTemplate = path.join(__dirname, '..', 'templates', 'waiting.hbs');
