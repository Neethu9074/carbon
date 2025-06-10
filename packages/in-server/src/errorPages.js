/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const errorPageI18n = require('./errorPageI18n');

Handlebars.registerPartial({
  errorPage: fs.readFileSync(path.join(__dirname, 'templates', '_errorPage.hbs'), { encoding: 'utf8' }),
  ...Object.fromEntries(
    ['content403', 'content404', 'content500', 'contentMaintenance'].map(page => [
      page,
      fs.readFileSync(path.join(__dirname, 'templates', 'generated', `${page}.hbs`), { encoding: 'utf8' })
    ])
  )
});

Handlebars.registerHelper('whichError', function (content) {
  return content;
});

const csp = `font-src 'self' ; default-src 'self'`;

const template403 = getCompiledTemplate('403.hbs');
const template404 = getCompiledTemplate('404.hbs');
const template500 = getCompiledTemplate('500.hbs');
const templateMaintenance = getCompiledTemplate('maintenance.hbs');

exports.send403 = function send403(req, res, user, signOutUrl, returnUrlWithoutHash, nonce) {
  const t = req.t;
  res
    .status(403)
    .set('Content-Security-Policy', `${csp} 'nonce-${nonce}'`)
    .send(template403({ user, signOutUrl, returnUrlWithoutHash, nonce, ...errorPageI18n('403', t) }));
};

exports.send404 = function send404(req, res) {
  const t = req.t;
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');
  res
    .status(404)
    .set('Content-Security-Policy', csp)
    .send(template404(errorPageI18n('404', t)));
};

exports.send500 = function send500(req, res) {
  const t = req.t;
  res
    .status(500)
    .set('Content-Security-Policy', csp)
    .send(template500({ ...errorPageI18n('500', t) }));
};

exports.sendMaintenance = function sendMaintenance(req, res) {
  const t = req.t;
  res
    .status(503)
    .set('Content-Security-Policy', csp)
    .send(templateMaintenance(errorPageI18n('maintenance', t)));
};

function getCompiledTemplate(fileName) {
  return Handlebars.compile(fs.readFileSync(path.join(__dirname, 'templates', fileName), { encoding: 'utf8' }));
}
