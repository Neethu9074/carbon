import * as ro from 'reactive-observables';

import {createTrackingStore} from 'in-stores/store';

let localTimeIntervalHandle;
export const localTime = createTrackingStore({
  name: 'localTime',
  observable: ro.create({
    start(observable) {
      observable.emit(Date.now());
      localTimeIntervalHandle = setInterval(() => {
        observable.emit(Date.now());
      }, 1000);
    },

    stop() {
      clearInterval(localTimeIntervalHandle);
    }
  })
}).observable;
