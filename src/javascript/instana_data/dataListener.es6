'use strict';

import InventoryConveyer from 'instana-ui-services/conveyer/InventoryConveyer';
import {create} from 'instana-ui-services/conveyer';
import Immutable from 'immutable';

class DataListener {
  constructor() {
    //bind methods
    this.onNext = this.onNext.bind(this);
    this.onError = this.onError.bind(this);

    this.dataSource = new InventoryConveyer();
    this.dataSource.start(this.onNext, this.onError);
  }

  onNext(hosts) {
    this.onUpdateHosts(hosts);
  }

  onError() {

  }

  onUpdateHosts() {};

  /*
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
  */
}

export default DataListener;
