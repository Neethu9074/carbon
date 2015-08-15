import {List} from 'immutable';

import {Timestamp, Snapshot, TimeWindow} from './types';
import TimeSeries from './TimeSeries';
import {getServerTime} from '../time/time';

export interface MetricTimeSeriesConfig {
  snapshot: Snapshot;
  metric: string;
}

export default class MetricTimeSeries extends TimeSeries<number> {

  constructor(config: MetricTimeSeriesConfig) {
    super(MetricTimeSeries.getUniqueId(config));
  }

  static getUniqueId(config: MetricTimeSeriesConfig): string {
    return config.snapshot.get('id') + '#' + config.metric;
  }

  getLatest() {
    // on
  }

  getLatestWithHistory(sizeOfTimeWindowInMillis: number) {
    // this is a sliding time window. It will be moved further into the future
    // with every metric tick.
    const timeWindow: TimeWindow = {
      from: getServerTime() - sizeOfTimeWindowInMillis,
      to: null
    };
    // return all values since that point in time until now and keep adding using
  }
}
