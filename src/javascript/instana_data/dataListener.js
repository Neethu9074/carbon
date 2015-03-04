'use strict';

exports.DataListener = function DataListener(interval) {
  //bind methods
  this.updateData = this.updateData.bind(this);
  this.callUpdate = this.callUpdate.bind(this);

  setInterval(this.updateData, interval);
};

exports.DataListener.prototype.updateData = function() {
  //get the data
  var updateMethod = this.callUpdate;

  getJSON('http://localhost:4000/api')
  .then(function(returnData) {
      updateMethod(extractDataFromJSONStructure(returnData));
  }, function(status) {
    //error detection....
      updateMethod( { error: status } );
  });
};

function extractDataFromJSONStructure(struct) {
  return struct;
}

exports.DataListener.prototype.callUpdate = function(data) {
  if(this.onUpdate !== undefined) {
    this.onUpdate( data );
  }
};

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

exports.DataListener.prototype.onUpdate = undefined;
