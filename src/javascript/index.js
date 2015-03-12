'use strict';

var instana = require('./instana_UI_3D/app');
var setup = require('./instana_UI_3D/setup');
var res = require('./instana_UI_3D/resources');
var data = require('./instana_data/dataListenerManager');

//first load all resources
res.load(function() { //on finished

  //start up the UI when all resources are loaded
  var uiApplication = new instana.Application();
  //test setup
  //setup(uiApplication); return;

  var m = new data.DataListenerManager(uiApplication, 1000);
});
