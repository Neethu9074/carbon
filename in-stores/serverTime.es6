import {combineLatest} from 'reactive-observables';

import * as timeOffsetStore from 'in-stores/timeOffset';
import * as fixedStreams from 'in-services/fixedStreams';
import {createTrackingStore} from 'in-stores/store';


export const serverTime = createTrackingStore({
  name: 'serverTime',
  observable: combineLatest([timeOffsetStore.offset, fixedStreams.currentTime])
    .map(([currentOffset, currentTime]) => {
      return timeOffsetStore.toServerTime(currentTime, currentOffset);
    })
}).observable;
