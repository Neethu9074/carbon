import { interval } from 'reactive-observables';

import { createTrackingStore } from 'in-stores/store';

export const localTime = createTrackingStore({
  name: 'localTime',
  observable: interval(1000)
}).observable;
