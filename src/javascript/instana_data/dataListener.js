'use strict';

class DataListener {
  constructor(interval) {
    //bind methods
    this.getHosts = this.getHosts.bind(this);
    this.getInventory = this.getInventory.bind(this);

    setInterval(this.getHosts, interval);
  }

  getHosts() {
    const onUpdateHostsTemp = this.onUpdateHosts;
    const getInventoryTemp = this.getInventory;

    this.getJSON('http://localhost:4000/api/hosts')
      .then(function(hosts) {
        onUpdateHostsTemp(hosts);
        getInventoryTemp(hosts);
      }, function(status) {
        //error detection....
        onUpdateHostsTemp({
          error: status
        });
      });
  }

  getInventory(hosts) {
    const onUpdateInventoryTemp = this.onUpdateInventory;
    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i];
      const id = host.id;
      let url = host.discoveriesUrl;
      url = url.substring(url.indexOf('/hosts/'));
      this.getInv(id, url, onUpdateInventoryTemp);
    }
  }

  //create external function to get scope of hostID
  getInv(hostID, url, update) {
    this.getJSON('http://localhost:4000/api' + url)
      .then(function(inv) {
        update([hostID, inv]);
      }, function(status) {
        //error detection....
        update({
          error: status
        });
      });
  }

  onUpdateHosts() {};
  onUpdateInventory() {};

  //support stuff
  getJSON(url) {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
        const status = xhr.status;
        if (status === 200) {
          resolve(xhr.response);
        } else {
          reject(status);
        }
      };
      xhr.send();
    });
  }
}

export default DataListener;
