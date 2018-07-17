import { combineLatest } from 'reactive-observables';
import moment from 'moment';
import React from 'react';

import createHistoricMetricsSubscription from 'in-subscription/historicMetrics';
import createSingleHistoricMetricSubscription from 'in-subscription/historicMetric';

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
const INDEX_METRIC_PREFIX = 'index.';
const ROLL_UP = 3600000; // 1h

export default class FillerStatsRow extends React.Component {
  static displayName = 'FillerStatsRow';

  state = {};

  componentDidMount() {
    const { snapshotId, esSnapshotId, timeConfig, tuName } = this.props;

    STATS.map(stat =>
      createHistoricMetricsSubscription({
        snapshotId,
        metric: METER_METRIC_PREFIX + stat.metric,
        timeConfig,
        rollup: ROLL_UP
      }).once(response => {
        const values = response.map(values => values[1]);
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

    combineLatest(
      getDateStrings(timeConfig)
        .map(dateStr => getESIndexSizeMetric(tuName, dateStr))
        .map(metric =>
          createSingleHistoricMetricSubscription({
            snapshotId: esSnapshotId,
            metric: metric,
            timeConfig,
            rollup: ROLL_UP
          })
        )
    ).once(responses => {
      const totalSize = responses.map(response => response[1]).reduce((a, b) => a + b, 0);
      this.setState({
        esSize: totalSize
      });
    });
  }

  render() {
    const { region, snapshotId, tuName } = this.props;
    const { spanMessageReceived, spanMessageDropped, spanProcessed, spanStored, esSize } = this.state;

    return (
      <div>
        {region};{snapshotId};{tuName};
        {spanMessageReceived ? spanMessageReceived.average : ''};
        {spanMessageDropped ? spanMessageDropped.average : ''};
        {spanProcessed ? spanProcessed.average : ''};
        {spanStored ? spanStored.average : ''};
        {spanMessageReceived ? spanMessageReceived.top : ''};
        {spanMessageDropped ? spanMessageDropped.top : ''};
        {spanProcessed ? spanProcessed.top : ''};
        {spanStored ? spanStored.top : ''};
        {esSize ? esSize : ''};
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

function getDateStrings(timeConfig) {
  const fromDate = moment(timeConfig.to - timeConfig.windowSize);
  const toDate = moment(timeConfig.to);
  let dateStrings = [];
  let enumDate = fromDate;
  while (enumDate.isSameOrBefore(toDate, 'day')) {
    dateStrings.push(enumDate.format('YYYY-MM-DD'));
    enumDate.add(1, 'day');
  }
  return dateStrings;
}

function getESIndexSizeMetric(tuName, dateStr) {
  const tuNameInMetric = tuName.replace('-', '_');
  return `${INDEX_METRIC_PREFIX}saas_${tuNameInMetric}_traces_${dateStr}.size`;
}
