const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

Handlebars.registerPartial('errorPage', fs.readFileSync(
  path.join(__dirname, 'templates', '_errorPage.hbs'),
  {encoding: 'utf8'}
));

const template403 = getCompiledTemplate('403.hbs');
const template404 = getCompiledTemplate('404.hbs');
const template500 = getCompiledTemplate('500.hbs');
const templateMaintenance = getCompiledTemplate('maintenance.hbs');

exports.send403 = function send403(req, res) {
  res.status(403).send(template403({}));
};

exports.send404 = function send403(req, res) {
  res.status(404).send(template404({}));
};

exports.send500 = function send403(req, res) {
  res.status(500).send(template500({}));
};

exports.sendMaintenance = function sendMaintenance(req, res) {
  res.status(503).send(templateMaintenance({}));
};

function getCompiledTemplate(fileName) {
  return Handlebars.compile(fs.readFileSync(
    path.join(__dirname, 'templates', fileName),
    {encoding: 'utf8'}
  ));
}
