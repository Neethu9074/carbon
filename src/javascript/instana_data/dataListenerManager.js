'use strict';

var data = require('./dataListener');

exports.DataListenerManager = function DataListenerManager(app, interval) {
	if (app === undefined || interval === undefined) {
		return undefined;
	}

  this.onUpdateHosts = this.onUpdateHosts.bind(this);
  this.onUpdateInventory = this.onUpdateInventory.bind(this);
  this.app = app;

  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return true;
      }
    }
    return false;
  };

	//a collection to store all found hosts
	this.detectedHostIds = [];
	//a collection to store all found inventory
	this.detectedInventory = [];

	//create the listener with a refresh interval of x
	var dataListener = new data.DataListener(interval); // in ms
	dataListener.onUpdateHosts = this.onUpdateHosts;
  dataListener.onUpdateInventory = this.onUpdateInventory;
};

exports.DataListenerManager.prototype.onUpdateHosts = function(
	currentHosts) {
	if (currentHosts.error !== undefined) {
    return; //if error occured
  }

	for (var i = 0; i < currentHosts.length; i++) {
		var hostMetaData = currentHosts[i];
		var hostID = hostMetaData.id;
		if (hostID !== undefined &&
      !this.detectedHostIds.contains(hostID)) {
			//new hostMetaData found!
			this.detectedHostIds.push(hostID);

			//create new hostMetaData cube
      this.app.addHost(2, 2, hostMetaData);
		} else {
			//hostMetaData is still created
			this.app.changeHost(hostID, hostMetaData);

			//TODO: calculate dif ?
		}
	}
};

exports.DataListenerManager.prototype.onUpdateInventory = function(
	currentInventory) {
	if (currentInventory.error !== undefined) {
    return; //if error occured
  }

  var hostID = currentInventory[0];
	for (var i = 0; i < currentInventory[1].length; i++) {
		var inv = currentInventory[1][i];
    var invID = hostID + '/' + inv.type + '/' + inv.properties.pid;
    if (!this.detectedInventory.contains(invID)) {
			//new host found!
			this.detectedInventory.push(invID);

      //get cube with name = hostID and add a cube
      var hostCube = this.app.getHost(hostID);
      hostCube.addContainer( {
        id: invID,
        discription: inv.type,
				pid: inv.properties.pid,
        tag: inv.properties.name,
        entityId: inv.properties.entityId,
        host: inv.properties.host
      });
		}
	}
};
