'use strict';

var instana = require('./instana_UI_3D/app');
var setup = require('./instana_UI_3D/setup');
var res = require('./instana_UI_3D/resources');
var data = require('./instana_data/dataListener');

//first load all resources
res.load(function(){ //on finished

  //start up the UI when all resources are loaded
  var uiApplication = new instana.Application();

  //create test setup
  setup(uiApplication);


  //add logic to get realtime data and react to it
  var dataListener = new data.DataListener(2500);
  dataListener.onUpdate = function( currentData ) {
    //react to it

    //console.log(currentData);
  };
});
