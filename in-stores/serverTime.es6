import {combineLatest} from 'reactive-observables';

import * as timeOffsetStore from 'in-stores/timeOffset';
import * as localTimeStore from 'in-stores/localTime';
import {createTrackingStore} from 'in-stores/store';


export const serverTime = createTrackingStore({
  name: 'serverTime',
  observable: combineLatest([timeOffsetStore.offset, localTimeStore.localTime])
    .map(([currentOffset, localTime]) => {
      return timeOffsetStore.toServerTime(localTime, currentOffset);
    })
}).observable;
