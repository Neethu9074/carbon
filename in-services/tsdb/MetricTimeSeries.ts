import {List} from 'immutable';
import {Timestamp, Snapshot} from './types';
import TimeSeries from './TimeSeries';

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
}
