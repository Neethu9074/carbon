'use strict';

import * as math from '../math';


class DataProvider{
  constructor(metaData) {
    this.ID = metaData.id;
    this.discription = '';
  }

  setCube(cube) {
    this.cube = cube;
  }

  get3DContent() {}
  get2DContent() {}


  getDashboardUrl(){
    return 'www.google.com';
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
