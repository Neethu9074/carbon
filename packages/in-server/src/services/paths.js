/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const path = require('path');

exports.assetDir = path.join(__dirname, '..', '..', 'assets');
exports.bundleDir = path.join(exports.assetDir, 'bundle');
exports.indexJs = path.join(exports.bundleDir, 'index.js');
exports.compStyleCss = path.join(exports.bundleDir, 'compStyle.css');
exports.indexHtmlTemplate = path.join(__dirname, '..', 'templates', 'index.hbs');
exports.redirectToSignInTemplate = path.join(__dirname, '..', 'templates', 'redirectToSignIn.hbs');
exports.maximumCookiesTemplate = path.join(__dirname, '..', 'templates', 'maximumCookies.hbs');

exports.waitingJs = path.join(exports.bundleDir, 'waiting.js');
exports.waitingHtmlTemplate = path.join(__dirname, '..', 'templates', 'waiting.hbs');
