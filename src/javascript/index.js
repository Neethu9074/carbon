'use strict';

var instana = require('./instana_UI_3D/app');
var setup = require('./instana_UI_3D/setup');
var res = require('./instana_UI_3D/resources');
var data = require('./instana_data/dataListener');

//first load all resources
res.load(function() { //on finished

	//start up the UI when all resources are loaded
	var uiApplication = new instana.Application();
	setup(uiApplication);
	return;

  //fire up the data listener
	var detectedHostIds = [];
	Array.prototype.contains = function(obj) {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) {
				return true;
			}
		}
		return false;
	};

	//add logic to get realtime data and react to it
	var dataListener = new data.DataListener(1000); // in ms
	dataListener.onUpdate = function(currentData) {
		//react to it
		if (currentData.error !== undefined) {
			//error happened -> create test setup
		} else {
			for (var i = 0; i < currentData.length; i++) {
				var host = currentData[i];

				if (!detectedHostIds.contains(host.id)) {
					//new host found!

					detectedHostIds.push(host.id);
					uiApplication.addServer(1, 1, host);
				}
			}
		}
	};
});
