/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

Handlebars.registerPartial(
  'errorPage',
  fs.readFileSync(path.join(__dirname, 'templates', '_errorPage.hbs'), { encoding: 'utf8' })
);

const csp = `default-src 'self'`;

const template403 = getCompiledTemplate('403.hbs');
const template404 = getCompiledTemplate('404.hbs');
const template500 = getCompiledTemplate('500.hbs');
const templateMaintenance = getCompiledTemplate('maintenance.hbs');

exports.send403 = function send403(req, res) {
  res
    .status(403)
    .set('Content-Security-Policy', csp)
    .send(template403({}));
};

exports.send404 = function send404(req, res) {
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');
  res
    .status(404)
    .set('Content-Security-Policy', csp)
    .send(template404({}));
};

exports.send500 = function send500(req, res) {
  res
    .status(500)
    .set('Content-Security-Policy', csp)
    .send(template500({}));
};

exports.sendMaintenance = function sendMaintenance(req, res) {
  res
    .status(503)
    .set('Content-Security-Policy', csp)
    .send(templateMaintenance({}));
};

function getCompiledTemplate(fileName) {
  return Handlebars.compile(fs.readFileSync(path.join(__dirname, 'templates', fileName), { encoding: 'utf8' }));
}
