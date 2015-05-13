'use strict';

import RxEmitter from 'rxemitter';

// This is our application wide event bus
const emitter = new RxEmitter('global event bus');

export default emitter;
