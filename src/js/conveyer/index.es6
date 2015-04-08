'use strict';

import rx from 'rx';
import Immutable from 'immutable';
import http from './http';

const inventoryConveyer = new rx.ReplaySubject(1);

let disposed = false;
let lastInventory = null;
loadInventory();

function loadInventory() {
  if (disposed) {
    return;
  }

  http.get('/api/hosts')
  .then(response => {
    const newInventory = response.body;
    if (!Immutable.is(lastInventory, newInventory)) {
      // TODO Ben compute smallest possible diff between both immutable
      // values
      inventoryConveyer.onNext(newInventory);
      lastInventory = newInventory;
    }
    setTimeout(loadInventory, 1000);
  }, error => {
    // TODO Ben propagate error on observable
    console.error(error);
    setTimeout(loadInventory, 1000);
  });
}

// returns a conveyer, where conveyer is
// a Observable<Immutable<Set<Host>>>
// + the following guarantee:
// the immutable objects will have the minimum number of changes possible, i.e.
// when only a single host is changed, than only this immutable host object +
// all parent objects (in the object hierarchy) will be different.
export function getInventory() {
  return inventoryConveyer;
}

export function dispose() {
  disposed = true;
  inventoryConveyer.dispose();
}
