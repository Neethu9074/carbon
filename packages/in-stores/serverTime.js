/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest, create } from '@instana/observables';

import { offset, toServerTime } from 'in-stores/timeOffset';

// EXPLICITLY USING A TIMEOUT TO AVOID EVENT LOOP CONGESTION.
//
// An interval would be executed at least one per second. A timeout
// based solution will only be called at once every second. This is
// large difference when the browser has problems rendering / scripting.
// Especially in our case, since this will trigger timeline repaints.
let timeoutHandle;
const localTime$ = create({
  start(observable) {
    loop();
    function loop() {
      observable.emit(Date.now());
      setTimeout(loop, 1000);
    }
  },

  stop() {
    clearTimeout(timeoutHandle);
  }
});

export const serverTime$ = combineLatest([offset, localTime$]).map(([_currentOffset, _localTime]) =>
  toServerTime(_localTime, _currentOffset)
);
