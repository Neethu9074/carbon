'use strict';

import * as math from '../math';


class DataProvider{
  constructor(metaData) {
    this.ID = metaData.id;
    this.discription = '';
  }

  get3DContent() {}
  get2DContent() {}
}

export default DataProvider;
