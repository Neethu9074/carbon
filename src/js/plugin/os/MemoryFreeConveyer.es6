'use strict';

import Immutable from 'immutable';
import {create} from '../conveyer';
import http from '../http';

class MemoryFreeConveyer {
  constructor() {
    this.run = this.run.bind(this);
  }

  start(onNext, onError) {
    this.running = true;
    this.onNext = onNext;
    this.onError = onError;
    this.run();
  }

  run() {
    if (!this.running) return;

    http.get('/api/snapshots/com.instana.forge.infrastructure.os.OS')
    .then(response => {
      if (!this.running) return;
      const newInventory = response.body;
      if (!Immutable.is(this.lastInventory, newInventory)) {
        // TODO Ben compute smallest possible diff between both immutable
        // values
        this.onNext(newInventory);
        this.lastInventory = newInventory;
      }
      setTimeout(this.run, 1000);
    }, error => {
      if (!this.running) return;
      this.onError(error);
      setTimeout(this.run, 1000);
    });
  }

  stop() {
    this.running = false;
    this.lastInventory = null;
  }
}
export default create(MemoryFreeConveyer);
