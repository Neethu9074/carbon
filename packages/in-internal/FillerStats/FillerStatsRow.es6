import React from 'react';

import { getMetrics } from 'in-api/metrics';

export const STATS = [
  {
    id: 'spanMessageReceived',
    label: 'Span Message Received',
    metric: 'KPI.incoming.span_messages.calls'
  },
  {
    id: 'spanMessageDropped',
    label: 'Span Message Dropped',
    metric: 'KPI.incoming.span_messages.errors'
  },
  {
    id: 'spanProcessed',
    label: 'Span Processed',
    metric: 'KPI.processing.spans.calls'
  },
  {
    id: 'spanStored',
    label: 'Span Stored',
    metric: 'KPI.outgoing.spans.calls'
  }
];

const METER_METRIC_PREFIX = 'metrics.meters.';
const ROLL_UP = 3600000; // 1h

export default class FillerStatsRow extends React.Component {
  static displayName = 'FillerStatsRow';

  state = {};

  componentDidMount() {
    const { snapshotId, timeConfig } = this.props;
    const to = timeConfig.to ? timeConfig.to : Date.now();
    const from = to - timeConfig.windowSize;

    if (snapshotId != null && timeConfig != null) {
      STATS.map(stat =>
        getMetrics(METER_METRIC_PREFIX + stat.metric, from, to, snapshotId, ROLL_UP).once(response => {
          const values = response.values.map(value => value.value);
          const average = calculateAverage(values, timeConfig.windowSize, ROLL_UP);
          const top = calculateTop(values);

          let stateObject = {};
          stateObject[stat.id] = {
            average,
            top
          };
          this.setState(stateObject);
        })
      );
    }
  }

  render() {
    const { spanMessageReceived, spanMessageDropped, spanProcessed, spanStored } = this.state;
    return (
      <div>
        {this.props.region};{this.props.snapshotId};{this.props.snapshotLabel};
        {spanMessageReceived ? spanMessageReceived.average : ''};
        {spanMessageDropped ? spanMessageDropped.average : ''};
        {spanProcessed ? spanProcessed.average : ''};
        {spanStored ? spanStored.average : ''};
        {spanMessageReceived ? spanMessageReceived.top : ''};
        {spanMessageDropped ? spanMessageDropped.top : ''};
        {spanProcessed ? spanProcessed.top : ''};
        {spanStored ? spanStored.top : ''};
      </div>
    );
  }
}

function calculateAverage(values, windowSize, rollup) {
  return values.reduce((a, b) => a + b, 0) * rollup / windowSize;
}

function calculateTop(values) {
  if (values.length == 0) return 0;
  return Math.max(...values);
}
