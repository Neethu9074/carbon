'use strict';

import * as math from '../math';


class DataProvider{
  constructor(metaData) {
    this.ID = metaData.get('hostId');
  }

  setCube(cube) {
    this.cube = cube;
  }

  get3DContent() {}
  get2DContent() {}


  getDashboardUrl(){
    return 'www.instana.com';
  }

  setState(newState) {
    this.onStateChanged(newState);
  }

  dispose(){
    this.cube = null;
    this.ID = null;
    this.discription = null;
  }
}

export default DataProvider;
