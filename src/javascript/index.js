'use strict';

var instana = require('./app');
var setup = require('./setup');
var res = require('./resources');

//first load all resources
res.load(function(){

  //start up the application when all resources are loaded
  var application = new instana.Application();
  setup(application);
});
