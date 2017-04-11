import {create} from 'reactive-observables';

import {createTrackingStore} from 'in-stores/store';

// EXPLICITLY USING A TIMEOUT TO AVOID EVENT LOOP CONGESTION.
//
// An interval would be executed at least one per second. A timeout
// based solution will only be called at once every second. This is
// large difference when the browser has problems rendering / scripting.
// Especially in our case, since this will trigger timeline repaints.
let timeoutHandle;

export const localTime = createTrackingStore({
  name: 'localTime',
  observable: create({
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
  })
}).observable;
