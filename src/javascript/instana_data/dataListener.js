'use strict';

exports.DataListener = function DataListener(interval) {
  //bind methods
  this.updateDate = this.updateDate.bind(this);

  setInterval(this.updateDate, interval);
};

exports.DataListener.prototype.updateDate = function() {
  //get the data
  var data = { data: 'someData' };

  if(this.onUpdate !== undefined) {
    this.onUpdate( data );
  }
};

exports.DataListener.prototype.onUpdate = undefined;

exports.DataListener.prototype.calculateDeltaTime = function() {
	var timeNow = Date.now();
	var deltaTime = (timeNow - this.time);
	this.time = timeNow;

  return deltaTime;
};
