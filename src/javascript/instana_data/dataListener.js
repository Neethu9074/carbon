'use strict';

exports.DataListener = function DataListener(interval) {
  //interval in ms
  this.interval = interval;

  //needed to calculate the delta between last call
	this.time = Date.now();
  this.counterTime = 0;

  //bind methods
  this.loop = this.loop.bind(this);

  //start loop
  this.loop();
};

exports.DataListener.prototype.loop = function() {
	//call this again
	requestAnimationFrame(this.loop);
  this.counterTime += this.calculateDeltaTime();

  if(this.counterTime > this.interval) {
    //reset counter
    this.counterTime = 0;

    this.updateDate();
  }
};

exports.DataListener.prototype.updateDate = function() {
  if(this.onUpdate !== undefined) {
    this.onUpdate( { data: 'someData' } );
  }
};

exports.DataListener.prototype.onUpdate = undefined;

exports.DataListener.prototype.calculateDeltaTime = function() {
	var timeNow = Date.now();
	var deltaTime = (timeNow - this.time);
	this.time = timeNow;

  return deltaTime;
};
