import {timeframe as timeframe$} from 'in-services/stores/timeline';
import createLiveMetricObservable from 'in-services/subscription/liveMetric';

export function getLiveMetrics(snapshotId, metric) {
  return timeframe$.flatMap(timeframe =>
    createLiveMetricObservable({snapshotId, metric, timeframe})
  );
}
