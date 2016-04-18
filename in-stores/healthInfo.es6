import createHealthInfoObservable from 'in-services/subscription/healthInfo';
import * as timelineStore from 'in-stores/timeline';


export function getHealthInfo(snapshotId) {
  return timelineStore.timeframe.flatMap(timeframe => {
    return createHealthInfoObservable({snapshotId, time: timeframe.to});
  });
}
