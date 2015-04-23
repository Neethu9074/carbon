'use strict';

import RxEmitter from 'rxemitter';


//singleton
let instance;
export function getInstance() {
	if (!instance) {
    instance = new RxEmitter();
  }
  return instance;
}
