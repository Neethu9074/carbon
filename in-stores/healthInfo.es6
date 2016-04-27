import Immutable from 'immutable';

import createHealthInfoObservable from 'in-services/subscription/healthInfo';
import {focusedMoment$} from 'in-stores/timeline';

const defaultHealthInfo = Immutable.Map({
  maxSeverity: 0,
  numberOfOpenEvents: 0
});

export function getHealthInfo(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment => {
    return createHealthInfoObservable({snapshotId, time: focusedMoment});
  })
  .startWith(defaultHealthInfo);
}
