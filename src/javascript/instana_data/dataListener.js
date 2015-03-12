'use strict';

exports.DataListener = function DataListener(interval) {
	//bind methods
	this.getHosts = this.getHosts.bind(this);
	this.getInventory = this.getInventory.bind(this);

	setInterval(this.getHosts, interval);
};

exports.DataListener.prototype.getHosts = function() {
	var onUpdateHostsTemp = this.onUpdateHosts;
  var getInventoryTemp = this.getInventory;

	getJSON('http://localhost:4000/api/hosts')
		.then(function(hosts) {
			onUpdateHostsTemp(hosts);
      getInventoryTemp(hosts);
		}, function(status) {
			//error detection....
			onUpdateHostsTemp({
				error: status
			});
		});
};

exports.DataListener.prototype.getInventory = function(hosts) {
	var onUpdateInventoryTemp = this.onUpdateInventory;

  for (var i = 0; i < hosts.length; i++) {
    var host = hosts[i];
    var id = host.id;
    var url = host.discoveriesUrl;
    url = url.substring(url.indexOf('/hosts/'));
    getInv(id, url, onUpdateInventoryTemp);
  }
};

//create external function to get scope of hostID
function getInv(hostID, url, update) {
  getJSON('http://localhost:4000/api' + url)
  .then(function(inv) {
    update([hostID, inv]);
  }, function(status) {
    //error detection....
    update({
      error: status
    });
  });
}

exports.DataListener.prototype.onUpdateHosts = function() {};
exports.DataListener.prototype.onUpdateInventory = function() {};

//support stuff
function getJSON(url) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
			var status = xhr.status;
			if (status === 200) {
				resolve(xhr.response);
			} else {
				reject(status);
			}
		};
		xhr.send();
	});
}
