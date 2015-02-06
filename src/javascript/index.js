'use strict';

var instana = require('./app');
var setup = require('./setup');

var application = new instana.Application();
setup(application);
