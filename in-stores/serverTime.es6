import { combineLatest } from 'reactive-observables';

import { offset, toServerTime } from 'in-stores/timeOffset';
import { createTrackingStore } from 'in-stores/store';
import { localTime } from 'in-stores/localTime';

export const serverTime = createTrackingStore({
  name: 'serverTime',
  observable: combineLatest([offset, localTime]).map(([_currentOffset, _localTime]) =>
    toServerTime(_localTime, _currentOffset))
}).observable;

export const serverTime$ = serverTime;
