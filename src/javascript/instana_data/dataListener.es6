'use strict';

const localUrl = window.location.origin;
const snapshotUrl = localUrl +
  '/api/snapshots/com.instana.forge.infrastructure.os.OS';
const ec2Url = localUrl +
  '/api/snapshots/com.instana.forge.infrastructure.virtualization.EC2';

class DataListener {
  constructor(interval) {
    //bind methods
    this.getHosts = this.getHosts.bind(this);
    this.merge = this.merge.bind(this);
    //this.getInventory = this.getInventory.bind(this);

    setInterval(this.getHosts, interval);
  }

  getHosts() {
    const onUpdateHostsTemp = this.onUpdateHosts;
    const doit = this.merge;
    const t = this;

    this.getJSON(snapshotUrl)
      .then(function(hosts) {
        onUpdateHostsTemp(hosts);

        t.getJSON(ec2Url)
          .then(function(ec2s) {
            doit(hosts, ec2s);
          }, function(status) {
            //error detection....
            onUpdateHostsTemp({
              error: status
            });
          });

      }, function(status) {
        //error detection....
        onUpdateHostsTemp({
          error: status
        });
      });
  }

  merge(hosts, ec2s) {
    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i];
      for (let i2 = 0; i2 < ec2s.length; i2++) {
        const ec2 = ec2s[i2];

        if(host.hostId === ec2.hostId) {
          host.EC2 = ec2.snapshot;
        }
      }
    }
    this.onUpdateHosts(hosts);
  }

/*
  getHosts() {
    const onUpdateHostsTemp = this.onUpdateHosts;
    const getInventoryTemp = this.getInventory;

    this.getJSON(localUrl + '/api/hosts')
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
    this.getJSON(localUrl + '/api' + url)
      .then(function(inv) {
        update([hostID, inv]);
      }, function(status) {
        //error detection....
        update({
          error: status
        });
      });
  }
*/

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
