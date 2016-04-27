import createHealthInfoObservable from 'in-services/subscription/healthInfo';
import * as timelineStore from 'in-stores/timeline';

const defaultHealthInfo = {
  maxSeverity: 0,
  numberOfOpenEvents: 0
};

export function getHealthInfo(snapshotId) {
  return timelineStore.focusedMoment$.flatMap(focusedMoment => {
    return createHealthInfoObservable({snapshotId, time: focusedMoment});
  })
  .startWith(defaultHealthInfo);
}
